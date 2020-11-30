<template>
  <div>
    <error-msg v-if="error" />
    <LoginLoading v-else-if="loading" msg="Launching DataCue..." />
    <div v-else class="centre-on-page">
      <div class="logo-img">
        <img src="@/assets/img/datacue-logo-dark.svg" style="width:10rem" />
      </div>
      <div class="centered-box">
        <div class="col-12 dialog">
          <h3>Select a store</h3>
          <dc-table
            :colnames="clientsTable.colnames"
            :data="clientsTable.data"
            v-model="clientsTable.selectedClient"
          />
          <dc-button
            type="primary"
            :disabled="selectedApikey === ''"
            @click="selectClient"
            >Select</dc-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import LoginLoading from "./LoginLoading.vue";
import DcTable from "@/components/UI/DcTable.vue";
import { computed, defineComponent, onMounted, reactive, ref, Ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Loading",
  setup() {
    const store = useStore();
    const router = useRouter();
    const loading = ref(true);
    const error: Ref<Error | null> = ref(null);
    const clientsTable = reactive({
      columns: ["domain", "name"],
      data: [] as Array<{ apikey: string; name: string; domain: string }>,
      loading: true,
      selectedClient: null as number | null
    });
    const selectedApikey = computed(() => {
      if (
        clientsTable.data.length === 0 ||
        clientsTable.selectedClient === null
      ) {
        return "";
      }
      return clientsTable.data[clientsTable.selectedClient].apikey;
    });
    const selectClient = () => {
      if (selectedApikey.value === "") {
        return;
      }
      store.dispatch("setApikey", selectedApikey.value);
      //is an apikey set and a client selected?
      if (store.getters.isAuthenticated) {
        //proceed
        const nextPage = store.getters.nextPage || "overview";
        router.push(nextPage);
      }
    };
    onMounted(async () => {
      try {
        //have we got clients loaded from the backend?
        if (!store.getters.hasActiveClients) {
          await store.dispatch("fetchClients");
        }
        //is an apikey set and a client selected?
        if (store.getters.isAuthenticated) {
          //proceed
          const nextPage = store.getters.nextPage || "overview";
          await router.push(nextPage);
          return;
        }
        const clients = store.getters.clients;
        clientsTable.data = Object.keys(clients).map(elem => {
          return {
            name: clients[elem]["name"],
            apikey: clients[elem]["apikey"],
            domain: clients[elem]["domain"]
          };
        });
        loading.value = false;
      } catch (e) {
        error.value = e;
      }
    });
    return {
      error,
      loading,
      clientsTable,
      selectClient,
      selectedApikey
    };
  },
  components: {
    LoginLoading,
    DcTable
  }
});
</script>
<style lang="scss" scoped>
@import "../assets/sass/datacue/_colors.scss";

.dialog {
  max-width: 720px;
  padding: 1rem;
  border: 1px solid $gray-light;
}
</style>
