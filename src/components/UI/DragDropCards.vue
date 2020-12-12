<template>
  <div class="board">
    <draggable
      v-for="(title, idx) in data.keys()"
      :key="idx"
      class="list-group"
      :list="data.get(title)"
      @change="handleChange"
      itemKey="name"
    >
      <template #header>
        <div
          class="d-flex justify-content-between align-items-center group-title"
        >
          <p>{{ title }}</p>
          <dc-button @click="editTitle(title)" type="circle" :small="true"
            ><i class="ti-pencil"
          /></dc-button>
        </div>
      </template>
      <template #item="{ element }">
        <div class="list-item">
          <span>{{ element }}</span>
        </div>
      </template>
    </draggable>
  </div>
  <Dialog v-model:visible="showGroupNameEditor">
    <template #header>
      <h3>Rename {{ groupName.old_val }}</h3>
    </template>

    <input
      type="text"
      class="form-control"
      id="group-name"
      v-model="groupName.new_val"
    />

    <template #footer>
      <div class="d-flex justify-content-center align-items-center">
        <dc-button type="primary" :small="true" @click="saveGroupName"
          ><i class="ti-check" />&nbsp;&nbsp;Save</dc-button
        >
        <dc-button type="outline" :small="true" @click="hideGroupNameEditor"
          ><i class="ti-close" />&nbsp;&nbsp;Cancel</dc-button
        >
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import draggable from "vuedraggable";
import Dialog from "primevue/dialog";

export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {
    draggable,
    Dialog
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    let data = ref(new Map());
    Object.keys(props.modelValue).forEach(key => {
      data.value.set(key, props.modelValue[key]);
    });
    let showGroupNameEditor = ref(false);
    let groupName = reactive({ old_val: "", new_val: "" });
    const editTitle = (title: string) => {
      groupName.old_val = title;
      groupName.new_val = title;
      showGroupNameEditor.value = true;
    };
    const saveGroupName = () => {
      const { old_val, new_val } = groupName;
      if (old_val === "" || new_val === "") {
        return;
      }
      let newData = new Map();
      data.value.forEach((val, key) => {
        let newkey = key;
        if (key === old_val) {
          newkey = new_val;
        }
        newData.set(newkey, val);
      });
      data.value = newData;
      resetGroupNames();
      showGroupNameEditor.value = false;
    };
    const resetGroupNames = () => {
      groupName.old_val = "";
      groupName.new_val = "";
    };
    const hideGroupNameEditor = () => {
      resetGroupNames();
      showGroupNameEditor.value = false;
    };
    const handleChange = () => {
      emit("update:modelValue", data);
    };
    return {
      handleChange,
      editTitle,
      data,
      showGroupNameEditor,
      hideGroupNameEditor,
      saveGroupName,
      groupName
    };
  }
});
</script>

<style scoped>
.board {
  height: calc(100vh - 195px);
  white-space: nowrap;
  position: relative;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: row;
}

.list-group {
  width: 272px;
  flex: 0 0 auto;
  margin: 0 4px;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
}

.list-item {
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  cursor: pointer;
  margin-bottom: 8px;
  max-width: 300px;
  min-height: 20px;
  background-color: white;
  padding: 10px 5px;
}

.group-title {
  margin-bottom: 0.5rem;
}
.group-title > p {
  font-weight: bold;
  font-size: 0.8rem;
  margin-bottom: 0;
}
::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 7px;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
}
</style>
