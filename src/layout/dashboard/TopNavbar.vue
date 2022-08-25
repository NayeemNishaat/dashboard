<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">{{
          $tc(routeName.toLowerCase(), 2)
        }}</a>
        <button
          class="navbar-toggler navbar-burger"
          type="button"
          @click="toggleSidebar"
          :aria-expanded="$sidebar.showSidebar"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-bar"></span>
          <span class="navbar-toggler-bar"></span>
          <span class="navbar-toggler-bar"></span>
        </button>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav ml-auto">
            <drop-down
              class="nav-item"
              title
              title-classes="nav-link"
              icon="ti-bell"
            >
              <a class="dropdown-item">{{ $t("no notifications") }}</a>
            </drop-down>
            <li class="nav-item">
              <a
                :href="guideLink"
                class="nav-link"
                target="_blank"
                data-id="navbar:help-btn"
              >
                <i class="ti-help"></i>
                <p>
                  {{ $t("help") }}
                </p>
              </a>
            </li>
            <li class="nav-item">
              <router-link
                to="/billing"
                class="nav-link"
                data-id="navbar:billing-btn"
              >
                <i class="ti-credit-card"></i>
                <p :class="{ badge: !hasActiveSubscription }">
                  {{ $t("billing") }}
                </p>
              </router-link>
            </li>
            <drop-down
              class="nav-item"
              :title="userName"
              title-classes="nav-link"
              icon="ti-user"
              data-id="navbar:menu-btn"
            >
              <a
                data-id="navbar:logout-btn"
                class="dropdown-item"
                @click="logout()"
                >{{ $t("logout") }}</a
              >
            </drop-down>
          </ul>
        </div>
      </div>
    </nav>
    <div class="row" v-if="testMode">
      <div class="col-12">
        <el-alert :title="$t('test mode on')" type="warning" effect="light">
        </el-alert>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["user"]),
    ...mapGetters("settings", ["testMode"]),
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
    userName() {
      return `${this.user?.first_name} ${this.user?.last_name}`;
    },
    guideLink() {
      let lang = "";
      if (this.$i18n.locale === "es") {
        lang = "es/";
      }

      return `https://help.datacue.co/${lang}guide/`;
    }
  },
  data() {
    return {
      activeNotifications: false
    };
  },
  methods: {
    ...mapActions(["switchWebsite", "logout"]),
    hasActiveSubscription() {
      return this.setupSummary.has_active_subscription;
    },
    async switchToNewWebsite() {
      await this.switchWebsite();
      this.$router.push({ name: "loading" });
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    }
  }
};
</script>
<style lang="scss" scoped>
.navbar .navbar-nav .nav-item .nav-link.router-link-exact-active.active,
.navbar .navbar-collapse .nav-item .nav-link.router-link-exact-active.active p {
  font-weight: bold;
  color: #5c5852 !important;
}
.navbar .navbar-nav .nav-item .nav-link.active,
.navbar .navbar-nav .nav-item .nav-link.active p {
  font-weight: bold;
  color: #000000 !important;
}
.nav-item {
  position: relative;
}
.badge:before {
  content: "";
  display: inline;
  position: absolute;
  top: 1.4rem;
  right: 0.5rem;
  font-size: 0.7em;
  background: red;
  color: white;
  width: 7px;
  height: 7px;
  text-align: center;
  border-radius: 50%;
  box-shadow: 0 0 1px #333;
}
.dropdown:deep {
  .dropdown-menu {
    left: auto;
    right: 0;
  }

  .dropdown-item {
    &.active {
      color: #ffffff !important;
      background-color: #66615b;
    }
  }
}
</style>
