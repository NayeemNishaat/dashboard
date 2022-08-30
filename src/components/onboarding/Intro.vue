<template>
  <main
    class="font-opensans md:h-screen md:min-h-[650px] lg:min-h-[700px] xl:min-h-[900px]"
  >
    <div class="h-full relative">
      <Transition name="fade">
        <Intro
          class="absolute inset-0"
          v-show="store.step === 1"
          :store="store"
          @previous="previous"
          @next="next"
        />
      </Transition>
      <Transition name="fade">
        <Home
          class="absolute inset-0"
          v-show="store.step === 2"
          :store="store"
          @previous="previous"
          @next="next"
        />
      </Transition>
      <Transition name="fade">
        <Product
          class="absolute inset-0"
          v-show="store.step === 3"
          :store="store"
          @previous="previous"
          @next="next"
        />
      </Transition>
      <Transition name="fade">
        <Analytics
          class="absolute inset-0"
          v-show="store.step === 4"
          :store="store"
          @previous="previous"
          @next="next"
        />
      </Transition>
      <Transition name="fade">
        <Billing
          class="absolute inset-0"
          v-show="store.step === 5"
          :store="store"
          @previous="previous"
          @next="next"
        />
      </Transition>
    </div>
  </main>
</template>

<script lang="ts">
import { reactive, defineComponent } from "vue";
import Intro from "@/components/Steps/Intro/Intro.vue";
import Home from "@/components/Steps/Home/Home.vue";
import Product from "@/components/Steps/Product/Product.vue";
import Analytics from "@/components/Steps/Analytics/Analytics.vue";
import Billing from "@/components/Steps/Billing/Billing.vue";
import "@/assets/css/tailwind.css";
export default defineComponent({
  components: {
    Intro,
    Home,
    Product,
    Analytics,
    Billing
  },
  setup() {
    const store = reactive({
      step: 1
    });

    const previous = () => {
      store.step--;
    };
    const next = () => {
      if (store.step < 6) {
        store.step++;
      }
    };

    return {
      store,
      previous,
      next
    };
  }
});
</script>
