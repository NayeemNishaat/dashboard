<template>
  <div>
    <date-range-picker @datechange="refreshData"></date-range-picker>
    <div class="row">
      <div class="col-12">
        <el-tabs v-model="productFilter">
          <el-tab-pane
            v-for="section in allSections"
            :key="section"
            :name="section"
            :label="$t(section)"
          >
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
<script setup>
import * as Sentry from "@sentry/browser";
import { ref, computed, onMounted } from "vue";
import CardGrid from "@/components/Cards/CardGrid.vue";
import DateRangePicker from "@/components/DateRangePicker.vue";
import { getPageData } from "@/api/backend";
import { useStore } from "vuex";

const store = useStore();
const { dateRange } = store.getters;

const productFilter = ref("recent");
const allSections = ref([
  "recent",
  "related",
  "user_related",
  "user_related_categories",
  "top",
  "similar"
]);
const productPerf = ref([]);
const loading = ref(true);
const error = ref(false);

const allProducts = computed(() => {
  let allProducts = {};
  productPerf.value.forEach((e) => {
    allProducts[e.section_type] = e.products;
  });
  return allProducts;
});
const selProducts = computed(() => {
  if (!allProducts.value || allProducts.value === {}) {
    return [];
  }
  return allProducts.value[productFilter.value] || [];
});
const refreshData = async () => {
  const dates = dateRange;
  if (!dates || dates.length !== 2) {
    return;
  }
  loading.value = true;
  try {
    let response = await getPageData(
      `products?startdate=${dates[0]}&enddate=${dates[1]}`
    );
    productPerf.value = response || [];
  } catch (err) {
    error.value = true;
    Sentry.captureException(err);
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  refreshData();
});
</script>
<style>
.product-btns > a {
  padding-left: 10px;
}
</style>
