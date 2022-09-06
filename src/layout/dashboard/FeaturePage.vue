<template>
  <div>
    <div class="row">
      <div class="col-6 align-self-center">
        <el-breadcrumb separator=">" v-if="subPageName !== 'view' && subPageName !== 'upgrade'">
          <el-breadcrumb-item :to="{ path: `/${mainPageName}` }">{{
              $t(mainPageName, 2)
          }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t($route.name) }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="col-6 text-right banner-btns align-self-center">
        <router-link v-if="!['upgrade', 'view'].includes(subPageName)" :to="`/${mainPageName}/view`">
          <el-button>
            <i class="ti-arrow-left"></i>
            &nbsp;&nbsp;{{ $t("back") }}
          </el-button>
        </router-link>
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>
<script>
export default {
  components: {},
  computed: {
    mainPageName() {
      if (!this.$route.fullPath) {
        return "";
      }
      if (this.$route.fullPath.split("/").length < 3) {
        return "";
      }
      return this.$route.fullPath.split("/")[1];
    },
    subPageName() {
      if (!this.$route.fullPath) {
        return "";
      }
      if (this.$route.fullPath.split("/").length < 3) {
        return "";
      }
      return this.$route.fullPath.split("/")[2];
    }
  },
  methods: {}
};
</script>
<style>
.banner-btns {
  text-align: right;
}
</style>
