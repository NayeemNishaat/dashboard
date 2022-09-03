<template>
  <div>
    <loader-dots v-if="loading"></loader-dots>
    <template v-else>
      <card>
        <h3 slot="header">
          <i class="ti-info"></i>
          &nbsp;{{ $t("about your store") }}
        </h3>
        <div class="row">
          <div class="col-sm-6">
            <p v-if="isShopify">{{ storeName }}</p>
            <el-form
              class="form:storename"
              label-position="top"
              label-width="180px"
              v-else
            >
              <el-form-item :label="$t('store name')">
                <el-input v-model="storeName"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="col-sm-6">
            <p>{{ $t("domain") }} : {{ client.domain }}</p>
            <p>{{ $t("platform") }} : {{ client.type }}</p>
          </div>
        </div>
      </card>
      <card>
        <h3 slot="header">
          <i class="ti-world"></i>
          &nbsp;{{ $t("region") }}
        </h3>
        <p v-if="isShopify">
          {{ $t("settings:general:regional-settings") }}
        </p>

        <el-form label-position="top" label-width="180px">
          <div class="row">
            <div class="col-sm-6">
              <el-form-item :label="$t('country')">
                <p v-if="isShopify">{{ countryName }}</p>
                <el-select
                  v-else
                  v-model="country"
                  data-id="general-settings:country-list"
                  :placeholder="$t('select country')"
                  :disabled="isShopify"
                  filterable
                  @change="updateCountryDependents()"
                >
                  <el-option
                    v-for="country in countries"
                    :key="country.code"
                    :label="country.name"
                    :value="country.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-sm-6">
              <el-form-item :label="$t('language')">
                <p v-if="isShopify">
                  {{ languageName }}
                </p>
                <el-select
                  v-else
                  v-model="language"
                  :placeholder="$t('select your website language')"
                  :disabled="isShopify"
                  :allow-create="availableLanguages === []"
                >
                  <el-option
                    v-for="language in availableLanguages"
                    :key="language.code"
                    :label="language.name"
                    :value="language.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </card>
      <card>
        <h3 slot="header">
          <i class="ti-money"></i>
          &nbsp;{{ $t("pricing format") }}
        </h3>
        <h4>{{ $t("sample price") }}&nbsp;:&nbsp;{{ samplePrice }}</h4>
        <p v-if="isShopify">
          {{ $t("settings:general:currency-settings") }}
        </p>
        <template v-else>
          <h4>{{ $t("currency code") }}</h4>
          <el-form label-position="top" :model="currency" label-width="180px">
            <div class="row">
              <div class="col-sm-4">
                <el-form-item :label="$t('currency symbol')">
                  <el-select v-model="currency.code">
                    <el-option
                      v-for="currency in availableCurrencies"
                      :key="currency"
                      :label="currency"
                      :value="currency"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-sm-4">
                <el-form-item :label="$t('currency symbol separator')">
                  <el-select
                    data-id="general-settings:currency-symbol-separator"
                    v-model="currencySymbolSeparator"
                    :placeholder="$t('currency symbol position')"
                  >
                    <el-option
                      v-for="separator in [
                        { name: $t('none'), value: '' },
                        { name: $t('space'), value: ' ' },
                        { name: '.', value: '.' }
                      ]"
                      :key="separator.value"
                      :label="separator.name"
                      :value="separator.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-sm-4">
                <el-form-item :label="$t('placement')">
                  <el-select
                    data-id="general-settings:currency-symbol-placement"
                    v-model="currencySymbolPosition"
                    :placeholder="$t('currency symbol position')"
                  >
                    <el-option
                      v-for="placement in [
                        { name: $t('front'), value: 'front' },
                        { name: $t('back'), value: 'back' }
                      ]"
                      :key="placement.value"
                      :label="placement.name"
                      :value="placement.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <h4>{{ $t("price format") }}</h4>
          <el-form label-position="top" :model="currency" label-width="180px">
            <div class="row">
              <div class="col-sm-4">
                <el-form-item :label="$t('decimal separator')">
                  <el-select
                    v-model="currencyDecimalSeparator"
                    :placeholder="$t('decimal symbol')"
                  >
                    <el-option
                      v-for="separator in [
                        { name: '.', value: '.' },
                        { name: ',', value: ',' }
                      ]"
                      :key="separator.value"
                      :label="separator.name"
                      :value="separator.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-sm-4">
                <el-form-item :label="$t('decimals')">
                  <el-checkbox v-model="currencyShowDecimals">{{
                    $t("show decimals")
                  }}</el-checkbox>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <dc-button
            data-id="general-settings:save-btn"
            :loading="saving"
            @click="saveChanges"
            type="primary"
          >
            {{ $t("save") }}
          </dc-button>
        </template>
      </card>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import * as Sentry from "@sentry/browser";
