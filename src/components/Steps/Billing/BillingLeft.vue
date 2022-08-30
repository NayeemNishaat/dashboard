<template>
  <div
    class="md:h-[calc(100%-80px)] realive w-full flex justify-center items-center 2xl:pr-8 pt-8 md:!pt-5"
  >
    <div class="w-[770px] max-w-full mx-auto">
      <div class="w-full flex gap-6 xl:gap-3 2xl:gap-6 items-stretch">
        <DataMenus class="xl:block hidden" :plan="plan" />
        <div class="w-full xl:w-[250px] 2xl:w-[340px] xl:shrink-0 grid gap-3">
          <ul class="grid gap-2.5">
            <li
              class="cursor-pointer"
              @click="ChangePlan(plan.id)"
              v-for="plan in plans"
              :key="plan.id"
              :class="plan.active && 'group'"
            >
              <div
                class="flex justify-between gap-2 2xl:gap-5 items-center rounded-[16px] group-even:!bg-brand-yellow group-odd:!bg-brand-yellow group-even:border-brand-yellow group-odd:!border-brand-yellow border !border-brand-gray !px-4 !py-5 xl:!px-2 xl:!py-2.5 2xl:!px-4 2xl:!py-5 bg-white"
              >
                <div class="flex items-center gap-4">
                  <div>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        v-if="!plan.active"
                        cx="9"
                        cy="9"
                        r="8.5"
                        stroke="#CCCCCC"
                      />
                      <circle
                        v-if="plan.active"
                        cx="9"
                        cy="9"
                        r="9"
                        fill="white"
                      />
                      <path
                        v-if="plan.active"
                        d="M6.81009 12.8306C6.91095 12.9387 7.05177 13 7.19916 13C7.34655 13 7.48737 12.9387 7.58823 12.8306L13.8356 6.54637C13.9408 6.44139 14 6.29849 14 6.14942C14 6.00034 13.9408 5.85744 13.8356 5.75246L13.2464 5.15982C13.0303 4.94673 12.6844 4.94673 12.4683 5.15982L7.19916 10.46L5.53171 8.79392C5.43085 8.68582 5.29003 8.6245 5.14264 8.6245C4.99526 8.6245 4.85444 8.68582 4.75357 8.79392L4.16441 9.38656C4.05919 9.49154 4 9.63444 4 9.78352C4 9.93259 4.05919 10.0755 4.16441 10.1805L6.81009 12.8306Z"
                        fill="#FEB80A"
                      />
                    </svg>
                  </div>
                  <div class="space-y-1">
                    <h4
                      class="text-base font-bold group-even:text-white group-odd:text-white text-black"
                    >
                      {{ plan.name }}
                    </h4>
                    <p
                      class="text-xs text-brand-yellow group-odd:bg-white group-odd:bg-opacity-80 group-even:bg-white group-even:bg-opacity-80 bg-[#F6CA92] bg-opacity-30 rounded-full !py-1 !px-3"
                    >
                      Free {{ plan.trial_period_days }} days
                    </p>
                  </div>
                </div>
                <div>
                  <p
                    class="text-2xl xl:text-xl 2xl:text-2xl flex items-start 2xl:items-end flex-col 2xl:flex-row font-bold group-odd:text-white group-even:text-white text-black"
                  >
                    ${{ plan.price_per_month }}
                    <sub
                      class="text-xs group-even:text-white group-odd:text-white text-brand-gray"
                      >/month</sub
                    >
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DataMenus from "@/components/Steps/DataMenus.vue";
export default defineComponent({
  name: "BillingLeft",
  props: ["plan", "plans"],
  components: {
    DataMenus,
  },
  setup(props, contex) {
    const ChangePlan = (id) => {
      contex.emit("ChangePlan", id);
    };
    return {
      ChangePlan,
    };
  },
});
</script>
