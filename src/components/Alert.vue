<template>
  <div :class="alertClass" role="alert">
    <div class="icon"></div>
    <div>
      <slot>
        {{ message }}
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "error"
    }
  },
  computed: {
    alertClass() {
      return {
        "m-0": true,
        alert: true,
        "align-items-center": true,
        "alert-success": this.type === "success",
        "alert-warning": this.type === "warning",
        "alert-danger": this.type === "error"
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/sass/datacue/_colors.scss";
.alert {
  display: flex;
  border-radius: 0 15px 15px 0;
  border: none;
  color: #53555f;
  padding: 1.25rem 1rem;
  font-size: 1rem;
  width: 100%;

  .icon {
    min-width: 30px;
    width: 30px;
    height: 30px;
    margin-right: 10px;
    background-size: 30px 30px;
  }

  &.alert-success {
    border-left: 2px solid $green;
    background-color: $green-light;

    .icon {
      background-image: url("https://cdn.datacue.co/assets/login/icon-successful.svg");
    }
  }

  &.alert-warning {
    border-left: 2px solid $orange;
    background-color: $orange-light;

    .icon {
      background-image: none;
      font-family: "themify";
      font-size: 2em;
      color: #de8f4e;
    }
    .icon::before {
      content: "\e6c5";
    }

    &.alert-danger {
      border-left: 2px solid $red;
      background-color: $red-light;
      .icon {
        background-image: url("https://cdn.datacue.co/assets/login/icon-not-successful.svg");
      }
    }
  }
}
</style>
