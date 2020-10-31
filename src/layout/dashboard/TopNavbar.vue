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
          <drop-down
            class="nav-item"
            :title="client && client.name"
            title-classes="nav-link"
            icon="nc-icon nc-shop"
            data-id="navbar:menu-btn"
          >
            <a
              v-if="multipleWebsites"
              data-id="navbar:switch-websites-btn"
              class="dropdown-item"
              @click="switchToNewWebsite()"
              >Switch website</a
            >
            <a
              data-id="navbar:logout-btn"
              class="dropdown-item"
              @click="logout()"
              >Logout</a
            >
          </drop-down>
          <!-- <li class="nav-item">
            <a class="nav-link" @click="logout()">
              <i class="nc-icon nc-single-02"></i>
              Logout
            </a>
          </li> -->
        </ul>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import { getAuth, authPlugin } from "@/auth";
import { getSidebar } from "@/components/SidebarPlugin/state";
import { computed, defineComponent, onMounted, Ref, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const sidebar = getSidebar();
    const store = useStore();
    const router = useRouter();
    let auth: Ref<authPlugin> | Ref<null> = ref(null);
    onMounted(async () => {
      auth.value = await getAuth();
    });
    const logout = async () => {
      if (auth.value) {
        await auth.value.logout();
      }
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

    const client = computed(() => store.getters.client);
    const multipleWebsites = computed(
      () => Object.keys(store.getters.clients || {}).length > 1
    );
    const switchToNewWebsite = async () => {
      store.dispatch("setApikey", "");
      await router.push({ name: "authorizing" });
    };
    return {
      client,
      multipleWebsites,
      switchToNewWebsite,
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
