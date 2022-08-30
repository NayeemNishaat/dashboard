<template>
  <li class="dc-step" :class="{ done, active }">
    {{ title }}
  </li>
</template>

<script>
export default {
  name: "DcStep",
  props: {
    done: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/datacue/_colors.scss";

.dc-step {
  position: relative;
  flex: 1 1 0;
  min-width: 6em;
  padding: 0 1em;
  list-style-type: none;
  text-align: center;
  text-transform: uppercase;
  color: $gray-light;

  @media (min-width: 768px) {
    min-width: 10em;
  }

  & + &::before {
    content: "";
    position: absolute;
    bottom: -1em;
    left: -50%;
    width: 100%;
    border-bottom: solid 1px;
    z-index: -1;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -1.4em;
    left: calc(50% - 0.4em);
    width: 0.8em;
    height: 0.8em;
    border: 1px solid;
    border-radius: 50%;
    background: white;
  }

  &.done,
  &.active {
    font-weight: 600;
    color: $gray-dark;

    &::before {
      margin-bottom: -1px;
      border-bottom-width: 3px;
    }

    &::after {
      border-width: 3px;
    }
  }

  &.done:not(.active)::after {
    background: currentcolor;
  }
}
</style>
