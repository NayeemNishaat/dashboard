<template>
  <div class="row">
    <div class="col-12 text-right datepicker">
      <el-date-picker
        v-model="dateRangeModel"
        type="daterange"
        :range-separator="$t('to')"
        :start-placeholder="$t('start date')"
        :end-placeholder="$t('end date')"
        @change="dateChanged"
      >
      </el-date-picker>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["dateRange"]),
    dateRangeModel: {
      get() {
        return this.dateRange;
      },
      set(value) {
        this.setDateRange(value);
      }
    }
  },
  methods: {
    ...mapActions(["setDateRange"]),
    dateChanged(value) {
      this.$emit("datechange", value);
    }
  }
};
</script>
<style>
.datepicker .el-date-editor .el-range-separator {
  width: auto;
  flex: 1 0 auto;
}
.datepicker {
  padding-bottom: 10px;
}
</style>
