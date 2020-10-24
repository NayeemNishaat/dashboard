<template>
  <nav
    class="navbar navbar-expand-lg navbar-absolute fixed-top navbar-transparent"
  >
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div class="navbar-toggle">
          <button
            class="navbar-toggler"
            type="button"
            @click="toggleSidebar"
            :aria-expanded="sidebar.state.showSidebar"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-bar bar1"></span>
            <span class="navbar-toggler-bar bar2"></span>
            <span class="navbar-toggler-bar bar3"></span>
          </button>
        </div>
        <a class="navbar-brand" href="#">{{ routeName }}</a>
      </div>
      <!-- <button
        class="navbar-toggler collapsed"
        type="button"
        @click="toggleSidebar"
        data-toggle="collapse"
        data-target="#navigation"
        aria-controls="navigation-index"
        :aria-expanded="sidebar.state.showSidebar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
      </button> -->

      <div class="navbar-collapse justify-content-end collapse" id="navigation">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a class="nav-link" @click="logout()">
              <i class="nc-icon nc-single-02"></i>
              <p v-if="auth && auth.state && auth.state.isAuthenticated">
                Logout
              </p>
              <p v-else>
                Login
              </p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import { getAuth, authPlugin } from "@/auth";
import { getSidebar } from "@/components/SidebarPlugin/state";
import { computed, defineComponent, onMounted, Ref, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const sidebar = getSidebar();
    let auth: Ref<authPlugin> | Ref<null> = ref(null);
    onMounted(async () => {
      auth.value = await getAuth();
    });
    const logout = () => {
      console.log("hello");
    };
    const toggleSidebar = () => {
      sidebar.displaySidebar(!sidebar.state.showSidebar);
    };
    const hideSidebar = () => {
      sidebar.displaySidebar(false);
    };
    const routeName = computed(() => {
      const route = useRoute();
      const { name } = route;
      let newName = (name as string) || "";
      if (newName === "") {
        return "";
      }
      newName = newName.charAt(0).toUpperCase() + newName.slice(1);
      return newName;
    });
    return {
      routeName,
      sidebar,
      logout,
      toggleSidebar,
      hideSidebar,
      auth
    };
  }
});
</script>
<style></style>
