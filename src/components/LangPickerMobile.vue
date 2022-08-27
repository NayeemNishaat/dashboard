<template>
  <div class="lang-picker-container">
    <span class="lang-picker" @click="togglePicker">
      <lang-picker-icon v-if="showPicker"></lang-picker-icon>
      <template v-else>
        {{ this.selectedLocale.code.toUpperCase() }}
      </template>
      <i class="fa fa-angle-down"></i>
    </span>

    <div v-if="showPicker" class="lang-selector">
      <div class="languages">
        <div :key="locale.code" v-for="locale in locales" @click="setLocale(locale)"
          :class="{ item: true, active: selectedLocale.code === locale.code }">
          {{ locale.title }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LangPickerIcon from "@/components/icons/LangPickerIcon.vue";
import { mapActions } from "vuex";
export default {
  props: {
    selectedLocale: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    LangPickerIcon
  },
  data() {
    return {
      showPicker: true,
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
  methods: {
    ...mapActions(["setLanguageCode"]),
    getLocale(code) {
      return this.locales.find((item) => item.code === code);
    },
    togglePicker() {
      this.showPicker = !this.showPicker;
      if (this.showPicker) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    },
    setLocale(locale, redirect = true) {
      this.$i18n.locale = locale.code;
      this.setLanguageCode(locale.code);
      this.$emit("select", locale);
      this.togglePicker();
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
@import "@/assets/sass/datacue/_colors.scss";

.lang-picker-container {
  background: $bg-primary;
  width: 100%;

  .lang-picker {
    top: 20px;
    left: 15px;
    position: absolute;
    line-height: 1;
    z-index: 1000;
    cursor: pointer;

    svg {
      width: 15px;
      height: 15px;
      margin-top: -5px;
      fill: $gray;
    }
  }
}

.lang-selector {
  width: 100%;
  height: 100%;
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  background: $bg-primary;
  z-index: 999;

  .languages {
    margin-top: 50px;
    width: 100%;

    .item {
      cursor: pointer;
      width: 100%;
      align-items: center;
      justify-content: center;
      display: flex;
      height: 40px;

      &:hover,
      &.active {
        color: $primary;
      }
    }
  }
}
</style>