import { getCountrySettings } from "@/api/backend";
import { useStore } from "vuex";
import Card from "@/components/Cards/Card.vue";
import DcButton from "@/components/DcButton.vue";
import LoaderDots from "@/components/LoaderDots.vue";

const store = useStore();

function currencyFormatString(format) {
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  return format.match(placeholderRegex)[1];
}

function formatPrice(price, options) {
  var cents = price * 100;
  var value = "";
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = options && options.format;

  function formatWithDelimiters(
    number,
    precision = 2,
    thousands = ",",
    decimal = "."
  ) {
    if (isNaN(number) || number == null) {
      return "0";
    }

    number = (number / 100.0).toFixed(precision);

    var parts = number.split("."),
      dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
      cents = parts[1] ? decimal + parts[1] : "";

    return dollars + cents;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
    case "amount_with_apostrophe_separator":
      value = formatWithDelimiters(cents, 2, "'", ".");
      break;
  }
  return formatString.replace(placeholderRegex, value);
}

const saving = ref(false);
const loading = ref(false);
const countrySettings = ref({});
const currencyCode = ref("");
const currencyDecimalSeparator = ref(".");
const currencyShowDecimals = ref(true);
const currencySymbolPosition = ref("front");
const currencySymbolSeparator = ref("");
const storeName = ref("");
const language = ref("es");
const country = ref("US");
const defaultCurrency = ref({
  code: "USD",
  format: "${{amount}}",
  supported_codes: ["USD"]
});

const { client, languageCode } = store.getters;
// const webSettings = store.getters["settings/webSettings"];
// const locale = store.getters["settings/locale"];

const languageName = computed(() => {
  try {
    return availableLanguages.value.filter(
      (elem) => elem.code === language.value
    )[0].name;
  } catch (err) {
    return "";
  }
});
const countryName = computed(() => {
  try {
    return countries.value.filter((elem) => elem.code === country.value)[0]
      .name;
  } catch (err) {
    return "";
  }
});
const isShopify = computed(() => {
  return (client?.type ?? "shopify") === "shopify";
});
const currencySymbol = computed(() => {
  return currentCountry.value?.currencies?.currency?.symbol ?? "";
});
const availableLanguages = computed(() => {
  if (currentCountry.value === {}) {
    return [];
  }
  let languages = currentCountry.value.languages || [
    { iso639_1: "en", name: "English", nativeName: "English" }
  ];

  return languages.map((lang) => {
    return {
      code: lang.iso639_1,
      name:
        lang.name === lang.nativeName
          ? lang.name
          : `${lang.nativeName} (${lang.name})`
    };
  });
});
const currency = computed(() => {
  let currency = client?.profile?.locale?.currency ?? defaultCurrency.value;

  let formatString = "{{amount}}";
  if (currencyDecimalSeparator.value === "'") {
    formatString = "{{amount_with_apostrophe_separator}}";
  } else if (currencyDecimalSeparator.value === ",") {
    if (currencyShowDecimals.value) {
      formatString = "{{amount_with_comma_separator}}";
    } else {
      formatString = "{{amount_no_decimals_with_comma_separator}}";
    }
  } else if (!currencyShowDecimals.value) {
    formatString = "{{amount_no_decimals}}";
  }
  currency.supported_codes = [currencyCode.value];
  if (currencySymbolPosition.value === "back") {
    currency.format = `${formatString}${currencySymbolSeparator.value}${currencySymbol.value}`;
    return currency;
  }
  currency.format = `${currencySymbol.value}${currencySymbolSeparator.value}${formatString}`;
  return currency;
});
const availableCurrencies = computed(() => {
  if (currentCountry.value === {}) {
    return [];
  }
  return [currentCountry.value?.currencies?.code ?? "USD"];
});
const currentCountry = computed(() => {
  if (
    !countrySettings.value ||
    countrySettings.value === {} ||
    !country.value ||
    !(country in countrySettings.value)
  ) {
    return {};
  }
  return countrySettings.value[country.value.toUpperCase()];
});
const countries = computed(() => {
  if (!countrySettings.value || countrySettings.value === {}) {
    return [];
  }
  let countries = [];
  Object.keys(countrySettings.value).map((countryCode) => {
    let name = countrySettings.value[countryCode].names.en;
    try {
      if (
        languageCode &&
        languageCode in countrySettings.value[countryCode].names.translations
      ) {
        name =
          countrySettings.value[countryCode].names.translations[languageCode];
      }
    } catch (err) {
      name = countrySettings.value[countryCode].names.en;
    }
    countries.push({
      code: countryCode,
      name: name
    });
  });
  return countries;
});
const samplePrice = computed(() => {
  if (!currency.value || currency.value === {}) {
    return "$1,500.00";
  }
  return formatPrice(1500, currency.value);
});

