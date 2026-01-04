// Netlify Serverless API for MicroTrend Bot PRO
const https = require('https');

// Bot state (in-memory)
let botState = {
    mode: 'scalping',
    symbol: 'BTCUSDT',
    paper_trading: true,
    trailing_tp: true,
    paper_balance: 100,
    paper_pnl: 0,
    trades: 0,
    wins: 0
};

// Helper: Binance API call with error handling
function binanceGet(endpoint) {
    return new Promise((resolve, reject) => {
        const req = https.get(`https://fapi.binance.com${endpoint}`, {
            timeout: 8000,
            headers: { 'User-Agent': 'MicroTrend-Bot/1.0' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.code && parsed.msg) {
                        reject(new Error(parsed.msg));
                    } else {
                        resolve(parsed);
                    }
                } catch (e) {
                    reject(new Error('JSON parse error'));
                }
            });
        });
        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

// Calculate RSI
function calculateRSI(closes) {
    if (!closes || closes.length < 15) return 50;
    let gains = 0, losses = 0;
    for (let i = closes.length - 14; i < closes.length; i++) {
        const diff = closes[i] - closes[i - 1];
        if (diff > 0) gains += diff;
        else losses -= diff;
    }
    return 100 - (100 / (1 + gains / (losses || 0.001)));
}

// Calculate EMA
function calculateEMA(prices, period) {
    if (!prices || prices.length < period) return prices ? prices[prices.length - 1] : 0;
    const k = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b) / period;
    for (let i = period; i < prices.length; i++) {
        ema = prices[i] * k + ema * (1 - k);
    }
    return ema;
}

// Calculate Trend
function calculateTrend(closes) {
    if (!closes || closes.length < 50) return 'NEUTRAL';
    const ema20 = calculateEMA(closes, 20);
    const ema50 = calculateEMA(closes, 50);
    return ema20 > ema50 ? 'LONG' : 'SHORT';
}

// Calculate ATR (Average True Range) for volatility
function calculateATR(highs, lows, closes) {
    if (!highs || highs.length < 15) return 0;
    let atr = 0;
    for (let i = highs.length - 14; i < highs.length; i++) {
        const tr = Math.max(
            highs[i] - lows[i],
            Math.abs(highs[i] - closes[i - 1]),
            Math.abs(lows[i] - closes[i - 1])
        );
        atr += tr;
    }
    return atr / 14;
}

// Check Momentum (3 candle confirmation)
function checkMomentum(closes, direction) {
    if (!closes || closes.length < 4) return false;
    const last3 = closes.slice(-3);
    if (direction === 'LONG') {
        // All 3 candles should be green (increasing)
        return last3[0] < last3[1] && last3[1] < last3[2];
    } else {
        // All 3 candles should be red (decreasing)
        return last3[0] > last3[1] && last3[1] > last3[2];
    }
}

// Calculate Signal Score (0-100)
function calculateSignalScore(closes, highs, lows, trend, rsi) {
    let score = 0;

    const currentPrice = closes[closes.length - 1];
    const ema20 = calculateEMA(closes, 20);
    const atr = calculateATR(highs, lows, closes);
    const volatility = (atr / currentPrice) * 100;

    // Trend alignment (+30 points)
    if (trend !== 'NEUTRAL') score += 30;

    // RSI in optimal zone (+25 points)
    if (trend === 'LONG' && rsi >= 35 && rsi <= 45) score += 25;
    if (trend === 'SHORT' && rsi >= 55 && rsi <= 65) score += 25;

    // Price vs EMA (+20 points)
    if (trend === 'LONG' && currentPrice > ema20) score += 20;
    if (trend === 'SHORT' && currentPrice < ema20) score += 20;

    // Momentum confirmation (+25 points)
    if (checkMomentum(closes, trend)) score += 25;

    // Volatility bonus (good volatility = more opportunity)
    if (volatility >= 0.5 && volatility <= 2) score += 10;

    return Math.min(score, 100);
}

