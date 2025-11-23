function validUrl(input) {
  try {
    const u = new URL(input);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    return true;
  } catch (e) {
    return false;
  }
}

function validCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

function randomCode(len = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < len; i++) {
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return s;
}

module.exports = { validUrl, validCode, randomCode };
