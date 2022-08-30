<template>
  <div class="upgrade-page">
    <card :title="
        noPlanSelected
        ? $t('select a plan to activate {feature}', {
              feature: $tc(feature, 2).toLowerCase()
          })
          : $t('upgrade your plan to activate {feature}', {
            feature: $tc(feature, 2).toLowerCase()
            })
    ">
      <div class="row">
        <div class="col-12 align-self-center">
          <p>{{ $t(`upgradeText:${feature}`) }}</p>
          <img v-if="feature == 'notifications'" class="feature-img" src="@/assets/img/features/notifications.jpg" />
          <img v-if="f
          ature == 'banners'" class="feature-img" src="@/assets/img/features/banners.jpg" />
          <img v-if="feature == 'products'" class="feature-img" src="@/assets/img/features/products.jpg" />
          <router-link class="button-link" to="/billing">{{
          $t("setupSummary:NoPlanSelected:btn")
          }}</router-link>
        </div>
      </div>
    </card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "UpgradePlan",
  props: {
    feature: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(["subscription"]),
    noPlanSelected() {
      return !this.subscription?.name;
    }
  },
  methods: {
    getImgURL(type) {
      return require(`../../assets/img/features/${this.feature}.jpg`);
    }
  }
};
</script>

<style scoped>
.feature-img {
  max-width: 100%;
  max-height: 300px;
}

.upgrade-page {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  max-width: 60em;
  min-height: 20vh;
  text-align: center;
}

.upgrade-page> :first-child {
  font-size: 2em;
}

.button-link {
  display: block;
  max-width: 180px;
  margin: 30px auto;
  border: 0 none;
  border-radius: 25px;
  padding: 10px;
  line-height: 30px;
  font-size: 16px;
  color: white;
  background-color: #fdb809;
}
</style>
