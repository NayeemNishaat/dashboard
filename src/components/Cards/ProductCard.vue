<template>
  <div class="col-sm-6 col-md-4">
    <card>
      <div class="product-photo-outer">
        <div class="product-photo-inner">
          <img :src="photoURL" />
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-center">
          <h4 style="text-transform: capitalize">{{ name }}</h4>

          <el-rate
            v-if="rating > 0.6"
            v-model="rating"
            disabled
            :colors="['#80848f', '#80848f', '#f7ba2a']"
            :max="3"
            :low-threshold="1"
            :high-threshold="2"
          />
          <p v-else class="rating-warning">
            <i class="el-icon-warning" />
            {{ $t("this product isnt performing well") }}
          </p>

          <table class="product-stats">
            <tbody>
              <tr>
                <td>
                  <i class="ti-eye" />
                  &nbsp;{{ $t("views") }}:&nbsp;{{ impressions }}
                </td>
                <td>
                  <i class="ti-mouse-alt" />
                  &nbsp;{{ $tc("clicks", 2) }}:&nbsp;{{ clicks }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </card>
  </div>
</template>
<script>
import Card from "./Card.vue";

export default {
  name: "product-card",
  components: {
    Card
  },
  data() {
    return {
      deleting: false
    };
  },
  props: {
    name: String,
    photoURL: String,
    productID: String,
    clicks: Number,
    impressions: Number,
    rating: Number
  },
  methods: {}
};
</script>
<style scoped>
.product-photo-outer {
  position: relative;
  height: 0;
  padding-top: 100%;
}

.product-photo-inner {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid #bdc0c5;
}

.product-photo-inner img {
  max-width: 100%;
  max-height: 100%;
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

.product-stats {
  width: 100%;
}

.product-stats td {
  padding: 0.5em 0;
  text-align: left;
}
</style>
