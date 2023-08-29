<template>
  <div class="search-page__main">
    <div class="back-homepage" @click="backToHome">
      <i class="el-icon-back"></i>
      BACK
    </div>
    <el-row :gutter="22" class="search-right-detail">
      <el-col :span="24">
        <div class="search-left-list">
          <div style="margin-right: 20px">Result：{{ $route.params.searchValue }}</div>
          <div>
            <el-select v-model="selectValue" placeholder="Please choose" style="width: 100px" @change="searchCategory">
              <el-option
                  v-for="item in selectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <el-tabs v-model="tabName" type="card" :stretch="true" @tab-click="selectTab">
          <el-tab-pane label="My Storage" name="myFile"></el-tab-pane>
          <el-tab-pane label="All" name="allFile"></el-tab-pane>
        </el-tabs>
        <div style="margin-top: 30px;">
          <fileList
              :allOrderList="tableData"
              :totalTableLength="totalTableLength"
              :loading="loading"
              @changeTableData="changeTableData"
              @changePagination="changePagination"
              @viewDetail="viewDetail"
              :fileStyle="fileListWidthStyle"
              :currentPage="currentPage"></fileList>
        </div>
      </el-col>
<!--      <el-col :span="8" style="min-height: 500px">-->
<!--        <div class="search-left-list">-->
<!--          <div style="margin: 10px 0">File Detail</div>-->
<!--        </div>-->
<!--        <div class="search-right-top" style="width: 400px;">-->
<!--          <div class="dile-detail-left" style="width: 400px;height: auto">-->
<!--            <div v-if="fileDetail.fileType && fileDetail.fileType.includes('image')">-->
<!--              <img-->
<!--                  width="400"-->
<!--                  height="auto"-->
<!--                  class="detail-left-style"-->
<!--                  :src="`https://arseed.web3infra.dev/${fileDetail.itemId ? fileDetail.itemId : fileDetail.hash}`"-->
<!--                  alt=""/>-->
<!--            </div>-->
<!--            <div v-else-if="fileDetail.fileType && fileDetail.fileType.includes('audio')">-->
<!--              <audio-->
<!--                  loop-->
<!--                  controls-->
<!--                  :src="`https://arseed.web3infra.dev/${fileDetail.itemId ? fileDetail.itemId : fileDetail.hash}`">-->
<!--                {{ $t("message.fileDetail.audioText") }}-->
<!--              </audio>-->
<!--            </div>-->
<!--            <div v-else-if="fileDetail.fileType && fileDetail.fileType.includes('video')">-->
<!--              <video-->
<!--                  width="400"-->
<!--                  class="detail-left-style"-->
<!--                  height="auto"-->
<!--                  :src="`https://arseed.web3infra.dev/${fileDetail.itemId ? fileDetail.itemId : fileDetail.hash}`"-->
<!--                  controls="controls">-->
<!--                {{ $t("message.fileDetail.videoText") }}-->
<!--              </video>-->
<!--            </div>-->
<!--            <div v-else-if="fileDetail.fileType && (fileDetail.fileType.includes('pdf') || fileDetail.fileType.includes('text'))">-->
<!--              <iframe-->
<!--                  id="iframeSearchDetail"-->
<!--                  width="400"-->
<!--                  height="405"-->
<!--                  :src="`https://arseed.web3infra.dev/${fileDetail.itemId ? fileDetail.itemId : fileDetail.hash}`"></iframe>-->
<!--            </div>-->
<!--            <div v-else-if="fileDetail.fileType && (fileDetail.fileType.includes('json') || fileDetail.fileType.includes('text'))">-->
<!--              <div class="json-text-style">-->
<!--                <pre>{{ fileDetail.info }}</pre>-->
<!--                &lt;!&ndash;                {{JSON.stringify(JSON.parse(fileDetail.body), null, '\t')}}&ndash;&gt;-->
<!--              </div>-->
<!--            </div>-->
<!--            <div v-else style="text-align: center">-->
<!--              <el-empty :description="$t('message.homePage.fileList.noData')"></el-empty>-->
<!--            </div>-->
<!--          </div>-->
<!--          &lt;!&ndash;          <iframe id="iframeSearchDetail" width="665" height="665" :src="`https://arseed.web3infra.dev/${fileItemId}`"></iframe>&ndash;&gt;-->
<!--        </div>-->
<!--        <div v-if="fileDetail && Object.keys(fileDetail).length !== 0" class="file-detail-right-info">-->
<!--          <div class="detail-title">-->
<!--            <p-->
<!--                v-if="fileDetail.fileType && fileDetail.fileType.includes('image')"-->
<!--                class="span-table-text"-->
<!--                style="display: flex;align-items: center">-->
<!--              <img src="../assets/svg/icon-one.svg" alt="" style="margin-right: 13px">-->
<!--              {{ fileDetail.fileName }}-->
<!--            </p>-->
<!--            <p-->
<!--                v-else-if="fileDetail.fileType && fileDetail.fileType.includes('audio')"-->
<!--                class="span-table-text">-->
<!--              <img src="../assets/svg/icon-four.svg" alt="" style="margin-right: 13px">-->
<!--              {{ fileDetail.fileName }}-->
<!--            </p>-->
<!--            <p-->
<!--                v-else-if="fileDetail.fileType && (fileDetail.fileType.includes('word') || fileDetail.fileType.includes('pdf'))"-->
<!--                class="span-table-text">-->
<!--              <img src="../assets/svg/icon-three.svg" alt="" style="margin-right: 13px">-->
<!--              {{ fileDetail.fileName }}-->
<!--            </p>-->
<!--            <p-->
<!--                v-else-if="fileDetail.fileType && fileDetail.fileType.includes('video')"-->
<!--                class="span-table-text">-->
<!--              <img src="../assets/svg/icon-five.svg" alt="" style="margin-right: 13px">-->
<!--              {{ fileDetail.fileName }}-->
<!--            </p>-->
<!--            <p-->
<!--                v-else-->
<!--                class="span-table-text">-->
<!--              <img src="../assets/svg/icon-two.svg" alt="" style="margin-right: 13px">-->
<!--              {{ fileDetail.fileName }}-->
<!--            </p>-->
<!--          </div>-->
<!--          <p class="item-fileInfo">-->
<!--            <span class="item-content">{{ $t("message.fileDetail.timestamp") }}:</span>-->
<!--            {{ fileDetail.timeStampStr }}-->
<!--          </p>-->
<!--          <p v-if="fileDetail.fileSize" class="item-fileInfo">-->
<!--            <span class="item-content">{{ $t("message.fileDetail.size") }}:</span>-->
<!--            {{ fileDetail.fileSize }}-->
<!--          </p>-->
<!--          <p v-if="fileDetail.height" class="item-fileInfo">-->
<!--            <span class="item-content">{{ $t("message.fileDetail.height") }}:</span>-->
<!--            {{ fileDetail.height }}-->
<!--          </p>-->
<!--          <p class="item-fileInfo">-->
<!--            <span class="item-content">-->
<!--              {{ $t("message.fileDetail.FileType") }}:</span>-->
<!--            {{ fileDetail.fileType }}-->
<!--          </p>-->
<!--          &lt;!&ndash;            <p><span class="item-content">Age:</span> </p>&ndash;&gt;-->
<!--          &lt;!&ndash;            <p><span class="item-content">Tx Index:</span> </p>&ndash;&gt;-->
<!--          &lt;!&ndash;            <p><span class="item-content">Height:</span> {{ txInfoByHash.rawId }}</p>&ndash;&gt;-->
<!--          &lt;!&ndash;            <p><span class="item-content">Confirmations:</span> </p>&ndash;&gt;-->
<!--          <p v-if="fileDetail.fee && fileDetail.decimals" class="item-fileInfo">-->
<!--            <span class="item-content">{{ $t("message.fileDetail.fee") }}:</span>-->
<!--            {{ `${fileDetail.fee / (Math.pow(10, Number(fileDetail.decimals)))}${fileDetail.currency}` }}-->
<!--          </p>-->
<!--        </div>-->
<!--        <div v-if="fileDetail && Object.keys(fileDetail).length !== 0" class="file-detail-button">-->
<!--          <p class="download-button" style="display: flex;align-items: center;justify-content: center" @click="download">-->
<!--            <img src="../assets/svg/Download.svg" style="margin-right: 5px" alt="">-->
<!--            {{ $t("message.button.download") }} ({{ fileDetail.fileSize }})-->
<!--          </p>-->
<!--          <p class="copy-button" style="display: flex;align-items: center;justify-content: center" id="copyURLBtn" @click="copyUrl">-->
<!--            <img src="../assets/svg/link.svg" style="margin-right: 5px" alt="">-->
<!--            {{ $t("message.button.copyUrl") }}-->
<!--          </p>-->
<!--          <p class="copy-button" style="display: flex;align-items: center;justify-content: center" @click="clickToARTxPage">-->
<!--            <img src="../assets/svg/icon_logo.svg" style="margin-right: 5px" alt="">-->
<!--            {{ $t("message.fileDetail.explorer") }}-->
<!--          </p>-->
<!--          <p class="copy-button" style="display: flex;align-items: center;justify-content: center" @click="collectFile">-->
<!--            <img src="../assets/svg/collect-icon.svg" style="margin-right: 5px" alt="">-->
<!--            {{ $t("message.button.collectButton") }}-->
<!--          </p>-->
<!--        </div>-->
<!--      </el-col>-->
    </el-row>
  </div>
