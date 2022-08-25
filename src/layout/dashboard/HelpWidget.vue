<template>
  <div>
    <div
      v-show="hasClientDetails"
      ref="btnHelp"
      draggable="true"
      @dragstart="dragStart"
      @dragend="dragEnd"
      @drag="drag"
      :class="draggableClass"
    >
      <el-button
        type="primary"
        icon="ti-help"
        circle
        @click="feedbackFormVisible = true"
      ></el-button>
    </div>
    <el-dialog
      :title="$t('how can we help you today?')"
      :visible.sync="feedbackFormVisible"
      :modal-append-to-body="false"
    >
      <p>{{ $t("how do you feel?") }}</p>
      <el-radio-group
        fill="#e6a23c"
        class="smileys"
        v-model="feelings"
        size="medium"
      >
        <el-radio-button :label="$t('happy')" value="happy">
          <i class="far fa-smile"></i>
        </el-radio-button>
        <el-radio-button :label="$t('confused')" value="confused">
          <i class="far fa-flushed"></i>
        </el-radio-button>
        <el-radio-button :label="$t('angry')" value="angry">
          <i class="far fa-angry"></i>
        </el-radio-button>
      </el-radio-group>
      <p>{{ $t("describe the issue") }}</p>
      <el-input
        class="comments"
        type="textarea"
        v-model="comments"
        :placeholder="$t('describe the issue')"
        autocomplete="off"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button
          :disabled="!comments || !feelings"
          :loading="sending"
          type="warning"
          @click="sendEmail()"
          >{{ $t("send") }}</el-button
        >
        <el-button @click="feedbackFormVisible = null">
          {{ $t("cancel") }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { postSendEmail, setHelpWidgetPosition } from "/src/api/backend";
import * as Sentry from "@sentry/browser";
export default {
  name: "HelpWidget",
  data() {
    return {
      unsubscribe: null,
      hasClientDetails: false,
      sending: false,
      feedbackFormVisible: null,
      feelings: "",
      comments: "",
      dragging: false,
      offsetX: 0,
      offsetY: 0,

      clientX: 0,
      clientY: 0,
      left: null,
      top: null
    };
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  mounted() {
    this.setupDraggable();

    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === "setApikey") {
        const client = this.$store.getters.client;
        if (client && client.user_profile) {
          const position = client.user_profile.help_widget_position;
          if (position) {
            const pos = position.split(",");
            this.left = pos[0];
            this.top = pos[1];
            this.setPosition(this.left, this.top);
          }
        }
        this.hasClientDetails = true;
      }
    });
    window.addEventListener("resize", this.updatePosition);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updatePosition);
  },
  computed: {
    draggableClass() {
      return {
        float: true,
        dragging: this.dragging
      };
    },
    client() {
      return this.$store.getters.client;
    }
  },
  methods: {
    updatePosition() {
      if (this.left && this.top) {
        this.setPosition(this.left, this.top);
      }
    },
    setupDraggable() {
      // Fix for firefox, this shouldn't be necessary for other browsers but still works the same
      // https://stackoverflow.com/questions/13110349/firefox-ondrag-pagex-pagey-always-zero/13110582
      document.addEventListener("dragover", (e) => {
        this.clientX = e.clientX || e.pageX;
        this.clientY = e.clientY || e.pageY;
        e.preventDefault();
      });

      document.addEventListener("drop", (e) => {
        e.preventDefault();
      });
    },
    cleanPosition(topOrLeft, widthOrHeight) {
      const max = ((widthOrHeight - 70.0) / widthOrHeight) * 100;
      const min = (10 / widthOrHeight) * 100;
      if (topOrLeft > max) {
        return max;
      } else if (topOrLeft < min) {
        return min;
      }
      return topOrLeft;
    },
    setPosition(left, top) {
      const btn = this.$refs.btnHelp;
      const cleanedLeft = this.cleanPosition(left, window.innerWidth);
      const cleanedTop = this.cleanPosition(top, window.innerHeight);
      btn.style.left = `${cleanedLeft}%`;
      btn.style.top = `${cleanedTop}%`;
    },
    sendEmail() {
      this.sending = true;
      const data = {
        email_type: "feedback",
        lang: this.$store.getters.languageCode,
        subject: this.$t(
          "we’ve received your help request and will be in touch…"
        ),
        body: {
          feelings: this.feelings,
          comments: this.comments,
          path: this.$route.fullPath
        }
      };
      postSendEmail(data)
        .then(() => {
          this.feedbackFormVisible = null;
        })
        .catch((err) => {
          this.$notify({
            title: this.$t("error sending email"),
            message: this.$t("please send us an email to contact@datacue.co"),
            type: "warning"
          });
          Sentry.captureException(err);
        })
        .finally(() => {
          this.sending = false;
        });
    },
    dragStart(event) {
      const style = window.getComputedStyle(event.target, null);
      this.offsetX =
        parseInt(style.getPropertyValue("left"), 10) - event.clientX;
      this.offsetY =
        parseInt(style.getPropertyValue("top"), 10) - event.clientY;
      this.dragging = true;

      // Needed for firefox to work
      event.dataTransfer.setData("text", "firefoxfix");
    },
    drag(event) {
      event.currentTarget.style.opacity = 0;
      event.dataTransfer.dropEffect = "move";
    },
    dragEnd(event) {
      this.dragging = false;
      const elem = event.target;
      const height = window.innerHeight;
      const width = window.innerWidth;
      this.left = ((this.clientX + this.offsetX) / width) * 100;
      this.top = ((this.clientY + this.offsetY) / height) * 100;

      const btn = this.$refs.btnHelp;
      const cleanedLeft = this.cleanPosition(this.left, window.innerWidth);
      const cleanedTop = this.cleanPosition(this.top, window.innerHeight);
      btn.style.left = `${cleanedLeft}%`;
      btn.style.top = `${cleanedTop}%`;
      elem.style.opacity = 1;

      const data = {
        position: `${cleanedLeft},${cleanedTop}`
      };

      setHelpWidgetPosition(data);
    }
  }
};
</script>
<style lang="scss" scoped>
.smileys i {
  font-size: 2em;
}
.el-radio-button__inner:hover {
  color: #e6a23c !important;
}

.float {
  position: fixed;
  z-index: 99;
  top: calc(100vh - 100px);
  left: calc(100vw - 100px);

  button {
    width: 60px;
    height: 60px;
    box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
      0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
    font-size: 1.5em;
    background-color: #c3413e;
    border-color: #c3413e;
  }
}

.dragging {
  button {
    box-shadow: none !important;
  }
}
input.comments {
  height: 120px;
}
</style>
