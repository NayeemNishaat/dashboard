<template>
  <card :title="$t('no data')">
    <div class="row">
      <div class="col-2 icon-danger icon-big text-center align-self-center">
        <i class="ti-alert"></i>
      </div>
      <div class="col-10 align-self-center">
        <p>{{ $t("no data for this period") }}</p>
      </div>
    </div>
  </card>
</template>
<script>
import Card from "/src/components/Cards/Card.vue";
export default {
  name: "UnavailableSettings",
  components: {
    Card,
  },
  props: {
    title: String,
    subTitle: String,
  },
};
</script>
<style>
</style>
