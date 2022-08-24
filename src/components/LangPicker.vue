<template>
  <div class="lang-picker">
    <lang-picker-icon></lang-picker-icon>
    <span class="active">{{ selectedLocale.title }}</span> |
    <template v-for="(locale, idx) in otherLocales" :key="idx">
      <span @click="setLocale(locale)">
        {{ locale.title }}
      </span>
      <template v-if="idx + 1 != otherLocales.length"> | </template>
    </template>
  </div>
</template>
<script>
import LangPickerIcon from "/src/components/icons/LangPickerIcon.vue";
import { mapActions } from "vuex";
export default {
  props: {
    selectedLocale: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    LangPickerIcon
  },
  data() {
    return {
      locales: [
        {
          code: "en",
          title: "English"
        },
        {
          code: "es",
          title: "Español"
        }
      ]
    };
  },
  mounted() {
    const locale = this.getLocale(this.$route.params.lang);
    this.setLocale(locale, false);
  },
  computed: {
    otherLocales() {
      return this.locales.filter(
        (item) => item.code !== this.selectedLocale.code
      );
    }
  },
  methods: {
    ...mapActions(["setLanguageCode"]),
    getLocale(code) {
      return this.locales.find((item) => item.code === code);
    },
    setLocale(locale, redirect = true) {
      this.$i18n.locale = locale.code;
      this.setLanguageCode(locale.code);
      this.$emit("select", locale);
      if (redirect) {
        const { name, params, query } = this.$route;
        params.lang = locale.code;
        this.$router.push({ name: name, params: params, query: query });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "/src/assets/sass/datacue/_colors.scss";

.lang-picker {
  fill: $primary;
  color: $gray;

  svg {
    width: 15px;
    height: 15px;
    margin-bottom: 4px;
    margin-right: 5px;
  }

  span {
    cursor: pointer;
    font-size: 16px;

    &:hover {
      color: $primary;
      text-decoration: underline;
    }

    &.active {
      color: $primary;
    }
  }
}
</style>
