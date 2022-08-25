<template>
  <div class="row">
    <div class="col-12 stars">
      <img alt src="@/assets/img/sign-up/stars-icon.svg" />
    </div>
    <div class="col-12">
      <p class="info">{{ $t("receivedAllTheData") }}</p>

      <p class="info">{{ $t("headToDashboard") }}</p>
    </div>
    <div class="col-12 action">
      <el-button
        @click="goToSummary"
        type="warning"
        class="btn-yellow btn-large rounded"
        >{{ $t("get started") }}</el-button
      >
      <img
        class="d-sm-none"
        alt
        src="@/assets/img/sign-up/arrows-layout-1.svg"
      />
      <img
        class="d-none d-sm-block d-md-none"
        alt
        src="@/assets/img/sign-up/arrows-layout-2.svg"
      />
      <img
        class="d-none d-md-block"
        alt
        src="@/assets/img/sign-up/arrows-layout-3-4-5.svg"
      />
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goToSummary() {
      this.$router.push({ name: "setup-summary", params: this.$route.params });
    },
  },
};
</script>

<style lang="scss" scoped>
.stars {
  margin-top: 10px;
  margin-bottom: 40px;

  img {
    min-width: 150px;
    max-width: 180px;
    width: 30vw;
  }
}

.info {
  margin-bottom: 30px;
}

.action {
  position: relative;

  button {
    z-index: 888;
  }

  @media (max-height: 568px) {
    min-height: 150px;
  }

  img {
    position: absolute;
    height: 120px;
    right: 15px;
    top: -5px;
    z-index: -1;
  }
}

// layout 2
@media (min-width: 576px) {
  .stars {
    img {
      min-width: 180px;
    }
  }

  .action {
    padding-top: 40px;

    img {
      height: 170px;
      right: 15px;
      top: -38px;
    }
  }
}

@media (min-width: 768px) {
  .action {
    padding-top: 98px;
    img {
      height: 290px;
      left: 15px;
      top: 0px;
    }
  }
}
</style>
