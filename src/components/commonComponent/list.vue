<template>
  <div class="file-list__main">
    <el-table
        :data="allOrderList"
        :row-style="{}"
        empty-text="NO DATA"
        style="width: 100%"
        v-loading="loading"
        @cell-mouse-enter="changeButton"
        @cell-mouse-leave	="closeButton">
      <el-table-column
          prop="name"
          label="FILE NAME">
        <template slot-scope="scope">
          <p
              class="span-table-text"
              style="display: flex;align-items: center">
            <fileIconView :file-type="scope.row.fileType"></fileIconView>
            {{ scope.row.fileName }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
          prop="tags"
          label="">
        <template slot-scope="scope">
          <el-tag
              v-if="scope.row.tags.find(item => (item.name.toUpperCase() === 'weave-collect'.toUpperCase() && item.value === accountStr))"
              style="border-color: rgba(0, 0, 0, 1);color: #6447F2"
          >
            Collected
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="fileSize"
          label="SIZE">
      </el-table-column>
      <el-table-column
          prop="tags"
          label="TAGS"
          width="400px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" placement="top-start">
            <div slot="content">
              <p class="table-item-tags-position" style="display: flex;align-items: center;justify-content: start;flex-wrap: wrap">
            <span v-for="(item, index) in scope.row.tags" :key="index" class="table-tag-style">
              {{item.value}}
            </span>
              </p>
            </div>
            <p class="table-item-tags-position view-text">
            <span v-for="(item, index) in scope.row.tags" :key="index" class="table-tag-style">
              {{item.value}}
            </span>
            </p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
          prop="time"
          align="right"
          label="TIME"
      width="200">
        <template slot-scope="scope">
          <!--          {{scope.row.showButton}}-->
          <div v-if="scope.row.showButton" class="view-button">
            <span class="click-to-detail" @click="clickToDetail(scope.row)">
              <img src="../../assets/svg/eye.svg" alt="">
              VIEW
          </span>
            <span class="click-to-detail" @click="comment(scope.row)">
              <i class="el-icon-s-comment"/>
              COMMENT
          </span>
          </div>
          <div v-else>{{scope.row.time}}</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="file-list-pagination">
      <el-pagination
          :page-size="10"
          :current-page="currentPage"
          hide-on-single-page
          @current-change="handlePagination"
          @prev-click="handlePagination"
          @next-click="handlePagination"
          layout="prev, pager, next"
          :total="totalTableLength">
      </el-pagination>
    </div>
    <commentDialog ref="commentDialog"></commentDialog>
  </div>
</template>

<script>
import {mapGetters} from "vuex"
import fileIconView from "@/components/commonComponent/fileIconView"
import commentDialog from "@/components/__dialog/commentDialog"

export default {
  name: "fileList",
  components: {
    fileIconView,
    commentDialog
  },
  props: {
    allOrderList: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    totalTableLength: {
      type: Number,
      default: 0
    },
    fileStyle: {
      type: Object,
      default: () => {}
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      showButton: false,
      // loading: true,
    }
  },
  computed: {
    ...mapGetters({
      accountStr: 'account/account'
    })
  },
  methods: {
    handlePagination(pageIndex) {
      this.$emit('changePagination', pageIndex)
    },
    clickToDetail(item) {
      this.$router.push({
        name: "FileDetail",
        params: {
          id: item.itemId ? item.itemId : item.hash
        }
      })
      sessionStorage.setItem('FILE_DETAIL_JSON', JSON.stringify(item))
    },
    changeButton(value) {
      // this.showButton = true
      this.$emit("changeTableData", value)
    },
    closeButton() {
      // this.showButton = false
    },
    comment(item) {
      const id = item.itemId ? item.itemId : item.hash
      this.$refs['commentDialog'].openDialog(id)
    }
  }
}
</script>

<style lang="scss">
.file-list__main {
  min-height: 300px;
  .view-button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.file-list__main .el-table thead {
  color: #A9A8B0;
  text-align: center;
}
.file-list__main .el-table thead tr {
  background: #FCFCFC;
  text-align: center;
}
.file-list__main .file-list-pagination {
  margin: 10px 0;
  text-align: right;
}
.file-list__main .span-table-text {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #09244B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.table-tag-style {
  /*display: inline-block;*/
  /*width: 60px;*/
  /*height: 19px;*/
  padding: 2px 8px;
  border-radius: 6px;
  margin-right: 8px;
  background: #FAF9F8;
  color: #09244B;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 8px;
}
.click-to-detail {
  display: inline-block;
  width: 87px;
  height: 28px;
  line-height: 28px;
  background: #000000;
  color: #ffffff;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
}
.click-to-detail:nth-child(1) {
  margin-right: 5px;
}
.table-item-tags-position {
  width: 265px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.view-text{
  display: inline-block;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow:ellipsis;
}
</style>