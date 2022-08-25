<template>
  <div>
    <div v-if="windowWidth < 700" class="row">
      <div class="col-xs-12">
        <card :title="$t('not enough screen space')">
          <div class="row">
            <div
              class="col-2 icon-danger icon-big text-center align-self-center"
            >
              <i class="ti-alert"></i>
            </div>
            <div class="col-10 align-self-center">
              <p>
                {{
                  $t(
                    "you need a larger screen / window size to view the email editor"
                  )
                }}
              </p>
            </div>
          </div>
        </card>
      </div>
    </div>
    <div v-else class="editor">
      <section class="preview">
        <div class="preview-toolbar">
          <header>
            <span v-if="this.emailSettings.mailing_address">
              <strong>{{ $t("from") }}:</strong>
              &lt;{{ this.emailSettings.mailing_address }}&gt;
            </span>
            <span>
              <strong>{{ $t("subject") }}:</strong>
              {{ campaign.subject }}
            </span>
          </header>
          <aside>
            <div class="radio-group preview-size">
              <input
                id="preview-size-mobile"
                type="radio"
                name="preview-size"
                v-model="preview.size"
                value="mobile"
              />
              <label for="preview-size-mobile">
                <img svg-inline src="@/assets/img/email/icon-mobile.svg" />
                <span class="sr-only">{{ $t("preview:mobile") }}</span>
              </label>
              <input
                id="preview-size-desktop"
                type="radio"
                name="preview-size"
                v-model="preview.size"
                value="desktop"
              />
              <label for="preview-size-desktop">
                <img svg-inline src="@/assets/img/email/icon-desktop.svg" />
                <span class="sr-only">{{ $t("preview:desktop") }}</span>
              </label>
            </div>
          </aside>
        </div>
        <mjml-preview
          :template="preview.template"
          :size="preview.size"
          :editorState="editor"
        />
      </section>
      <div class="panel">
        <nav class="panel-tabs">
          <button
            type="button"
            class="panel-tab"
            :class="{ active: pane === 'content' }"
            data-id="editor:content-tab-btn"
            @click="pane = 'content'"
          >
            <img svg-inline src="@/assets/img/email/icon-content.svg" />
            {{ $t("content") }}
          </button>
          <button
            type="button"
            class="panel-tab"
            :class="{ active: pane === 'design' }"
            data-id="editor:design-tab-btn"
            @click="pane = 'design'"
          >
            <img svg-inline src="@/assets/img/email/icon-design.svg" />
            {{ $t("design") }}
          </button>
          <button
            type="button"
            class="panel-tab"
            :class="{ active: pane === 'settings' }"
            data-id="editor:settings-tab-btn"
            @click="pane = 'settings'"
          >
            <img svg-inline src="@/assets/img/email/icon-settings.svg" />
            {{ $t("settings") }}
          </button>
        </nav>
        <div class="pane content" v-show="pane === 'content'">
          <label class="main-label" for="campaign-subject">
            {{ $t("subject") }}
            <span v-if="validate && !campaign.subject" class="validation-error"
              >({{ $t("cannot be empty") }})</span
            >
          </label>
          <input
            id="campaign-subject"
            type="text"
            v-model="campaign.subject"
            data-id="editor:subject-input"
            :placeholder="$t('edit email subject here')"
          />
          <div class="heading-container">
            <label class="main-label" for="content-logo">
              {{ $t("logo") }}
              <span
                v-if="validate && !editor.content.logo"
                class="validation-error"
                >({{ $t("cannot be empty") }})</span
              >
            </label>
            <el-button
              v-if="editor.content.logo"
              circle
              size="small"
              data-id="editor:clear-logo-btn"
              @click="editor.content.logo = null"
            >
              <i class="ti-trash"></i>
            </el-button>
          </div>
          <el-upload
            id="content-logo"
            drag
            action
            accept="image/jpeg, image/png"
            :show-file-list="false"
            :http-request="handleLogo"
            data-id="editor:upload-logo-btn"
            :class="{ uploading: uploading.logo }"
          >
            <img
              v-if="editor.content.logo"
              class="upload-logo"
              :src="editor.content.logo.src"
            />
            <div class="upload-hint">
              <span>{{ $t("upload logo") }}</span>
              <div v-if="uploading.logo" class="upload-spinner"></div>
              <img v-else svg-inline src="@/assets/img/email/icon-upload.svg" />
            </div>
          </el-upload>
          <label class="main-label" for="content-heading">
            {{ $t("heading") }}
            <span
              v-if="validate && !editor.content.heading"
              class="validation-error"
              >({{ $t("cannot be empty") }})</span
            >
          </label>
          <input
            id="content-heading"
            type="text"
            v-model="editor.content.heading"
            data-id="editor:heading-input"
            :placeholder="$t('edit your heading here')"
          />
          <div class="heading-container">
            <label class="main-label" for="content-cover">
              {{ $t("cover photo") }}
              <span
                v-if="validate && !editor.content.cover"
                class="validation-error"
                >({{ $t("cannot be empty") }})</span
              >
            </label>
            <el-button
              v-if="editor.content.cover"
              size="small"
              circle
              data-id="editor:clear-cover-photo-btn"
              @click="editor.content.cover = null"
            >
              <i class="ti-trash"></i>
            </el-button>
          </div>
          <el-upload
            id="content-cover"
            drag
            action
            accept="image/jpeg, image/png"
            :show-file-list="false"
            :http-request="handleCoverPhoto"
            data-id="editor:upload-cover-photo"
            :class="{ uploading: uploading.cover }"
          >
            <img
              v-if="editor.content.cover"
              class="upload-cover"
              :src="editor.content.cover.src"
            />
            <div class="upload-hint">
              <span>{{ $t("upload cover photo") }}</span>
              <div v-if="uploading.cover" class="upload-spinner"></div>
              <img v-else svg-inline src="@/assets/img/email/icon-upload.svg" />
              <small>{{ $t("recommended width 560px") }}</small>
            </div>
          </el-upload>
          <label class="main-label" for="content-body">
            {{ $t("main body") }}
            <span
              v-if="validate && !editor.content.body"
              class="validation-error"
              >({{ $t("cannot be empty") }})</span
            >
          </label>
          <textarea
            id="content-body"
            data-id="editor:content-body-input"
            v-model="editor.content.body"
            :placeholder="$t('edit your main text here')"
          ></textarea>
          <label class="main-label" for="content-button-text">
            {{ $t("button text") }}
            <span
              v-if="validate && !editor.content.button"
              class="validation-error"
              >({{ $t("cannot be empty") }})</span
            >
          </label>
          <input
            id="content-button-text"
            type="text"
            v-model="editor.content.button"
            data-id="editor:button-caption-btn"
            :placeholder="$t('edit button captions here')"
          />
          <label class="main-label" for="content-footer">{{
            $t("footer")
          }}</label>
          <textarea
            id="content-footer"
            v-model="editor.content.footer"
            data-id="editor:content-footer-input"
            :placeholder="$t('edit your footer here')"
          ></textarea>
        </div>
        <div class="pane settings" v-show="pane === 'design'">
          <label class="main-label">{{ $t("theme") }}</label>
          <label class="sub-label" for="settings-main-color">{{
            $t("main color")
          }}</label>
          <div class="color-picker">
            <el-color-picker
              size="small"
              v-model="editor.settings.mainColor"
              data-id="editor:main-color-picker"
            />
            <input
              id="settings-main-color"
              type="text"
              v-model="editor.settings.mainColor"
              data-id="editor:main-color-input"
              readonly
            />
          </div>
          <label class="sub-label" for="settings-logo-background">{{
            $t("logo background")
          }}</label>
          <label class="switch">
            <input
              id="settings-logo-background"
              type="checkbox"
              v-model="editor.settings.logoBackground"
              data-id="editor:logo-background-checkbox"
            />
            <div class="switch-track">
              <!-- <span>
              {{ $t(editor.settings.logoBackground ? "on" : "off") }}
              </span>-->
            </div>
          </label>
          <hr />
          <label class="main-label">{{ $t("typography") }}</label>
          <label class="sub-label" for="settings-font">{{ $t("font") }}</label>
          <select
            id="settings-font"
            v-model="editor.settings.font"
            :style="`font-family: ${editor.settings.font}`"
            data-id="editor:main-font-select"
          >
            <option
              v-for="font in [
                { name: 'Arial', fallback: 'sans-serif' },
                { name: 'Helvetica', fallback: 'sans-serif' },
                { name: 'Tahoma', fallback: 'sans-serif' },
                { name: 'Verdana', fallback: 'sans-serif' },
                { name: 'Times New Roman', fallback: 'serif' },
                { name: 'Georgia', fallback: 'serif' },
                { name: 'Courier', fallback: 'monospace' },
              ]"
              :key="font.name"
              :value="`'${font.name}', ${font.fallback}`"
              :style="`font-family: '${font.name}', ${font.fallback}`"
            >
              {{ font.name }}
            </option>
          </select>
          <label class="sub-label">{{ $t("heading size") }}</label>
          <div class="radio-group">
            <input
              id="heading-size-small"
              type="radio"
              name="heading-size"
              v-model="editor.settings.headingSize"
              value="small"
              data-id="editor:heading-size-small-radio"
            />
            <label for="heading-size-small">
              <img svg-inline src="@/assets/img/email/size-small.svg" />
              <span class="sr-only">{{ $t("size:small") }}</span>
            </label>
            <input
              id="heading-size-medium"
              type="radio"
              name="heading-size"
              v-model="editor.settings.headingSize"
              value="medium"
              data-id="editor:heading-size-medium-radio"
            />
            <label for="heading-size-medium">
              <img svg-inline src="@/assets/img/email/size-medium.svg" />
              <span class="sr-only">{{ $t("size:medium") }}</span>
            </label>
            <input
              id="heading-size-large"
              type="radio"
              name="heading-size"
              v-model="editor.settings.headingSize"
              value="large"
              data-id="editor:heading-size-large-radio"
            />
            <label for="heading-size-large">
              <img svg-inline src="@/assets/img/email/size-large.svg" />
              <span class="sr-only">{{ $t("size:large") }}</span>
            </label>
          </div>
          <label class="sub-label" for="settings-heading-bold">{{
            $t("heading bold")
          }}</label>
          <label class="switch">
            <input
              id="settings-heading-bold"
              type="checkbox"
              v-model="editor.settings.headingBold"
              data-id="editor:heading-bold-checkbox"
            />
            <div class="switch-track">
              <!-- <span>{{ $t(editor.settings.headingBold ? "on" : "off") }}</span> -->
            </div>
          </label>
          <label class="sub-label">{{ $t("heading alignment") }}</label>
          <div class="radio-group">
            <input
              id="heading-align-left"
              type="radio"
              name="heading-align"
              v-model="editor.settings.headingAlign"
              value="left"
              data-id="editor:heading-align-left-radio"
            />
            <label for="heading-align-left">
              <img svg-inline src="@/assets/img/email/alignment-left.svg" />
              <span class="sr-only">{{ $t("align:left") }}</span>
            </label>
            <input
              id="heading-align-center"
              type="radio"
              name="heading-align"
              v-model="editor.settings.headingAlign"
              value="center"
              data-id="editor:heading-align-center-radio"
            />
            <label for="heading-align-center">
              <img svg-inline src="@/assets/img/email/alignment-center.svg" />
              <span class="sr-only">{{ $t("align:center") }}</span>
            </label>
            <input
              id="heading-align-right"
              type="radio"
              name="heading-align"
              v-model="editor.settings.headingAlign"
              value="right"
              data-id="editor:heading-align-right-radio"
            />
            <label for="heading-align-right">
              <img svg-inline src="@/assets/img/email/alignment-right.svg" />
              <span class="sr-only">{{ $t("align:right") }}</span>
            </label>
            <input
              id="heading-align-justify"
              type="radio"
              name="heading-align"
              v-model="editor.settings.headingAlign"
              value="justify"
              data-id="editor:heading-align-justify-radio"
            />
            <label for="heading-align-justify">
              <img svg-inline src="@/assets/img/email/alignment-justify.svg" />
              <span class="sr-only">{{ $t("align:justify") }}</span>
            </label>
          </div>
          <label class="sub-label">{{ $t("main text alignment") }}</label>
          <div class="radio-group">
            <input
              id="body-align-left"
              type="radio"
              name="body-align"
              v-model="editor.settings.bodyAlign"
              value="left"
              data-id="editor:body-align-left-radio"
            />
            <label for="body-align-left">
              <img svg-inline src="@/assets/img/email/alignment-left.svg" />
              <span class="sr-only">{{ $t("align:left") }}</span>
            </label>
            <input
              id="body-align-center"
              type="radio"
              name="body-align"
              v-model="editor.settings.bodyAlign"
              value="center"
              data-id="editor:body-align-center-radio"
            />
            <label for="body-align-center">
              <img svg-inline src="@/assets/img/email/alignment-center.svg" />
              <span class="sr-only">{{ $t("align:center") }}</span>
            </label>
            <input
              id="body-align-right"
              type="radio"
              name="body-align"
              v-model="editor.settings.bodyAlign"
              value="right"
              data-id="editor:body-align-right-radio"
            />
            <label for="body-align-right">
              <img svg-inline src="@/assets/img/email/alignment-right.svg" />
              <span class="sr-only">{{ $t("align:right") }}</span>
            </label>
            <input
              id="body-align-justify"
              type="radio"
              name="body-align"
              v-model="editor.settings.bodyAlign"
              value="justify"
              data-id="editor:body-align-justify-radio"
            />
            <label for="body-align-justify">
              <img svg-inline src="@/assets/img/email/alignment-justify.svg" />
              <span class="sr-only">{{ $t("align:justify") }}</span>
            </label>
          </div>
          <label class="sub-label" for="settings-discount-color">{{
            $t("discount price color")
          }}</label>
          <div class="color-picker">
            <el-color-picker
              size="small"
              v-model="editor.settings.discountColor"
              data-id="editor:discount-color-picker"
            />
            <input
              id="settings-discount-color"
              type="text"
              v-model="editor.settings.discountColor"
              data-id="editor:discount-color-input"
              readonly
            />
          </div>
        </div>
        <div class="pane settings" v-show="pane === 'settings'">
          <label class="main-label">
            {{ $t("send after") }}
            <span
              v-if="validate && !campaign.rules.delay"
              class="validation-error"
              >({{ $t("must be greater than 0") }})</span
            >
          </label>
          <label class="sub-label">{{ $t("days since last purchase") }}</label>
          <input
            id="rules-delay"
            type="number"
            min="0"
            v-model.number="campaign.rules.delay"
            data-id="editor:rules-delay-input"
          />
          <transition name="fade">
            <p key="1" class="note" v-if="estimatedReachLoading">
              {{ $t("loading") }}
            </p>
            <p key="2" class="note" v-else-if="estimatedReach === 0">
              {{
                $t(
                  "no eligible users found, you may have insufficient subscribers."
                )
              }}
            </p>
            <p key="3" class="note" v-else>
              {{ $t("users match criteria", { count: estimatedReach }) }}
            </p>
          </transition>
        </div>
        <el-button
          round
          type="warning"
          class="launch"
          @click="toggleActive"
          data-id="editor:launch-campaign-btn"
          >{{
            $t(`${campaign.active ? "deactivate" : "launch"} campaign`)
          }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import omit from "lodash/omit";
import axios from "axios";
import imageSize from "browser-image-size";
import * as Sentry from "@sentry/browser";
import { mapGetters, mapActions } from "vuex";

import MjmlPreview from "@/components/MjmlPreview.vue";

import { getPageData, putCampaign, preSign } from "@/api/backend";
import { getTemplateTypes, buildTemplateMjml } from "@/api/template-builder";

const SHOW_TIPS_STORAGE_KEY = "datacue-dashboard-showTips";

export default {
  name: "Editor",
  components: {
    MjmlPreview,
  },
  data: function () {
    return {
      pane: "content",
      preview: {
        template: getTemplateTypes().WE_MISS_YOU,
        size: "desktop",
      },
      uploading: {
        logo: false,
        cover: false,
      },
      campaign: {
        name: "",
        subject: "",
        active: false,
        rules: {
          delay: 0,
        },
      },
      editor: {
        content: {
          heading: "",
          body: "",
          button: "",
          footer: "",
          logo: null,
          cover: null,
          unsubscribeText: this.$t("click to unsubscribe"),
        },
        settings: {
          mainColor: "#f8d188",
          logoBackground: true,
          font: "'Arial', sans-serif",
          headingSize: "medium",
          headingAlign: "center",
          headingBold: false,
          bodyAlign: "left",
          discountColor: "#ff5c77",
        },
      },
      validate: false,
      windowWidth: 1024,
      estimatedReach: 0,
      estimatedReachLoading: 0,
      tips: {
        preview: null,
        autosave: null,
      },
      showTips: JSON.parse(
        window.localStorage.getItem(SHOW_TIPS_STORAGE_KEY)
      ) || {
        preview: true,
        autosave: true,
      },
      cleanup: false,
    };
  },
  watch: {
    editor: {
      handler: "autoSave",
      deep: true,
    },
    campaign: {
      handler: "autoSave",
      deep: true,
    },
    "campaign.rules": {
      handler: "updateEstimatedReach",
      deep: true,
    },
  },
  computed: {
    ...mapGetters("settings", ["emailSettings"]),
    hasErrors: function () {
      const requiredFields = ["logo", "heading", "cover", "body", "button"];
      return (
        !this.campaign.subject ||
        !this.campaign.rules.delay ||
        requiredFields.some((field) => !this.editor.content[field])
      );
    },
  },
  methods: {
    ...mapActions("settings", ["fetchEmailSettings"]),
    handleLogo({ file }) {
      this.handleImageUpload("logo", file);
    },
    handleCoverPhoto({ file }) {
      this.handleImageUpload("cover", file);
    },
    handleImageUpload(slot, file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        return;
      }

      this.uploading[slot] = true;
      preSign("images", file.name, file.type)
        .then((res) =>
          axios
            .request({
              url: res.url,
              method: "put",
              data: file,
              responseType: "text",
              headers: {
                "Content-Type": file.type,
              },
            })
            .then(async () => {
              try {
                const { width, height } = await imageSize(file);
                this.editor.content[slot] = {
                  src: `https://cdn.datacue.co/${res.key}`,
                  width,
                  height,
                };
              } catch (err) {
                Sentry.captureException(err);
                this.$notify({
                  title: this.$t("error uploading"),
                  message: this.$t(
                    "an unknown error occured, please try again later"
                  ),
                  type: "warning",
                });
              }
            })
        )
        .finally(() => {
          this.uploading[slot] = false;
        });
    },
    closeTip(tip) {
      if (!this.cleanup) {
        if (this.tips[tip]) {
          this.tips[tip] = null;
        }

        this.showTips[tip] = false;
        window.localStorage.setItem(
          SHOW_TIPS_STORAGE_KEY,
          JSON.stringify(this.showTips)
        );
      }
    },
    toggleActive() {
      if (this.campaign.active) {
        this.campaign.active = false;
        return;
      }

      this.validate = true;

      if (this.hasErrors) {
        if (!this.campaign.rules.delay) {
          this.pane = "settings";
        } else {
          this.pane = "content";
        }
      } else {
        this.campaign.active = true;
      }
    },
    updateEstimatedReach: debounce(function () {
      this.estimatedReachLoading = true;
      getPageData(
        `campaigns/${this.$route.params.campaignid}/reach?delay=${this.campaign.rules.delay}`
      )
        .then((res) => {
          this.estimatedReach = res.reach;
        })
        .finally(() => {
          this.estimatedReachLoading = false;
        });
    }, 1000),
    autoSave: debounce(function () {
      putCampaign(this.$route.params.campaignid, {
        name: "We miss you",
        subject:
          this.campaign.subject.replace(/\{+%+|%+\}+/g, "") || "We miss you",
        rules: JSON.stringify({
          ...this.campaign.rules,
          editor: this.editor,
        }),
        template: buildTemplateMjml(
          this.preview.template,
          this.editor,
          "jinja"
        ),
        active: !this.hasErrors && this.campaign.active,
      }).catch(() => {
        this.$notify({
          title: this.$t("error"),
          message: this.$t("could not save"),
          type: "warning",
        });
      });
    }, 1500),
  },
  mounted() {
    // FIXME attach event listeners properly and clean on unmount
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };

    (async () => {
      for (let tip of ["preview", "autosave"]) {
        if (this.showTips[tip]) {
          await this.$nextTick();

          this.tips[tip] = this.$notify({
            message: this.$t(`${tip} tip`),
            type: "info",
            duration: 0,
            onClose: () => this.closeTip(tip),
          });
        }
      }
    })();
    getPageData(`campaigns/${this.$route.params.campaignid}`).then((res) => {
      this.campaign = {
        ...this.campaign,
        name: res.name,
        subject: res.subject,
        active: res.active || false,
        rules: {
          ...this.campaign.rules,
          ...omit(res.rules, "editor"),
        },
      };

      if (res.rules && res.rules.editor) {
        this.editor = {
          content: {
            ...this.editor.content,
            ...res.rules.editor.content,
          },
          settings: {
            ...this.editor.settings,
            ...res.rules.editor.settings,
          },
        };
      }

      this.updateEstimatedReach();
    });

    if (!this.emailSettings.mailing_address) {
      this.fetchEmailSettings();
    }
  },
  beforeUnmount() {
    this.cleanup = true;
    ["preview", "autosave"].forEach((tip) => {
      if (this.tips[tip]) {
        this.tips[tip].close();
      }
    });
  },
};
</script>

