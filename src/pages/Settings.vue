<template>
  <div>
    <template v-if="error">
      <error-msg />
    </template>
    <template v-else>
      <div class="row">
        <div class="col-12">
          <pending-settings
            :has-unsaved-changes="hasUnsavedChanges"
            :saving="saving"
            @publish="save"
            @restore="restore"
          />
          <drag-drop-cards v-model="current" />
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, Ref, ref, computed } from "vue";
import { getApi } from "@/api";
import { datacueApi, productTypeGroup } from "@/api/interfaces";
import DragDropCards from "@/components/UI/DragDropCards.vue";
import PendingSettings from "@/components/UI/PendingSettings.vue";
import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";

function isMapEqual(
  map1: Map<string, Array<string>>,
  map2: Map<string, Array<string>>
) {
  var testVal;
  if (map1.size !== map2.size) {
    return false;
  }
  for (let [key, val] of map1) {
    if (!map2.has(key)) {
      return false;
    }
    testVal = map2.get(key);
    if (!isEqual(testVal, val)) {
      return false;
    }
  }
  return true;
}

export default defineComponent({
  name: "Settings",
  components: {
    DragDropCards,
    PendingSettings
  },
  async setup() {
    const error = ref(null);
    const saving = ref(false);
    let dbSettings: Ref<Array<productTypeGroup> | null> = ref([]);
    let lastSaved = ref(new Map<string, Array<string>>());
    let current = ref(new Map<string, Array<string>>());
    const hasUnsavedChanges = computed(() => {
      if (!current.value) {
        return false;
      }
      //check equality
      return !isMapEqual(current.value, lastSaved.value);
    });
    let api: datacueApi | undefined = undefined;
    try {
      api = getApi();
    } catch (err) {
      console.log("error occurred", err);
      error.value = err;
    }
    const refresh = async () => {
      try {
        if (!api) {
          console.error("no api found");
          return;
        }

        dbSettings.value = await api.getGroupToProductTypeSettings();

        dbSettings.value.forEach(element => {
          const values = [...element.product_types].sort();
          current.value.set(element.group_id, [...values]);
          lastSaved.value.set(element.group_id, [...values]);
        });
      } catch (err) {
        console.error("error occurred", err);
        error.value = err;
      }
    };
    const restore = () => {
      current.value = cloneDeep(lastSaved.value);
    };
    const save = async () => {
      //convert map to array of product type groups
      saving.value = true;
      let groups: Array<productTypeGroup> = [];
      current.value.forEach((val, key) => {
        groups.push({ product_types: val, group_id: key });
      });
      try {
        if (!api) {
          console.error("no api found");
          return;
        }
        await api.saveGroupToProductTypeSettings(groups);
        await refresh();
      } catch (err) {
        console.error("error occurred", err);
        error.value = err;
      } finally {
        saving.value = false;
      }
    };
    await refresh();
    return {
      hasUnsavedChanges,
      current,
      error,
      saving,
      save,
      restore
    };
  }
});
</script>
