<template>
  <div class="message-banner-panel" :class="type">
    <i :class="msgIcon" v-if="msgIcon" />
    <p class="message-panel-contents">
      <slot>
        {{ message }}
      </slot>
    </p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MessageBanner",
  computed: {
    msgIcon() {
      if (this.icon) {
        return (this as any).icon;
      }
      switch (this.type) {
        case "default":
          return "ti-announcement";
        case "success":
          return "ti-check";
        case "warning":
          return "ti-alert";
        case "error":
          return "ti-alert";
        default:
          return "";
      }
    }
  },
  props: {
    cardMode: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String
    },
    type: {
      type: String,
      default: "default",
      validator: function(value: string) {
        return ["default", "success", "warning", "error"].indexOf(value) !== -1;
      }
    },
    message: {
      type: String
    }
  }
});
</script>
<style lang="scss" scoped>
@import "../assets/sass/datacue/_colors.scss";

.message-banner-panel.success {
  > i {
    color: $green;
  }
}

.message-banner-panel.error,
.message-banner-panel.warning {
  > i {
    color: $red;
  }
}

.message-banner-panel.default {
  > i {
    color: $primary;
  }
}

.message-banner-panel {
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  margin-top: 1em;
  color: $gray-dark;

  > i {
    font-size: 20px;
  }

  .message-panel-contents {
    margin: 0 0 0 1em;
    font-size: 14px;
    > a {
      font-weight: bold;
      text-decoration: underline;
    }
  }
}
</style>
