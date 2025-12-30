#!/usr/bin/env python3
"""
MicroTrend Bot PRO - Gelişmiş Trading Modları
==============================================
- Scalping Mode (Trend + Pullback)
- Grid Bot Mode (Range Trading)
- Paper Trading (Simülasyon)
- Trailing Take Profit
"""

import os
import time
import json
import hmac
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, List, Tuple
import requests
from dotenv import load_dotenv

load_dotenv()

# ===========================================
# KONFİGÜRASYON
# ===========================================

CONFIG = {
    # API
    "API_KEY": os.getenv("BINANCE_API_KEY", ""),
    "API_SECRET": os.getenv("BINANCE_API_SECRET", ""),
    "BASE_URL": "https://fapi.binance.com",
    "TESTNET": os.getenv("BINANCE_TESTNET", "true").lower() == "true",
    
    # Trading Mode: "scalping", "grid", "dca"
    "TRADING_MODE": os.getenv("TRADING_MODE", "scalping"),
    
    # Paper Trading (simülasyon)
    "PAPER_TRADING": os.getenv("PAPER_TRADING", "false").lower() == "true",
    "PAPER_BALANCE": float(os.getenv("PAPER_BALANCE", "100")),
    
    # Common
    "SYMBOL": os.getenv("TRADING_SYMBOL", "BTCUSDT"),
    "LEVERAGE": int(os.getenv("LEVERAGE", "5")),
    "RISK_PER_TRADE": float(os.getenv("RISK_PER_TRADE", "0.003")),
    
    # Scalping
    "MIN_PROFIT_USD": float(os.getenv("MIN_PROFIT_USD", "0.3")),
    "MAX_PROFIT_USD": float(os.getenv("MAX_PROFIT_USD", "0.8")),
    
    # Grid Bot Settings
    "GRID_UPPER": float(os.getenv("GRID_UPPER", "0")),  # 0 = auto
    "GRID_LOWER": float(os.getenv("GRID_LOWER", "0")),  # 0 = auto
    "GRID_COUNT": int(os.getenv("GRID_COUNT", "10")),
    "GRID_INVESTMENT": float(os.getenv("GRID_INVESTMENT", "50")),
    
    # Trailing TP
    "TRAILING_TP_ENABLED": os.getenv("TRAILING_TP", "true").lower() == "true",
    "TRAILING_TP_ACTIVATION": float(os.getenv("TRAILING_TP_ACTIVATION", "0.3")),  # %
    "TRAILING_TP_CALLBACK": float(os.getenv("TRAILING_TP_CALLBACK", "0.1")),  # %
    
    # Limitler
    "MAX_TRADES_PER_DAY": int(os.getenv("MAX_TRADES_PER_DAY", "3")),
    "MAX_CONSECUTIVE_LOSSES": int(os.getenv("MAX_CONSECUTIVE_LOSSES", "1")),
    "MAX_DAILY_DRAWDOWN_PCT": float(os.getenv("MAX_DAILY_DRAWDOWN_PCT", "1.0")),
    "MIN_BALANCE_USD": float(os.getenv("MIN_BALANCE_USD", "45")),
    
    # Filtreler
    "MAX_FUNDING_RATE": float(os.getenv("MAX_FUNDING_RATE", "0.0003")),
    "MIN_ATR_PCT": float(os.getenv("MIN_ATR_PCT", "0.1")),
    
    # RSI
    "RSI_LONG_MIN": int(os.getenv("RSI_LONG_MIN", "40")),
    "RSI_LONG_MAX": int(os.getenv("RSI_LONG_MAX", "50")),
    "RSI_SHORT_MIN": int(os.getenv("RSI_SHORT_MIN", "50")),
    "RSI_SHORT_MAX": int(os.getenv("RSI_SHORT_MAX", "60")),
    
    # Telegram
    "TELEGRAM_BOT_TOKEN": os.getenv("TELEGRAM_BOT_TOKEN", ""),
    "TELEGRAM_CHAT_ID": os.getenv("TELEGRAM_CHAT_ID", ""),
}

