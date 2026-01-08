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
      "x-ingest-token": "9b2d3f4e5a6c7b8d0123456789abcdefabcdef0123456789abcdef0123456789" // <-- твій токен для запису
    },
    body: JSON.stringify(payload)
  }).catch(() => {});
})();
