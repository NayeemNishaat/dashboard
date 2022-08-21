import auth0 from "auth0-js";
import decode from "jwt-decode";

//error reporting
export const AUTH_CONFIG = {
  clientId: `${process.env.VUE_APP_AUTH_ID}`,
  domain: `${process.env.VUE_APP_AUTH_DOMAIN}`,
  callbackUrl: `${process.env.VUE_APP_URL}/callback`
};

const auth = new auth0.WebAuth({
  domain: AUTH_CONFIG.domain,
  clientID: AUTH_CONFIG.clientId,
  redirectUri: AUTH_CONFIG.callbackUrl,
  responseType: "token id_token",
  scope: "openid email"
});

export function login(
  language: string,
  platform: string,
  appname: string
): void {
  const params = {} as auth0.AuthorizeOptions;
  params.language = language;
  // params.login_hint = JSON.stringify({ platform, appname });

  auth.authorize(params);
}

export function logout(auth_provider: string, url: string) {
  if (!url) {
    url = `${process.env.VUE_APP_URL}`;
  }
  if (auth_provider == "auth0") {
    auth.logout({
      returnTo: url
    });
  }
  window.location.href = url;
}

export function logoutNoRedirect() {
  auth.logout({});
}

export function handleAuthentication(
  callback: auth0.Auth0Callback<
    auth0.Auth0DecodedHash | null,
    auth0.Auth0ParseHashError
  >
) {
  auth.parseHash(callback);
}

export function getTokenExpirationDate(encodedToken: string): Date | null {
  let token = {} as { exp?: number };
  try {
    token = decode(encodedToken);
  } catch (err) {
    return null;
  }
  if (!token.exp) {
    return null;
  }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

export function isTokenExpired(token: string): boolean {
  const expirationDate = getTokenExpirationDate(token);
  if (!expirationDate) {
    return false;
  }
  return expirationDate < new Date();
}
