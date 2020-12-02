<template>
  <div>
    <template v-if="error">
      <error-msg />
    </template>
    <template v-else>
      <div class="row">
        <div class="col-12">
          <card
            title="Product Grouping Settings"
            sub-title="Each product type is assigned a 'group' to improve audience analysis"
          >
            <dc-table
              :colnames="['group_id', 'product_type']"
              :friendly-col-names="['Group', 'Product Types']"
              :data="groupsTable"
            />
          </card>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import DcTable from "@/components/UI/DcTable.vue";
import { defineComponent, reactive, Ref, ref } from "vue";
import { getApi } from "@/api";
import { productTypeGroup } from "@/api/interfaces";

export default defineComponent({
  name: "Settings",
  components: {
    DcTable
  },
  async setup() {
    const error = ref(null);
    let groups: Ref<Array<productTypeGroup> | null> = ref([]);
    let groupsTable = reactive({});
    try {
      const api = getApi();
      groups.value = await api.getGroupToProductTypeSettings();
      groupsTable = reactive(
        groups.value.map(row => {
          return {
            group_id: row.group_id.replace("equipments", "equipment"),
            product_type: row.product_types.join(", ")
          };
        })
      );
    } catch (err) {
      console.log("error occurred", err);
      error.value = err;
      return {
        groupsTable,
        error
      };
    }
    return {
      groupsTable,
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
