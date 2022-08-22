<template>
  <div class="row tip">
    <div class="col-1 icon">
      <img alt="" src="@/assets/img/lightbulb.svg" />
    </div>
    <div class="col message">
      <span class="title">{{ formattedTitle }}</span>
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    message: {
      type: String,
    },
  },
  computed: {
    formattedTitle() {
      return this.title ? this.title : this.$t("tip!");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/datacue/_colors.scss";

.tip {
  .icon {
    width: 50px;
    min-width: 50px;
    border-right: 2px solid $primary;

    img {
      height: 40px;
    }
  }

  .title {
    color: $primary;
    font-weight: bold;
    text-transform: uppercase;
  }

  .message {
    padding-left: 5px;
    color: $gray;
  }
}
</style>