const saveChanges = async () => {
  if (client.type === "shopify") {
    return;
  }
  saving.value = true;
  try {
    const newProfile = client?.profile;
    newProfile.locale["country"] = country.value;
    newProfile.locale["language"] = language.value;
    newProfile.locale["currency"] = currency.value;

    await store.dispatch("settings/saveSettings", {
      profile: newProfile,
      store_name: storeName.value
    });
    setData();
    $notify({
      title: "success",
      message: "saved",
      type: "success"
    });
  } catch (err) {
    Sentry.captureException(err);
    showError(err);
  } finally {
    saving.value = false;
  }
};

const refreshData = async () => {
  loading.value = true;
  try {
    const webSettings = store.dispatch("settings/getWebSettings");
    const fetchCountrySettings = getCountrySettings();
    let response = [await webSettings, await fetchCountrySettings];
    setData();
    if (response[1]) {
      countrySettings.value = response[1];
    }
  } catch (err) {
    console.log(err);
    Sentry.captureException(err);
  } finally {
    loading.value = false;
  }
};
function setData() {
  //set name
  storeName.value = client.name;
  //set country
  country.value = client?.profile?.locale?.country ?? "US";

  //set language
  language.value = client?.profile?.locale?.language ?? "en";

  const currency = client?.profile?.locale?.currency ?? defaultCurrency.value;

  //set currency vars
  switch (currencyFormatString(currency.format)) {
    case "amount":
      setCurrencyVars(true, "", "front", ".");
      break;
    case "amount_no_decimals":
      setCurrencyVars(false, "", "front", ".");
      break;
    case "amount_with_comma_separator":
      setCurrencyVars(true, "", "front", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      setCurrencyVars(false, "", "front", ",");
      break;
    case "amount_with_apostrophe_separator":
      setCurrencyVars(true, "", "front", "'");
      break;
  }
}
const showError = (err) => {
  Sentry.captureException(err);
  $notify({
    title: "could not save",
    message: "an unknown error occured, please try again later",
    type: "warning"
  });
  saving.value = false;
};
const setCurrencyVars = (
  showDecimals,
  symbolSeparator,
  symbolPosition,
  decimalSeparator
) => {
  currencySymbolPosition.value = symbolPosition;
  currencySymbolSeparator.value = symbolSeparator;
  currencyDecimalSeparator.value = decimalSeparator;
  currencyShowDecimals.value = showDecimals;
};
const updateCountryDependents = () => {
  if (availableLanguages.value !== []) {
    let found = false;
    availableLanguages.value.forEach((lang) => {
      if (language.value === lang.code) {
        found = true;
      }
    });
    if (!found) {
      language.value = availableLanguages.value[0].code;
    }
  }
  if (currentCountry.value !== {} && currentCountry.value.currencies !== {}) {
    const currency = currentCountry.value.currencies;
    currencyCode.value = currency.code;
    currencyDecimalSeparator.value = currency?.separator?.decimal ?? ".";
    currencyShowDecimals.value = !!currency.show_cents;
    currencySymbolSeparator.value = currency?.separator?.currency ?? "";
    currencySymbolPosition.value = ["front", "back"].includes(
      currency.placement
    )
      ? currency.placement
      : "front";
  }
};

onMounted(() => {
  refreshData();
});
</script>