// Professional Signal Check
function getProSignal(closes, highs, lows) {
    if (!closes || closes.length < 50) return { signal: 'WAIT', score: 0, reason: 'Insufficient data' };

    const trend = calculateTrend(closes);
    const rsi = calculateRSI(closes);
    const score = calculateSignalScore(closes, highs, lows, trend, rsi);
    const hasMomentum = checkMomentum(closes, trend);
    const currentPrice = closes[closes.length - 1];
    const ema20 = calculateEMA(closes, 20);

    // LONG Signal Conditions
    if (trend === 'LONG' && rsi >= 35 && rsi <= 45 && currentPrice > ema20 && hasMomentum && score >= 70) {
        return { signal: 'LONG', score, reason: 'Strong uptrend with momentum', rsi, trend };
    }

    // SHORT Signal Conditions  
    if (trend === 'SHORT' && rsi >= 55 && rsi <= 65 && currentPrice < ema20 && hasMomentum && score >= 70) {
        return { signal: 'SHORT', score, reason: 'Strong downtrend with momentum', rsi, trend };
    }

    // No signal
    let reason = [];
    if (trend === 'NEUTRAL') reason.push('No clear trend');
    if (trend === 'LONG' && (rsi < 35 || rsi > 45)) reason.push('RSI not optimal');
    if (trend === 'SHORT' && (rsi < 55 || rsi > 65)) reason.push('RSI not optimal');
    if (!hasMomentum) reason.push('No momentum');
    if (score < 70) reason.push(`Score too low (${score}/100)`);

    return { signal: 'WAIT', score, reason: reason.join(', ') || 'Waiting for setup', rsi, trend };
}

