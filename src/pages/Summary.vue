<template>
  <div>
    <!--Notification-->
    <date-range-picker @datechange="refreshData"></date-range-picker>
    <section class="summary row">
      <div class="col-sm-12">
        <el-alert
          v-if="installationError != ''"
          :title="$t(installationError)"
          type="error"
          effect="light"
        >
        </el-alert>
      </div>
    </section>
    <!--Stats cards-->
    <div class="row">
      <div
        class="col-md-4 col-sm-6"
        v-for="stats in statsCards"
        :key="stats.title"
      >
        <stats-card
          :loading="loading"
          :title="stats.title"
          :value="stats.value"
          :comparison="stats.comparison"
          :icon="stats.icon"
        >
          <div class="stats" slot="footer">
            <i class="ti-info"></i>
            {{ $t(stats.footer) }}
          </div>
        </stats-card>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-4 col-xs-12">
        <chart-card
          title="% of sales with datacue clicks"
          :no-data="!conversionContribution[0]"
          no-data-text="noSalesStayPositive"
          no-data-icon="ti-light-bulb"
          :chart-data="{
            datasets: [
              {
                data: conversionContribution,
                backgroundColor: [
                  'rgba(243, 187, 69, 1)',
                  'rgba(104, 179, 200, 1)'
                ]
              }
            ],
            labels: ['DataCue', $t('other')]
          }"
          :loading="loading"
          :chart-type="'Doughnut'"
          :chart-options="{
            responsive: true,
            maintainAspectRatio: false,
            legend: { display: true },
            layout: {
              padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }
            },
            tooltips: {
              callbacks: {
                label: (tooltipItem, data) =>
                  data['datasets'][0]['data'][tooltipItem['index']] + '%'
              }
            }
          }"
        ></chart-card>
      </div>
      <div class="col-sm-8 col-xs-12">
        <chart-card-metrics
          :title="$t('product revenue per day')"
          :chart-data="pageData['summary_timeline']"
          :chart-type="'Bar'"
          :loading="loading"
          default-metric="sales"
        ></chart-card-metrics>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <chart-card-metrics
          title="performance by component"
          :chart-data="pageData['component_performance_chart']"
          :loading="loading"
          :options="{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
          }"
        ></chart-card-metrics>
      </div>
    </div>
  </div>
</template>

<script>
import ChartCard from "/src/components/Cards/ChartCard.vue";
import ChartCardMetrics from "/src/components/Cards/ChartCardMetrics.vue";
import StatsCard from "/src/components/Cards/StatsCard.vue";
import DateRangePicker from "/src/components/DateRangePicker.vue";
import * as Sentry from "@sentry/browser";
import { mapActions, mapGetters } from "vuex";

import { getPageData } from "/src/api/backend";

function pctChange(previous, today) {
  if (!previous) {
    return "n/a";
  }
  let ans = ((today - previous) * 100.0) / previous;
  return ans.toFixed(0);
}

const emptyStats = [
  {
    title: "sessions",
    icon: "ti-pulse",
    value: "0",
    comparison: "0",
    footer: "blocks of user activity",
    nodata: true
  },
  {
    title: "clicks",
    icon: "ti-mouse-alt",
    value: "0",
    comparison: "0",
    footer: "recommendation clicks"
  },
  {
    title: "conversions",
    icon: "ti-money",
    value: "0",
    comparison: "0",
    footer: "recommendation sales"
  }
];
export default {
  components: {
    ChartCard,
    ChartCardMetrics,
    StatsCard,
    DateRangePicker
  },
  data() {
    return {
      error: false,
      loading: true,
      pageData: {},
      statsCards: []
    };
  },
  computed: {
    ...mapGetters(["client", "dateRange"]),
    ...mapGetters("settings", [
      "locale",
      "webSettings",
      "installationSettings"
    ]),
    installationError() {
      if (!this.installationSettings.library) {
        return "installerror:MissingLibrary";
      } else if (!this.installationSettings.products) {
        return "installerror:MissingProducts";
      }
      return "";
    },
    conversionContribution() {
      const chartData = this.pageData["datacue_conversion_contribution_chart"];
      if (!chartData) {
        return [0, 0];
      }
      return [chartData["dc"], chartData["other"]];
    }
  },
  methods: {
    ...mapActions("settings", ["getPageInstallationSettings"]),
    formatToClientCurrency(value) {
      let pricingFormat = this.locale?.currency?.format || "{{amount}}";
      const formattedValue = new Intl.NumberFormat(this.locale).format(
        value || 0
      );
      return pricingFormat.replace("{{amount}}", formattedValue);
    },
    getStatsCards() {
      let newStatsCards = JSON.parse(JSON.stringify(emptyStats));
      if (
        !this.pageData.hasOwnProperty("cards") ||
        this.pageData["cards"] === null
      ) {
        return newStatsCards;
      }
      const cards = this.pageData["cards"];
      return newStatsCards.map((elem) => {
        let newStat = elem;
        const current = Math.round(+cards[elem.title].current);
        newStat.value =
          elem.title === "conversions"
            ? this.formatToClientCurrency(current)
            : current.toLocaleString(this.locale);
        newStat.comparison = pctChange(
          cards[elem.title].comparison,
          cards[elem.title].current
        );
        newStat["nodata"] = cards[elem.title].current === 0;
        return newStat;
      });
    },
    async refreshData(dates) {
      if (!dates || dates.length !== 2) {
        return;
      }
      this.loading = true;
      const startdate = dates[0];
      const enddate = dates[1];

      try {
        const stats = getPageData(
          `web?startdate=${startdate}&enddate=${enddate}`
        );
        const installation = this.getPageInstallationSettings("home");
        let response = [await stats, await installation];
        let pageData = response[0];
        this.pageData = pageData;
        this.statsCards = this.getStatsCards();
      } catch (err) {
        Sentry.captureException(err);
        this.error = true;
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.statsCards = JSON.parse(JSON.stringify(emptyStats));
    this.refreshData(this.dateRange);
  }
};
</script>
<style scoped>
.row.summary > div > div.el-alert {
  margin-bottom: 10px;
}
</style>
