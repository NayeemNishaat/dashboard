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
            <el-form class="form:storename" label-position="top" label-width="180px" v-else>
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
                <el-select v-else v-model="country" data-id="general-settings:country-list"
                  :placeholder="$t('select country')" :disabled="isShopify" filterable
                  @change="updateCountryDependents()">
                  <el-option v-for="country in countries" :key="country.code" :label="country.name"
                    :value="country.code"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-sm-6">
              <el-form-item :label="$t('language')">
                <p v-if="isShopify">
                  {{ languageName }}
                </p>
                <el-select v-else v-model="language" :placeholder="$t('select your website language')"
                  :disabled="isShopify" :allow-create="availableLanguages === []">
                  <el-option v-for="language in availableLanguages" :key="language.code" :label="language.name"
                    :value="language.code"></el-option>
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
        <HR />
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
                    <el-option v-for="currency in availableCurrencies" :key="currency" :label="currency"
                      :value="currency"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-sm-4">
                <el-form-item :label="$t('currency symbol separator')">
                  <el-select data-id="general-settings:currency-symbol-separator" v-model="currencySymbolSeparator"
                    :placeholder="$t('currency symbol position')">
                    <el-option v-for="separator in [
                      { name: $t('none'), value: '' },
                      { name: $t('space'), value: ' ' },
                      { name: '.', value: '.' }
                    ]" :key="separator.value" :label="separator.name" :value="separator.value"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-sm-4">
                <el-form-item :label="$t('placement')">
                  <el-select data-id="general-settings:currency-symbol-placement" v-model="currencySymbolPosition"
                    :placeholder="$t('currency symbol position')">
                    <el-option v-for="placement in [
                      { name: $t('front'), value: 'front' },
                      { name: $t('back'), value: 'back' }
                    ]" :key="placement.value" :label="placement.name" :value="placement.value"></el-option>
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
                  <el-select v-model="currencyDecimalSeparator" :placeholder="$t('decimal symbol')">
                    <el-option v-for="separator in [
                      { name: '.', value: '.' },
                      { name: ',', value: ',' }
                    ]" :key="separator.value" :label="separator.name" :value="separator.value"></el-option>
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
          <dc-button data-id="general-settings:save-btn" :loading="saving" @click="saveChanges" type="primary">
            {{ $t("save") }}
          </dc-button>
        </template>
      </card>
    </template>
  </div>
</template>

<script>
import * as Sentry from "@sentry/browser";
import { mapActions, mapGetters } from "vuex";
import { getCountrySettings } from "/src/api/backend";

import Card from "/src/components/Cards/Card.vue";

import DcButton from "/src/components/DcButton.vue";
import LoaderDots from "/src/components/LoaderDots.vue";

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

