<template>
  <div>
    <card-message-box v-if="error" type="error">
      <h3>{{ $t("an error occurred") }}</h3>
      <p>{{ $t("an unknown error occured, please try again later") }}</p>
    </card-message-box>
    <card-message-box v-else-if="(current || []).length === 0" type="error">
      <h3>{{ $t("categories:NoCategoriesFound:title") }}</h3>
      <p>
        {{ $t("categories:NoCategoriesFound:subtext") }}
      </p>
    </card-message-box>
    <template v-else>
      <pending-settings
        :has-unsaved-changes="hasUnsavedChanges"
        :saving="saving"
        @save="saveChanges"
      />

      <card>
        <h3 slot="header">
          <i class="ti-layout-tab"></i>
          &nbsp;{{
            $t(`categories:About${client.type === "shopify" ? "_shopify" : ""}`)
          }}
        </h3>
        <ul>
          <li>{{ $t(`onboarding:feature:banners`) }}</li>
          <li>
            {{ $t(`top${client.type === "shopify" ? "_shopify" : ""}`) }}
          </li>
          <li>
            {{
              $t(
                `user_related_categories${
                  client.type === "shopify" ? "_shopify" : ""
                }`
              )
            }}
          </li>
        </ul>
        <loader-dots v-if="loading"></loader-dots>
        <template v-else-if="current">
          <div class="row">
            <div class="col-12">
              <multi-select-table
                idcol="category_id"
                selectorcol="active"
                :data="current"
                :columns="['name']"
                @select="handleSelect"
              ></multi-select-table>
            </div>
          </div>
        </template>
      </card>
    </template>
  </div>
</template>

<script>
import Card from "@/components/Cards/Card.vue";
import CardMessageBox from "@/components/Cards/CardMessageBox.vue";
import PendingSettings from "@/components/Settings/PendingSettings.vue";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import * as Sentry from "@sentry/browser";
import { mapGetters } from "vuex";
import LoaderDots from "@/components/LoaderDots.vue";
import MultiSelectTable from "@/components/table/MultiSelect.vue";
import { GetCategories, DeactivateCategories } from "@/api/backend";

export default {
  name: "Category",
  components: {
    Card,
    MultiSelectTable,
    LoaderDots,
    PendingSettings,
    CardMessageBox
  },
  data() {
    return {
      saving: false,
      loading: false,
      error: false,
      multipleSelection: [],
      lastSaved: [],
      search: "",
      current: null
    };
  },
  computed: {
    ...mapGetters(["client"]),
    hasUnsavedChanges() {
      return !isEqual(this.current, this.lastSaved);
    }
  },
  methods: {
    async saveChanges() {
      this.saving = true;
      try {
        //we only need the list of inactive categories
        //to process changes
        await DeactivateCategories(
          this.current
            .filter((elem) => !elem.active)
            .map((elem) => elem.category_id)
        );
        let resp = await GetCategories();
        this.lastSaved = cloneDeep(resp || []);
        this.current = cloneDeep(resp || []);
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        this.saving = false;
      }
    },
    handleSelect(id) {
      let toggleActive = (item) => {
        item.active = !item.active;
        return item;
      };
      try {
        this.current[id] = this.current.map((item) => {
          item.category_id === id ? toggleActive(item) : item;
        });
      } catch (err) {
        Sentry.captureException(err);
      }
    },
    async refreshData() {
      this.loading = true;
      try {
        let resp = await GetCategories();
        this.lastSaved = cloneDeep(resp || []);
        this.current = cloneDeep(resp || []);
      } catch (err) {
        this.error = true;
        Sentry.captureException(err);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.refreshData();
  }
};
</script>
