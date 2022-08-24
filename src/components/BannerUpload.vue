<template>
  <div>
    <dropzone
      data-id="banner-form:image-dropzone"
      :max-files="1"
      :custom-layout="bannerLayout === 'custom'"
      :options="dropzoneOptions"
      @success="success"
      @removedfile="removedFile"
    ></dropzone>
    <card-message-box v-if="fileSizeExceeded" type="error">
      <p>
        {{
          $t(
            "the image you uploaded is too large, this will slow down your website's loading time"
          )
        }}.
        {{
          $t(
            "instead, use an image optimization tool to reduce the image size and upload it again"
          )
        }}.
      </p>
    </card-message-box>
    <card-message-box v-if="invalidFormat" type="error">
      <p>
        {{
          $t("your image has an invalid format of '{format}'", {
            format: this.invalidFormat
          })
        }}.
        {{
          $t("the supported image formats are '{formats}'", {
            formats: validFormats.join(", ")
          })
        }}.
      </p>
      <p>
        {{ $t("please click") }}
        <a :href="bannerHelpLink" target="_blank">{{ $t("here") }}</a>
        {{ $t("for more info") }}.
      </p>
    </card-message-box>
    <card-message-box v-if="invalidRatio" type="error">
      <p>
        {{
          $t("your image has invalid dimension ratio of '{ratio}'", {
            ratio: this.invalidRatio
          })
        }}.
        {{
          $t("the supported dimension ratios are", {
            ratios: validRatios.join(", ")
          })
        }}.
      </p>
      <p>
        {{ $t("please click") }}
        <a :href="bannerHelpLink" target="_blank">{{ $t("here") }}</a>
        {{ $t("for more info") }}.
      </p>
    </card-message-box>
    <card-message-box v-else-if="invalidRatioForBannerLayout" type="error">
      <p>
        {{
          $t(
            "you selected the 'low' banner layout which doesn't support this banner size.",
            {
              layout: $t(bannerLayout)
            }
          )
        }}
        {{ $t("the supported dimension ratios are '2:3'") }}
      </p>
      <p>
        {{ $t("please click") }}
        <a :href="bannerHelpLink" target="_blank">{{ $t("here") }}</a>
        {{ $t("for more info") }}.
      </p>
    </card-message-box>
  </div>
</template>
<script>
import * as Sentry from "@sentry/browser";
import { mapGetters } from "vuex";

import Dropzone from "/src/components/Dropzone.vue";

import { preSign } from "/src/api/backend";
import { getRatio } from "/src/api/utils";

import CardMessageBox from "/src/components/Cards/CardMessageBox";

const allowedRatios = {
  "2:3": "sub",
  "5:3": "main"
};
export default {
  components: {
    CardMessageBox,
    Dropzone
  },
  data() {
    const vm = this;
    return {
      bannerType: "",
      invalidFormat: null,
      invalidRatio: null,
      invalidRatioForBannerLayout: null,
      fileSizeExceeded: false,
      dropzoneOptions: {
        maxFilesize: 1,
        maxFiles: 1,
        init: function () {
          this.on("addedfile", function () {
            this.fileSizeExceeded = false;
            while (this.files.length > this.options.maxFiles) {
              this.removeFile(this.files[0]);
            }
            const file = this.files[0];
            const fileSize = file.size / 1024 ** 2;
            if (fileSize > this.options.maxFilesize) {
              vm.fileSizeExceeded = true;
            }
          });
        },
        accept: function (file, done) {
          vm.validateImage(file)
            .then(() => {
              // Here we request a signed upload URL when a file being accepted
              let fileName = file.name;
              if (vm.staticBanner) {
                fileName = "static-banner.jpg";
              }
              preSign("banners", fileName, file.type)
                .then((res) => {
                  vm.$emit("started");
                  if (res.url && res.key) {
                    file.uploadURL = res.url;
                    done();
                  } else {
                    done(
                      "Failed to get an S3 signed URL",
                      Error("url and ref don't match")
                    );
                  }
                  // Manually process each file
                  setTimeout(() => this.processFile(file));
                })
                .catch((err) => {
                  done("Failed to get an S3 signed upload URL", err);
                  Sentry.captureException(err);
                });
            })
            .catch((error) => {
              Sentry.captureException(error);
            });
        }
      }
    };
  },
  props: {
    bannerLayout: {
      type: String
    },
    staticBanner: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(["languageCode"]),
    validRatios() {
      if (this.staticBanner) {
        return ["5:3"];
      }
      return Object.keys(allowedRatios);
    },
    validFormats() {
      if (this.staticBanner) {
        return ["image/jpeg"];
      }
      return ["image/png", "image/jpeg"];
    },
    validRatiosForBannerLayout() {
      if (this.bannerLayout === "low") {
        return Object.keys(allowedRatios).filter((elem) => elem === "2:3");
      }
      return this.validRatios;
    },
    bannerHelpLink() {
      let languageShortCode = "";
      if (["es"].includes(this.languageCode)) {
        languageShortCode = this.languageCode + "/";
      }

      return `https://help.datacue.co/${languageShortCode}guide/banners.html`;
    }
  },
  methods: {
    validateImage(file) {
      this.invalidRatio = null;
      return new Promise((resolve, reject) => {
        if (this.bannerLayout === "custom") {
          return resolve();
        }
        if (!this.validFormats.includes(file.type)) {
          this.invalidFormat = file.type;
          reject(file.type);
        }
        const fr = new FileReader();
        fr.onload = () => {
          const img = new Image();
          img.onload = () => {
            const ratio = getRatio(img.width, img.height);
            if (!this.validRatios.includes(ratio)) {
              this.invalidRatio = ratio;
              reject(ratio);
            } else {
              if (!this.validRatiosForBannerLayout.includes(ratio)) {
                this.invalidRatioForBannerLayout = ratio;
              }
              this.bannerType = allowedRatios[ratio];
              resolve(ratio);
            }
          };
          img.src = fr.result;
        };
        fr.readAsDataURL(file);
      });
    },
    removedFile() {
      this.invalidFormat = null;
      this.invalidRatio = null;
      this.invalidRatioForBannerLayout = null;
      this.fileSizeExceeded = false;
    },
    success(file) {
      // convert filename into an id by stripping the file extension
      file.uploadURL = file.uploadURL.split("?")[0];
      const urlParts = file.uploadURL.split("/");
      const filename = urlParts[urlParts.length - 1];
      file["id"] = decodeURI(filename);
      this.$emit("success", { file, banner_type: this.bannerType });
    }
  }
};
</script>
<style scoped>
.dropzone .dz-preview .dz-error-message {
  top: -140px !important;
}
.dz-error-message:after {
  border-top: 6px solid #be2626 !important;
  border-bottom: none !important;
  top: 133px !important;
}
</style>
