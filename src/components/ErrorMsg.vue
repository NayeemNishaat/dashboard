<template>
  <MessageBanner icon="ti-alert" type="error">
    <div class="row d-flex justify-content-center align-items-center">
      <template v-if="refreshBtn">
        <div class="col-10">
          <h4>{{ msg }}</h4>
          <p v-if="description">{{ description }}</p>
        </div>
        <div class="col-2 d-flex justify-content-center align-items-center">
          <dc-button type="circle" @click="reload"
            ><i class="ti-reload"
          /></dc-button>
        </div>
      </template>
      <div class="col-12" v-else>
        <h4>{{ msg }}</h4>
        <p v-if="description">{{ description }}</p>
      </div>
    </div>
  </MessageBanner>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import MessageBanner from "./MessageBanner.vue";

export default defineComponent({
  name: "error-msg",
  components: { MessageBanner },
  props: {
    msg: {
      type: String,
      default: "Oops... an error occurred. Try refreshing?"
    },
    description: {
      type: String,
      default: ""
    },
    refreshBtn: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const router = useRouter();
    const reload = () => {
      router.go(0);
    };
    return {
      reload
    };
  }
});
</script>
