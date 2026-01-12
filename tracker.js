const INGEST_TOKEN = "1f4a9b8c3d6e2f017ab9c4d5e6f7890a1234567890abcdef1234567890abcdef";

/* ---------- CANVAS ---------- */
function getCanvasFingerprint() {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillStyle = "#f60";
    ctx.fillRect(100, 10, 80, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("fp", 2, 15);
    return canvas.toDataURL();
  } catch {
    return null;
  }
}

/* ---------- WEBGL ---------- */
function getWebGLFingerprint() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    if (!gl) return null;

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return null;

    return {
      vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
      renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
    };
  } catch {
    return null;
  }
}

/* ---------- AUDIO ---------- */
async function getAudioFingerprint() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const analyser = ctx.createAnalyser();
    const gain = ctx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = 10000;
    gain.gain.value = 0;

    oscillator.connect(analyser);
    analyser.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    const buffer = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(buffer);

    oscillator.stop();
    ctx.close();

    return buffer.slice(0, 30).join(",");
  } catch {
    return null;
  }
}

/* ---------- COLLECT ---------- */
async function collectFingerprint() {
  return {
    user_agent: navigator.userAgent || null,
    platform: navigator.platform || null,
    canvas_fingerprint: getCanvasFingerprint(),
    webgl_fingerprint: JSON.stringify(getWebGLFingerprint()),
    audio_fingerprint: await getAudioFingerprint(),
    screen: `${screen.width || 0}x${screen.height || 0}`,
    lang: navigator.language || null,
    cookies_enabled: navigator.cookieEnabled ? 1 : 0,
    connection_type: navigator.connection?.effectiveType || null,
  };
}

/* ---------- SEND ---------- */
(async () => {
  const data = await collectFingerprint();

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
      console.log("Fingerprint sent");
    }
  } catch (e) {
    console.error("NETWORK ERROR:", e);
  }
})();
