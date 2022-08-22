<template>
  <div>
    <el-form class="api-info">
      <div class="col-12">
        <p class="info">
          {{ $t("use the credentials below to connect to datacue's api") }}:
        </p>
      </div>
      <div class="col-12">
        <el-form-item label="API key:">
          <el-input :value="apikey" class="float-md-left" readonly></el-input>
          <copy-button
            @copy="$clipboard(apikey)"
            class="float-right float-md-left"
          ></copy-button>
        </el-form-item>
      </div>
      <div class="col-12">
        <el-form-item label="API secret:">
          <el-input
            :value="apisecret"
            class="float-md-left"
            readonly
          ></el-input>
          <copy-button
            @copy="$clipboard(apisecret)"
            class="float-right float-md-left"
          ></copy-button>
          <dc-button v-if="!readOnly">{{ $t("re-generate") }}</dc-button>
        </el-form-item>
      </div>
      <div class="col-12 first-tip">
        <dc-tip
          :message="
            $t('copy and save your api key and api secret in a secure place.')
          "
        />
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import DcTip from "@/components/DcTip.vue";
import CopyButton from "@/components/onboarding/CopyButton.vue";
import DcButton from "@/components/DcButton.vue";

export default {
  name: "ApiSettings",
  components: {
    DcTip,
    DcButton,
    CopyButton,
  },
  computed: {
    ...mapGetters(["apikey", "client"]),
    apisecret() {
      return atob(this.client.apisecret);
    },
  },
  props: {
    readOnly: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/sass/datacue/_colors.scss";

hr {
  border-color: $gray-light;
}

label.toggle-keys {
  cursor: pointer;
  font-size: 1em;
  color: $gray;
  fill: $gray;

  &.visible {
    margin-bottom: 25px;
  }

  &:hover {
    fill: $primary;
    color: $primary;
  }

  svg {
    width: 25px;
    height: 13px;
    margin-bottom: 3px;
  }
}

p.info {
  color: $dark;
  margin-bottom: 20px;
}

.data-info {
  p {
    color: $dark;

    @media (max-width: 992px) {
      margin-top: 30px;
      margin-bottom: 0;
    }
  }
}

.product-data {
  margin-top: 30px;
}

.el-form.api-info ::v-deep {
  .el-form-item {
    margin-bottom: 0;
  }
  .el-form-item__label {
    font-weight: bold;
    color: $dark;
    font-size: 16px;
    margin: 10px 0 15px 0;
    line-height: 1;

    @media (min-width: 768px) {
      float: none;
      margin-top: 30px;
    }

    @media (min-width: 1200px) {
      float: left;
      min-width: 100px;
    }
  }
}

.first-tip {
  margin-top: 30px;
}

.btn-yellow-outline {
  margin: 30px 0 30px;
  min-width: 150px;
}

.refresh {
  margin: 30px 0;

  img {
    width: 20px;
    margin-right: 10px;
    margin-bottom: 2px;
  }
}

.assistance {
  hr {
    border-color: $gray-light;
    margin-bottom: 10px;
    margin-top: 20px;
  }

  .icon {
    width: 55px;
    min-width: 55px;

    img {
      height: 40px;
    }
  }

  .title {
    color: $primary;
    font-weight: bold;
    text-transform: uppercase;
  }

  .message {
    color: $dark;
    padding-left: 5px;
  }
}

.btn-help {
  margin-top: 15px;
}

@media (min-width: 768px) {
  p.info {
    margin-bottom: 0;
  }

  .el-input {
    width: 330px;
  }

  label.copy {
    margin-left: 15px;
  }
}

@media (min-width: 992px) {
  .second-tip {
    margin-top: 30px;
    padding-left: 30px;
  }

  .btn-help {
    margin-top: 0;
  }
}

@media (min-width: 1200px) {
  p.info {
    margin-bottom: 10px;
  }

  .el-input {
    margin-top: 20px;
  }

  label.copy {
    margin-top: 30px;
  }
}
</style>
