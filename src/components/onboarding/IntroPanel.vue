<template>
  <div class="card intropanel d-flex">
    <header>
      <h2>{{ title }}</h2>
    </header>
    <section class="intro-panel-image">
      <div class="feature-slideshow" v-if="browserWindow">
        <div class="slideshow-browser-window">
          <div class="slideshow-browser-bar" />
          <div class="slideshow-viewport">
            <slot name="slideshow" />
          </div>
        </div>
      </div>
      <slot> </slot>
    </section>
    <section class="subtitle">
      <slot name="subtitle">
        <p v-if="subtitle">{{ subtitle }}</p>
      </slot>
    </section>
    <footer class="row">
      <div class="col-2">
        <button class="text-btn" v-if="!firstPanel" @click="$emit('back')">
          <div class="d-flex">
            <i class="ti-angle-left"></i>&nbsp;&nbsp;{{ $t("back") }}
          </div>
        </button>
      </div>
      <div class="col-8 d-flex justify-content-center">
        <dc-button type="primary" @click="$emit('next')">
          {{ $t(nextBtnCaption) }}
        </dc-button>
      </div>
      <div class="col-2">
        <button class="skip text-btn" v-if="!lastPanel" @click="$emit('skip')">
          {{ $t("skip") }}
        </button>
      </div>
    </footer>
  </div>
</template>
<script>
import DcButton from "@/components/DcButton.vue";
export default {
  name: "IntroPanel",
  components: {
    DcButton
  },
  props: {
    title: String,
    subtitle: String,
    photoURL: String,
    firstPanel: {
      type: Boolean,
      default: false
    },
    lastPanel: {
      type: Boolean,
      default: false
    },
    browserWindow: {
      type: Boolean,
      default: false
    },
    nextBtnCaption: {
      type: String,
      default: "continue"
    }
  }
};
</script>
<style scoped lang="scss">
@import "~sass/datacue/_colors.scss";
.card-header > * {
  margin-top: 0;
  margin-bottom: 0;
}
section.intro-panel-image {
  text-align: center;
  max-height: 50%;
  flex: 1;
}
section.subtitle {
  font-size: 1.2em;
  padding: 10px 40px;
}
header {
  text-align: center;
  padding-bottom: 10px;
}

footer {
  padding-top: 10px;
  align-items: center;
  justify-content: center;
}
.intropanel {
  min-height: 460px;
  background-color: white;
  padding: 20px 20px;
  transition: opacity 0.5s ease;
}
img.static {
  width: 80%;
}

button > div > i {
  margin-top: 3px;
}

button {
  text-transform: none;
  font-weight: 400;
}

.slideshow-browser-window {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 0;
  border-radius: 8px;
  padding: 24px 0 56.25%;
  background: white;
  box-shadow: 3px 3px 8px fade-out($gray, 0.8);
  margin-bottom: 10px;
}

.slideshow-browser-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 24px;
  background: radial-gradient(circle at 18px, #ff6058 4px, #0000 5px),
    radial-gradient(circle at 33px, #ffbc2d 4px, #0000 5px),
    radial-gradient(circle at 48px, #27c940 4px, #0000 5px), #353439;
  z-index: 2;
}

.feature-slideshow {
  width: 100%;
  padding: 10px 80px;
}

.slideshow-viewport {
  position: absolute;
  top: 24px;
  bottom: 0;
  left: 0;
  right: 0;
}
button.skip {
  color: $gray-dark;
}
</style>
