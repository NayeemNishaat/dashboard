<template>
  <div>
    <div class="row">
      <div class="col-sm-6 search-box align-self-center">
        <el-input
          :placeholder="$t(`type a ${cardType} name to filter the list`)"
          icon="search"
          v-model="filter"
        >
        </el-input>
      </div>
      <div class="col-sm-6 ml-auto text-right d-flex align-items-center">
        <span>{{ $t("sort by") }}&nbsp;&nbsp;</span>
        <el-radio-group v-model="sortField" size="small" fill="#f8ba00">
          <el-radio label="impressions">
            <i class="ti-eye"></i>
            &nbsp;&nbsp;{{ $t("views") }}
          </el-radio>
          <el-radio label="clicks">
            <i class="ti-mouse-alt"></i>
            &nbsp;&nbsp;{{ $tc("clicks", 2) }}
          </el-radio>
          <el-radio :label="cardType === 'banners' ? 'score' : 'ctr_norm'">
            <i class="ti-star"></i>
            &nbsp;&nbsp;{{ $t("score") }}
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="row">
      <div v-if="loading" class="col-auto">
        <card>
          <loader-dots />
        </card>
      </div>
      <template
        v-else-if="displayCards.length > 0"
        v-for="card in displayCards"
      >
        <banner-card
          v-if="cardType === 'banners' && card.category !== null"
          :category="card"
          :photoURL="card.photo_url"
          :name="card.name"
          :type="card.type"
          :bannerID="card.banner_id"
          :link="getLink(card.link)"
          :clicks="card.clicks || 0"
          :impressions="card.impressions || 0"
          :conversions="card.conversions || 0"
          :rating="card.rating || 0"
          :score="card.score || 1"
          :key="card.banner_id"
          @delete="delCard"
          @edit="editCard"
        />
        <product-card
          v-else-if="cardType === 'products' || cardType === 'notifications'"
          :name="card.name"
          :photoURL="card.photo_url"
          :productID="card.product_id"
          :clicks="card.clicks || 0"
          :impressions="card.impressions || 0"
          :rating="card.ctr_norm * 0.6 || 0"
          :key="card.product_id"
        />
      </template>
      <div v-else>
        <i class="ti-face-sad"></i>
        {{ $t("no data for this period") }}
      </div>
    </div>
    <div class="row text-center">
      <div class="col-12">
        <dc-button v-if="maxcards < cards.length" @click="addMore()">{{
          $t("show more")
        }}</dc-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, ref } from "vue";
import BannerCard from "@/components/Cards/BannerCard.vue";
import ProductCard from "@/components/Cards/ProductCard.vue";
import Card from "@/components/Cards/Card.vue";
import LoaderDots from "@/components/LoaderDots.vue";
import DcButton from "@/components/DcButton.vue";

const store = useStore();
const { client } = store.getters;

const emit = defineEmits(["edit", "delete", "cardClick"]);

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  cards: {
    type: Array,
    default: () => []
  },
  cardType: String
});

const maxcards = ref(30);
const filter = ref("");
const sortField = ref(props.cardType === "banners" ? "score" : "ctr_norm");

const filteredCards = computed(() => {
  if (!props.cards) {
    return [];
  }
  if (!filter.value) {
    return props.cards;
  }
  let cards = props.cards.filter((item) => {
    let searchstring = getSearchString(item);
    return searchstring.toLowerCase().includes(filter.value.toLowerCase());
  });
  return cards;
});
const displayCards = computed(() => {
  if (!filteredCards.value || filteredCards.value.length === 0) {
    return [];
  }
  return filteredCards.value
    .sort(
      (a, b) =>
        parseFloat(b[sortField.value] || 0) -
        parseFloat(a[sortField.value] || 0)
    )
    .slice(0, maxcards.value);
});

const getSearchString = (item) => {
  if (props.cardType === "banners") {
    return item.link.slice(item.link.lastIndexOf("/") + 1);
  }
  return item["name"];
};
const addMore = () => {
  maxcards.value += 10;
};
const handleClick = (item) => {
  emit("cardClick", item);
};
const delCard = (item) => {
  emit("delete", item);
};
const editCard = (item) => {
  emit("edit", item);
};
const getLink = (link) => {
  if (link.substring(0, 4) === "http") {
    return link;
  }
  if (!client) {
    return link;
  }
  const clientDomain = client.domain;
  return `https://${clientDomain}${link}`;
};
</script>
<style>
.grid {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.el-radio-button {
  margin: 0;
}
label {
  margin: 0.25rem 0;
}
.search-box {
  margin-bottom: 10px;
}

.search-box > .el-input > input::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #333;
  opacity: 0.7;
  /* Firefox */
}
</style>
