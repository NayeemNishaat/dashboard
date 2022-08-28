<template>
  <div>
    <date-range-picker @datechange="refreshData"></date-range-picker>
    <div class="row">
      <div class="col-lg-4 col-sm-6" v-for="stats in statsCards" :key="stats.title">
        <stats-card :loading="loading" :title="stats.title" :value="stats.value.toString()"
          :comparison="stats.comparison" :icon="stats.icon">
          <div class="stats" slot="footer">
            <i class="ti-info"></i> {{ $t(stats.footer) }}
          </div>
        </stats-card>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <el-tabs v-model="notificationsFilter">
          <el-tab-pane :label="$t('on discount')" name="on discount"></el-tab-pane>
          <el-tab-pane :label="$t('in stock')" name="in stock"></el-tab-pane>
          <el-tab-pane :label="$t('low stock')" name="low stock"></el-tab-pane>
        </el-tabs>
        <card-grid :loading="loading" :cards="selNotifications" card-type="notifications">
        </card-grid>
      </div>
    </div>
  </div>
</template>
<script>
import * as Sentry from "@sentry/browser";
import CardGrid from "@/components/Cards/CardGrid.vue";
import DateRangePicker from "@/components/DateRangePicker.vue";
import StatsCard from "@/components/Cards/StatsCard.vue";
import { mapGetters } from "vuex";
import { getPageData } from "@/api/backend";
export default {
  components: {
    CardGrid,
    DateRangePicker,
    StatsCard,
  },
  data() {
    return {
      notificationsPerf: [],
      notificationsFilter: "on discount",
      statsCards: [
        {
          type: "info",
          icon: "ti-bell",
          title: "notifications",
          value: "0",
          comparison: "n/a",
          footer: "notifications generated",
        },
        {
          type: "info",
          icon: "ti-user",
          title: "users",
          value: "0",
          comparison: "n/a",
          footer: "users with notifications",
        },
        {
          type: "info",
          icon: "ti-package",
          title: "products",
          value: "0",
          comparison: "n/a",
          footer: "products with notifications",
        },
      ],
      loading: true,
      error: false,
    };
  },
  computed: {
    ...mapGetters(["dateRange"]),
    allNotifications() {
      let allNotifications = {};
      this.notificationsPerf.forEach((e) => {
        allNotifications[e.reason] = e.notifications;
      });
      return allNotifications;
    },
    selNotifications() {
      if (!this.allNotifications || this.allNotifications === {}) {
        return [];
      }
      return this.allNotifications[this.notificationsFilter];
    },
  },
  methods: {
    async refreshData() {
      const dates = this.dateRange;
      if (!dates || dates.length !== 2) {
        return;
      }
      this.loading = true;
      try {
        let response = await getPageData(
          `notifications?startdate=${dates[0]}&enddate=${dates[1]}`
        );

        if (response.performance) {
          this.notificationsPerf = response.performance || [];
        }
        if (response.cards) {
          //calculate card data from response
          let dbCards = response.cards || {};
          let newCards = [];
          this.statsCards.forEach((e) => {
            e.value = dbCards[e.title].toString();
            newCards.push(e);
          });
          this.statsCards = newCards;
        }
      } catch (err) {
        this.error = true;
        Sentry.captureException(err);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.refreshData();
  },
};
</script>
<style>
.el-input__wrapper.is-focus {
  border-color: #f3bb45 !important;
  box-shadow: 0 0 0 1px #f3bb45 !important;
}
</style>
