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
              &nbsp;&nbsp;{{ $t("views") }}:
              {{ Number.isNaN(Number(impressions)) ? 0 : Number(impressions) }}
            </li>
            <li>
              <i class="ti-mouse-alt"></i>
              &nbsp;&nbsp;{{ $t("clicks", 2) }}:
              {{ Number.isNaN(Number(clicks)) ? 0 : Number(clicks) }}
            </li>
            <li>
              <i class="ti-shopping-cart"></i>
              &nbsp;&nbsp;{{ $t("conversions", 2) }}:
              {{
                Number.isNaN(Number(conversions))
                  ? 0
                  : Number(Math.abs(conversions))
              }}
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
            <i :class="deleting ? 'ti-time' : 'ti-trash'" circle></i>
          </el-button>
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
