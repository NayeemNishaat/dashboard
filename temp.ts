// <template>
//   <div class="demo-date-picker">
//     <div class="block">
//       <el-date-picker
//         v-model="value1"
//         type="daterange"
//         range-separator="To"
//         start-placeholder="Start date"
//         end-placeholder="End date"
//       />
//     </div>
//   </div>
// </template>

// <script lang="ts" setup>
// import { ref } from "vue";

// const value1 = ref("");
// const value2 = ref("");
// </script>
// <style scoped>
// .demo-date-picker {
//   display: flex;
//   width: 100%;
//   padding: 0;
//   flex-wrap: wrap;
// }
// .demo-date-picker .block {
//   padding: 30px 0;
//   text-align: left;
//   border-right: solid 1px var(--el-border-color);
//   flex: 1;
// }
// .demo-date-picker .block:last-child {
//   border-right: none;
// }
// .demo-date-picker .demonstration {
//   display: block;
//   color: var(--el-text-color-secondary);
//   font-size: 14px;
//   margin-bottom: 20px;
// }
// </style>

// Test:
// <template>
//   <div class="row">
//     <div class="col-12 text-right datepicker">
//       <el-date-picker
//         v-model="dateRangeModel"
//         type="daterange"
//         :range-separator="$t('to')"
//         :start-placeholder="$t('start date')"
//         :end-placeholder="$t('end date')"
//         :format="yyyy - mm - dd"
//         :value-format="yyyy - mm - dd"
//         @change="dateChanged"
//       >
//       </el-date-picker>
//     </div>
//   </div>
// </template>
// <script>
// import { mapActions, mapGetters } from "vuex";
// export default {
//   computed: {
//     ...mapGetters(["dateRange"]),
//     dateRangeModel: {
//       get() {
//         return this.dateRange;
//       },
//       set(value) {
//         this.setDateRange(value);
//       }
//     }
//   },
//   methods: {
//     ...mapActions(["setDateRange"]),
//     dateChanged(value) {
//       this.$emit("datechange", value);
//     }
//   }
// };
// </script>
// <style>
// .datepicker .el-date-editor .el-range-separator {
//   width: auto;
//   flex: 1 0 auto;
// }
// .datepicker {
//   padding-bottom: 10px;
// }
// </style>

// Bug:
// <template>
//   <div class="content">
//     <div class="container-fluid">
//       <transition name="fade" mode="out-in">
//         <!-- your content here -->
//         <router-view v-slot="{}"> </router-view>
//       </transition>
//     </div>
//   </div>
// </template>
// <script>
// export default {};
// </script>
