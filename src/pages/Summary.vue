<template>
  <div>
    <!--Stats cards-->
    <div class="row">
      <div
        class="col-md-6 col-xl-3"
        v-for="stats in statsCards"
        :key="stats.title"
      >
        <stats-card>
          <template v-slot:header>
            <div class="icon-big text-center" :class="`icon-${stats.type}`">
              <i class="nc-icon" :class="stats.icon"></i>
            </div>
          </template>
          <template v-slot:content>
            <div class="numbers">
              <p>{{ stats.title }}</p>
              {{ stats.value }}
            </div>
          </template>
          <template v-slot:footer>
            <div class="stats">
              <i :class="stats.footerIcon"></i> {{ stats.footerText }}
            </div>
          </template>
        </stats-card>
      </div>
    </div>

    <!--Charts-->
    <div class="row">
      <div class="col-12">
        <chart-card
          title="Users behavior"
          sub-title="24 Hours performance"
          :chart-data="usersChart.data"
          :chart-options="usersChart.options"
        >
          <template v-slot:footer>
            <span> <i class="ti-reload"></i> Updated 3 minutes ago </span>
          </template>
          <template v-slot:legend>
            <div>
              <i class="fa fa-circle text-info"></i> Open
              <i class="fa fa-circle text-danger"></i> Click
              <i class="fa fa-circle text-warning"></i> Click Second Time
            </div>
          </template>
        </chart-card>
      </div>

      <div class="col-md-6 col-12">
        <stats-card
          title="Email Statistics"
          sub-title="Last campaign performance"
          :chart-data="preferencesChart.data"
          chart-type="Pie"
        >
          <template v-slot:footer>
            <span> <i class="ti-timer"></i> Campaign set 2 days ago</span>
          </template>
          <template v-slot:legend>
            <div>
              <i class="fa fa-circle text-info"></i> Open
              <i class="fa fa-circle text-danger"></i> Bounce
              <i class="fa fa-circle text-warning"></i> Unsubscribe
            </div>
          </template>
        </stats-card>
      </div>

      <div class="col-md-6 col-12">
        <stats-card
          title="2015 Sales"
          sub-title="All products including Taxes"
          :chart-data="activityChart.data"
          :chart-options="activityChart.options"
        >
          <template v-slot:footer>
            <span> <i class="ti-check"></i> Data information certified </span>
          </template>
          <template v-slot:legend>
            <div>
              <i class="fa fa-circle text-info"></i> Tesla Model S
              <i class="fa fa-circle text-warning"></i> BMW 5 Series
            </div>
          </template>
        </stats-card>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { StatsCard } from "@/components/index";
import ChartCard from "@/components/Cards/ChartCard.vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    StatsCard,
    ChartCard
  },
  /**
   * Chart data used to render stats, charts. Should be replaced with server data
   */
  data() {
    return {
      statsCards: [
        {
          type: "warning",
          icon: "nc-globe",
          title: "Capacity",
          value: "105GB",
          footerText: "Updated now",
          footerIcon: "ti-reload"
        },
        {
          type: "success",
          icon: "ti-wallet",
          title: "Revenue",
          value: "$1,345",
          footerText: "Last day",
          footerIcon: "ti-calendar"
        },
        {
          type: "danger",
          icon: "ti-pulse",
          title: "Errors",
          value: "23",
          footerText: "In the last hour",
          footerIcon: "ti-timer"
        },
        {
          type: "info",
          icon: "ti-twitter-alt",
          title: "Followers",
          value: "+45",
          footerText: "Updated now",
          footerIcon: "ti-reload"
        }
      ],
      usersChart: {
        data: [
          {
            name: "series-1",
            data: [30, 40, 45, 50, 49, 60, 70, 91]
          }
        ],
        options: {
          chart: {
            id: "chart-id"
          },
          xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
          }
        }
      },
      activityChart: {
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mai",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          series: [
            [542, 543, 520, 680, 653, 753, 326, 434, 568, 610, 756, 895],
            [230, 293, 380, 480, 503, 553, 600, 664, 698, 710, 736, 795]
          ]
        },
        options: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false
          },
          height: "245px"
        }
      },
      preferencesChart: {
        data: {
          labels: ["62%", "32%", "6%"],
          series: [62, 32, 6]
        },
        options: {}
      }
    };
  }
});
</script>
<style></style>
