<template>
  <card :title="title">
    <div class="row message-banner-panel" :class="type">
      <div class="col-1 icon-big text-center align-self-center">
        <i :class="msgIcon"></i>
      </div>
      <div class="align-self-center" :class="messageWidth">
        <slot></slot>
      </div>
      <div class="col-4 align-self-center">
        <slot name="action"></slot>
      </div>
    </div>
  </card>
</template>
<script>
import Card from "@/components/Cards/Card.vue";
export default {
  name: "CardNoData",
  components: {
    Card
  },
  props: {
    title: String,
    icon: {
      type: String
    },
    type: {
      type: String,
      default: "default",
      validator: function (value) {
        return ["default", "success", "warning", "error"].indexOf(value) !== -1;
      }
    }
  },
  computed: {
    messageWidth() {
      if (this.$slots.action) {
        return "col-7";
      }
      return "col-11";
    },
    msgIcon() {
      if (this.icon) {
        return this.icon;
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
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/datacue/_colors.scss";

.message-banner-panel.success {
  i {
    color: $green;
  }
}

.message-banner-panel.error,
.message-banner-panel.warning {
  i {
    color: $red;
  }
}

.message-banner-panel.default {
  i {
    color: $primary;
  }
}
</style>
