// Central place for the auth cookie. Keeping the name and options in one
// file means "set on login" and "clear on logout" can never drift apart.
//
// Why a cookie instead of returning the token in the JSON body?
//   - httpOnly  -> JavaScript can't read it, so an XSS bug can't steal the
//                  token the way it could from localStorage.
//   - secure    -> only sent over HTTPS (enabled in production).
//   - sameSite  -> the browser won't attach the cookie to cross-site
//                  requests, which is what actually blocks CSRF.
const COOKIE_NAME = "token";

const isProd = () => process.env.NODE_ENV === "production";

// When the frontend and backend live on different domains (e.g. Vercel +
// Render), the browser treats requests as cross-site and will only send a
// cookie whose SameSite is "none" (and "none" REQUIRES secure=true). For a
// same-site setup "lax"/"strict" is safer. Drive it from an env var so the
// same code works in both deployments.
const sameSite = () => process.env.COOKIE_SAMESITE || "lax";

const cookieOptions = () => {
  const same = sameSite();
  return {
    httpOnly: true,
    // "none" cookies are rejected by browsers unless they're also secure.
    secure:false, // isProd() || same === "none",
    sameSite: "none", //same 
    // Match the token's own lifetime so the cookie doesn't outlive the JWT.
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: "/",
  };
};

const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, cookieOptions());
};

const clearAuthCookie = (res) => {
  // Must pass the same options (minus maxAge) or some browsers won't clear it.
  const { maxAge, ...rest } = cookieOptions();
  res.clearCookie(COOKIE_NAME, rest);
};

module.exports = { COOKIE_NAME, setAuthCookie, clearAuthCookie };


// hello 