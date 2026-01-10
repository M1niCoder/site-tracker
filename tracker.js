const INGEST_TOKEN = "1f4a9b8c3d6e2f017ab9c4d5e6f7890a1234567890abcdef1234567890abcdef";

function getCanvasFingerprint() {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125,1,62,20);
    ctx.fillStyle = "#069";
    ctx.fillText("fingerprint", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("fingerprint", 4, 17);
    return canvas.toDataURL();
  } catch(e) {
    return null;
  }
}

function collectFingerprint() {
  return {
    clientLocalTime: new Date().toISOString(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    canvasFingerprint: getCanvasFingerprint(),
    org: navigator.vendor || null,
    country: null, // Cloudflare збере при серверному записі
    city: null,
    region: null,
    timezone_cf: null,
    asn: null,
    screen: `${screen.width || 0}x${screen.height || 0}`,
    lang: navigator.language,
    cookies_enabled: navigator.cookieEnabled ? 1 : 0,
    connection_type: navigator.connection?.effectiveType || null,
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

// Відправка при завантаженні сторінки
sendFingerprint();