</template>

<script>
import fileList from "@/components/commonComponent/list"
import {mapActions, mapGetters} from 'vuex'
import clipboard from "clipboard"
import {getItemMeta} from "arseeding-js"
import {paymentStatus, adotAppName} from '@/utils/constant/chainConst'
import {reportUrl} from '@/utils/constant/apiConst'
import {
  formatMirrorData,
  formatOtherData,
  formatSmartWeaveContractData,
  formatTwitterData,
  formatWeWeaveData,
  getUploadAppName
} from "@/utils/fileSequence"
import moment from "moment/moment"

const fileListWidthStyle = {
  name: 220,
  isSearch: true
}
const selectList = [{
  label: 'All',
  value: 'all'
}, {
  label: 'Tag',
  value: 'tag'
}]
export default {
  name: "searchPage",
  components: {
    fileList
  },
  data() {
    return {
      fileListWidthStyle,
      tabName: this.$route.query.searchTab,
      selectValue: selectList[0].value,
      tableData: undefined,
      loading: false,
      totalTableLength: 0,
      selectList,
      fileDetail: {},
      clipboard: null,
      currentPage: 1
    }
  },
  computed: {
    ...mapGetters({
      accountStr: 'account/account',
      allOrderList: 'order/getOrders',
    })
  },
  async mounted() {
    await this.handleClick()
  },
  destroyed() {
    if (this.clipboard) {
      // this.clipboard.destroyed()
    }
  },
  watch: {
    $route: {
      handler: async function() {
        this.currentPage = 1
        await this.handleClick(this.currentPage)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      getBalances: "account/getAccountBalances",
      searchList: 'order/searchArweave',
      getOrders: 'order/getOrders',
      getTxByHash: 'order/getTxByHash',
      getOrderDetail: 'order/getItemMeta',
    }),
    backToHome() {
      this.$router.push({
        name: "Main"
      })
    },
    async searchCategory(value) {
      await this.handleClick(1, value)
    },
    changeTableData() {
      // this.tableData = this.tableData.map(item => {
      //   if (item.itemId === value.itemId) {
      //     item.showButton = true
      //   } else {
      //     item.showButton = false
      //   }
      //   return item
      // })
    },
    viewDetail(item) {
      this.fileDetail = {}
      this.fileDetail = item
      this.initCopyBtn()
    },
    formatMetaInfo(item) {
      const searchValue = this.$route.params.searchValue
      let info = {
        ...item,
        fileName: item.id ? item.id : '--',
        fileType: '--',
        tags: []
      }
      if (item.metaInfo && item.metaInfo.tags && item.metaInfo.tags.length !== 0) {
        const list = item.metaInfo.tags.filter(item => item.name && (item.name.toUpperCase() === 'name'.toUpperCase() || item.name.toUpperCase() === 'fileName'.toUpperCase()))
        const typeList = item.metaInfo.tags.filter(item => item.name && (item.name.toUpperCase() === 'Content-Type'.toUpperCase() || item.name.toUpperCase() === 'type'.toUpperCase()))
        info.fileName = list && list.length !== 0 ? list[0].value : item.id
        info.fileType = typeList && typeList.length !== 0 ? typeList[0].value : ''
        info.tags = item.metaInfo.tags
        const str = JSON.stringify(info.tags)
        info.isSearch = str.toUpperCase().includes(searchValue.toUpperCase())
        info.timeStampStr = moment(item.createdAt).format('YYYY.MM.D  HH:mm:SS  A')
      }
      return info
    },
    async changePagination(pageIndex) {
      this.currentPage = pageIndex
      await this.handleClick(pageIndex)
    },
    async getMyFileList(pageIndex) {
      // if ()
      await this.getOrders(this.accountStr)
      // let list = this.allOrderList.slice((pageIndex - 1) * 10, pageIndex * 10)
      this.$nextTick(async () => {
        let list = this.allOrderList
        for (let i = 0; i < list.length; i++) {
          if (list[i].paymentStatus !== paymentStatus.EXPIRED) {
            const id = list[i].itemId
            list[i].metaInfo = await getItemMeta(reportUrl, id)
            list[i] = this.formatMetaInfo(list[i])
          } else {
            list[i].metaInfo = {}
          }
        }
        // Filter logic
        const searchList = list.filter(item => item.isSearch)
        this.tableData = searchList.slice((pageIndex - 1) * 10, pageIndex * 10)
        this.totalTableLength = searchList.length
        this.loading = false
      })
    },
    selectTab() {
      this.$router.push({
        name: 'Search',
        params: {
          searchValue: this.$route.params.searchValue
        },
        query: {
          searchTab: this.tabName
        }
      })
      // await this.handleClick()
    },
    /**
     * The acquisition of search results, serialization and classification of the whole chain data
     * @param pageIndex
     * @returns {Promise<void>}
     */
    async handleClick(pageIndex) {
      this.loading = true
      this.fileDetail = {}
      const pageNum = pageIndex ? pageIndex : 1
      this.currentPage = pageNum
      // my storage
      if (this.tabName === 'myFile') {
        await this.getMyFileList(pageNum)
      } else {
        // All Data
        const param = {
          query: '',
          pageNum,
          filter: {
            tags: '',
            sentimentLabel: ""
          }
        }
        // Only search the tag with this field in it
        if (this.selectValue && this.selectValue === selectList[1].value) {
          param.filter.tags = this.$route.params.searchValue
        } else {
          // Search all
          param.query = this.$route.params.searchValue
        }
        const {data} = await this.searchList(param)
        this.totalTableLength = data.searchResultTotal > 10000 ? 10000 : data.searchResultTotal
        this.tableData = data.searchResultList.map(item => {
          // Determine whether tags are arrays
          if (!Array.isArray(item.tags)) {
            item.tags = JSON.parse(item.tags)
          }
          let result
          // formatTag method hopes to obtain the uploaded APP name through the data stored in tags,
          // parse different data formats to obtain data
          const appName = getUploadAppName(item.tags)
          switch (appName) {
            case adotAppName.weweave:
              result = formatWeWeaveData(item)
              break
            case adotAppName.mirror:
              result = formatMirrorData(item)
              break
            case adotAppName.twitter:
              result = formatTwitterData(item)
              break
            case adotAppName.smartWeaveContract:
              result = formatSmartWeaveContractData(item)
              break
            default:
              result = formatOtherData(item)
              break
          }
          if (!result.fileName) {
            result.fileName = 'Untitled'
          }
          return {
            ...item,
            ...result
          }
        })
        this.loading = false
      }
    },
    copyUrl() {
      this.clipboard.once("success", () => {
        this.$message.success("Copy success")
      })
      this.clipboard.once("error", err => {
        console.error(err)
      })
    },
    initCopyBtn() {
      const id = this.fileDetail.itemId ? this.fileDetail.itemId : this.fileDetail.hash
      const copyText = `https://arseed.web3infra.dev/${id}`
      this.clipboard = new clipboard("#copyURLBtn", {text: () => copyText})
    },
    download() {
      const id = this.fileDetail.itemId ? this.fileDetail.itemId : this.fileDetail.hash
      window.open(`https://arseed.web3infra.dev/${id}`, "_blank")
    },
    clickToARTxPage() {
      const id = this.fileDetail.itemId ? this.fileDetail.itemId : this.fileDetail.hash
      window.open(`https://viewblock.io/arweave/tx/${id}`, "_blank")
    }
  }
}
</script>

