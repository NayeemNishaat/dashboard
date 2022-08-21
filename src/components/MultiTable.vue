<template>
  <div>
    <div class="header" v-if="title || subTitle">
      <slot name="header">
        <h4 class="title">{{ title }}</h4>
        <p class="category">{{ subTitle }}</p>
      </slot>
    </div>
    <div class="content">
      <table class="mytable" :class="tableClass">
        <thead>
          <tr>
            <th v-for="(column, idx) in cols" :key="idx">{{ column }}</th>
            <th v-for="(action, idx) in actions" :key="'action' + idx"></th>
            <th v-if="deletebtn"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in data" :key="idx">
            <template
              v-for="(column, idx) in columns"
              v-if="hasValue(item, column)"
            >
              <td v-if="imgcols.includes(column)" :key="idx" width="10%">
                <img
                  width="100%"
                  :src="getURL(baseurl, itemValue(item, column))"
                />
              </td>

              <td v-else-if="linkcols.includes(column)" :key="idx" width="10%">
                <a
                  :href="getURL(baseurl, itemValue(item, column))"
                  class="el-button el-button--default"
                  target="_blank"
                >
                  <i class="el-icon-view"></i>
                </a>
              </td>

              <td
                v-else-if="statusCols.includes(column)"
                :key="idx"
                :class="'row ' + itemValue(item, column)"
              >
                <i
                  v-if="itemValue(item, column) === 'success'"
                  class="ti-check"
                >
                  <span>OK</span>
                </i>
                <i
                  v-if="itemValue(item, column) === 'warning'"
                  class="ti-alert"
                >
                  <span>Insufficient</span>
                </i>
                <i v-if="itemValue(item, column) === 'error'" class="ti-close">
                  <span>No Data</span>
                </i>
              </td>

              <td v-else :key="idx">{{ itemValue(item, column) }}</td>
            </template>
            <td v-if="actions">
              <el-button
                v-for="(action, idx) in actions"
                :key="'action' + idx"
                :data-id="`${action.id}-${idx}`"
                type="default"
                @click="processItem(action.action, itemValue(item, idcol))"
              >
                <i :class="action.icon"></i>
                &nbsp;{{ $t(action.action) }}
              </el-button>
            </td>
            <td v-if="deletebtn">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="processItem('delete', [itemValue(item, idcol), idx])"
              ></el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    columns: Array,
    colnames: Array,
    data: Array,
    deletebtn: {
      type: Boolean,
      default: false
    },
    idcol: {
      type: String,
      default: ""
    },
    type: {
      type: String, // striped | hover
      default: "striped"
    },
    statusCols: {
      type: Array,
      default: () => {
        return ["status"];
      }
    },
    imgcols: {
      type: Array,
      default: () => {
        return ["img"];
      }
    },
    linkcols: {
      type: Array,
      default: () => {
        return ["link"];
      }
    },
    actions: {
      type: Array,
      default: () => {
        return [];
      }
    },
    baseurl: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    subTitle: {
      type: String,
      default: ""
    }
  },
  computed: {
    tableClass() {
      return `table-${this.type}`;
    },
    cols() {
      if (!this.colnames) {
        return this.columns;
      }
      return this.colnames;
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
<style>
table.mytable {
  width: 100%;
}

@media (max-width: 600px) {
  .content {
    overflow-x: auto;
  }

  table.mytable {
    width: auto;
  }
}

td.success i {
  color: #41b883;
}

td.warning i {
  color: #f3bb45;
}

td.error i {
  color: #eb5e28;
}

td.row i span {
  color: #252422;
  font-family: "Open Sans", "Helvetica", Arial, sans-serif;
  font-size: 14px;
  font-weight: normal;
}

table.mytable thead > tr > th {
  white-space: nowrap;
}

table.mytable thead > tr > th,
table.mytable tbody > tr > td {
  padding: 0.5em;
}

table.mytable tr > th:first-child,
table.mytable tr > td:first-child {
  padding-left: 0;
}

table.mytable tr > td:not(:first-child),
table.mytable tr > th:not(:first-child) {
  text-align: right;
}
</style>
