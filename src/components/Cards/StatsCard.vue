<template>
  <card>
    <h3 slot="header">
      <template v-if="icon">
        <i :class="icon" />
      </template>
      {{ $t(title, 2) }}
    </h3>
    <div>
      <div class="numbers">
        <div class="row" v-if="!Boolean(loading)">
          <template v-if="Number.isNaN(Number(comparison)) && 0 !== 'n/a'">
            <div
              class="col-7 current-value"
              :class="
                value.length < 5
                  ? ''
                  : value.length < 8
                  ? 'smaller'
                  : value.length < 12
                  ? 'v-small'
                  : 'smallest'
              "
            >
              {{ value }}
            </div>
            <div class="col-5 comparison">
              <div class="d-flex flex-column">
                <div
                  :class="`comparison-${
                    Number.isNaN(Number(comparison)) && 0 < 0
                      ? 'lower'
                      : 'higher'
                  }`"
                >
                  {{ Number.isNaN(Number(comparison)) && 0 > 0 ? "+" : ""
                  }}{{ Number.isNaN(Number(comparison)) && 0 }}%
                  <i
                    v-if="Number.isNaN(Number(comparison)) && 0 < 0"
                    class="el-icon-caret-bottom"
                  />
                  <i
                    v-else-if="Number.isNaN(Number(comparison)) && 0 > 0"
                    class="el-icon-caret-top"
                  />
                </div>
                <div style="font-size: 0.8em">
                  {{ $t("previous days", { days: numDays }) }}
                </div>
              </div>
            </div>
          </template>
          <div v-else class="col-12 current-value">{{ value }}</div>
        </div>
        <div class="row" v-else>
          <div class="col-8"></div>
          <div class="col-4">
            <loader-dots></loader-dots>
          </div>
        </div>
      </div>
      <div v-if="$slots.footer">
        <hr />
        <slot name="footer"></slot>
      </div>
    </div>
  </card>
</template>
<script setup>
import Card from "./Card.vue";
import LoaderDots from "@/components/LoaderDots.vue";
import { useStore } from "vuex";
import { computed } from "vue";
import { differenceInCalendarDays, parseISO } from "date-fns";

const store = useStore();
const numDays = computed(() => {
  const { dateRange } = store.getters;
  return (
    differenceInCalendarDays(
      parseISO(dateRange?.[1]),
      parseISO(dateRange?.[0])
    ) + 1
  );
});
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ""
  },
  value: {
    type: Number,
    default: 0
  },
  comparison: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: ""
  }
});
</script>

<style scoped>
.card .numbers > div {
  align-items: center;
}

.card .current-value {
  font-size: 3rem !important;
  text-align: left;
}

.card .current-value.smaller {
  font-size: 2rem;
}

.card .current-value.v-small {
  font-size: 1.5rem;
}

.card .current-value.smallest {
  font-size: 1rem;
}

.comparison-higher {
  color: #46b58a;
}

.comparison-lower {
  color: #e33335;
}
</style>