<style lang="scss">
.search-page__main {
  width: 1024px;
  //min-height: 600px;
  min-height: 90vh;
  margin: 36px auto;

  .search-left-list {
    //width: 200px;
    display: flex;
    //justify-content: space-between;
    align-items: center;
    margin: 20px 0;
  }

  .search-right-top {
    background: rgba(250, 249, 248, 1);
    border-radius: 10px;
  }

  .file-detail-button {
    //display: flex;
    //justify-content: space-between;
    //align-items: center;
    margin-top: 20px;
  }

  .download-button {
    //width: 250px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    border: 2px solid #09244B;
    background: #715EFF;
    color: #ffffff;
    border-radius: 10px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
  }

  .copy-button {
    height: 44px;
    line-height: 44px;
    text-align: center;
    border: 2px solid #FAF9F8;
    background: #FAF9F8;
    color: #09244B;
    border-radius: 10px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 15px;
  }

  .file-detail-right-info {
    font-size: 14px;
    margin-left: 20px;
    margin-bottom: 40px;

    .item-fileInfo {
      margin: 12px 0;
    }

    .item-content {
      display: inline-block;
      width: 116px;
      font-weight: bold;
      color: rgba(9, 36, 75, 1);
    }
  }

  .detail-title {
    margin: 36px 0 36px 0;
  }

  .back-homepage {
    width: 107px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 2px solid #EFECFD;
    background: #F7F6FE;
    color: #000000;
    border-radius: 6px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
  }

  .back-homepage:hover {
    border-color: #000000;
    max-width: 665px;
  }

  .json-text-style {
    max-height: 400px;
    padding: 10px 10px;
    overflow: scroll;
    //word-wrap: break-word;
    //word-break: normal;
    pre {
      //  white-space: pre-wrap;
      //  word-break: break-word;
    }
  }
}

.search-right-detail {
  .el-tabs__item.is-active {
    color: white;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    background: rgba(9, 36, 75, 1);
    color: white;
  }
}
</style>