if CONFIG["TESTNET"]:
    CONFIG["BASE_URL"] = "https://testnet.binancefuture.com"
    print("⚠️ TESTNET MODU AKTİF")

if CONFIG["PAPER_TRADING"]:
    print("📝 PAPER TRADING MODU AKTİF - Gerçek işlem yapılmayacak")

# ===========================================
# PAPER TRADING SİSTEMİ
# ===========================================

class PaperTrading:
    def __init__(self, initial_balance: float):
        self.balance = initial_balance
        self.positions = {}
        self.trades = []
        self.pnl = 0.0
        
    def open_position(self, symbol: str, side: str, quantity: float, entry_price: float, sl: float, tp: float):
        """Simüle pozisyon aç"""
        self.positions[symbol] = {
            "side": side,
            "quantity": quantity,
            "entry_price": entry_price,
            "sl": sl,
            "tp": tp,
            "opened_at": datetime.now().isoformat()
        }
        print(f"📝 [PAPER] {side} {symbol}: {quantity} @ ${entry_price:,.2f}")
        return True
    
    def check_position(self, symbol: str, current_price: float) -> Optional[dict]:
        """Pozisyon SL/TP kontrolü"""
        if symbol not in self.positions:
            return None
        
        pos = self.positions[symbol]
        
        if pos["side"] == "BUY":
            if current_price <= pos["sl"]:
                return self.close_position(symbol, current_price, "SL Hit")
            elif current_price >= pos["tp"]:
                return self.close_position(symbol, current_price, "TP Hit")
        else:
            if current_price >= pos["sl"]:
                return self.close_position(symbol, current_price, "SL Hit")
            elif current_price <= pos["tp"]:
                return self.close_position(symbol, current_price, "TP Hit")
        
        return None
    
    def close_position(self, symbol: str, exit_price: float, reason: str) -> dict:
        """Pozisyon kapat"""
        if symbol not in self.positions:
            return {}
        
        pos = self.positions[symbol]
        
        if pos["side"] == "BUY":
            pnl = (exit_price - pos["entry_price"]) * pos["quantity"]
        else:
            pnl = (pos["entry_price"] - exit_price) * pos["quantity"]
        
        self.balance += pnl
        self.pnl += pnl
        
        trade = {
            "symbol": symbol,
            "side": pos["side"],
            "entry": pos["entry_price"],
            "exit": exit_price,
            "quantity": pos["quantity"],
            "pnl": pnl,
            "reason": reason,
            "closed_at": datetime.now().isoformat()
        }
        self.trades.append(trade)
        
        del self.positions[symbol]
        
        pnl_str = f"+${pnl:.2f}" if pnl >= 0 else f"-${abs(pnl):.2f}"
        print(f"📝 [PAPER] Kapatıldı: {reason} | PnL: {pnl_str} | Bakiye: ${self.balance:.2f}")
        
        return trade
    
    def get_balance(self) -> float:
        return self.balance
    
    def get_stats(self) -> dict:
        wins = len([t for t in self.trades if t["pnl"] > 0])
        losses = len([t for t in self.trades if t["pnl"] < 0])
        return {
            "balance": self.balance,
            "total_pnl": self.pnl,
            "trades": len(self.trades),
            "wins": wins,
            "losses": losses,
            "win_rate": (wins / len(self.trades) * 100) if self.trades else 0
        }

paper_trader = PaperTrading(CONFIG["PAPER_BALANCE"])

# ===========================================
# GRİD BOT SİSTEMİ
# ===========================================

