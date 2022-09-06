import axios from "axios";
import * as Sentry from "@sentry/browser";

import store from "@/store/index";

// event bus setup
import bus from 'tiny-emitter/instance';
import { ClientBillingDetails } from "./billing_interfaces";
import { ClientSettings, Context, ClientSettingsUpdate, SetupSummary, PageInstallationSettings } from "./interfaces";

const BACKEND = import.meta.env.VITE_APP_BACKEND_URL;

axios.defaults.baseURL = `${BACKEND}/v1`;
axios.defaults.timeout = 8000;

function updateAuthHeader(token?) {
  const accessToken = token || store?.getters?.accessToken?.token;
  let headers = {
    Authorization: `Bearer ${accessToken}`
  };
  if (store.getters.apikey) {
    headers["X-Client"] = window.btoa(store.getters?.context?.client?.apikey);
  }
  return headers;
}

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error && error.response && error.response.status === 401) {
      bus.emit("errors:401");
      return Promise.reject(new Error("token expired"));
    }
    Sentry.captureException(error);
    return Promise.reject(error);
  }
);

bus.on("errors:401", () => {
  store.dispatch("logout");
});

export function getPageData(pagename, config) {
  const headers = updateAuthHeader();
  return new Promise((resolve, reject) => {
    axios
      .get(pagename, { headers, ...config })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function GetBillingPlans(): Promise<ClientBillingDetails> {
  const headers = updateAuthHeader();
  return new Promise((resolve, reject) => {
    axios
      .get("billing", { headers })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function GetCategories() {
  return new Promise((resolve, reject) => {
    axios.get("categories")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function DeactivateCategories(categories) {
  return new Promise((resolve, reject) => {
    axios.patch("categories", categories)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => reject(error));
  });
}

export function postSendEmail(payload) {
  const headers = updateAuthHeader();
  return axios.post("send-email", payload, { headers });
}

export function postBanner(banner) {
  const headers = updateAuthHeader();
  return axios.post("banners", banner, { headers });
}

export function signUp(client) {
  const urlParts = client.website
    .replace("http://", "")
    .replace("https://", "")
    .split(/[/?#]/);
  const domain = urlParts[0];
  const newUser = {
    name: "",
    email: client.email,
    password: client.password,
    username: client.username,
    domain: domain,
    language: store.getters.languageCode || "en",
    type: client.type,
    profile: {
      name: `${client.firstName} ${client.lastName}`
    }
  };
  const headers = { "X-APP": "dashboard" };
  return axios.post("client/sign-up", newUser, {
    headers
  });
}

export function deleteBanner(bannerId) {
  const headers = updateAuthHeader();
  return axios
    .delete(`banners/${encodeURI(bannerId)}`, {
      data: "",
      headers
    })
    .then((response) => response)
    .catch((error) => error);
}

export function updateBanner(bannerid, banner) {
  const headers = updateAuthHeader();
  return axios.put(`banners/${encodeURI(bannerid)}`, banner, { headers });
}

export function updatePartnerId(partnerId) {
  if (!partnerId) {
    console.error("empty ref");
    return;
  }
  const headers = updateAuthHeader();
  return axios.patch(`client/partner`, { aff_id: partnerId }, { headers });
}

export function deleteImage(bannerId) {
  const headers = updateAuthHeader();
  return axios
    .delete(`images/${bannerId}`, {
      data: "",
      headers
    })
    .then((response) => response)
    .catch((error) => error);
}

export function preSign(uploadType, fileName, contentType) {
  const headers = updateAuthHeader();
  if (["banners", "images"].includes(uploadType)) {
    fileName = `${genUniqueFileName(fileName)}`;
  }
  return axios
    .post(`uploads/presign`, { uploadType, fileName, contentType }, { headers })
    .then((response) => response.data)
    .catch((error) => error);
}

export function getImages() {
  const headers = updateAuthHeader();
  return axios
    .get(`uploads`, { headers })
    .then((response) => response.data)
    .catch((error) => error);
}

export function getCountrySettings() {
  const headers = updateAuthHeader();
  return axios
    .get(`countrylocales`, { headers })
    .then((response) => response.data)
    .catch((error) => error);
}

function genUniqueFileName(curName) {
  // to avoid file name conflicts, we append
  // 4 random alphanumerics to the uploaded filename
  const filename = curName.split(".");
  const ext = filename[filename.length - 1];
  const name = filename.slice(0, filename.length - 1).join(".");
  return `${name}_${randomAlphaNum(4)}.${ext}`;
}

function randomAlphaNum(len) {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return text;
}

export function selectPlan(planId, commissionCap) {
  const headers = updateAuthHeader();
  return axios.post(
    "billing",
    { plan_id: planId, commission_cap: commissionCap },
    { headers }
  );
}

export function verifyWebsite(url) {
  const headers = { "X-APP": "dashboard" };
  return axios.post("verify-website", { url }, { headers });
}

export function postOnboardingNotification(data) {
  const headers = updateAuthHeader();
  return axios.post("client/onboarding-notification", data, { headers });
}

export function GetSetupSummary(): Promise<SetupSummary> {
  const headers = updateAuthHeader();
  return new Promise((resolve, reject) => {
    axios
      .get("summary/setup", { headers })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function GetPageInstallationSettings(page: string): Promise<PageInstallationSettings> {
  const headers = updateAuthHeader();
  return new Promise((resolve, reject) => {
    axios
      .get(`settings/installation/${page}`, { headers })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function GetDashboardContext(): Promise<Context> {
  const headers = updateAuthHeader();
  return new Promise((resolve, reject) => {
    axios
      .get(`${BACKEND}/login`, { headers })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function GetSettings(): Promise<ClientSettings> {
  const headers = updateAuthHeader();
  return new Promise((resolve, reject) => {
    axios
      .get("settings", { headers })
      .then((response) => {
        if (response?.data?.name && response.data.name != "") {
          resolve(response.data)
          return
        }
        reject("invalid client settings object");
      })
      .catch((error) => reject(error));
  });
}

export function SaveSettings(settings: ClientSettingsUpdate): Promise<ClientSettings> {
  const headers = updateAuthHeader();
  return new Promise((resolve, reject) => {
    axios
      .post("settings", settings, { headers })
      .then((response) => {
        if (response?.data?.name && response.data.name != "") {
          resolve(response.data)
          return
        }
        reject("invalid settings object");
      })
      .catch((error) => reject(error));
  });
}

function finishOnboardingStage(stage: string): Promise<Context> {
  if (!["finish-setup", "finish-onboarding"].includes(stage)) {
    throw new Error(`invalid stage specified: ${stage}`)
  }
  const headers = updateAuthHeader();
  return new Promise((resolve, reject) => {
    axios
      .post(`client/${stage}`, "", { headers })
      .then((response) => {
        if (response?.data?.client?.apikey) {
          resolve(response.data)
          return
        }
        reject("invalid context");
      })
      .catch((error) => reject(error));
  });
}
export function FinishOnboarding(): Promise<Context> {
  return finishOnboardingStage("finish-onboarding");
}

export function FinishSetup(): Promise<Context> {
  return finishOnboardingStage("finish-setup");
}