import axios from "axios";
import { Http } from "@/http";
import Vue from "vue";
import * as Sentry from "@sentry/browser";

import store from "@/store/index";
import router from "@/router/index";

// event bus setup
const bus = new Vue();

const BACKEND = import.meta.env.VITE_APP_BACKEND_URL;

axios.defaults.baseURL = `${BACKEND}/v1`;
axios.defaults.timeout = 15000;

function updateAuthHeader(token) {
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
  response => {
    return response;
  },
  error => {
    if (error && error.response && error.response.status === 401) {
      bus.$emit("errors:401");
      return Promise.reject(new Error("token expired"));
    }
    Sentry.captureException(error);
    return Promise.reject(error);
  }
);

bus.$on("errors:401", () => {
  store.dispatch("logout");
});

export function getPageData(pagename, config) {
  const headers = updateAuthHeader();
  return new Promise((resolve, reject) => {
    axios
      .get(pagename, { headers, ...config })
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

export function GetCategories() {
  return new Promise((resolve, reject) => {
    Http.get("categories")
      .then(response => {
        resolve(response.data);
      })
      .catch(error => reject(error));
  });
}

export function DeactivateCategories(categories) {
  return new Promise((resolve, reject) => {
    Http.patch("categories", categories)
      .then(response => {
        resolve(response);
      })
      .catch(error => reject(error));
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
      body: "",
      data: "",
      headers
    })
    .then(response => response)
    .catch(error => error);
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
      body: "",
      data: "",
      headers
    })
    .then(response => response)
    .catch(error => error);
}

export function setHelpWidgetPosition(data) {
  const headers = updateAuthHeader();
  return axios.post("client/help-widget", data, { headers });
}

export function postCampaign(campaign) {
  const headers = updateAuthHeader();
  return axios.post("campaigns", campaign, { headers });
}

export function putCampaign(campaignId, campaign) {
  const headers = updateAuthHeader();
  return axios.put(`campaigns/${campaignId}`, campaign, { headers });
}

export function preSign(uploadType, fileName, contentType) {
  const headers = updateAuthHeader();
  if (["banners", "images"].includes(uploadType)) {
    fileName = `${genUniqueFileName(fileName)}`;
  }
  return axios
    .post(`uploads/presign`, { uploadType, fileName, contentType }, { headers })
    .then(response => response.data)
    .catch(error => error);
}

export function getImages() {
  const headers = updateAuthHeader();
  return axios
    .get(`uploads`, { headers })
    .then(response => response.data)
    .catch(error => error);
}

export function getCountrySettings() {
  const headers = updateAuthHeader();
  return axios
    .get(`countrylocales`, { headers })
    .then(response => response.data)
    .catch(error => error);
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
