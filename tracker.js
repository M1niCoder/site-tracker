(function() {
  const payload = {
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    lang: navigator.language,
    screen: `${screen.width}x${screen.height}`,
    ua: navigator.userAgent,
    platform: navigator.platform,
    cookiesEnabled: navigator.cookieEnabled,
    online: navigator.onLine
  };

  fetch("https://cf-ingest.trendomuz.workers.dev/ingest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-ingest-token": "1f4a9b8c3d6e2f017ab9c4d5e6f7890a1234567890abcdef1234567890abcdef" // <-- твій токен для запису
    },
    body: JSON.stringify(payload)
  }).catch(() => {});
})();
