const INGEST_TOKEN = "1f4a9b8c3d6e2f017ab9c4d5e6f7890a1234567890abcdef1234567890abcdef";

function collectFingerprint() {
  const now = new Date();
  return {
    clientLocalTime: now.toISOString(),
    clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    lang: navigator.language,
    platform: navigator.platform,
    screen: `${screen.width}x${screen.height}`,
    cookiesEnabled: navigator.cookieEnabled,
    online: navigator.onLine,
  };
}

async function sendFingerprint() {
  try {
    const res = await fetch("https://cf-ingest.trendomuz.workers.dev/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-ingest-token": INGEST_TOKEN,
      },
      body: JSON.stringify(collectFingerprint()),
    });

    if (!res.ok) {
      console.error("INGEST FAILED:", await res.text());
    }
  } catch (e) {
    console.error("NETWORK ERROR:", e);
  }
}

sendFingerprint();
