import { postCampaign } from "@/api/backend";

export const addCampaignMixin = {
  data() {
    return {
      addingCampaign: false
    };
  },
  methods: {
    addCampaign() {
      this.addingCampaign = true;
      postCampaign({
        name: "We miss you",
        subject: "We miss you",
        rules: "{}",
        template: "<!-- empty -->",
        active: false
      })
        .then(res => {
          this.$router.push({
            name: "edit campaign",
            params: { campaignid: res.data.campaign_id }
          });
        })
        .catch(() => {
          this.$notify({
            title: this.$i18n.t("error"),
            message: this.$i18n.t("could not save"),
            type: "warning"
          });
        })
        .finally(() => {
          this.addingCampaign = false;
        });
    }
  }
};
