<template>
  <div>
    <template
      v-if="error || !(segment && segment.stats && segment.stats.revenue)"
    >
      <error-msg />
    </template>
    <template v-else>
      <div class="row">
        <div class="col-12 title">
          <div class="row">
            <div class="col-9">
              <h1>{{ segmentName }}</h1>
            </div>
            <div class="col-3 right-align">
              <router-link :to="'/segments/recommendations'"
                ><dc-button
                  ><i class="ti-arrow-left" />&nbsp; back</dc-button
                ></router-link
              >
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-sm-6">
          <stats-card
            title="Revenue"
            :value="new Intl.NumberFormat().format(segment.stats.revenue)"
            icon="ti-money"
          >
          </stats-card>
        </div>
        <div class="col-md-4 col-sm-6">
          <stats-card
            title="# of customers"
            :value="new Intl.NumberFormat().format(segment.stats.customers)"
            icon="ti-user"
          >
          </stats-card>
        </div>
        <div class="col-md-4 col-sm-6">
          <stats-card
            title="Average order value"
            :value="new Intl.NumberFormat().format(segment.stats.aov)"
            icon="ti-cart"
          >
          </stats-card>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <chart-card
            title="Product groups"
            sub-title="This cluster is
          associated with the following product groups"
            type="bar"
            :options="{}"
            :height="120"
            :data="groupsChart"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 col-sm-12">
          <card title="Top products">
            <ProductList :products="segment.top_products" />
          </card>
        </div>
        <div class="col-md-6 col-sm-12">
          <card title="Commonly bought together">
            <ProductList :products="segment.commonly_bought_together" />
          </card>
        </div>
        <div class="col-12">
          <chart-card
            v-if="rfmMap.series[0].data.length > 0"
            type="treemap"
            :options="rfmMap.options"
            :data="rfmMap.series"
          ></chart-card>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import ProductList from "@/components/UI/ProductList.vue";
import { computed, defineComponent, reactive, Ref, ref } from "vue";
import { getApi } from "@/api";
import { segment } from "@/api/interfaces";
import { useRoute } from "vue-router";
import { barChartData } from "@/components/Charts/basecharts";

export default defineComponent({
  name: "Segments",
  components: { ProductList },
  async setup() {
    const error = ref(null);
    let segment: Ref<segment | null> = ref(null);
    const groupsChart: barChartData = reactive({
      labels: [],
      datasets: []
    });
    let rfmMap = reactive({
      series: [{ data: [] as Array<{ x: string; y: number }> }],
      options: {
        legend: {
          show: false
        },
        chart: {
          height: 350,
          type: "treemap"
        },
        title: {
          text: "Customer Lifecycles"
        }
      }
    });
    const segmentName = computed(() => {
      const segment = useRoute()?.params?.segment ?? "";
      if (Array.isArray(segment)) {
        return segment[0];
      }
      return segment;
    });

    try {
      const api = getApi();
      segment.value = await api.getSegment(segmentName.value);
      if (segment.value && segment.value.rfm) {
        rfmMap.series = [
          {
            data: segment.value.rfm.map(item => {
              return { x: item.rfm_level, y: item.customers };
            })
          }
        ];
      }
      if (segment.value && segment.value.product_groups) {
        const chartLabels = Object.keys(segment.value.product_groups);
        const data = chartLabels.map(
          item => segment.value?.product_groups[item]
        );
        if (data) {
          groupsChart.labels = chartLabels.map(label =>
            label.replace(/_/g, " ")
          );
          groupsChart.datasets.push({
            label: "Product groups",
            data: data as any
          });
        }
      }
    } catch (err) {
      console.log("error occurred", err);
      error.value = err;
      return {
        segmentName,
        groupsChart,
        segment: null,
        error
      };
    }
    return {
      groupsChart,
      segment,
      segmentName,
      error,
      rfmMap
    };
  }
});
</script>
<style>
.title {
  margin-bottom: 1rem;
}
.right-align {
  align-items: center;
}
</style>
