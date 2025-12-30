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

// Calculate Trend
function calculateTrend(closes) {
    if (!closes || closes.length < 50) return 'NEUTRAL';
    const ema = (prices, period) => {
        if (prices.length < period) return prices[prices.length - 1];
        const k = 2 / (period + 1);
        let e = prices.slice(0, period).reduce((a, b) => a + b) / period;
        for (let i = period; i < prices.length; i++) e = prices[i] * k + e * (1 - k);
        return e;
    };
    const ema20 = ema(closes, 20);
    const ema50 = ema(closes, 50);
    return ema20 > ema50 ? 'LONG' : 'SHORT';
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