export default {
  name: "General",
  components: {
    Card,
    DcButton,
    LoaderDots
  },
  data() {
    return {
      saving: false,
      loading: false,
      countrySettings: {},
      currencyCode: "",
      currencyDecimalSeparator: ".",
      currencyShowDecimals: true,
      currencySymbolPosition: "front",
      currencySymbolSeparator: "",
      storeName: "",
      language: "es",
      country: "US",
      defaultCurrency: {
        code: "USD",
        format: "${{amount}}",
        supported_codes: ["USD"]
      }
    };
  },
  computed: {
    ...mapGetters(["client"]),
    ...mapGetters(["client", "languageCode"]),
    ...mapGetters("settings", ["webSettings", "locale"]),
    languageName() {
      try {
        return this.availableLanguages.filter(
          (elem) => elem.code == this.language
        )[0].name;
      } catch (err) {
        return "";
      }
    },
    countryName() {
      try {
        return this.countries.filter((elem) => elem.code == this.country)[0]
          .name;
      } catch (err) {
        return "";
      }
    },
    isShopify() {
      return (this.client?.type ?? "shopify") === "shopify";
    },
    currencySymbol() {
      return this.currentCountry?.currencies?.currency?.symbol ?? "";
    },
    availableLanguages() {
      if (this.currentCountry === {}) {
        return [];
      }
      let languages = this.currentCountry.languages || [
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
    },
    currency() {
      let currency =
        this.client?.profile?.locale?.currency ?? this.defaultCurrency;

      let formatString = "{{amount}}";
      if (this.currencyDecimalSeparator === "'") {
        formatString = "{{amount_with_apostrophe_separator}}";
      } else if (this.currencyDecimalSeparator === ",") {
        if (this.currencyShowDecimals) {
          formatString = "{{amount_with_comma_separator}}";
        } else {
          formatString = "{{amount_no_decimals_with_comma_separator}}";
        }
      } else if (!this.currencyShowDecimals) {
        formatString = "{{amount_no_decimals}}";
      }
      currency.supported_codes = [this.currencyCode];
      if (this.currencySymbolPosition === "back") {
        currency.format = `${formatString}${this.currencySymbolSeparator}${this.currencySymbol}`;
        return currency;
      }
      currency.format = `${this.currencySymbol}${this.currencySymbolSeparator}${formatString}`;
      return currency;
    },
    availableCurrencies() {
      if (this.currentCountry === {}) {
        return [];
      }
      return [this.currentCountry?.currencies?.code ?? "USD"];
    },
    currentCountry() {
      if (
        !this.countrySettings ||
        this.countrySettings === {} ||
        !this.country ||
        !(this.country in this.countrySettings)
      ) {
        return {};
      }
      return this.countrySettings[this.country.toUpperCase()];
    },
    countries() {
      if (!this.countrySettings || this.countrySettings === {}) {
        return [];
      }
      let countries = [];
      Object.keys(this.countrySettings).map((countryCode) => {
        let name = this.countrySettings[countryCode].names.en;
        try {
          if (
            this.languageCode &&
            this.languageCode in
            this.countrySettings[countryCode].names.translations
          ) {
            name =
              this.countrySettings[countryCode].names.translations[
              this.languageCode
              ];
          }
        } catch (err) {
          name = this.countrySettings[countryCode].names.en;
        }
        countries.push({
          code: countryCode,
          name: name
        });
      });
      return countries;
    },
    samplePrice() {
      if (!this.currency || this.currency === {}) {
        return "$1,500.00";
      }
      return formatPrice(1500, this.currency);
    }
  },
  methods: {
    ...mapActions("settings", ["getWebSettings", "saveSettings"]),
    async saveChanges() {
      if (this.client.type === "shopify") {
        return;
      }
      this.saving = true;
      try {
        const newProfile = this.client?.profile;
        newProfile.locale["country"] = this.country;
        newProfile.locale["language"] = this.language;
        newProfile.locale["currency"] = this.currency;
        await this.saveSettings({
          profile: newProfile,
          store_name: this.storeName
        });
        this.setData();
        this.$notify({
          title: this.$t("success"),
          message: this.$t("saved"),
          type: "success"
        });
      } catch (err) {
        Sentry.captureException(err);
        this.showError(err);
      } finally {
        this.saving = false;
      }
    },
    async refreshData() {
      this.loading = true;
      try {
        const webSettings = this.getWebSettings();
        const countrySettings = getCountrySettings();
        let response = [await webSettings, await countrySettings];
        this.setData();
        if (response[1]) {
          this.countrySettings = response[1];
        }
      } catch (err) {
        this.error = this.$t(
          "an unknown error occured, please try again later"
        );
        Sentry.captureException(err);
      } finally {
        this.loading = false;
      }
    },
    setData() {
      //set name
      this.storeName = this.client.name;
      //set country
      this.country = this.client?.profile?.locale?.country ?? "US";

      //set language
      this.language = this.client?.profile?.locale?.language ?? "en";

      const currency =
        this.client?.profile?.locale?.currency ?? this.defaultCurrency;

      //set currency vars
      switch (currencyFormatString(currency.format)) {
        case "amount":
          this.setCurrencyVars(true, "", "front", ".");
          break;
        case "amount_no_decimals":
          this.setCurrencyVars(false, "", "front", ".");
          break;
        case "amount_with_comma_separator":
          this.setCurrencyVars(true, "", "front", ",");
          break;
        case "amount_no_decimals_with_comma_separator":
          this.setCurrencyVars(false, "", "front", ",");
          break;
        case "amount_with_apostrophe_separator":
          this.setCurrencyVars(true, "", "front", "'");
          break;
      }
    },
    showError(err) {
      Sentry.captureException(err);
      this.$notify({
        title: this.$t("could not save"),
        message: this.$t("an unknown error occured, please try again later"),
        type: "warning"
      });
      this.saving = false;
    },
    setCurrencyVars(
      showDecimals,
      currencySymbolSeparator,
      currencySymbolPosition,
      currencyDecimalSeparator
    ) {
      this.currencySymbolPosition = currencySymbolPosition;
      this.currencySymbolSeparator = currencySymbolSeparator;
      this.currencyDecimalSeparator = currencyDecimalSeparator;
      this.currencyShowDecimals = showDecimals;
    },
    updateCountryDependents() {
      if (this.availableLanguages !== []) {
        let found = false;
        this.availableLanguages.forEach((lang) => {
          if (this.language === lang.code) {
            found = true;
          }
        });
        if (!found) {
          this.language = this.availableLanguages[0].code;
        }
      }
      if (this.currentCountry !== {} && this.currentCountry.currencies !== {}) {
        const currency = this.currentCountry.currencies;
        this.currencyCode = currency.code;
        this.currencyDecimalSeparator = currency?.separator?.decimal ?? ".";
        this.currencyShowDecimals = !!currency.show_cents;
        this.currencySymbolSeparator = currency?.separator?.currency ?? "";
        this.currencySymbolPosition = ["front", "back"].includes(
          currency.placement
        )
          ? currency.placement
          : "front";
      }
    }
  },
  async mounted() {
    await this.refreshData();
  }
};
</script>