<style scoped>
@keyframes datacue-spinner {
  from {
    opacity: 1;
    transform: rotateZ(0);
  }

  50% {
    opacity: 0.5;
  }

  to {
    opacity: 1;
    transform: rotateZ(360deg);
  }
}

.editor {
  position: relative;
  display: grid;
  grid-gap: 20px;
  grid-auto-flow: column;
  grid-template-columns:
    [preview] 1fr
    [panel] minmax(400px, 500px);
  color: #192024;
}

.preview {
  grid-column: preview;
  align-self: flex-start;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

.preview-toolbar {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
  border: 1px solid #404047;
  padding: 0 20px;
  background-color: white;
}

.preview-toolbar > header > span {
  margin-right: 20px;
}

.preview-size {
  width: 80px;
}

.panel {
  grid-column: panel;
}

.panel-tabs {
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  height: 50px;
  font-size: 16px;
}

.panel-tab {
  flex: 1 1 0;
  height: 40px;
  border: 1px solid #404047;
  border-right-width: 0;
  padding: 0;
  color: #80848e;
  background-color: #efefef;
}

.panel-tab:last-child {
  border-right-width: 1px;
}

.panel-tab svg {
  height: 15px;
  margin-top: -2px;
  fill: #80848e;
}

.panel-tab.active {
  height: 50px;
  border-right-width: 1px;
  border-bottom: 0 none;
  font-weight: bold;
  color: #192024;
  background-color: white;
}

.panel-tab.active svg {
  fill: #192024;
}

.panel-tab.active + .panel-tab {
  border-left-width: 0;
}

.pane {
  border: 1px solid #404047;
  border-top: 0 none;
  padding: 30px 20px;
  background-color: white;
}

.pane.content {
  display: flex;
  flex-flow: column nowrap;
}

.pane.settings {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 200px 1fr;
}

.pane .main-label {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
}

.pane.content * + .main-label {
  margin-top: 20px;
}

.pane.settings > * {
  min-width: 0;
}

.pane.settings .main-label,
.pane.settings hr {
  grid-column: 1 / -1;
}

.pane.settings .note {
  grid-column: 2;
  font-size: inherit;
  font-style: italic;
}

.pane.settings .sub-label {
  align-self: center;
  margin: 0;
  padding-left: 20px;
  color: #80848e;
}

.pane.settings hr {
  margin: 4px 0;
  border: 1px solid #efefef;
}

.pane input[type="text"],
.pane input[type="number"],
.pane textarea,
.pane select {
  width: auto;
  border: 1px solid #bdc1c6;
  border-radius: 4px;
  color: #80848e;
  background-color: #fcfcfc;
}

.pane input[type="text"],
.pane input[type="number"],
.pane textarea {
  padding: 8px;
}

.pane textarea {
  min-height: 120px;
}

.pane select {
  height: 30px;
  padding: 0 8px;
}

.pane >>> .el-color-picker__trigger {
  border-color: #bdc1c6;
  background-color: #fcfcfc;
}

.pane >>> .el-upload {
  display: block;
}

.pane >>> .el-upload-dragger {
  width: 100%;
  height: auto;
  border-color: #bdc1c6;
  border-radius: 4px;
}

#content-logo >>> .el-upload-dragger {
  min-height: 75px;
}