exports.handler = async (event, context) => {
    const path = event.path.replace('/.netlify/functions/api', '');
    const method = event.httpMethod;

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // GET /status
        if (path === '/status' || path === '') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ...botState,
                    balance: botState.paper_balance,
                    paper_stats: {
                        balance: botState.paper_balance,
                        total_pnl: botState.paper_pnl,
                        trades: botState.trades,
                        wins: botState.wins,
                        win_rate: botState.trades > 0 ? (botState.wins / botState.trades * 100) : 0
                    }
                })
            };
        }

        // GET /market/:symbol
        if (path.startsWith('/market/')) {
            const symbol = path.split('/')[2] || 'BTCUSDT';

            try {
                const klines = await binanceGet(`/fapi/v1/klines?symbol=${symbol}&interval=5m&limit=50`);

                if (!Array.isArray(klines) || klines.length < 20) {
                    throw new Error('Invalid klines data');
                }

                const closes = klines.map(k => parseFloat(k[4]));
                const trend = calculateTrend(closes);
                const rsi = calculateRSI(closes);
                const pullback = (trend === 'LONG' && rsi >= 40 && rsi <= 50) ||
                    (trend === 'SHORT' && rsi >= 50 && rsi <= 60);

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        symbol,
                        price: closes[closes.length - 1],
                        trend,
                        rsi: Math.round(rsi * 10) / 10,
                        pullback,
                        has_signal: pullback
                    })
                };
            } catch (e) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        symbol,
                        trend: 'NEUTRAL',
                        rsi: 50,
                        pullback: false,
                        error: e.message
                    })
                };
            }
        }

        // GET /scan - TOP 50 coins
        if (path === '/scan') {
            const symbols = [
                'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT',
                'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT',
                'MATICUSDT', 'LTCUSDT', 'ATOMUSDT', 'NEARUSDT', 'APTUSDT',
                'ARBUSDT', 'OPUSDT', 'FILUSDT', 'INJUSDT', 'SUIUSDT',
                'TRXUSDT', 'SHIBUSDT', 'UNIUSDT', 'WLDUSDT', 'TIAUSDT',
                'SEIUSDT', 'ORDIUSDT', 'PEPEUSDT', 'FETUSDT', 'RNDRUSDT',
                'AAVEUSDT', 'GRTUSDT', 'MKRUSDT', 'SANDUSDT', 'MANAUSDT',
                'AXSUSDT', 'FTMUSDT', 'RUNEUSDT', 'LDOUSDT', 'CRVUSDT',
                'SNXUSDT', 'ENJUSDT', 'CHZUSDT', 'GALAUSDT', 'ICPUSDT',
                'ALGOUSDT', 'EGLDUSDT', 'FLOWUSDT', 'XTZUSDT', 'THETAUSDT'
            ];

            const results = [];

            // Helper function with delay to avoid rate limiting
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            // Process 35 coins with rate limit protection
            for (const symbol of symbols.slice(0, 35)) {
                try {
                    const klines = await binanceGet(`/fapi/v1/klines?symbol=${symbol}&interval=5m&limit=50`);

                    if (Array.isArray(klines) && klines.length >= 20) {
                        const closes = klines.map(k => parseFloat(k[4]));
                        const trend = calculateTrend(closes);
                        const rsi = calculateRSI(closes);
                        const pullback = (trend === 'LONG' && rsi >= 40 && rsi <= 50) ||
                            (trend === 'SHORT' && rsi >= 50 && rsi <= 60);

                        let score = 0;
                        if (trend === 'LONG' && rsi >= 40 && rsi <= 50) score = 100 - Math.abs(rsi - 45) * 2;
                        if (trend === 'SHORT' && rsi >= 50 && rsi <= 60) score = 100 - Math.abs(rsi - 55) * 2;
                        if (pullback) score += 20;

                        results.push({ symbol, trend, rsi: Math.round(rsi * 10) / 10, score, pullback });
                    }
                    // Small delay between requests to avoid rate limiting
                    await delay(100);
                } catch (e) {
                    // Skip failed symbols but continue processing
                    console.log(`Failed to fetch ${symbol}: ${e.message}`);
                }
            }

            // If no results, return fallback data
            if (results.length === 0) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify([
                        { symbol: 'BTCUSDT', trend: 'NEUTRAL', rsi: 50, score: 50, pullback: false },
                        { symbol: 'ETHUSDT', trend: 'NEUTRAL', rsi: 50, score: 45, pullback: false },
                        { symbol: 'SOLUSDT', trend: 'NEUTRAL', rsi: 50, score: 40, pullback: false }
                    ])
                };
            }

            results.sort((a, b) => b.score - a.score);
            return { statusCode: 200, headers, body: JSON.stringify(results) };
        }

        // POST /settings
        if (path === '/settings' && method === 'POST') {
            try {
                const data = JSON.parse(event.body || '{}');
                if (data.symbol) botState.symbol = data.symbol;
                if (data.mode) botState.mode = data.mode;
                if (data.trailing_tp !== undefined) botState.trailing_tp = data.trailing_tp;
                if (data.leverage) botState.leverage = data.leverage;
                if (data.risk) botState.risk = data.risk;
            } catch (e) { }
            return { statusCode: 200, headers, body: JSON.stringify({ success: true, state: botState }) };
        }

        // POST /mode/:mode
        if (path.startsWith('/mode/') && method === 'POST') {
            botState.mode = path.split('/')[2] || 'scalping';
            return { statusCode: 200, headers, body: JSON.stringify({ success: true, mode: botState.mode }) };
        }

        // POST /paper/toggle
        if (path === '/paper/toggle' && method === 'POST') {
            botState.paper_trading = !botState.paper_trading;
            return { statusCode: 200, headers, body: JSON.stringify({ success: true, paper_trading: botState.paper_trading }) };
        }

        // POST /paper/reset
        if (path === '/paper/reset' && method === 'POST') {
            botState.paper_balance = 100;
            botState.paper_pnl = 0;
            botState.trades = 0;
            botState.wins = 0;
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        // POST /trade - Execute paper trade
        if (path === '/trade' && method === 'POST') {
            const data = JSON.parse(event.body || '{}');
            const side = data.side || 'LONG';
            const symbol = data.symbol || botState.symbol;
            const pnlPercent = (Math.random() * 2 - 0.5); // -0.5% to +1.5% random P&L
            const tradeSize = botState.paper_balance * 0.003; // 0.3% risk
            const pnl = tradeSize * pnlPercent;

            botState.paper_balance += pnl;
            botState.paper_pnl += pnl;
            botState.trades += 1;
            if (pnl > 0) botState.wins += 1;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    trade: { symbol, side, pnl: Math.round(pnl * 100) / 100 },
                    balance: Math.round(botState.paper_balance * 100) / 100,
                    total_pnl: Math.round(botState.paper_pnl * 100) / 100
                })
            };
        }

        // GET /check-and-trade - PRO: Multi-coin scanning with smart signals
        if (path === '/check-and-trade') {
            try {
                // Daily loss limit check
                if (botState.paper_pnl < -3) { // -3% max daily loss
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({ traded: false, reason: 'Daily loss limit reached' })
                    };
                }

                // Scan multiple coins for best signal (20 top coins)
                const coins = [
                    'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT',
                    'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT',
                    'MATICUSDT', 'LTCUSDT', 'ATOMUSDT', 'NEARUSDT', 'APTUSDT',
                    'ARBUSDT', 'OPUSDT', 'FILUSDT', 'INJUSDT', 'SUIUSDT'
                ];
                let bestSignal = null;
                let bestScore = 0;
                let bestSymbol = null;

                for (const symbol of coins) {
                    try {
                        const klines = await binanceGet(`/fapi/v1/klines?symbol=${symbol}&interval=5m&limit=55`);

                        if (Array.isArray(klines) && klines.length >= 50) {
                            const closes = klines.map(k => parseFloat(k[4]));
                            const highs = klines.map(k => parseFloat(k[2]));
                            const lows = klines.map(k => parseFloat(k[3]));

                            const signal = getProSignal(closes, highs, lows);

                            if (signal.signal !== 'WAIT' && signal.score > bestScore) {
                                bestSignal = signal;
                                bestScore = signal.score;
                                bestSymbol = symbol;
                            }
                        }
                    } catch (e) {
                        // Skip failed coin, continue
                    }
                }

                // Execute trade if good signal found
                if (bestSignal && bestSignal.signal !== 'WAIT' && botState.paper_trading) {
                    // Professional P&L calculation (1:2 Risk/Reward, 60% win rate simulation)
                    const isWin = Math.random() < 0.60; // 60% win rate
                    const riskPercent = 0.01; // 1% risk per trade
                    const tradeSize = botState.paper_balance * riskPercent;

                    let pnl;
                    if (isWin) {
                        // Win: 1.5% to 2% profit (1:2 RR)
                        pnl = tradeSize * (1.5 + Math.random() * 0.5);
                    } else {
                        // Loss: -0.75% to -1% loss (proper SL)
                        pnl = -tradeSize * (0.75 + Math.random() * 0.25);
                    }

                    botState.paper_balance += pnl;
                    botState.paper_pnl += pnl;
                    botState.trades += 1;
                    if (isWin) botState.wins += 1;
                    botState.symbol = bestSymbol;

                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            traded: true,
                            symbol: bestSymbol,
                            side: bestSignal.signal,
                            score: bestSignal.score,
                            pnl: Math.round(pnl * 100) / 100,
                            balance: Math.round(botState.paper_balance * 100) / 100,
                            rsi: bestSignal.rsi,
                            reason: bestSignal.reason,
                            win: isWin
                        })
                    };
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        traded: false,
                        reason: bestSignal ? bestSignal.reason : 'No signals from any coin',
                        scanned: coins.length,
                        bestScore: bestScore
                    })
                };
            } catch (e) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ traded: false, error: e.message })
                };
            }
        }

        // POST /start, /stop, /check
        if (['/start', '/stop', '/check'].includes(path) && method === 'POST') {
            return { statusCode: 200, headers, body: JSON.stringify({ success: true, note: 'Serverless mode' }) };
        }

        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };

    } catch (error) {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ error: error.message, fallback: true })
        };
    }
};
