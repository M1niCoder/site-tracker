const INGEST_TOKEN = "1f4a9b8c3d6e2f017ab9c4d5e6f7890a1234567890abcdef1234567890abcdef";

function collectFingerprint() {
  const now = new Date();

  // Canvas fingerprint (простіший варіант для унікальності)
  let canvasFingerprint = "";
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125,1,62,20);
    ctx.fillStyle = "#069";
    ctx.fillText("fingerprint", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("fingerprint", 4, 17);
    canvasFingerprint = canvas.toDataURL();
  } catch(e) {
    canvasFingerprint = null;
  }

  return {
    clientLocalTime: now.toISOString(),
    clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    lang: navigator.language,
    platform: navigator.platform,
    screen: `${screen.width || 0}x${screen.height || 0}`,
    cookiesEnabled: navigator.cookieEnabled,
    online: navigator.onLine,
    userAgent: navigator.userAgent,
    doNotTrack: navigator.doNotTrack || null,
    colorDepth: screen.colorDepth || null,
    pixelDepth: screen.pixelDepth || null,
    hardwareConcurrency: navigator.hardwareConcurrency || null,
    deviceMemory: navigator.deviceMemory || null,
    canvasFingerprint: canvasFingerprint,
    timezoneOffset: now.getTimezoneOffset(),
    connectionType: navigator.connection?.effectiveType || null,
  };
}

async function sendFingerprint() {
  const data = collectFingerprint();

  try {
    const res = await fetch("https://cf-ingest.trendomuz.workers.dev/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-ingest-token": INGEST_TOKEN,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error("INGEST FAILED:", await res.text());
    } else {
      console.log("Fingerprint sent:", data);
    }
  } catch (err) {
    console.error("NETWORK ERROR:", err);
  }
}

// Відправляємо при завантаженні сторінки
sendFingerprint();