#content-cover >>> .el-upload-dragger {
  min-height: 120px;
}

.upload-logo {
  display: block;
  object-fit: contain;
  max-width: 100%;
  min-height: 75px;
  margin: 0 auto;
  transition: opacity 0.25s ease;
}

.upload-cover {
  width: 100%;
  transition: opacity 0.25s ease;
}

:hover > .upload-logo,
:hover > .upload-cover,
.uploading .upload-logo,
.uploading .upload-cover {
  opacity: 0.25;
}

.upload-hint {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  padding: 5px 20px;
  color: #80848e;
  fill: #80848e;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.upload-hint:only-child {
  opacity: 0.5;
}

:hover > .upload-hint,
.uploading .upload-hint {
  opacity: 1;
}

.upload-hint > svg {
  height: 20px;
  margin: 5px;
}

.upload-spinner {
  width: 20px;
  height: 20px;
  margin: 5px;
  border: 2px solid #80848e;
  border-top-color: transparent;
  border-radius: 50%;
  animation: 0.8s linear 0s infinite normal datacue-spinner;
}

.validation-error {
  font-size: 14px;
  font-style: italic;
  color: #e55f5e;
}

.color-picker {
  display: flex;
  flex-flow: row nowrap;
}

.color-picker input[type] {
  flex: 1 1 auto;
  min-width: 0;
  margin-left: 5px;
  padding: 0 8px;
}

