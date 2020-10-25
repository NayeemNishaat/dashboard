import { reactive, readonly, inject } from "vue";
export const authSymbol = Symbol("auth");
import router from "@/router/index";
import store from "@/store/index";

import createAuth0Client, {
  Auth0Client,
  Auth0ClientOptions,
  GetIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  IdToken,
  LogoutOptions,
  PopupLoginOptions,
  RedirectLoginOptions
} from "@auth0/auth0-spa-js";

export let instance: authPlugin | undefined;

export const getAuth = async (): Promise<authPlugin> => {
  const auth: authPlugin | undefined = await inject(authSymbol);
  if (!auth) {
    throw new Error("could not load auth component");
  }
  return auth;
};

/** Define a default action to perform after authentication */
// const DEFAULT_REDIRECT_CALLBACK = (appState: any) =>
//   window.history.replaceState({}, document.title, "/");
interface authState {
  loading: boolean;
  isAuthenticated: boolean;
  user: any;
  auth0Client: Readonly<Auth0Client> | null;
  popupOpen: boolean;
  error: null | any;
}

export interface authPlugin {
  state: authState;
  loginWithPopup: (o: PopupLoginOptions) => Promise<void>;
  handleRedirectCallback: () => Promise<void>;
  loginWithRedirect: (o?: RedirectLoginOptions) => void;
  getIdTokenClaims: (
    o?: GetIdTokenClaimsOptions
  ) => Promise<IdToken | undefined>;
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
    isAuthenticated: false,
    user: {} as any,
    auth0Client: null as Readonly<Auth0Client> | null,
    popupOpen: false,
    error: null as any | null
  });

  state.auth0Client = await createAuth0Client({
    domain: options.domain,
    client_id: options.client_id,
    redirect_uri: options.redirect_uri
  });

  try {
    // If the user is returning to the app after authentication..
    if (
      window.location.search.includes("code=") &&
      window.location.search.includes("state=")
    ) {
      // handle the redirect and retrieve tokens
      const { appState } = await state.auth0Client.handleRedirectCallback();
    }
  } catch (e) {
    state.error = e;
  } finally {
    // Initialize the internal authentication state
    state.isAuthenticated = await state.auth0Client.isAuthenticated();
    state.user = await state.auth0Client.getUser();
    state.loading = false;
  }
  const loginWithPopup = async (o?: PopupLoginOptions) => {
    if (!state.auth0Client) {
      return;
    }
    state.popupOpen = true;

    try {
      await state.auth0Client.loginWithPopup(o);
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    } finally {
      state.popupOpen = false;
    }

    state.user = await state.auth0Client.getUser();
    state.isAuthenticated = true;
  };
  /** Handles the callback when logging in using a redirect */
  const handleRedirectCallback = async () => {
    if (!state.auth0Client) {
      throw new Error("no auth0 client found");
    }
    state.loading = true;
    try {
      await state.auth0Client.handleRedirectCallback();
      state.user = await state.auth0Client.getUser();
      state.isAuthenticated = true;
    } catch (e) {
      state.error = e;
    } finally {
      state.loading = false;
    }
    try {
      await store.dispatch("fetchClients");
    } catch (e) {
      console.log(e);
    }
  };
  /** Authenticates the user using the redirect method */
  const loginWithRedirect = (o?: RedirectLoginOptions) => {
    if (!state.auth0Client) {
      return;
    }
    return state.auth0Client.loginWithRedirect(o);
  };
  /** Returns all the claims present in the ID token */
  const getIdTokenClaims = async (o?: GetIdTokenClaimsOptions) => {
    if (!state.auth0Client) return;
    return state.auth0Client.getIdTokenClaims(o);
  };
  /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
  const getTokenSilently = async (o?: GetTokenSilentlyOptions) => {
    if (!state.auth0Client) return;
    return await state.auth0Client.getTokenSilently(o);
  };
  /** Gets the access token using a popup window */

  const getTokenWithPopup = (o?: GetTokenWithPopupOptions) => {
    if (!state.auth0Client) return;
    return state.auth0Client.getTokenWithPopup(o);
  };
  /** Logs the user out and removes their session on the authorization server */
  const logout = async (o?: LogoutOptions) => {
    if (!state.auth0Client) return;
    state.auth0Client.logout(o);
    await router.push("login");
  };
  const logoutNoRedirect = (o?: LogoutOptions) => {
    if (!state.auth0Client) return;
    return state.auth0Client.logout(o);
  };
  instance = {
    loginWithPopup,
    handleRedirectCallback,
    loginWithRedirect,
    getIdTokenClaims,
    getTokenSilently,
    getTokenWithPopup,
    logout,
    logoutNoRedirect,
    state: readonly(state)
  };
  return instance;
};
