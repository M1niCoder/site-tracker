(function () {
  // Унікальна сесія для кожного відвідувача
  const sessionId = crypto.randomUUID();

  function isTelegramWebView() {
    return /Telegram/i.test(navigator.userAgent);
  }

  const payload = {
    event: "page_view",
    session_id: sessionId,
    timestamp: Date.now(),

    ua: navigator.userAgent,
    language: navigator.language || null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,

    screen: {
      width: screen.width,
      height: screen.height,
      dpr: window.devicePixelRatio || 1
    },

    platform: navigator.platform || null,
    touch: "ontouchstart" in window,
    telegram_webview: isTelegramWebView()
  };

  // Заміни YOUR_WORKER_URL на URL твого Cloudflare Worker
fetch("https://old-math-71c0.trendomuz.workers.dev/log", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
}).catch(() => {});
})();
