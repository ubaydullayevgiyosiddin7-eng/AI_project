// Asosiy Surdo AI ilovasi (root papkadagi Vite loyihasi) manzili.
// Sayt (:3000) va ilova (:5173) — alohida serverlar.
export const APP_URL = 'http://localhost:5173';

// Ilova serveri ishlayaptimi? no-cors so'rovi ishlayotgan bo'lsa opaque
// javob qaytaradi, ishlamasa tarmoq xatosi beradi — shu farqdan foydalanamiz.
export async function checkAppAlive(timeoutMs = 3000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    await fetch(APP_URL, { mode: 'no-cors', cache: 'no-store', signal: ctrl.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
