#!/usr/bin/env python3
"""
MicroTrend Bot PRO - API Server
Panel ile bot arasında köprü + PRO özellikler
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import json
import threading
import time
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='.')
CORS(app)

# Bot State
bot_state = {
    "is_running": False,
    "mode": os.getenv("TRADING_MODE", "scalping"),
    "symbol": os.getenv("TRADING_SYMBOL", "BTCUSDT"),
    "leverage": int(os.getenv("LEVERAGE", "5")),
    "risk": float(os.getenv("RISK_PER_TRADE", "0.003")),
    "paper_trading": os.getenv("PAPER_TRADING", "false").lower() == "true",
    "paper_balance": float(os.getenv("PAPER_BALANCE", "100")),
    "trailing_tp": os.getenv("TRAILING_TP", "true").lower() == "true",
    "trades_today": 0,
    "daily_pnl": 0.0,
    "logs": [],
    "grid_stats": {},
    "paper_stats": {}
}

bot_thread = None

def add_log(message):
    ts = datetime.now().strftime("%H:%M:%S")
    bot_state["logs"].append({"time": ts, "message": message})
    if len(bot_state["logs"]) > 100:
        bot_state["logs"] = bot_state["logs"][-100:]
    print(f"[{ts}] {message}")

# Import bot
try:
    from bot import (
        get_account_balance, get_mark_price, get_klines, get_funding_rate,
        analyze_trend, calculate_rsi, calculate_atr, check_pullback,
        run_strategy, CONFIG, state as trading_state,
        paper_trader, grid_bot, trailing_tp
    )
    BOT_OK = True
    add_log("✅ Bot PRO modülü yüklendi")
except Exception as e:
    BOT_OK = False
    add_log(f"❌ Bot yüklenemedi: {e}")

# ============================================
# API ENDPOINTS
# ============================================

@app.route('/')
def index():
    return send_from_directory('.', 'panel.html')

@app.route('/setup')
def setup():
    return send_from_directory('.', 'setup.html')

@app.route('/api/status')
def get_status():
    data = {
        "is_running": bot_state["is_running"],
        "mode": bot_state["mode"],
        "symbol": bot_state["symbol"],
        "leverage": bot_state["leverage"],
        "risk": bot_state["risk"],
        "paper_trading": bot_state["paper_trading"],
        "trailing_tp": bot_state["trailing_tp"],
        "trades_today": bot_state["trades_today"],
        "daily_pnl": bot_state["daily_pnl"]
    }
    
    if BOT_OK:
        try:
            data["balance"] = get_account_balance()
            data["paper_stats"] = paper_trader.get_stats() if bot_state["paper_trading"] else {}
            data["grid_stats"] = grid_bot.get_stats() if bot_state["mode"] == "grid" else {}
        except:
            data["balance"] = 0
    
    return jsonify(data)

@app.route('/api/market/<symbol>')
def get_market_data(symbol):
    if not BOT_OK:
        return jsonify({"error": "Bot not available"}), 500
    
    try:
        old = CONFIG["SYMBOL"]
        CONFIG["SYMBOL"] = symbol
        
        klines = get_klines("5m", 100)
        if not klines:
            CONFIG["SYMBOL"] = old
            return jsonify({"error": "No data"}), 500
        
        closes = [k["close"] for k in klines]
        trend = analyze_trend(klines)
        rsi = calculate_rsi(closes, 14)
        atr = calculate_atr(klines)
        funding = get_funding_rate()
        pullback = check_pullback(klines, trend)
        
        CONFIG["SYMBOL"] = old
        
        return jsonify({
            "symbol": symbol,
            "price": klines[-1]["close"],
            "trend": trend,
            "rsi": round(rsi, 1),
            "atr": round(atr, 2),
            "funding": round(funding * 100, 4),
            "pullback": pullback,
            "has_signal": pullback and trend != "NEUTRAL"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/scan')
def scan_all():
    if not BOT_OK:
        return jsonify({"error": "Bot not available"}), 500
    
    symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", "ADAUSDT", "DOGEUSDT", "AVAXUSDT"]
    results = []
    
    for symbol in symbols:
        try:
            old = CONFIG["SYMBOL"]
            CONFIG["SYMBOL"] = symbol
            
            klines = get_klines("5m", 50)
            if klines:
                closes = [k["close"] for k in klines]
                trend = analyze_trend(klines)
                rsi = calculate_rsi(closes, 14)
                pullback = check_pullback(klines, trend)
                
                score = 0
                if trend == "LONG" and 40 <= rsi <= 50:
                    score = 100 - abs(rsi - 45) * 2
                elif trend == "SHORT" and 50 <= rsi <= 60:
                    score = 100 - abs(rsi - 55) * 2
                
                results.append({
                    "symbol": symbol,
                    "trend": trend,
                    "rsi": round(rsi, 1),
                    "pullback": pullback,
                    "score": score
                })
            
            CONFIG["SYMBOL"] = old
        except:
            pass
    
    results.sort(key=lambda x: x["score"], reverse=True)
    return jsonify(results)

@app.route('/api/settings', methods=['POST'])
def update_settings():
    data = request.json
    
    if "symbol" in data:
        bot_state["symbol"] = data["symbol"]
        CONFIG["SYMBOL"] = data["symbol"]
        add_log(f"🔄 Kripto: {data['symbol']}")
    
    if "mode" in data:
        bot_state["mode"] = data["mode"]
        CONFIG["TRADING_MODE"] = data["mode"]
        add_log(f"📊 Mode: {data['mode'].upper()}")
    
    if "leverage" in data:
        bot_state["leverage"] = int(data["leverage"])
        CONFIG["LEVERAGE"] = int(data["leverage"])
        add_log(f"⚙️ Kaldıraç: {data['leverage']}x")
    
    if "paper_trading" in data:
        bot_state["paper_trading"] = data["paper_trading"]
        CONFIG["PAPER_TRADING"] = data["paper_trading"]
        add_log(f"📝 Paper: {'ON' if data['paper_trading'] else 'OFF'}")
    
    if "trailing_tp" in data:
        bot_state["trailing_tp"] = data["trailing_tp"]
        CONFIG["TRAILING_TP_ENABLED"] = data["trailing_tp"]
        add_log(f"🎯 Trailing TP: {'ON' if data['trailing_tp'] else 'OFF'}")
    
    return jsonify({"success": True, "state": bot_state})

@app.route('/api/mode/<mode>', methods=['POST'])
def set_mode(mode):
    if mode not in ["scalping", "grid"]:
        return jsonify({"error": "Invalid mode"}), 400
    
    bot_state["mode"] = mode
    CONFIG["TRADING_MODE"] = mode
    add_log(f"📊 Mode değişti: {mode.upper()}")
    
    # Grid mode için grid reset
    if mode == "grid" and BOT_OK:
        grid_bot.grids = []  # Reset grids
    
    return jsonify({"success": True, "mode": mode})

@app.route('/api/paper/toggle', methods=['POST'])
def toggle_paper():
    bot_state["paper_trading"] = not bot_state["paper_trading"]
    CONFIG["PAPER_TRADING"] = bot_state["paper_trading"]
    add_log(f"📝 Paper Trading: {'ON' if bot_state['paper_trading'] else 'OFF'}")
    return jsonify({"success": True, "paper_trading": bot_state["paper_trading"]})

@app.route('/api/paper/reset', methods=['POST'])
def reset_paper():
    if BOT_OK:
        paper_trader.balance = float(os.getenv("PAPER_BALANCE", "100"))
        paper_trader.trades = []
        paper_trader.pnl = 0.0
        add_log("📝 Paper Trading sıfırlandı")
    return jsonify({"success": True})

@app.route('/api/start', methods=['POST'])
def start_bot():
    global bot_thread
    
    if bot_state["is_running"]:
        return jsonify({"error": "Already running"}), 400
    
    bot_state["is_running"] = True
    add_log(f"▶️ Bot başladı ({bot_state['mode'].upper()})")
    
    def loop():
        while bot_state["is_running"]:
            try:
                if BOT_OK:
                    run_strategy()
                time.sleep(300)
            except Exception as e:
                add_log(f"❌ {e}")
                time.sleep(60)
    
    bot_thread = threading.Thread(target=loop, daemon=True)
    bot_thread.start()
    
    return jsonify({"success": True})

@app.route('/api/stop', methods=['POST'])
def stop_bot():
    bot_state["is_running"] = False
    add_log("⏹️ Bot durduruldu")
    return jsonify({"success": True})

@app.route('/api/check', methods=['POST'])
def force_check():
    if not BOT_OK:
        return jsonify({"error": "Bot not available"}), 500
    
    add_log("🔄 Manuel kontrol...")
    try:
        run_strategy()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/logs')
def get_logs():
    return jsonify(bot_state["logs"])

# ============================================
# MAIN
# ============================================

if __name__ == '__main__':
    add_log("🚀 MicroTrend Bot PRO Server")
    add_log(f"📊 Mode: {bot_state['mode'].upper()}")
    add_log(f"📝 Paper: {bot_state['paper_trading']}")
    add_log(f"🎯 Trailing TP: {bot_state['trailing_tp']}")
    
    print("\n" + "="*50)
    print("🌐 Panel: http://localhost:5000")
    print("🛠️ Setup: http://localhost:5000/setup")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=False)