class GridBot:
    def __init__(self):
        self.grids = []
        self.active_orders = []
        self.grid_profits = 0.0
        
    def calculate_grids(self, current_price: float, upper: float = 0, lower: float = 0, count: int = 10) -> List[dict]:
        """Grid seviyelerini hesapla"""
        if upper == 0:
            upper = current_price * 1.03  # +%3
        if lower == 0:
            lower = current_price * 0.97  # -%3
        
        step = (upper - lower) / count
        grids = []
        
        for i in range(count + 1):
            price = lower + (step * i)
            grids.append({
                "level": i,
                "price": round(price, 2),
                "type": "buy" if price < current_price else "sell",
                "filled": False
            })
        
        self.grids = grids
        print(f"📊 Grid oluşturuldu: {lower:.2f} - {upper:.2f} ({count} grid)")
        return grids
    
    def check_grid_triggers(self, current_price: float) -> List[dict]:
        """Tetiklenen gridleri kontrol et"""
        triggered = []
        
        for grid in self.grids:
            if grid["filled"]:
                continue
            
            if grid["type"] == "buy" and current_price <= grid["price"]:
                grid["filled"] = True
                triggered.append({"action": "BUY", "price": grid["price"], "level": grid["level"]})
            elif grid["type"] == "sell" and current_price >= grid["price"]:
                grid["filled"] = True
                triggered.append({"action": "SELL", "price": grid["price"], "level": grid["level"]})
        
        return triggered
    
    def reset_grid(self, level: int, new_type: str):
        """Grid'i resetle (ters yönde)"""
        for grid in self.grids:
            if grid["level"] == level:
                grid["filled"] = False
                grid["type"] = new_type
                break
    
    def get_stats(self) -> dict:
        filled = len([g for g in self.grids if g["filled"]])
        return {
            "total_grids": len(self.grids),
            "filled_grids": filled,
            "profits": self.grid_profits
        }

grid_bot = GridBot()

# ===========================================
# TRAILING TAKE PROFIT
# ===========================================

class TrailingTP:
    def __init__(self):
        self.active_trails = {}
    
    def activate(self, symbol: str, entry_price: float, side: str, activation_pct: float, callback_pct: float):
        """Trailing TP başlat"""
        self.active_trails[symbol] = {
            "entry": entry_price,
            "side": side,
            "activation_pct": activation_pct,
            "callback_pct": callback_pct,
            "highest": entry_price if side == "BUY" else entry_price,
            "lowest": entry_price if side == "SELL" else entry_price,
            "activated": False,
            "trail_price": 0
        }
    
    def update(self, symbol: str, current_price: float) -> Tuple[bool, float]:
        """Trailing TP güncelle, (should_close, trail_price) döndür"""
        if symbol not in self.active_trails:
            return False, 0
        
        trail = self.active_trails[symbol]
        
        if trail["side"] == "BUY":
            # LONG pozisyon için
            profit_pct = ((current_price - trail["entry"]) / trail["entry"]) * 100
            
            if profit_pct >= trail["activation_pct"]:
                if not trail["activated"]:
                    trail["activated"] = True
                    print(f"🎯 Trailing TP aktif! Profit: %{profit_pct:.2f}")
                
                # Yeni yüksek
                if current_price > trail["highest"]:
                    trail["highest"] = current_price
                    trail["trail_price"] = current_price * (1 - trail["callback_pct"] / 100)
                
                # Callback triggered
                if current_price <= trail["trail_price"]:
                    return True, trail["trail_price"]
        
        else:
            # SHORT pozisyon için
            profit_pct = ((trail["entry"] - current_price) / trail["entry"]) * 100
            
            if profit_pct >= trail["activation_pct"]:
                if not trail["activated"]:
                    trail["activated"] = True
                    print(f"🎯 Trailing TP aktif! Profit: %{profit_pct:.2f}")
                
                # Yeni düşük
                if current_price < trail["lowest"]:
                    trail["lowest"] = current_price
                    trail["trail_price"] = current_price * (1 + trail["callback_pct"] / 100)
                
                # Callback triggered
                if current_price >= trail["trail_price"]:
                    return True, trail["trail_price"]
        
        return False, trail.get("trail_price", 0)
    
    def remove(self, symbol: str):
        if symbol in self.active_trails:
            del self.active_trails[symbol]

trailing_tp = TrailingTP()

# ===========================================
# STATE
# ===========================================

