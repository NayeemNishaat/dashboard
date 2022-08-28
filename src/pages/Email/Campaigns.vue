<template>
  <div>
    <date-range-picker @datechange="refreshData"></date-range-picker>
    <!--Stats cards-->
    <div class="row">
      <div
        class="col-lg-3 col-sm-6"
        v-for="stats in statsCards"
        :key="stats.title"
      >
        <stats-card
          :loading="loading"
          :title="stats.title"
          :value="stats.value.toString()"
          :comparison="stats.comparison"
          :icon="stats.icon"
        >
          <!-- <div class="stats" slot="footer">
            <i class="ti-info"></i>
            {{ $t(stats.footer) }}
          </div>-->
        </stats-card>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <h3>{{ $t("campaigns") }}</h3>
        <div class="card">
          <div class="card-body">
            <multi-table
              :data="tblCampaigns"
              idcol="campaign_id"
              :columns="[
                'name',
                'sent',
                'delivered',
                'opened',
                'clicked',
                'converted',
                'conversionValue',
              ]"
              :colnames="
                [
                  'name',
                  'sent',
                  'delivered',
                  'open %',
                  'click %',
                  'converted',
                  'value',
                ].map((n) => this.$t(n))
              "
              :actions="[
                {
                  action: 'edit',
                  icon: 'ti-pencil-alt',
                  id: 'campaigns:edit-btn',
                },
              ]"
              @edit="openEditor"
            ></multi-table>
            <el-button
              v-if="!loading && !tblCampaigns.length"
              type="warning"
              class="campaign-add"
              data-id="campaigns:add-campaign-btn"
              @click="addCampaign"
            >
              <i class="ti-plus"></i>
              &nbsp;{{ $t("add campaign") }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StatsCard from "@/components/Cards/StatsCard.vue";
import MultiTable from "@/components/MultiTable.vue";
import DateRangePicker from "@/components/DateRangePicker.vue";

import { addCampaignMixin } from "@/mixins/campaign";

import { getPageData } from "@/api/backend";

export default {
  mixins: [addCampaignMixin],
  components: {
    StatsCard,
    MultiTable,
    DateRangePicker,
  },

  data() {
    return {
      error: false,
      loading: false,
      statsCards: [
        {
          type: "info",
          icon: "ti-export",
          title: "sent",
          value: "0",
          comparison: "n/a",
        },
        {
          type: "info",
          icon: "ti-book",
          title: "opened",
          value: "0",
          comparison: "n/a",
        },
        {
          type: "info",
          icon: "ti-mouse-alt",
          title: "clicked",
          value: "0",
          comparison: "n/a",
        },
        {
          type: "info",
          icon: "ti-money",
          title: "converted",
          value: "0",
          comparison: "n/a",
        },
      ],
      tblCampaigns: [],
      campaignForm: {
        name: "",
        rules: "{}",
        subject: "",
        template: "",
      },
      type: ["", "info", "success", "warning", "danger"],
    };
  },
  watch: {},
  computed: {},
  methods: {
    refreshData(dates) {
      if (!dates || dates.length !== 2) {
        return;
      }
      this.loading = true;
      const [startdate, enddate] = dates;
      getPageData(`campaigns?startdate=${startdate}&enddate=${enddate}`)
        .then((response) => {
          this.tblCampaigns = response.campaigns || [];

          const stats = response.stats || [];
          const conversions = response.conversions || [];
          const cards = this.statsCards;

          const statsByType = {};
          const statsById = {};

          // transform data
          stats.forEach((item) => {
            const { campaign_id, count, event_type } = item;

            statsById[campaign_id] = statsById[campaign_id] || {
              Send: 0,
              Delivery: 0,
              Open: 0,
              Click: 0,
            };

            statsById[campaign_id][event_type] = count;

            statsByType[event_type] = statsByType[event_type] || 0;
            statsByType[event_type] += count;
          });

          // event count cards
          ["Send", "Open", "Click"].forEach((eventType, idx) => {
            cards[idx].footerText = "";
            cards[idx].value = statsByType[eventType] || 0;
          });

          // temporary fix for unreliable event counts
          cards[1].value = Math.max(cards[1].value, cards[2].value);
          cards[0].value = Math.max(cards[0].value, cards[1].value);

          // conversion count card
          cards[3].footerText = "";
          cards[3].value = conversions
            .map((item) => item.total_value)
            .reduce((s, v) => s + v, 0)
            .toLocaleString();

          this.tblCampaigns.forEach((campaign) => {
            const id = campaign.campaign_id;

            if (!statsById[id]) {
              campaign.sent = campaign.delivered = 0;
              campaign.opened = campaign.clicked = "-";
            } else {
              // temporary fix for unreliable event counts
              statsById[id].Open = Math.max(
                statsById[id].Open,
                statsById[id].Click
              );
              statsById[id].Delivery = Math.max(
                statsById[id].Delivery,
                statsById[id].Open
              );
              statsById[id].Send = Math.max(
                statsById[id].Send,
                statsById[id].Open
              );

              campaign.sent = statsById[id].Send;
              campaign.delivered = statsById[id].Delivery;
              if (campaign.sent) {
                campaign.opened =
                  Math.round((100 * statsById[id].Open) / statsById[id].Send) +
                  "%";
                campaign.clicked =
                  Math.round((100 * statsById[id].Click) / statsById[id].Send) +
                  "%";
              } else {
                campaign.opened = campaign.clicked = "0%";
              }
            }

            const converted = conversions.find(
              (item) => item.campaign_id === id
            );
            campaign.converted = converted ? converted.count : 0;
            campaign.conversionValue = converted
              ? converted.total_value.toLocaleString()
              : 0;
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.error = true;
        });
    },
    openEditor(campaignid) {
      this.$router.push({ name: "edit campaign", params: { campaignid } });
    },
  },
  mounted() {
    this.refreshData(this.$store.getters.dateRange);
  },
};
</script>
<style>
@media (max-width: 600px) {
  table.mytable th {
    letter-spacing: -1px;
  }
}

.campaign-add {
  margin-top: 1rem;
  align-self: flex-start;
}

.el-dialog.is-fullscreen {
  display: flex;
  flex-flow: column nowrap;
}

.el-dialog.is-fullscreen .el-dialog__header,
.el-dialog.is-fullscreen .el-dialog__footer {
  padding: 20px;
}

.el-dialog.is-fullscreen .el-dialog__body {
  position: relative;
  flex: 1 1 auto;
  padding: 0;
}
</style>
