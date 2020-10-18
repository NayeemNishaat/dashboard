<template>
  <div>
    <template v-if="error || !segments">
      <error-msg />
    </template>
    <template v-else>
      <div class="row">
        <div class="col-12">
          <card>
            <DataView :value="segments.segments" layout="list">
              <template #list="slotProps">
                <div>
                  <b>{{ slotProps.data.name }}</b>
                  <b>{{ slotProps.data.aov }}</b>
                  <b>{{ slotProps.data.size }}</b>
                  <b>{{ slotProps.data.lifecycle }}</b>
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
<style></style>
