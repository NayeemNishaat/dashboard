<template>
  <transition name="fade">
    <div class="status-bar" v-if="hasUnsavedChanges">
      <card>
        <div class="row">
          <div class="col-12 d-flex justify-content-between align-items-center">
            <div class="d-flex justify-content-between align-items-center">
              <p class="message" v-if="hasUnsavedChanges">
                <i class="ti-flag-alt-2" />
                {{ $t("you have unpublished changes") }}
              </p>
              <p v-else>
                {{ $t("published") }}
              </p>
            </div>
            <div class="d-flex align-items-center justify-content-end">
              <dc-button
                type="primary"
                :disabled="!hasUnsavedChanges"
                :loading="saving"
                @click="$emit('save')"
                >{{ $t("publish") }}</dc-button
              >
            </div>
          </div>
        </div>
      </card>
    </div>
  </transition>
</template>
<script>
import DcButton from "@/components/DcButton.vue";

export default {
  name: "PendingSettings",
  components: {
    DcButton
  },
  props: {
    hasUnsavedChanges: {
      type: Boolean,
      default: false
    },
    saving: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style scoped>
.status-bar {
  position: sticky;
  top: 10px;
  z-index: 1000;
  background-color: #f4f3ef;
  box-shadow: 0 0 0 10px #f4f3ef, 0 10px 5px 5px #f4f3ef;
}

.status-bar .row {
  width: 100%;
  margin: 0;
  padding: 0;
}

.status-bar p {
  padding: 0px;
  margin: 0px;
}

p.message {
  font-size: 1rem;
}

.status-bar :deep(.card-body) {
  display: flex;
  align-items: center;
}

.status-bar :deep(.card-body :deep(p)) {
  display: flex;
  align-items: center;
}
</style>