class TradingState:
    def __init__(self):
        self.trades_today = 0
        self.losses_today = 0
        self.consecutive_losses = 0
        self.daily_pnl = 0.0
        self.starting_balance = 0.0
        self.last_trade_time = None
        self.last_reset_date = datetime.now().date()
        self.mode = CONFIG["TRADING_MODE"]
    
    def reset_daily(self):
        today = datetime.now().date()
        if today > self.last_reset_date:
            self.trades_today = 0
            self.losses_today = 0
            self.daily_pnl = 0.0
            self.last_reset_date = today
            print(f"📅 Günlük limitler sıfırlandı: {today}")
    
    def can_trade(self) -> Tuple[bool, str]:
        self.reset_daily()
        
        if self.mode == "grid":
            return True, "Grid mode"
        
        if self.trades_today >= CONFIG["MAX_TRADES_PER_DAY"]:
            return False, f"Günlük limit ({self.trades_today}/{CONFIG['MAX_TRADES_PER_DAY']})"
        
        if self.consecutive_losses >= CONFIG["MAX_CONSECUTIVE_LOSSES"]:
            return False, f"Ardışık loss ({self.consecutive_losses})"
        
        if self.starting_balance > 0:
            dd = (self.daily_pnl / self.starting_balance) * -100
            if dd >= CONFIG["MAX_DAILY_DRAWDOWN_PCT"]:
                return False, f"Drawdown limit (%{dd:.2f})"
        
        return True, "OK"
    
    def record_trade(self, pnl: float):
        self.trades_today += 1
        self.daily_pnl += pnl
        if pnl < 0:
            self.losses_today += 1
            self.consecutive_losses += 1
        else:
            self.consecutive_losses = 0
        self.last_trade_time = datetime.now()

state = TradingState()

# ===========================================
# BINANCE API (aynı)
# ===========================================

def sign_request(params: dict) -> str:
    query = "&".join([f"{k}={v}" for k, v in params.items()])
    return hmac.new(CONFIG["API_SECRET"].encode(), query.encode(), hashlib.sha256).hexdigest()

