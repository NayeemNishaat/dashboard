<template>
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th scope="col" v-for="(col, idx) in columnNames" :key="idx">
          {{ col }}
        </th>
        <th scope="col" v-if="linkcol != ''">#</th>
        <th scope="col" v-if="actionButton != {}">#</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, idx) in data"
        :key="idx"
        :class="{ 'table-primary': selected === idx }"
        @click="handleClick(idx)"
      >
        <component
          v-for="(col, idx) in columns"
          :key="idx"
          :scope="idx === 0 ? 'row' : ''"
          :is="idx === 0 ? 'th' : 'td'"
          >{{ row[col] }}</component
        >
        <td v-if="linkcol !== ''">
          <router-link :to="row[linkcol]">
            <dc-button type="circle" :small="true"
              ><i class="ti-angle-right"/></dc-button
          ></router-link>
        </td>
        <td v-if="actionButton && actionButton.type">
          <dc-button
            :type="actionButton.type"
            :small="actionButton.type === 'circle'"
            ><i :class="actionButton.icon" />{{ actionButton.label }}</dc-button
          >
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
import { computed, defineComponent, Ref, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  props: {
    modelValue: {
      type: Number,
      default: () => null
    },
    friendlyColNames: {
      type: Array,
      default: () => []
    },
    colnames: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    linkcol: {
      type: String,
      default: ""
    },
    rowclicklink: {
      type: Boolean,
      default: true
    },
    actionButton: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const router = useRouter();
    const columnNames = computed(() => {
      if (props.friendlyColNames.length > 0) {
        return props.friendlyColNames;
      }
      if (props.colnames.length > 0) {
        return props.colnames;
      }
      if (props.data.length > 0) {
        return Object.keys(props.data[0] as any);
      }
      return [];
    });
    const columns = computed(() => {
      if (!props.data || props.data.length === 0) {
        return [];
      }
      return Object.keys(props.data[0] as any).filter(
        elem => elem !== props.linkcol
      );
    });
    const selected: Ref<number | null> = ref(null);
    const handleClick = (idx: number) => {
      selected.value = idx;
      emit("update:modelValue", idx);
      if (props.linkcol && props.rowclicklink) {
        router.push((props.data[idx] as any)[props.linkcol]);
      }
    };
    return { columns, columnNames, handleClick, selected };
  }
});
</script>
<style scoped>
.table {
  cursor: pointer;
}
</style>
