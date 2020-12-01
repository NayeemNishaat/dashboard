<template>
  <card>
    <template v-slot:header>
      <div class="d-flex align-items-center">
        <h3 class="card-title">{{ friendlyName[name].title }}</h3>
        <div class="lmargin p-tag p-tag-rounded p-tag-success">
          Coming Soon
        </div>
      </div>
      <p class="card-category">{{ friendlyName[name].description }}</p>
    </template>
    <div class="row">
      <div class="col-12">
        <img
          v-if="name === 'campaigns'"
          src="@/assets/img/coming-soon/campaigns.svg"
        />
        <img
          v-else-if="name === 'reports'"
          src="@/assets/img/coming-soon/reports.svg"
        />
      </div>
    </div>
  </card>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Coming Soon",
  props: {
    name: {
      type: String,
      default: "reports"
    }
  },
  setup() {
    const friendlyName = {
      reports: {
        title: "Export data for analysis easily",
        description:
          "Run reports to get a CSV version of your customer audiences"
      },
      campaigns: {
        title: "View Facebook campaign performance",
        description: "Monitor your campaign performance right from DataCue"
      }
    };
    return {
      friendlyName
    };
  }
});
</script>

<style scoped>
p.subtext {
  font-size: 1.2rem;
  padding-top: 1rem;
}
.lmargin {
  margin-left: 0.5rem;
}
</style>
