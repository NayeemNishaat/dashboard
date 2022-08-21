<template>
  <div>
    <div v-if="type === 'static'">
      {{ $t("static banners don't change") }}
      <ul>
        <li>{{ $t("static banner size") }}</li>
        <li>
          {{ $t("shown to all visitors") }}
        </li>
        <li>
          {{ $t("clicks don't count") }}
        </li>
      </ul>
    </div>
    <div v-else>
      <div>
        <div v-html="$t('dynamic banners ' + type)"></div>
        <ul>
          <li v-if="main_banners">
            {{ $t("wide banner desc") }}
          </li>
          <li>
            {{ $t("narrow banner desc") }}
          </li>
          <li>
            {{ $t("more banners") }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: "static"
    }
  },
  computed: {
    main_banners() {
      switch (this.type) {
        case "low":
          return 0;
        case "medium":
          return 1;
        case "high":
          return 2;
      }
      return 0;
    }
  }
};
</script>
