<template>
  <div class="board">
    <draggable
      v-for="(title, idx) in groupNames"
      :key="idx"
      group="people"
      class="list-group"
      :list="data.get(title)"
      @change="handleChange"
      :itemKey="elem => elem"
      easing="cubic-bezier(1, 0, 0, 1)"
      :sort="false"
      @add="changeList"
    >
      <template #header>
        <div
          class="d-flex justify-content-between align-items-center group-title"
          :title="title"
        >
          <p>{{ title ? title : emptyListHeaderText }}</p>
          <div v-if="title" class="d-flex">
            <button
              @click="editGroupName(title)"
              class="dc-button circle small"
            >
              <i class="ti-pencil" />
            </button>
            <button
              class="dc-button circle small"
              @click="delGroup(title)"
              type="circle"
              :small="true"
            >
              <i class="ti-trash" />
            </button>
          </div>
        </div>
      </template>
      <template #item="{ element }">
        <div class="list-item">
          <span>{{ element ? element : emptyListItemText }}</span>
        </div>
      </template>
    </draggable>
    <div
      v-if="!groupLimitReached"
      class="list-group d-flex justify-content-center align-items-center"
    >
      <button class="dc-button circle" @click="addGroup">
        <i class="ti-plus" />
      </button>
    </div>
  </div>
  <Dialog v-model:visible="groupNameEditor.show">
    <template #header>
      <h3 v-if="groupNameEditor.edit_mode">
        Rename {{ groupNameEditor.old_val }}
      </h3>
      <h3 v-else>Add new group</h3>
    </template>

    <input
      type="text"
      class="form-control"
      id="group-name"
      v-model="groupNameEditor.new_val"
    />
    <span
      style="color:red"
      v-if="
        groupNameEditor.new_val !== groupNameEditor.old_val &&
          data.has(groupNameEditor.new_val)
      "
      >This name is already used</span
    >
    <template #footer>
      <div class="d-flex justify-content-center align-items-center">
        <button
          class="dc-button primary small"
          @click="saveGroupName"
          :disabled="
            data.has(groupNameEditor.new_val) ||
              groupNameEditor.new_val === '' ||
              groupNameEditor.new_val === groupNameEditor.old_val
          "
        >
          <i class="ti-check" />&nbsp;&nbsp;Save
        </button>
        <button class="dc-button outline small" @click="hideGroupNameEditor">
          <i class="ti-close" />&nbsp;&nbsp;Cancel
        </button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import draggable from "vuedraggable";
import Dialog from "primevue/dialog";

interface sortableEvt {
  item: HTMLDivElement; // dragged HTMLElement
  to: HTMLDivElement; // target list
  from: HTMLDivElement; // previous list
  oldIndex: number; // element's old index within old parent
  newIndex: number; // element's new index within new parent
  oldDraggableIndex: number; // element's old index within old parent, only counting draggable elements
  newDraggableIndex: number; // element's new index within new parent, only counting draggable elements
  clone: HTMLElement; // the clone element
  pullMode: string | boolean; // when item is in another sortable: `"clone"` if cloning, `true` if moving
}
export default defineComponent({
  props: {
    groupLimit: {
      type: Number,
      default: 8
    },
    modelValue: {
      type: Map,
      default: () => {
        return new Map<string, Array<string>>();
      }
    },
    emptyListHeaderText: {
      type: String,
      default: "<Unassigned>"
    },
    emptyListItemText: {
      type: String,
      default: "<empty>"
    }
  },
  components: {
    draggable,
    Dialog
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    let data = ref(new Map<string, Array<string>>());
    const groupLimitReached = computed(
      () => data.value.size - 1 >= props.groupLimit
    );
    data.value = new Map(props.modelValue as Map<string, Array<string>>);
    let groupNameEditor = reactive({
      old_val: "",
      new_val: "",
      edit_mode: true,
      show: false
    });
    const groupNames = computed(() => {
      return [...data.value.keys()].filter(key => {
        if (key !== "") {
          return true;
        }
        const ungrouped = data.value.get(key);
        if (!ungrouped || ungrouped.length === 0) {
          return false;
        }
        return true;
      });
    });
    const changeList = (evt: sortableEvt, x: unknown) => {
      if (evt.to.isEqualNode(evt.from)) {
        return;
      }
      const title =
        evt.to.childNodes &&
        evt.to.childNodes[0] &&
        (evt.to.childNodes[0] as HTMLDivElement).getAttribute("title");
      if (title === null || title === undefined) {
        return;
      }
      (data.value.get(title) || []).sort();
    };
    const addGroup = () => {
      groupNameEditor.old_val = "";
      groupNameEditor.new_val = "";
      groupNameEditor.edit_mode = false;
      groupNameEditor.show = true;
    };

    const editGroupName = (title: string) => {
      groupNameEditor.old_val = title;
      groupNameEditor.new_val = title;
      groupNameEditor.edit_mode = true;
      groupNameEditor.show = true;
    };
    const saveGroupName = () => {
      const { old_val, new_val } = groupNameEditor;
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
      groupNameEditor.show = false;
      emit("update:modelValue", data);
    };
    const resetGroupNames = () => {
      groupNameEditor.old_val = "";
      groupNameEditor.new_val = "";
    };
    const hideGroupNameEditor = () => {
      resetGroupNames();
      groupNameEditor.show = false;
    };
    const handleChange = () => {
      emit("update:modelValue", data);
    };
    const delGroup = (title: string) => {
      const valuesToDelete = data.value.get(title);
      if (valuesToDelete && valuesToDelete.length > 0) {
        //append items in deleted list to 'unassigned' list
        data.value.set("", [...(data.value.get("") || []), ...valuesToDelete]);
      }
      data.value.delete(title);
      emit("update:modelValue", data);
    };
    return {
      handleChange,
      editGroupName,
      addGroup,
      delGroup,
      data,
      hideGroupNameEditor,
      saveGroupName,
      groupNameEditor,
      groupNames,
      groupLimitReached,
      changeList
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
  min-width: 272px;
  margin: 0 4px;
  display: block;
  background-color: rgba(100, 100, 100, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  height: max-content;
  min-height: 300px;
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
  display: block;
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
