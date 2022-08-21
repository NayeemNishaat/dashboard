<template>
  <div>
    <date-range-picker @datechange="refreshData"></date-range-picker>
    <div class="row">
      <div class="col-12">
        <el-tabs v-model="productFilter">
          <el-tab-pane v-for="section in allSections" :key="section" :name="section" :label="$t(section)">
        </el-tab-pane>
        </el-tabs>
        <card-grid
          :loading="loading"
          :cards="selProducts"
          card-type="products"
        />
      </div>
    </div>
  </div>
</template>
<script>
import * as Sentry from "@sentry/browser";
import CardGrid from "@/components/Cards/CardGrid.vue";
import DateRangePicker from "@/components/DateRangePicker.vue";
import { mapGetters } from "vuex";
import { getPageData } from "@/api/backend";
export default {
  components: {
    CardGrid,
    DateRangePicker
  },
  data() {
    return {
      productFilter: "recent",
      allSections:["recent","related","user_related","user_related_categories","top","similar"],
      productPerf: [],
      loading: true,
      error: false
    };
  },
  computed: {
    ...mapGetters(["dateRange"]),
    allProducts() {
      let allProducts = {};
      this.productPerf.forEach(e => {
        allProducts[e.section_type] = e.products;
      });
      return allProducts;
    },
    selProducts() {
      if (!this.allProducts || this.allProducts === {}) {
        return [];
      }
      return this.allProducts[this.productFilter] || [];
    }
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
          `products?startdate=${dates[0]}&enddate=${dates[1]}`
        );
        this.productPerf = response || [];
      } catch (err) {
        this.error = true;
        Sentry.captureException(err);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.refreshData();
  }
};
</script>
<style>
.product-btns > a {
  padding-left: 10px;
}
</style>
