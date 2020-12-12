<template>
  <div>
    <template v-if="error">
      <error-msg />
    </template>
    <template v-else>
      <div class="row">
        <div class="col-12">
          <drag-drop-cards v-model="groupLists" />
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, Ref, ref } from "vue";
import { getApi } from "@/api";
import { productTypeGroup } from "@/api/interfaces";
import DragDropCards from "@/components/UI/DragDropCards.vue";
export default defineComponent({
  name: "Settings",
  components: {
    DragDropCards
  },
  async setup() {
    const error = ref(null);
    let groups: Ref<Array<productTypeGroup> | null> = ref([]);
    let groupLists = reactive({} as { [key: string]: Array<string> });

    try {
      const api = getApi();
      groups.value = await api.getGroupToProductTypeSettings();

      groups.value.forEach(element => {
        groupLists[element.group_id] = element.product_types;
      });
    } catch (err) {
      console.log("error occurred", err);
      error.value = err;
    }
    return {
      groupLists,
      error
    };
  }
});
</script>
<style scoped>
.table-col {
  padding-right: 1rem;
}
.lmargin {
  margin-left: 1rem;
}
</style>
