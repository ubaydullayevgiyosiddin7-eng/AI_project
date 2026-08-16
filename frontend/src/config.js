// Aniqlash ilovasining manzili.
//
// Development : ikkita alohida server ishlaydi — ilova :5173 da.
// Production  : ikkala build bitta serverdan tarqatiladi, ilova /app yo'lida.
//               Same-origin bo'lgani uchun CORS va port muammosi yo'q.
export const APP_URL =
  process.env.NODE_ENV === 'production'
    ? '/app/'
    : 'http://localhost:5173';

// Ilova serveri javob beryaptimi? Production'da u sayt bilan bir xil
// serverda bo'lgani uchun tekshiruv doim muvaffaqiyatli o'tadi.
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
