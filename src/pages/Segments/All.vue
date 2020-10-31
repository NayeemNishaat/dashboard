<template>
  <div>
    <template v-if="error || !segments">
      <error-msg />
    </template>
    <template v-else>
      <div class="row">
        <div class="col-12">
          <card title="Customer Segments">
            <dc-table
              :colnames="['Name', 'AOV', 'Size', 'Lifecycle']"
              :data="segments"
              linkcol="link"
            />
          </card>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import DcTable from "@/components/UI/DcTable.vue";
import { defineComponent, reactive, ref } from "vue";
import { getApi } from "@/api";
import { segments } from "@/api/interfaces";
interface segmentsTable extends segments {
  link: string;
}
export default defineComponent({
  name: "Segments",
  components: {
    DcTable
  },
  async setup() {
    const error = ref(null);
    let segments: Array<segmentsTable> | undefined = undefined;
    try {
      const api = getApi();
      segments = (await api.getSegments()) as Array<segmentsTable>;
      segments = segments.map(elem => {
        elem.link = `/segments/${elem.name}`;
        return elem;
      });
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
