<template>
  <div class="banner-form">
    <div class="row">
      <div class="col-12">
        <el-form
          class="bannerform"
          ref="form"
          :model="bannerform"
          label-width="140px"
        >
          <el-form-item v-if="isBannerLayoutCustom" :label="$t('type')">
            <el-radio-group
              v-model="bannerform.type"
              class="banner-type"
              size="small"
            >
              <el-radio class="main" label="main" border>{{
                $t("large")
              }}</el-radio>
              <el-radio class="sub" label="sub" border>{{
                $t("small")
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('category')">
            <div v-if="categoriesLoading" class="center">
              <card>
                <loader-dots></loader-dots>
              </card>
            </div>
            <template v-else-if="!editMode">
              <el-input
                :placeholder="$t('type to filter the list')"
                v-model="filterText"
              ></el-input>
              <div class="tree-container" data-id="banner-form:category-list">
                <el-tree
                  :data="categoriestree"
                  ref="categorytree"
                  :filter-node-method="filterNode"
                  node-key="id"
                  default-expand-all
                  :expand-on-click-node="true"
                  @node-click="categoryTreeClick"
                >
                  <span class="category-tree" slot-scope="{ node, data }">
                    <span style="width: 10em">{{ node.label.text }}</span>
                    <span>
                      <small>
                        {{ node.label.orders }}&nbsp;{{ $tc("sales", 2) }}
                      </small>
                    </span>
                    <span style="width: 8em">
                      <span
                        v-if="node.label.banner"
                        class="dc-tag dc-tag--warning"
                      >
                        {{ node.label.banner }}&nbsp;{{
                          $tc("banners", node.label.banner)
                        }}
                      </span>
                      <span
                        v-else-if="node.label.recommended"
                        class="dc-tag dc-tag--success"
                        >{{ $t("recommended") }}</span
                      >
                      <span
                        v-else
                        style="visibility: hidden"
                        class="dc-tag"
                      ></span>
                      <!-- <div v-else>&nbsp;</div> -->
                    </span>
                  </span>
                </el-tree>
              </div>
              <div>
                <small>{{ $t("# of sales is within the last 2 weeks") }}</small>
              </div>
            </template>
            <el-select
              v-else-if="editMode"
              @change="updateEditFormLink"
              v-model="bannerform.categoryJSON"
              placeholder="Select"
              filterable
            >
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.label.text"
                :value="item.json"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :error="categoryLinkError" :label="$t('link')">
            <el-input
              @blur="validateCategoryLink(bannerform.link)"
              :placeholder="$t('link')"
              v-model="bannerform.link"
            ></el-input>
          </el-form-item>

          <el-form-item :label="$t('image')">
            <banner-upload
              v-if="!editMode && !bannerUploading"
              :banner-layout="bannerLayout"
              @success="bannerUploadedToS3"
            ></banner-upload>
            <card v-else-if="editMode">
              <center>
                <img class="bannerimg" :src="editBannerform.photoURL" />
              </center>
            </card>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="row">
      <div class="col-12 button-row">
        <dc-button
          v-if="editMode"
          data-id="banner-form:edit-btn"
          :disabled="disableSave"
          type="primary"
          @click="editBanner"
        >
          <i class="ti-check"></i>
          &nbsp;{{ $t("update") }}
        </dc-button>
        <dc-button
          v-else
          data-id="banner-form:upload-btn"
          :disabled="disableSave"
          type="primary"
          @click="uploadBanner"
        >
          <i class="ti-plus"></i>
          &nbsp;{{ uploadBtnCaption }}
        </dc-button>
        <router-link to="/banners">
          <dc-button data-id="banner-form:cancel-btn" type="outline">
            <i class="ti-close"></i>
            &nbsp;{{ $t("cancel") }}
          </dc-button>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import * as Sentry from "@sentry/browser";
import { mapActions, mapGetters } from "vuex";

import DcButton from "@/components/DcButton.vue";
import BannerUpload from "@/components/BannerUpload.vue";
import LoaderDots from "@/components/LoaderDots.vue";

import { getPageData, postBanner, updateBanner } from "@/api/backend";

export default {
  name: "Banners",
  components: {
    DcButton,
    BannerUpload,
    LoaderDots,
  },

  data() {
    return {
      editMode: !!this.$route.params.bannerid,
      categoriestree: [],
      filterText: "",
      bannerUploading: false,
      categoriesLoading: true,
      error: false,
      uploadedPhoto: {
        uploadURL: null,
        id: null,
      },
      editBannerform: {
        photoURL: "", //fixed, user cannot modify the image when editing the banner
      },
      bannerform: {
        // values of create new banner
        type: "main",
        category: {},
        categoryJSON: "",
        link: null,
      },
      validatingCategoryLink: false,
      invalidCategoryLink: false,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.categorytree.filter(val);
    },
  },
  computed: {
    ...mapGetters(["client"]),
    ...mapGetters("settings", ["webSettings"]),
    disableSave() {
      return (
        this.validatingCategoryLink ||
        (this.editBanner
          ? false
          : !(this.uploadedPhoto && this.uploadedPhoto.id)) ||
        this.bannerUploading ||
        this.invalidCategoryLink
      );
    },
    categoryLinkError() {
      if (!this.invalidCategoryLink) {
        return "";
      }
      let link = `https://${this.client.domain}${this.bannerform.link}`;
      if (
        this.bannerform &&
        this.bannerform.link &&
        this.bannerform.link.startsWith("http")
      ) {
        link = this.bannerform.link;
      }
      return this.$t("category link {link} is invalid, please edit it", {
        link,
      });
    },
    categories() {
      if (!this.editMode) {
        return [];
      }
      let categories = [];
      this.categoriestree.forEach((elem) => {
        elem.children.forEach((child) => {
          child.json = JSON.stringify(child.label);
          categories.push(child);
        });
      });
      return categories;
    },
    uploadBtnCaption() {
      if (this.bannerUploading) {
        return this.$t("loading");
      } else {
        return this.$t("upload");
      }
    },
    bannerLayout() {
      try {
        // Api may return response without banners yet
        return this.webSettings.recommendations.banners.type;
      } catch (e) {
        return null;
      }
    },
    isBannerLayoutCustom() {
      return this.bannerLayout === "custom";
    },
  },
  methods: {
    ...mapActions("settings", ["getSettings"]),
    ...mapActions("validators", ["verifyWebsite"]),

    filterNode(value, data) {
      if (!value) return true;
      const label = `${data.label.text} ${
        data.label.recommended ? "recommended" : ""
      } ${data.label.banner ? "banner exists" : ""}`;
      return label.toLocaleLowerCase().indexOf(value) !== -1;
    },
    updateEditFormLink() {
      try {
        const catJSON = JSON.parse(this.bannerform.categoryJSON);
        this.bannerform.link = this.getLink(catJSON.link);
      } catch (e) {
        Sentry.captureException(e);
      }
    },
    validateCategoryLink(link) {
      if (!link) {
        this.invalidCategoryLink = true;
        return;
      }
      this.validatingCategoryLink = true;
      this.invalidCategoryLink = false;
      let url = `https://${this.client.domain}${link}`;
      if (link.startsWith("http")) {
        url = link;
      }
      // this.verifyWebsite(url)
      //   .catch(err => {
      //     console.log(err);
      //     this.invalidCategoryLink = true;
      //   })
      //   .finally(() => {
      //     this.validatingCategoryLink = false;
      //   });
      this.validatingCategoryLink = false;
    },
    getLink(link) {
      link = encodeURI(link);
      this.validateCategoryLink(link);
      return link;
    },
    categoryTreeClick(node) {
      this.bannerform.category.category_id = node.label.category_id;
      this.bannerform.link = this.getLink(node.label.link);
    },
    uploadBanner() {
      if (
        !(
          this.bannerform.category &&
          this.bannerform.category.category_id &&
          this.bannerform.link &&
          this.bannerform.type
        )
      ) {
        this.$notify({
          title: this.$t("incomplete form"),
          message: this.$t("please fill in the product category and link"),
          type: "warning",
        });
        return;
      }
      if (!this.uploadedPhoto.uploadURL) {
        this.$notify({
          title: this.$t("No banner image"),
          message: this.$t("please upload a banner image first"),
          type: "warning",
        });
        return;
      }
      this.bannerUploading = true; // sets button label to 'loading...'
      const element = this.uploadedPhoto;
      const photoURL = element["uploadURL"].replace(
        "datacue-js.s3.amazonaws.com",
        "cdn.datacue.co"
      );
      postBanner({
        banner_id: this.slugify(element["id"]),
        active: true,
        photo_url: photoURL,
        type: this.bannerform.type,
        category_1: this.bannerform.category.category_id,
        link: this.bannerform.link,
      })
        .then(() => {
          // clear form
          this.$notify({
            title: this.$t("success"),
            message: this.$t("banner uploaded"),
            type: "success",
          });

          this.bannerform.category = {};
          this.bannerform.link = null;
          this.uploadedPhoto = {
            uploadURL: null,
            id: null,
          };

          this.refreshData();
          this.bannerUploading = false;
        })
        .catch((e) => {
          this.bannerUploading = false;
          if (e.response && e.response.data) {
            const data = e.response.data;
            if (data.code == "invalid" && data.field == "link") {
              this.invalidCategoryLink = true;
              return;
            }
          }
          Sentry.captureException(e);
          this.$notify({
            title: this.$t("error uploading"),
            message: this.$t(
              "an unknown error occured, please try again later"
            ),
            type: "warning",
          });
        });
    },
    editBanner() {
      this.bannerUploading = true;
      const category = JSON.parse(this.bannerform.categoryJSON);
      const banner = {
        type: this.bannerform.type,
        category_id: category.category_id,
        link: this.bannerform.link,
      };
      updateBanner(this.$route.params.bannerid, banner)
        .then(() => {
          this.$notify({
            title: this.$t("success"),
            message: this.$t("banner updated"),
            type: "success",
          });
          this.bannerUpdating = false;
          this.$router.push({ name: "banners" });
        })
        .catch((e) => {
          this.bannerUpdating = false;
          Sentry.captureException(e);
          this.$notify({
            title: this.$t("error"),
            message: this.$t(
              "we could not update the banner, please try again later"
            ),
            type: "warning",
          });
        });
    },
    bannerUploadedToS3(payload) {
      this.uploadedPhoto = payload["file"];
      if (!this.isBannerLayoutCustom) {
        this.bannerform.type = payload["banner_type"];
      }
    },
    async refreshData() {
      let bannerToEdit = {};
      let categories = {};
      this.categoriesLoading = true;
      try {
        const reqSettings = this.getSettings();
        const reqCategories = getPageData("banners/categories");
        if (this.editMode) {
          const reqBannerData = getPageData(
            `banners/${this.$route.params.bannerid}`
          );
          let resp = [
            await reqSettings,
            await reqCategories,
            await reqBannerData,
          ];
          categories = resp[1];
          bannerToEdit = resp[2];
          this.editBannerform.photoURL = bannerToEdit.photo_url;
          this.bannerform.type = bannerToEdit.type;
          this.bannerform.category = {
            category_id: bannerToEdit.category_id,
          };
          this.bannerform.link = bannerToEdit.link;
        } else {
          let resp = [await reqSettings, await reqCategories];
          categories = resp[1];
        }
      } catch (e) {
        Sentry.captureException(e);
      }
      if (!this.bannerLayout) {
        this.$notify({
          title: this.$t("incomplete form"),
          message: this.$t("please select your banner layout first"),
          type: "warning",
        });
        this.$router.push({ name: "banners settings" });
      }
      //we build the tree data from the api response
      //the tree requires a unique id for each node - we use the category label for that
      //all other meta data like if the category is recommended, how many orders it had etc
      //are stored as an object in the label
      try {
        let categorytree = [];
        categorytree.push({
          id: "category_id",
          label: { text: this.$t("category") },
          children: categories.map((item) => {
            return {
              id: item.id,
              label: {
                text: item.label,
                category_id: item.category_id,
                link: item.link,
                recommended: item.recommended,
                orders: item.orders,
                banner: item.banner,
              },
            };
          }),
        });

        this.categoriestree = categorytree;
        let filteredCategories = this.categories.filter(
          (elem) => elem.id === this.bannerform.category.category_id
        );

        // match banner details to bannerform
        if (filteredCategories.length > 0) {
          this.bannerform.categoryJSON = filteredCategories[0].json;
        }
      } catch (e) {
        Sentry.captureException(e);
      } finally {
        this.categoriesLoading = false;
      }
    },
    slugify(str) {
      str = str.replace(/^\s+|\s+$/g, ""); // trim
      str = str.toLowerCase();

      // remove accents, swap ñ for n, etc
      const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
      const to = "aaaaeeeeiiiioooouuuunc------";

      for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
      }

      str = str
        .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
        .replace(/\s+/g, "-") // collapse whitespace and replace by -
        .replace(/-+/g, "-"); // collapse dashes

      return str;
    },
  },
  mounted() {
    this.refreshData();
  },
};
</script>
<style lang="scss">
@import "@/assets/sass/datacue/_colors.scss";
.el-form-item__label {
  text-align: left;
}
.centered {
  flex: 1;
  justify-content: space-around;
  display: flex;
  align-items: center;
}
.indent {
  padding-left: 1em;
}
.tree-container {
  max-height: 35vh;
  min-height: 10vh;
  overflow-y: auto;
}
.category-tree {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1em;
  padding-right: 0.5em;
  height: 32px;
}
.dc-tag {
  background-color: rgba(64, 158, 255, 0.1);
  padding: 0 10px;
  height: 32px;
  line-height: 30px;
  font-size: 12px;
  color: $dark;
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid rgba(64, 158, 255, 0.2);
}
.dc-tag--success {
  background-color: rgba(103, 194, 58, 0.1);
  border-color: rgba(103, 194, 58, 0.2);
  color: $green;
}
.dc-tag--warning {
  background-color: rgba(230, 162, 60, 0.1);
  border-color: rgba(230, 162, 60, 0.2);
  color: $orange;
}

div.banner-type {
  display: flex;
  align-items: center;
}

label.el-radio.main {
  width: 200px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

label.el-radio.sub {
  width: 80px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.banner-type > .el-radio.is-bordered.is-checked {
  border-color: #f8ba00;
  border-width: 2px;
}

.banner-type > .el-radio.is-bordered {
  border: 1px solid #aaa;
}
.banner-type > .el-radio {
  padding: 10px;
}
.banner-type > label > .el-radio__input + .el-radio__label {
  font-size: 1.1em;
}
.banner-type > label > .el-radio__input.is-checked + .el-radio__label {
  color: #f8ba00;
  font-weight: bold;
}
.banner-type > label > .el-radio__input {
  display: none;
}
.banner-type > label > .el-radio__label {
  padding: 0px;
}
.button-row > button {
  margin-right: 10px;
}
img.bannerimg {
  max-height: 200px;
  max-width: 100%;
}
.bannerform > .el-select {
  width: 100%;
}
.banner-form {
  padding-top: 1em;
}
</style>
