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
          <el-radio-button label="impressions">
            <i class="ti-eye"></i>
            &nbsp;&nbsp;{{ $t("views") }}
          </el-radio-button>
          <el-radio-button label="clicks">
            <i class="ti-mouse-alt"></i>
            &nbsp;&nbsp;{{ $tc("clicks", 2) }}
          </el-radio-button>
          <el-radio-button
            :label="cardType === 'banners' ? 'score' : 'ctr_norm'"
          >
            <i class="ti-star"></i>
            &nbsp;&nbsp;{{ $t("score") }}
          </el-radio-button>
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

<script>
import { mapGetters } from "vuex";
import BannerCard from "@/components/Cards/BannerCard.vue";
import ProductCard from "@/components/Cards/ProductCard.vue";
import Card from "@/components/Cards/Card.vue";
import LoaderDots from "@/components/LoaderDots.vue";
import DcButton from "@/components/DcButton.vue";

export default {
  name: "CardGrid",
  components: {
    BannerCard,
    ProductCard,
    Card,
    DcButton,
    LoaderDots
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    cards: {
      type: Array,
      default: () => []
    },
    cardType: String
  },
  data() {
    return {
      maxcards: 30,
      filter: "",
      sortField: this.cardType === "banners" ? "score" : "ctr_norm"
    };
  },
  computed: {
    ...mapGetters(["client"]),
    filteredCards() {
      if (!this.cards) {
        return [];
      }
      if (!this.filter) {
        return this.cards;
      }

      let cards = this.cards.filter((item) => {
        let searchstring = this.getSearchString(item);
        return searchstring.toLowerCase().includes(this.filter.toLowerCase());
      });
      return cards;
    },
    displayCards() {
      if (!this.filteredCards || this.filteredCards.length === 0) {
        return [];
      }
      let filteredCards = this.filteredCards;
      return filteredCards
        .sort(
          (a, b) =>
            parseFloat(b[this.sortField] || 0) -
            parseFloat(a[this.sortField] || 0)
        )
        .slice(0, this.maxcards);
    }
  },
  methods: {
    getSearchString(item) {
      if (this.cardType === "banners") {
        return item["category_id"] + " " + (item["type"] || "");
      }
      return item["name"];
    },
    addMore() {
      this.maxcards += 10;
    },
    handleClick(item) {
      this.$emit("cardClick", item);
    },
    delCard(item) {
      this.$emit("delete", item);
    },
    editCard(item) {
      this.$emit("edit", item);
    },
    getLink(link) {
      if (link.substring(0, 4) === "http") {
        return link;
      }
      if (!this.client) {
        return link;
      }
      const clientDomain = this.client.domain;
      return `https://${clientDomain}${link}`;
    }
  },

  mounted() {}
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
