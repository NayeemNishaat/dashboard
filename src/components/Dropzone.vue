<template>
  <form class="dropzone">
    <!-- Not displayed, just for Dropzone's `dictDefaultMessage` option -->
    <div id="dropzone-message" style="display: none">
      <p class="dropzone-title">
        {{ $t("banner-upload-title") }}
      </p>
      <p class="dropzone-info">
        {{
            $t(customLayout ? "banner-upload-custom" : "banner-upload-standard")
        }}
      </p>
    </div>
  </form>
</template>

<script>
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";

Dropzone.autoDiscover = false;

export default {
  name: "dropzone",
  props: {
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
    customLayout: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    const vm = this;
    let options = {
      // The URL will be changed for each new file being processing
      url: "/",

      // Since we're going to do a `PUT` upload to S3 directly
      method: "put",
      addRemoveLinks: true,
      // We only want images
      acceptedFiles: "image/jpeg,image/jpg,image/png",
      maxFilesize: 2,
      // Hijack the xhr.send since Dropzone always upload file by using formData
      // ref: https://github.com/danialfarid/ng-file-upload/issues/743
      sending(file, xhr) {
        let _send = xhr.send;
        xhr.send = () => {
          _send.call(xhr, file);
        };
      },

      // Upload one file at a time since we're using the S3 pre-signed URL scenario
      parallelUploads: 1,
      uploadMultiple: false,

      // Content-Type should be included, otherwise you'll get a signature
      // mismatch error from S3. We're going to update this for each file.
      header: "",

      // Customize the wording
      dictDefaultMessage: document.querySelector("#dropzone-message").innerHTML,

      // We're going to process each file manually (see `accept` below)
      autoProcessQueue: false,
    };

    options = Object.assign({}, options, this.options);

    // Instantiate Dropzone
    this.dropzone = new Dropzone(this.$el, options);

    // Set signed upload URL for each file
    this.dropzone.on("addedfile", (file) => {
      this.$emit("addedfile", file);
    });

    // Set signed upload URL for each file
    this.dropzone.on("removedfile", (file) => {
      this.$emit("removedfile", file);
    });

    // Set signed upload URL for each file
    vm.dropzone.on("processing", (file) => {
      vm.dropzone.options.url = file.uploadURL;
    });

    // know when a file was successfully uploaded
    vm.dropzone.on("success", (file, awsResponse) => {
      this.$emit("success", file);
    });
    vm.dropzone.on("error", (file, errorMsg) => {
      this.$emit("error", errorMsg);
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/datacue/_colors.scss";

form.dropzone {
  transition: all 0.2s linear;
  border: 2px dashed $gray-light;
  background-color: $bg-input;
  min-height: initial;

  &:hover {
    border-color: $primary;
    background-color: white;

    .dz-message {
      .dropzone-title {
        font-weight: bold;
      }
    }
  }

  .dz-message {
    color: $gray;

    p {
      line-height: 1.8;
      font-size: 1em;
      letter-spacing: 0.4px;

      .dropzone-title {
        display: block;
        color: $dark;
        font-weight: bold;
        font-size: 1.25em;
      }

      .dropzone-info {
        display: block;
        color: $gray-dark;
      }
    }
  }
}
</style>
