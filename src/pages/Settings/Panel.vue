<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="panel in allPanels"
        :key="panel"
        :name="panel"
        :label="panel.toUpperCase()"
      >
        <span slot="label">
          {{ $tc(panel, 2) }}
        </span>
      </el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>
<script>
import * as Sentry from "@sentry/browser";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      activeName: "general",
      allPanels: [
        "general",
        "banners",
        "categories",
        "products",
        "notifications",
        "developer"
      ]
    };
  },
  computed: {
    ...mapGetters(["client"])
  },
  methods: {
    handleClick() {
      this.$router.push({ name: `${this.activeName} settings` });
    }
  },
  mounted() {
    try {
      this.activeName = this.$route.path.split("/")[2];
    } catch (err) {
      Sentry.captureException(err);
      this.activeName = "general";
    }
  }
};
</script>
