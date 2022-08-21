<template>
  <div>
    <div v-for="product in data" class="row">
      <div class="col-6 col-md-4">
        <span class="title">{{ product.title }}:</span>
        <el-progress
          :percentage="product.pct"
          :status="product.done ? 'warning' : 'exception'"
        ></el-progress>
      </div>
      <div class="col-6 col-md-8 right">
        <span v-if="product.done" class="done">
          <tick-check></tick-check>Done
        </span>
        <template v-else>
          <el-checkbox
            v-model="product.done"
            :disabled="refreshing.includes(product.title)"
            >{{ $t("mark as done") }}</el-checkbox
          >
          <span @click="refresh(product.title)" class="icon">
            <refresh-icon :class="getIconClass(product.title)"></refresh-icon>
          </span>

          <span @click="help(product.title)" class="icon">
            <magnifying-glass-icon></magnifying-glass-icon>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

import MagnifyingGlassIcon from "@/components/icons/MagnifyingGlassIcon";
import RefreshIcon from "@/components/icons/RefreshIcon";
import TickCheck from "@/components/icons/TickCheck";

export default {
  props: {
    displayOnly: {
      type: Boolean,
      default: () => false
    },
    refreshing: {
      type: Array,
      default: () => []
    },
    storeData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    minimumData: {
      type: Object,
      default: () => {
        return {
          products: 10,
          orders: 50,
          users: 10,
          categories: 2
        };
      }
    }
  },
  computed: {
    ...mapGetters("onboarding", ["setupSummary"]),
    data() {
      const storeData = this.setupSummary.store_data;
      const data = [];
      if (!storeData || Object.keys(storeData).length === 0) {
        return data;
      }
      Object.keys(storeData).forEach(key => {
        if (!["categories", "products", "orders", "users"].includes(key)) {
          return;
        }
        let value =
          (key === "products" ? storeData[key][key] : storeData[key]) || 0;
        const item = {
          title: key,
          value: value,
          pct: (value / this.minimumData[key]) * 100,
          done: value >= this.minimumData
        };
        data.push(item);
      });
      return data;
    }
  },
  data() {
    return {
      loading: false
    };
  },
  components: {
    MagnifyingGlassIcon,
    RefreshIcon,
    TickCheck
  },
  methods: {
    help(type) {
      window.open(
        `https://developer.datacue.co/#${type.toLowerCase()}`,
        "_blank"
      );
    },
    refresh(type) {
      if (!this.refreshing.includes(type)) {
        this.$emit("refresh", type);
      }
    },
    getIconClass(type) {
      return {
        "fa-spin-reverse": this.refreshing.includes(type)
      };
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~sass/datacue/_colors.scss";

.row {
  margin-bottom: 10px;
}

span {
  color: $dark;
  font-size: 16px;
}

.title {
  text-transform: capitalize;
}

.value {
  font-weight: bold;
}

.done {
  color: $gray-light;
  fill: $gray-light;
}
.done svg {
  width: 15px;
  height: 15px;
  margin-right: 10px;
}

.icon {
  cursor: pointer;
  display: inline-block;
  width: 35px;
  height: 35px;
  fill: $primary;
  border: 1px solid $primary;
  border-radius: 6px;
  margin-right: 15px;

  svg {
    width: 20px;
    margin-left: 7px;
    margin-top: 4px;
  }
}
</style>
