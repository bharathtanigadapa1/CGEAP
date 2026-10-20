const TOKEN_KEY = 'ceagapToken';
const USER_KEY = 'ceagapUser';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
};
export const saveSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.removeItem('ceagapGuest');
};
export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/** JSON helper: adds the JWT, throws Error(message) with the server's message on failure. */
export async function api(path, opt = {}) {
  const headers = { ...(opt.headers || {}) };
  if (opt.body !== undefined) headers['Content-Type'] = 'application/json';
  if (getToken()) headers.Authorization = 'Bearer ' + getToken();
  let res;
  try {
    res = await fetch(path, { ...opt, headers, body: opt.body !== undefined ? JSON.stringify(opt.body) : undefined });
  } catch {
    throw new Error('Cannot reach the server. Please check your connection.');
  }
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* not json */ }
  if (!res.ok) {
    if (res.status === 401 && getToken()) {
      // token expired or invalid: drop the session so the app sends the user to login
      clearSession();
      window.dispatchEvent(new Event('ceagap:logout'));
    }
    throw new Error((data && data.message) || 'Request failed');
  }
  return data;
}

/** Downloads a protected image (admin photo) as an object URL. */
export async function fetchImageUrl(path) {
  const res = await fetch(path, { headers: { Authorization: 'Bearer ' + getToken() } });
  if (!res.ok) throw new Error('Photo not available');
  return URL.createObjectURL(await res.blob());
}

/** Shrinks a photo before upload so the database stays small. Returns a data: URL (JPEG). */
export function compressImage(file, max = 1100, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * s);
        c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
