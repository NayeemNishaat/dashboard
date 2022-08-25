<template>
  <div class="wrapper">
    <side-bar>
      <slot name="links">
        <sidebar-link
          v-if="!hasFinishedSetup"
          class="setup"
          to="/setup"
          :translatedName="$t('finish setup process')"
        >
          <p class="sidebar-setup-summary">
            {{ $t("finish setup process") }}: {{ finishedSteps
            }}<span>/{{ numberOfSteps }}</span>
            <i class="ti-check"></i>
          </p>
          <div class="d-flex justify-content-between">
            <div :class="getStepClass(i)" v-for="i in numberOfSteps" :key="i">
              &nbsp;
            </div>
          </div>
        </sidebar-link>
        <sidebar-link to="/summary" name="summary" icon="ti-home" />
        <sidebar-link to="/banners" name="banners" icon="ti-image" />
        <sidebar-link to="/products" name="products" icon="ti-package" />
        <sidebar-link to="/notifications" name="notifications" icon="ti-bell" />
        <sidebar-link to="/settings" name="settings" icon="ti-settings" />
      </slot>

      <mobile-menu>
        <li class="nav-item">
          <a
            href="https://help.datacue.co/guide"
            class="nav-link"
            target="”_blank”"
            data-id="navbar:mobile-help-btn"
          >
            {{ $t("help") }}
          </a>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/billing">{{
            $t("billing")
          }}</router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click="logout()">{{ $t("logout") }}</a>
        </li>
        <drop-down
          class="nav-item"
          :title="$t('notifications')"
          title-classes="nav-link"
          icon="ti-bell"
        >
          <a class="dropdown-item">{{ $t("no notifications") }}</a>
        </drop-down>
        <li class="divider"></li>
      </mobile-menu>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>
      <dashboard-content @click="toggleSidebar"></dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<script>
import * as Sentry from "@sentry/browser";
import { mapActions, mapGetters } from "vuex";

import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu.vue";
export default {
  name: "DashboardLayout",
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu
  },
  computed: {
    ...mapGetters(["client"]),
    ...mapGetters("onboarding", [
      "setupSummary",
      "numberOfSteps",
      "finishedSteps",
      "hasFinishedSetup"
    ])
  },
  methods: {
    ...mapActions(["switchWebsite", "logout"]),
    async switchWebsite() {
      try {
        await this.switchWebsite();
        this.$router.push({ name: "loading" });
      } catch (err) {
        Sentry.captureException(err);
      }
    },
    getStepClass(idx) {
      return {
        step: true,
        done: idx <= this.finishedSteps
      };
    },
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    async logout() {
      this.$Tawk.$endChat();
      await this.logout();
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper:deep {
  .setup {
    .nav-link {
      margin-top: 0 !important;
      padding-bottom: 0;
    }

    p.sidebar-setup-summary {
      line-height: 20px;
      white-space: nowrap;
      color: #f3bb45;

      span {
        color: #ffffff;
        margin-right: 10px;
      }

      i {
        float: none !important;
        font-size: 12px !important;
        line-height: 20px !important;
      }
    }
  }

  .d-flex {
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    padding: 5px 5px 10px 5px;
    margin: 0 -5px;
  }

  .step {
    width: 20px;
    height: 20px;
    background: #273644;
    border-radius: 5px;

    &.done {
      background: #f3bb45;
    }
  }
}
</style>
