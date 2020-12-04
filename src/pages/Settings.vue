<template>
  <div>
    <template v-if="error">
      <error-msg />
    </template>
    <template v-else>
      <!-- <div class="row">
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
      </div> -->
      <div class="row">
        <div
          class="col-3"
          v-for="(title, idx) in Object.keys(groupLists)"
          :key="idx"
        >
          <h3>{{ title }}</h3>
          <draggable
            class="list-group"
            :list="groupLists[title]"
            group="people"
            @change="log"
            itemKey="name"
          >
            <template #item="{ element }">
              <div class="list-group-item">{{ element }}</div>
            </template>
          </draggable>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
// import DcTable from "@/components/UI/DcTable.vue";
import { defineComponent, reactive, Ref, ref } from "vue";
import { getApi } from "@/api";
import { productTypeGroup } from "@/api/interfaces";
import draggable from "vuedraggable";
// import Card from "@/components/Cards/Card.vue";

export default defineComponent({
  name: "Settings",
  components: {
    draggable
  },
  async setup() {
    const error = ref(null);
    let groups: Ref<Array<productTypeGroup> | null> = ref([]);
    let groupLists = reactive({} as { [key: string]: Array<string> });
    let groupsTable = reactive({});
    const list1 = reactive([
      { name: "John", id: 1 },
      { name: "Joao", id: 2 },
      { name: "Jean", id: 3 },
      { name: "Gerard", id: 4 }
    ]);
    const list2 = reactive([
      { name: "Juan", id: 5 },
      { name: "Edgard", id: 6 },
      { name: "Johnson", id: 7 }
    ]);
    const log = (evt: Event) => {
      console.log(evt);
    };
    try {
      const api = getApi();
      groups.value = await api.getGroupToProductTypeSettings();
      groupsTable = reactive(
        groups.value.map(row => {
          return {
            group_id: row.group_id,
            product_type: row.product_types.join(", ")
          };
        })
      );
      groups.value.forEach(element => {
        groupLists[element.group_id] = element.product_types;
      });
    } catch (err) {
      console.log("error occurred", err);
      error.value = err;
    }
    return {
      groupsTable,
      groupLists,
      log,
      list1,
      list2,
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
