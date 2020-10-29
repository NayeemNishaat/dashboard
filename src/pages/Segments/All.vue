<template>
  <div>
    <template v-if="error || !segments.segments">
      <error-msg />
    </template>
    <template v-else>
      <div class="row">
        <div class="col-12">
          <card title="Customer Segments">
            <div>
              <b class="table-col">Name</b>
              <b class="table-col">AOV</b>
              <b class="table-col">Size</b>
              <b class="table-col">Lifecycle</b>
            </div>
            <DataView :value="segments.segments" layout="list">
              <template #list="slotProps">
                <div>
                  <b class="table-col">{{ slotProps.data.name }}</b>
                  <span class="table-col">{{ slotProps.data.aov }}</span>
                  <span class="table-col">{{ slotProps.data.size }}</span>
                  <span class="table-col">{{ slotProps.data.lifecycle }}</span>
                  <router-link :to="`/segments/${slotProps.data.name}`"
                    >Open</router-link
                  >
                </div>
              </template>
            </DataView>
          </card>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import DataView from "primevue/dataview";
import { defineComponent, reactive, ref } from "vue";
import { getApi } from "@/api";
import { segments } from "@/api/interfaces";
export default defineComponent({
  name: "Segments",
  components: {
    DataView
  },
  async setup() {
    const error = ref(null);
    let segments: segments | undefined = undefined;
    try {
      const api = getApi();
      segments = await api.getSegments("blah-blah-blah");
    } catch (err) {
      console.log("error occurred", err);
      error.value = err;
      return {
        segments: null,
        error
      };
    }
    segments = reactive(segments);
    return {
      segments,
      error
    };
  }
});
</script>
<style scoped>
.table-col {
  padding-right: 1rem;
}
</style>
