<template>
  <div class="col-sm-6 col-md-4">
    <card>
      <img class="banner-img" :src="photoURL" />
      <div class="row banner-card-contents">
        <div class="col-12 text-center">
          <h4 style="text-transform: capitalize">
            {{ title }}
          </h4>
          <el-rate
            v-if="score > 1"
            v-model="score"
            disabled
            :max="3"
            :colors="['#80848f', '#80848f', '#f7ba2a']"
          />
          <p v-else class="rating-warning">
            <i class="el-icon-warning" />
            {{ $t("consider changing this banner") }}
          </p>
        </div>
        <hr />
        <div class="col-12">
          <ul>
            <li>
              <i class="ti-eye"></i>
              &nbsp;&nbsp;{{ $t("views") }}: {{ impressions }}
            </li>
            <li>
              <i class="ti-mouse-alt"></i>
              &nbsp;&nbsp;{{ $tc("clicks", 2) }}: {{ clicks }}
            </li>
            <li>
              <i class="ti-shopping-cart"></i>
              &nbsp;&nbsp;{{ $tc("conversions", 2) }}: {{ conversions }}
            </li>
          </ul>
        </div>
      </div>
      <div class="row actions">
        <div class="col-4 text-center">
          <a :href="link" target="_blank">
            <el-button type="warning" circle>
              <i class="ti-link"></i>
            </el-button>
          </a>
        </div>
        <div class="col-4 text-center">
          <el-button @click="editCard" circle>
            <i class="ti-pencil"></i>
          </el-button>
        </div>
        <div class="col-4 text-center">
          <el-button @click="delCard" :disabled="deleting" circle>
            <i :class="deleting ? 'ti-time' : 'ti-trash'" circle></i
          ></el-button>
        </div>
      </div>
    </card>
  </div>
</template>

<script setup>
import { computed } from "vue";
import Card from "./Card.vue";

let deleting = false;
const title = computed(() => {
  return props.name || props.category.link.split("/")[2];
});

const ratingIcons = computed(() => {
  switch (props.score) {
    case 1:
      return [
        ["el-icon-warning", "el-icon-warning", "el-icon-warning"],
        ["#c3413e", "#c3413e", "#c3413e"]
      ];
    case 2:
      return [
        ["el-icon-star-on", "el-icon-star-on", "el-icon-star-on"],
        ["grey", "grey", "grey"]
      ];
    case 3:
      return [
        ["el-icon-star-on", "el-icon-star-on", "el-icon-star-on"],
        ["#F7BA2A", "#F7BA2A", "#F7BA2A"]
      ];
  }
  return [];
});

const props = defineProps({
  category: Object,
  name: String,
  photoURL: String,
  bannerID: String,
  type: String,
  link: String,
  clicks: Number,
  impressions: Number,
  conversions: Number,
  rating: Number,
  score: Number
});
const emit = defineEmits(["edit", "delete"]);

const delCard = (_event) => {
  deleting = true;
  emit("delete", props.bannerID);
};
const editCard = () => {
  emit("edit", {
    banner_id: props.bannerID,
    category: props.category,
    photo_url: props.photoURL,
    type: props.type,
    link: props.link
  });
};
</script>

<style scoped>
.banner-card-contents ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.el-button:focus,
.el-button:hover {
  color: #555;
  border-color: #f7ba2a;
  background-color: #fcefcb;
}

img.banner-img {
  height: auto;
  width: 100%;
}

.el-rate {
  margin-bottom: 15px;
}

.rating-warning {
  margin: 0 0 15px;
  line-height: 20px;
  font-size: 14px;
  color: #e53333;
}

.actions {
  padding: 15px 0;
}
</style>
