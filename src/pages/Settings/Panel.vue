<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane
      v-for="panel in allPanels"
      :key="panel"
      :name="panel"
      :label="panel"
    >
      <span slot="label">
        {{ $tc(panel, 2) }}
      </span>
    </el-tab-pane>
    <router-view></router-view>
  </el-tabs>
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
    handleClick(tab, _e) {
      this.$router.push({ name: `${tab.props.name} settings` });
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
<style>
.el-tabs .el-tabs__item.is-active {
  color: #f3bb45;
}
.el-tabs .el-tabs__item {
  text-transform: capitalize;
}
.el-tabs .el-tabs__item:hover {
  color: #f3bb45;
}
.el-tabs .el-tabs__active-bar {
  background-color: #f3bb45;
}
</style>