.switch {
  width: 90px;
  height: 30px;
  margin: 0;
}

.switch input {
  position: absolute;
  left: -100vw;
  opacity: 0;
}

.switch .switch-track {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 1px solid #bdc1c6;
  border-radius: 15px;
  padding: 0 0 0 24px;
  text-transform: uppercase;
  color: #80848e;
  background-color: #fcfcfc;
  transition: all 0.25s ease;
}

.switch input:checked + .switch-track {
  padding: 0 24px 0 0;
  color: #fdb809;
}

.switch .switch-track::after {
  content: "";
  position: absolute;
  left: 2px;
  width: 24px;
  height: 24px;
  margin-left: 0;
  border-radius: 50%;
  background-color: #80848e;
  transition: all 0.25s ease;
}

.switch input:checked + .switch-track::after {
  left: calc(100% - 26px);
  background-color: #fdb809;
}

.radio-group {
  overflow: hidden;
  display: flex;
  flex-flow: row nowrap;
  height: 30px;
}

.radio-group > input {
  position: absolute;
  left: -100vw;
  opacity: 0;
}

.radio-group > label {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  margin: 0;
  border: 1px solid #bdc1c6;
  border-right: 0 none;
  color: #80848e;
  fill: #80848e;
  background-color: #fcfcfc;
}

.radio-group > label > svg {
  height: 14px;
}

.radio-group > input:checked + label {
  border: 1px solid #fdb809;
  color: #fdb809;
  fill: #fdb809;
  background-color: white;
}

.radio-group > input:checked + label + input + label {
  border-left: 0 none;
}

.radio-group > label:first-of-type {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.radio-group > label:last-of-type {
  border-right: 1px solid #bdc1c6;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.launch {
  display: block;
  min-width: 180px;
  margin: 30px auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.heading-container {
  margin-top: 20px;
  margin-bottom: 5px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
