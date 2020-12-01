import { reactive, readonly, inject } from "vue";
export const authSymbol = Symbol("auth");
import router from "@/router/index";
import decode from "jwt-decode";
const shopifyTokenLocalStorage = "dashboard:shopify_token";

import createAuth0Client, {
  Auth0Client,
  Auth0ClientOptions,
  GetIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  IdToken,
  LogoutOptions,
  RedirectLoginOptions
} from "@auth0/auth0-spa-js";
import { User } from "@/store/datacue_types";

export let instance: authPlugin | undefined;

export const getAuth = async (): Promise<authPlugin> => {
  const auth: authPlugin | undefined = await inject(authSymbol);
  if (!auth) {
    throw new Error("could not load auth component");
  }
  return auth;
};

function getTokenExpirationDate(token: any): Date | null {
  if (!token.exp) {
    return null;
  }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token: any): boolean {
  const expirationDate = getTokenExpirationDate(token);
  if (!expirationDate) {
    return false;
  }
  return expirationDate < new Date();
}
/** Define a default action to perform after authentication */
// const DEFAULT_REDIRECT_CALLBACK = (appState: any) =>
//   window.history.replaceState({}, document.title, "/");
interface authState {
  loading: boolean;
  auth0: {
    user: any;
    client: Readonly<Auth0Client> | null;
    isAuthenticated: boolean;
    popupOpen: boolean;
  };
  shopify: {
    token: any;
    raw_token: string;
    user: User;
  };
  error: null | any;
}

export interface authPlugin {
  state: authState;
  isAuthenticated: () => boolean;
  initShopifyAuth: (token: string, user: User) => void;
  handleRedirectCallback: () => Promise<void>;
  loginWithRedirect: (o?: RedirectLoginOptions) => void;
  getIdTokenClaims: (
    o?: GetIdTokenClaimsOptions
  ) => Promise<IdToken | undefined>;
  getIdToken: () => Promise<string | null>;
  getTokenSilently: (o?: GetTokenSilentlyOptions) => Promise<any>;
  getTokenWithPopup: (o?: GetTokenWithPopupOptions) => void;
  logout: (o?: LogoutOptions) => Promise<void>;
  logoutNoRedirect: (o?: LogoutOptions) => void;
}

export const createAuth = async (
  options: Auth0ClientOptions
): Promise<authPlugin> => {
  if (instance) {
    return instance;
  }
  const state = reactive({
    loading: true,
    shopify: {
      raw_token: "",
      token: {},
      user: {} as User
    },
    auth0: {
      isAuthenticated: false,
      user: {} as any,
      raw_token: "",
      client: null as Readonly<Auth0Client> | null,
      popupOpen: false
    },
    error: null as any | null
  });

  state.auth0.client = await createAuth0Client({
    domain: options.domain,
    client_id: options.client_id,
    redirect_uri: options.redirect_uri,
    cacheLocation: "localstorage"
  });

  const initShopifyAuth = (token: string, user: User) => {
    state.auth0.client = null;
    state.shopify.raw_token = token;
    state.shopify.token = decode(token) as any;
    state.shopify.user = user;
    localStorage.setItem(
      shopifyTokenLocalStorage,
      JSON.stringify({ token, user })
    );
  };

  const isAuthenticated = (): boolean => {
    //is it Shopify?
    if (state.shopify.raw_token) {
      return !isTokenExpired(state.shopify.token);
    }
    if (state.auth0.client) {
      return state.auth0.isAuthenticated;
    }
    return false;
  };

  /** Handles the callback when logging in using a redirect */
  const handleRedirectCallback = async () => {
    if (!state.auth0.client) {
      throw new Error("no auth0 client found");
    }
    state.loading = true;
    try {
      await state.auth0.client.handleRedirectCallback();
      state.auth0.user = await state.auth0.client.getUser();
      state.auth0.isAuthenticated = true;
      console.log(
        `user: ${state.auth0.user} authenticated?:${state.auth0.isAuthenticated}`
      );
    } catch (e) {
      state.error = e;
    } finally {
      state.loading = false;
    }
  };
  /** Authenticates the user using the redirect method */
  const loginWithRedirect = (o?: RedirectLoginOptions) => {
    if (!state.auth0.client) {
      return;
    }
    return state.auth0.client.loginWithRedirect(o);
  };
  /** Returns all the claims present in the ID token */
  const getIdTokenClaims = async (o?: GetIdTokenClaimsOptions) => {
    if (!state.auth0.client) return;
    return state.auth0.client.getIdTokenClaims(o);
  };
  /** Returns raw ID token */
  const getIdToken = async () => {
    if (state.auth0.client) {
      try {
        const token = await state.auth0.client.getIdTokenClaims();
        return token?.__raw ?? "";
      } catch (err) {
        return "";
      }
    }
    if (state.shopify.raw_token) {
      return state.shopify.raw_token;
    }
    return null;
  };
  /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
  const getTokenSilently = async (o?: GetTokenSilentlyOptions) => {
    if (!state.auth0.client) return;
    return await state.auth0.client.getTokenSilently(o);
  };
  /** Gets the access token using a popup window */

  const getTokenWithPopup = (o?: GetTokenWithPopupOptions) => {
    if (!state.auth0.client) return;
    return state.auth0.client.getTokenWithPopup(o);
  };
  /** Logs the user out and removes their session on the authorization server */
  const logout = async (o?: LogoutOptions) => {
    if (!state.auth0.client) return;
    state.auth0.client.logout(o);
    await router.push("login");
  };
  const logoutNoRedirect = (o?: LogoutOptions) => {
    if (!state.auth0.client) return;
    return state.auth0.client.logout(o);
  };
  instance = {
    initShopifyAuth,
    isAuthenticated,
    handleRedirectCallback,
    loginWithRedirect,
    getIdTokenClaims,
    getIdToken,
    getTokenSilently,
    getTokenWithPopup,
    logout,
    logoutNoRedirect,
    state: readonly(state)
  };

  //** INIT **/
  //is this a Shopify client?
  const shopifyToken = window.localStorage.getItem(shopifyTokenLocalStorage);
  if (shopifyToken) {
    try {
      const { token, user } = JSON.parse(shopifyToken);
      initShopifyAuth(token, user);
      if (!isAuthenticated()) {
        localStorage.removeItem(shopifyTokenLocalStorage);
      }
    } catch (err) {
      console.error(err);
    }
    return instance;
  }
  //auth0 client
  try {
    // If the user is returning to the app after authentication..
    if (
      window.location.search.includes("code=") &&
      window.location.search.includes("state=")
    ) {
      // handle the redirect and retrieve tokens
      const { appState } = await state.auth0.client.handleRedirectCallback();
    }
  } catch (e) {
    state.error = e;
  } finally {
    // Initialize the internal authentication state
    state.auth0.isAuthenticated = await state.auth0.client.isAuthenticated();
    state.auth0.user = await state.auth0.client.getUser();
    state.loading = false;
  }

  return instance;
};
