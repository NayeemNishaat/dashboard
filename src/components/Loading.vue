<template>
  <div>
    <div v-if="type === 'dots'" class="loader dots"></div>
    <svg
      v-else
      class="loading-circle"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" />
    </svg>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    type: {
      type: String,
      default: "dots",
      validator: function(value: string) {
        // The value must match one of these strings
        return ["dots", "circle"].indexOf(value) !== -1;
      }
    }
  }
});
</script>
<style scoped>
.loader {
  display: inline-block;
  position: relative;
  vertical-align: middle;
}
.loader div {
  position: absolute;
}
.loader div:before,
.loader div:after {
  content: "";
  position: absolute;
}
.loader.dots {
  width: 48px;
  height: 16px;
}
.loader.dots div {
  top: 5px;
  left: 21px;
  width: 6px;
  height: 6px;
  background-color: #333;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background-clip: padding-box;
  -webkit-animation: growDot 1s linear 0.15s infinite;
  -moz-animation: growDot 1s linear 0.15s infinite;
  -ms-animation: growDot 1s linear 0.15s infinite;
  -o-animation: growDot 1s linear 0.15s infinite;
  animation: growDot 1s linear 0.15s infinite;
}
.loader.dots div:before {
  top: 0;
  left: -15px;
  width: 6px;
  height: 6px;
  background-color: #333;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background-clip: padding-box;
  -webkit-animation: growDot 1s linear 0s infinite;
  -moz-animation: growDot 1s linear 0s infinite;
  -ms-animation: growDot 1s linear 0s infinite;
  -o-animation: growDot 1s linear 0s infinite;
  animation: growDot 1s linear 0s infinite;
}
.loader.dots div:after {
  top: 0;
  left: 15px;
  width: 6px;
  height: 6px;
  background-color: #333;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background-clip: padding-box;
  -webkit-animation: growDot 1s linear 0.3s infinite;
  -moz-animation: growDot 1s linear 0.3s infinite;
  -ms-animation: growDot 1s linear 0.3s infinite;
  -o-animation: growDot 1s linear 0.3s infinite;
  animation: growDot 1s linear 0.3s infinite;
}
/**
 * Animation frames
 */
@-webkit-keyframes growDot {
  0% {
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)";
    filter: alpha(opacity=(70));
    opacity: 0.7;
    -webkit-box-shadow: 0px 0px 0px 0px #333;
    box-shadow: 0px 0px 0px 0px #333;
  }
  25% {
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
    filter: alpha(opacity=(100));
    opacity: 1;
    -webkit-box-shadow: 0px 0px 0px 4px #333;
    box-shadow: 0px 0px 0px 4px #333;
  }
  50% {
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)";
    filter: alpha(opacity=(70));
    opacity: 0.7;
    -webkit-box-shadow: 0px 0px 0px 0px #333;
    box-shadow: 0px 0px 0px 0px #333;
  }
  100% {
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)";
    filter: alpha(opacity=(60));
    opacity: 0.6;
    -webkit-box-shadow: 0px 0px 0px 0px #333;
    box-shadow: 0px 0px 0px 0px #333;
  }
}
@keyframes growDot {
  0% {
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)";
    filter: alpha(opacity=(70));
    opacity: 0.7;
    -webkit-box-shadow: 0px 0px 0px 0px #333;
    box-shadow: 0px 0px 0px 0px #333;
  }
  25% {
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
    filter: alpha(opacity=(100));
    opacity: 1;
    -webkit-box-shadow: 0px 0px 0px 4px #333;
    box-shadow: 0px 0px 0px 4px #333;
  }
  50% {
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)";
    filter: alpha(opacity=(70));
    opacity: 0.7;
    -webkit-box-shadow: 0px 0px 0px 0px #333;
    box-shadow: 0px 0px 0px 0px #333;
  }
  100% {
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)";
    filter: alpha(opacity=(60));
    opacity: 0.6;
    -webkit-box-shadow: 0px 0px 0px 0px #333;
    box-shadow: 0px 0px 0px 0px #333;
  }
}
svg {
  animation: 2s linear infinite svg-animation;
  max-width: 100px;
}

@keyframes svg-animation {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}

circle {
  animation: 1.4s ease-in-out infinite both circle-animation;
  display: block;
  fill: transparent;
  stroke: #2f3d4c;
  stroke-linecap: round;
  stroke-dasharray: 283;
  stroke-dashoffset: 280;
  stroke-width: 10px;
  transform-origin: 50% 50%;
}

@keyframes circle-animation {
  0%,
  25% {
    stroke-dashoffset: 280;
    transform: rotate(0);
  }

  50%,
  75% {
    stroke-dashoffset: 75;
    transform: rotate(45deg);
  }

  100% {
    stroke-dashoffset: 280;
    transform: rotate(360deg);
  }
}
</style>
