<template>
  <div class="card pricing">
    <div class="card-image" v-if="$slots.image">
      <slot name="image"></slot>
    </div>
    <div class="card-header" v-if="$slots.header || title">
      <slot name="header">
        <h4 class="card-title-grey">
          {{ title }}
          <el-tag v-if="selected" size="small" type="warning" effect="plain">
            {{ $t("current") }}
          </el-tag>
        </h4>
        <p class="card-category" v-if="subTitle">{{ subTitle }}</p>
      </slot>
    </div>
    <div class="card-body" v-if="$slots.default">
      <slot></slot>
    </div>
    <slot name="raw-content"></slot>
    <div class="card-footer" v-if="$slots.footer">
      <!-- <hr /> -->
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "PricingCard",
  props: {
    title: String,
    selected: Boolean,
    subTitle: String
  }
};
</script>
<style scoped>
.card-footer div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title-grey {
  text-align: center;
  margin: 0px;
  padding: 0px;
  color: #80848e;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: "Open Sans", sans-serif;
}
</style>
