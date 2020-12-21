<template>
  <transition name="fade">
    <div class="status-bar" v-if="hasUnsavedChanges">
      <card>
        <div class="row">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <p class="message" v-if="hasUnsavedChanges">
                <i class="ti-flag-alt-2" />
                You have unpublished changes
              </p>
              <p class="message" v-else>
                Published
              </p>
              <div class="d-flex align-items-center justify-content-end">
                <button
                  class="dc-button outline"
                  :disabled="!hasUnsavedChanges"
                  @click="restore"
                >
                  <loading v-if="saving" /><span v-else>undo changes</span>
                </button>
                <button
                  class="dc-button primary"
                  :disabled="!hasUnsavedChanges"
                  @click="publish"
                >
                  <loading v-if="saving" /><span v-else>publish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </card>
    </div>
  </transition>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PendingSettings",
  emits: ["publish", "restore"],
  props: {
    hasUnsavedChanges: {
      type: Boolean,
      default: false
    },
    saving: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const publish = () => {
      emit("publish");
    };
    const restore = () => {
      emit("restore");
    };
    return { publish, restore };
  }
});
</script>
<style scoped>
.status-bar {
  position: sticky;
  top: 10px;
  z-index: 1000;
  background-color: #f4f3ef;
  box-shadow: 0 0 0 10px #f4f3ef, 0 10px 5px 5px #f4f3ef;
}

.status-bar >>> .card-body {
  display: flex;
  align-items: center;
}
.status-bar .row {
  width: 100%;
}
.status-bar p {
  padding: 0px;
  margin: 0px;
}
p.message {
  font-size: 1rem;
}
.status-bar >>> .card-body >>> p {
  display: flex;
  align-items: center;
}
</style>
