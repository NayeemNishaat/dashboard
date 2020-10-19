<template>
  <div>
    <template v-if="error || !segment">
      <error-msg />
    </template>
    <template v-else>
      <div class="row">
        <div class="col-12">
          <router-link :to="'/segments'">back</router-link>
          <h1>{{ segmentName }}</h1>
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
      segment = await api.getSegment("blah-blah-blah", "12312");
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

    const rfmMap = reactive({
      series: [
        {
          data: Object.keys(segment.rfm).map(key => {
            return { x: key, y: (segment as any).rfm[key] };
          })
        }
      ],
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
    return {
      segment,
      segmentName,
      error,
      rfmMap
    };
  }
});
</script>
<style></style>
