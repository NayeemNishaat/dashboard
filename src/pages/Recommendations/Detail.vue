<template>
  <div>
    <template v-if="error || !segment.pct_customers">
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
              <router-link :to="'/segments'"
                ><dc-button
                  ><i class="ti-arrow-left" />&nbsp; back</dc-button
                ></router-link
              >
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 col-sm-6">
          <stats-card
            title="% of all customers"
            :value="`${segment.pct_customers}%`"
            icon="ti-users"
          >
          </stats-card>
        </div>
        <div class="col-md-3 col-sm-6">
          <stats-card
            title="% of revenue"
            :value="`${segment.pct_revenue}%`"
            icon="ti-money"
          >
          </stats-card>
        </div>
        <div class="col-md-3 col-sm-6">
          <stats-card
            title="% repurchase rate"
            :value="`${segment.two_time_buyers}%`"
            icon="ti-money"
          >
          </stats-card>
        </div>
        <div class="col-md-3 col-sm-6">
          <stats-card
            title="Average order value"
            :value="`${segment.aov}`"
            icon="ti-cart"
          >
          </stats-card>
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
import { computed, defineComponent, reactive, ref } from "vue";
import { getApi } from "@/api";
import { segment } from "@/api/interfaces";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "Segments",
  components: { ProductList },
  async setup() {
    const error = ref(null);
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
    let segment: segment | undefined = undefined;
    try {
      const api = getApi();
      segment = await api.getSegment("12312");
    } catch (err) {
      console.log("error occurred", err);
      error.value = err;
      return {
        segmentName,
        segment: null,
        error
      };
    }
    segment = reactive(segment);
    if (segment && segment.rfm) {
      rfmMap.series = [
        {
          data: Object.keys(segment.rfm).map(key => {
            return { x: key, y: (segment as any).rfm[key] };
          })
        }
      ];
    }
    return {
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
