<template>
  <div class="password-strength">
    <password
      v-model="password"
      @score="score => (this.score = score)"
      :strength-meter-only="true"
      :secure-length="minLength"
      v-show="false"
    />
    <el-progress
      :percentage="percentage"
      :status="progressStatus"
      :show-text="false"
    ></el-progress>
    <span :class="meterClass">
      {{ passwordStatus }}
    </span>
  </div>
</template>
<script>
import Password from "vue-password-strength-meter";
export default {
  props: {
    password: {
      type: String
    },
    minLength: {
      type: Number,
      default: 6
    }
  },
  components: {
    Password
  },
  data() {
    return {
      score: 0
    };
  },
  computed: {
    isWeak() {
      return this.percentage <= 40;
    },
    isGood() {
      return this.percentage > 40 && this.percentage <= 60;
    },
    isStrong() {
      return this.percentage > 60;
    },
    meterClass() {
      return {
        status: true,
        weak: this.isWeak,
        good: this.isGood,
        strong: this.isStrong
      };
    },
    progressStatus() {
      if (this.isWeak) {
        return "exception";
      } else if (this.isGood) {
        return "warning";
      } else {
        return "success";
      }
    },
    passwordStatus() {
      if (this.isWeak) {
        return this.$t("weak password");
      } else if (this.isGood) {
        return this.$t("good password");
      } else {
        return this.$t("strong password");
      }
    },
    percentage() {
      const percent = (this.score + 1) * 20;
      return percent > 100 ? 100 : percent;
    }
  }
};
</script>

<style scoped lang="scss">
.password-strength {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  .status {
    margin-left: 1em;
  }

  ::v-deep {
    .el-progress {
      flex: 0 0 130px;

      .el-progress-bar__outer {
        height: 10px !important;
        border-radius: 0;

        background: repeating-linear-gradient(
          to right,
          #ebeef5,
          #ebeef5 10px,
          #fff 10px,
          #fff 20px
        );
      }

      .el-progress-bar__inner {
        border-radius: 0;
      }

      &.is-exception {
        .el-progress-bar__inner {
          background: repeating-linear-gradient(
            to right,
            #f56c6c,
            #f56c6c 10px,
            #fff 10px,
            #fff 20px
          );
        }
      }

      &.is-warning {
        .el-progress-bar__inner {
          background: repeating-linear-gradient(
            to right,
            #fdb809,
            #fdb809 10px,
            #fff 10px,
            #fff 20px
          );
        }
      }

      &.is-success {
        .el-progress-bar__inner {
          background: repeating-linear-gradient(
            to right,
            #67c23a,
            #67c23a 10px,
            #fff 10px,
            #fff 20px
          );
        }
      }
    }
  }
}
</style>