def api_request(method: str, endpoint: str, params: dict = None, signed: bool = False) -> dict:
    url = f"{CONFIG['BASE_URL']}{endpoint}"
    params = params or {}
    headers = {"X-MBX-APIKEY": CONFIG["API_KEY"]}
    
    if signed:
        params["timestamp"] = int(time.time() * 1000)
        params["signature"] = sign_request(params)
    
    try:
        if method == "GET":
            r = requests.get(url, params=params, headers=headers, timeout=10)
        else:
            r = requests.post(url, params=params, headers=headers, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print(f"❌ API: {e}")
        return {}

def get_account_balance() -> float:
    if CONFIG["PAPER_TRADING"]:
        return paper_trader.get_balance()
    data = api_request("GET", "/fapi/v2/balance", signed=True)
    for a in data:
        if a.get("asset") == "USDT":
            return float(a.get("availableBalance", 0))
    return 0.0

def get_mark_price() -> float:
    data = api_request("GET", "/fapi/v1/premiumIndex", {"symbol": CONFIG["SYMBOL"]})
    return float(data.get("markPrice", 0))

def get_klines(interval: str = "5m", limit: int = 100) -> List[dict]:
    data = api_request("GET", "/fapi/v1/klines", {"symbol": CONFIG["SYMBOL"], "interval": interval, "limit": limit})
    return [{"open": float(k[1]), "high": float(k[2]), "low": float(k[3]), "close": float(k[4]), "volume": float(k[5])} for k in data]

def get_funding_rate() -> float:
    data = api_request("GET", "/fapi/v1/premiumIndex", {"symbol": CONFIG["SYMBOL"]})
    return float(data.get("lastFundingRate", 0))

def place_order(side: str, quantity: float, sl: float, tp: float) -> bool:
    if CONFIG["PAPER_TRADING"]:
        price = get_mark_price()
        return paper_trader.open_position(CONFIG["SYMBOL"], side, quantity, price, sl, tp)
    
    try:
        order = api_request("POST", "/fapi/v1/order", {
            "symbol": CONFIG["SYMBOL"], "side": side, "type": "MARKET", "quantity": quantity
        }, signed=True)
        
        if not order.get("orderId"):
            return False
        
        sl_side = "SELL" if side == "BUY" else "BUY"
        api_request("POST", "/fapi/v1/order", {
            "symbol": CONFIG["SYMBOL"], "side": sl_side, "type": "STOP_MARKET",
            "stopPrice": sl, "closePosition": "true"
        }, signed=True)
        api_request("POST", "/fapi/v1/order", {
            "symbol": CONFIG["SYMBOL"], "side": sl_side, "type": "TAKE_PROFIT_MARKET",
            "stopPrice": tp, "closePosition": "true"
        }, signed=True)
        
        # Trailing TP aktifleştir
        if CONFIG["TRAILING_TP_ENABLED"]:
            price = get_mark_price()
            trailing_tp.activate(
                CONFIG["SYMBOL"], price, side,
                CONFIG["TRAILING_TP_ACTIVATION"],
                CONFIG["TRAILING_TP_CALLBACK"]
            )
        
        return True
    except Exception as e:
        print(f"❌ Order: {e}")
        return False

# ===========================================
# TEKNİK ANALİZ
# ===========================================

def calculate_ema(prices: List[float], period: int) -> float:
    if len(prices) < period:
        return 0
    k = 2 / (period + 1)
    ema = sum(prices[:period]) / period
    for p in prices[period:]:
        ema = (p - ema) * k + ema
    return ema

def calculate_rsi(prices: List[float], period: int = 14) -> float:
    if len(prices) < period + 1:
        return 50
    gains, losses = [], []
    for i in range(1, len(prices)):
        d = prices[i] - prices[i-1]
        gains.append(d if d > 0 else 0)
        losses.append(abs(d) if d < 0 else 0)
    avg_g = sum(gains[-period:]) / period
    avg_l = sum(losses[-period:]) / period
    if avg_l == 0:
        return 100
    return 100 - (100 / (1 + avg_g / avg_l))

def calculate_atr(klines: List[dict], period: int = 14) -> float:
    if len(klines) < period + 1:
        return 0
    trs = []
    for i in range(1, len(klines)):
        tr = max(klines[i]["high"] - klines[i]["low"],
                 abs(klines[i]["high"] - klines[i-1]["close"]),
                 abs(klines[i]["low"] - klines[i-1]["close"]))
        trs.append(tr)
    return sum(trs[-period:]) / period

def analyze_trend(klines: List[dict]) -> str:
    closes = [k["close"] for k in klines]
    ema20, ema50 = calculate_ema(closes, 20), calculate_ema(closes, 50)
    return "LONG" if ema20 > ema50 else "SHORT" if ema20 < ema50 else "NEUTRAL"

def check_pullback(klines: List[dict], trend: str) -> bool:
    rsi = calculate_rsi([k["close"] for k in klines], 14)
    if trend == "LONG":
        return CONFIG["RSI_LONG_MIN"] <= rsi <= CONFIG["RSI_LONG_MAX"]
    elif trend == "SHORT":
        return CONFIG["RSI_SHORT_MIN"] <= rsi <= CONFIG["RSI_SHORT_MAX"]
    return False

# ===========================================
# SCALPING STRATEJİ
# ===========================================

def run_scalping():
    print(f"\n{'='*50}\n⏰ {datetime.now().strftime('%H:%M:%S')} | SCALPING\n{'='*50}")
    
    can, reason = state.can_trade()
    if not can:
        print(f"❌ {reason}")
        return
    
    klines = get_klines("5m", 100)
    if not klines:
        return
    
    price = klines[-1]["close"]
    trend = analyze_trend(klines)
    print(f"💰 {CONFIG['SYMBOL']}: ${price:,.2f} | Trend: {trend}")
    
    if trend == "NEUTRAL":
        return
    
    if not check_pullback(klines, trend):
        rsi = calculate_rsi([k["close"] for k in klines], 14)
        print(f"⏳ Pullback bekleniyor (RSI: {rsi:.1f})")
        return
    
    atr = calculate_atr(klines)
    balance = get_account_balance()
    risk = balance * CONFIG["RISK_PER_TRADE"]
    
    if trend == "LONG":
        sl = round(price - atr * 1.5, 2)
        tp = round(price + atr * 0.8, 2)
        side = "BUY"
    else:
        sl = round(price + atr * 1.5, 2)
        tp = round(price - atr * 0.8, 2)
        side = "SELL"
    
    sl_dist = abs(price - sl) / price
    qty = round(risk / sl_dist / price, 3)
    
    print(f"\n🎯 {side} | SL: ${sl} | TP: ${tp} | Qty: {qty}")
    place_order(side, qty, sl, tp)

# ===========================================
# GRİD STRATEJİ
# ===========================================

def run_grid():
    print(f"\n{'='*50}\n⏰ {datetime.now().strftime('%H:%M:%S')} | GRID BOT\n{'='*50}")
    
    price = get_mark_price()
    print(f"💰 {CONFIG['SYMBOL']}: ${price:,.2f}")
    
    # İlk çalışmada gridleri kur
    if not grid_bot.grids:
        grid_bot.calculate_grids(
            price,
            CONFIG["GRID_UPPER"],
            CONFIG["GRID_LOWER"],
            CONFIG["GRID_COUNT"]
        )
        return
    
    # Tetiklenen gridleri kontrol et
    triggered = grid_bot.check_grid_triggers(price)
    
    for t in triggered:
        qty_per_grid = CONFIG["GRID_INVESTMENT"] / CONFIG["GRID_COUNT"] / price
        qty = round(qty_per_grid * CONFIG["LEVERAGE"], 3)
        
        if CONFIG["PAPER_TRADING"]:
            paper_trader.open_position(
                CONFIG["SYMBOL"], t["action"], qty, t["price"], 0, 0
            )
        else:
            api_request("POST", "/fapi/v1/order", {
                "symbol": CONFIG["SYMBOL"],
                "side": t["action"],
                "type": "MARKET",
                "quantity": qty
            }, signed=True)
        
        print(f"📊 Grid {t['level']}: {t['action']} @ ${t['price']:.2f}")
        
        # Grid'i ters yöne çevir
        new_type = "sell" if t["action"] == "BUY" else "buy"
        grid_bot.reset_grid(t["level"], new_type)
    
    stats = grid_bot.get_stats()
    print(f"📈 Filled: {stats['filled_grids']}/{stats['total_grids']}")

# ===========================================
# ANA DÖNGÜ
# ===========================================

def run_strategy():
    if CONFIG["TRADING_MODE"] == "grid":
        run_grid()
    else:
        run_scalping()
    
    # Paper trading pozisyon kontrolü
    if CONFIG["PAPER_TRADING"]:
        price = get_mark_price()
        paper_trader.check_position(CONFIG["SYMBOL"], price)
        
        stats = paper_trader.get_stats()
        if stats["trades"] > 0:
            print(f"\n📝 Paper: ${stats['balance']:.2f} | Trades: {stats['trades']} | Win: %{stats['win_rate']:.0f}")

def main():
    print(f"""
╔═══════════════════════════════════════════════╗
║   MicroTrend Bot PRO v2.0                     ║
║   Scalping | Grid | Paper Trading             ║
╚═══════════════════════════════════════════════╝
    """)
    
    if not CONFIG["API_KEY"] and not CONFIG["PAPER_TRADING"]:
        print("❌ API Key gerekli (veya PAPER_TRADING=true)")
        return
    
    balance = get_account_balance()
    print(f"💳 Bakiye: ${balance:.2f}")
    print(f"📊 Mode: {CONFIG['TRADING_MODE'].upper()}")
    print(f"📝 Paper: {CONFIG['PAPER_TRADING']}")
    print(f"🎯 Trailing TP: {CONFIG['TRAILING_TP_ENABLED']}")
    
    state.starting_balance = balance
    
    while True:
        try:
            run_strategy()
        except Exception as e:
            print(f"❌ {e}")
        
        # 5 dakika bekle
        now = datetime.now()
        mins = 5 - (now.minute % 5)
        if mins == 0:
            mins = 5
        next_run = now + timedelta(minutes=mins)
        next_run = next_run.replace(second=5, microsecond=0)
        wait = (next_run - now).total_seconds()
        if wait > 0:
            print(f"\n⏳ Sonraki: {next_run.strftime('%H:%M:%S')}")
            time.sleep(wait)

if __name__ == "__main__":
    main()
