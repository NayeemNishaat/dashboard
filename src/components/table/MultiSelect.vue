<template>
  <div class="category-settings">
    <div class="row">
      <div class="col-9">
        <div class="form-inline d-flex search-box">
          <i class="ti-search"></i>
          <input
            class="form-control form-control-sm ml-3 w-75"
            type="text"
            v-model="filter"
          />
        </div>
      </div>
      <div class="col-3">
        <el-radio-group v-model="selectorFilter" size="small">
          <el-radio-button label="">{{ $t("All") }}</el-radio-button>
          <el-radio-button :label="true">{{ $t("Active") }}</el-radio-button>
          <el-radio-button :label="false">{{ $t("Inactive") }}</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <table class="table table-striped">
          <thead>
            <tr>
              <th v-if="idcol">{{ $t(idcol) }}</th>
              <th v-for="(column, idx) in headerCols" :key="idx" scope="col">
                {{ $t(column) }}
              </th>
              <th v-if="selectorcol">{{ $t(selectorcol) }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in tableData" :key="idx">
              <th v-if="idcol && row[idcol]">{{ row[idcol] }}</th>
              <td v-for="(column, idx) in headerCols" :key="idx" scope="col">
                {{ row[column] }}
              </td>
              <td
                class="text-center"
                v-if="selectorcol && typeof row[selectorcol] === 'boolean'"
              >
                <label data-v-295cae58="" class="el-checkbox is-checked">
                  <span
                    class="el-checkbox__input"
                    :class="row[selectorcol] ? 'is-checked' : ''"
                  >
                    <span class="el-checkbox__inner"></span>
                    <input
                      class="el-checkbox__original"
                      type="checkbox"
                      :checked="row[selectorcol]"
                      @change="processItem('select', row[idcol])"
                    />
                  </span>
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MultiSelectTable",
  props: {
    data: Array,
    columns: {
      type: Array,
      default: () => []
    },
    idcol: String,
    selectorcol: String
  },
  data() {
    return {
      filter: "",
      selectorFilter: ""
    };
  },
  computed: {
    tableData() {
      let newData = this.data.filter(elem =>
        this.selectorFilter === ""
          ? true
          : elem[this.selectorcol] === this.selectorFilter
      );
      if (!this.filter) {
        return newData;
      }
      return newData.filter(elem =>
        Object.values(elem)
          .join(" ")
          .includes(this.filter)
      );
    },
    validCols() {
      if (!this.data || this.data.length === 0) {
        return [];
      }
      return Object.keys(this.data[0]);
    },
    headerCols() {
      if (!this.data || this.data.length === 0) {
        return [];
      }
      let validKeys = Object.keys(this.data[0]);
      if (this.idcol) {
        validKeys = validKeys.filter(elem => elem !== this.idcol);
      }
      if (this.selectorcol) {
        validKeys = validKeys.filter(elem => elem !== this.selectorcol);
      }
      if (this.columns.length > 0) {
        return this.columns.filter(elem => validKeys.includes(elem));
      }
      return validKeys;
    }
  },
  methods: {
    processItem(action, id) {
      this.$emit(action, id);
    },
    getURL(baseURL, itemURL) {
      if (itemURL === undefined) {
        return;
      }
      if (itemURL.includes("http")) {
        return itemURL;
      }
      return baseURL + itemURL;
    },
    hasValue(item, column) {
      return item[column] !== "undefined";
    },
    itemValue(item, column) {
      return item[column];
    }
  }
};
</script>
<style scoped>
.category-settings > .row > .col-12 > .table-striped > thead > tr > th {
  padding: 10px 8px;
}
.table thead tr > th {
  border-top: none;
}
input.el-input__inner {
  height: 32px !important;
}
.form-inline.d-flex.search-box {
  margin: 0px;
  height: 32px;
}
.form-inline.d-flex.search-box > input {
  height: 32px;
  border-bottom: 1px solid #ccc;
  background-color: inherit;
}
.form-inline.d-flex.search-box > input:focus {
  height: 32px;
  border-bottom: 1px solid #fab800;
}
</style>
