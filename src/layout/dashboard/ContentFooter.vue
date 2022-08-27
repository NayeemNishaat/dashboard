<template>
  <footer class="footer">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-sm-4 col-xs-12 d-flex centered">
          <span>&copy; {{ new Date().getFullYear() }} DATACUE (PTE. LTD.)</span>
        </div>
        <div class="col-sm-4 col-xs-12 d-flex centered">
          <div>
            <span>{{ $t("made with") }}&nbsp;</span>
            <i class="ti-heart"></i>
            <span>&nbsp;{{ $t("in singapore & santiago") }}</span>
          </div>
        </div>
        <div class="col-sm-4 col-xs-12 d-flex centered">
          <el-dropdown @command="changeLanguage">
            <div>
              <i class="ti-world"></i>
              <span>&nbsp;&nbsp;{{ currentLang.name }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <template #dropdown>
              <el-dropdown-menu data-id="footer:language-switcher-options">
                <el-dropdown-item
                  v-for="(lang, idx) in languages"
                  :key="idx"
                  :command="lang.code"
                  >{{ lang.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
import { supportedLanguages } from "../../lang/lang";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      languages: supportedLanguages
    };
  },
  computed: {
    ...mapGetters(["languageCode"]),
    currentLang() {
      let en = { code: "en", name: "English" }; // default
      return (
        this.languages.find((lang) => lang.code === this.languageCode) || en
      );
    }
  },
  methods: {
    ...mapActions(["setLanguageCode"]),
    changeLanguage(payload) {
      this.setLanguageCode(payload);
      this.$i18n.locale = locale;
    }
  }
};
</script>
<style>
.centered {
  justify-content: center;
}
.el-dropdown-menu__item:hover {
  background-color: #f3bb45 !important;
  color: white !important;
}
</style>
