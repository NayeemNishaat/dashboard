<template>
  <main class="font-opensans md:h-screen md:min-h-[650px] lg:min-h-[700px] xl:min-h-[900px]">
    <div class="h-full relative">
      <Transition name="fade">
        <Intro class="absolute inset-0" v-show="store.step === 1" :store="store" @previous="previous" @next="next" />
      </Transition>
      <Transition name="fade">
        <Home class="absolute inset-0" v-show="store.step === 2" :store="store" @previous="previous" @next="next" />
      </Transition>
      <Transition name="fade">
        <Product class="absolute inset-0" v-show="store.step === 3" :store="store" @previous="previous" @next="next" />
      </Transition>
      <Transition name="fade">
        <Analytics class="absolute inset-0" v-show="store.step === 4" :store="store" @previous="previous"
          @next="next" />
      </Transition>
      <Transition name="fade">
        <Billing class="absolute inset-0" v-show="store.step === 5" :store="store" @previous="previous" @next="next" />
      </Transition>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import Intro from "@/components/Onboarding/Intro/Intro.vue";
import Home from "@/components/Onboarding/Home/Home.vue";
import Product from "@/components/Onboarding/Product/Product.vue";
import Analytics from "@/components/Onboarding/Analytics/Analytics.vue";
import Billing from "@/components/Onboarding/Billing/Billing.vue";
import '@/assets/css/tailwind.css';
const store = reactive({
  step: 1,
});

const previous = () => {
  store.step--;
};
const next = () => {
  if (store.step < 6) {
    store.step++;
  }
};
</script>
