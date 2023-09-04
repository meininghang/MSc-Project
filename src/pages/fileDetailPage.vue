<template>
  <div class="file-detail-page-style">
    <div class="file-detail-page__main" >
      <div v-loading="loading">
        <div class="file-detail-page-back-homepage" @click="backToHome">
          <i class="el-icon-back"></i>
          BACK
        </div>
        <div class="file-detail-content">
          <div class="dile-detail-left" style="width: 665px;height: auto">
            <div v-if="fileDetail.fileType && fileDetail.fileType.includes('image')">
              <img width="665" height="auto" class="detail-left-style" :src="`https://arseed.web3infra.dev/${fileItemId}`"  alt=""/>
            </div>
            <div v-else-if="fileDetail.fileType && fileDetail.fileType.includes('audio')">
              <audio loop controls :src="`https://arseed.web3infra.dev/${fileItemId}`">
                Your browser does not support the audio tag.
              </audio>
            </div>
            <div v-else-if="fileDetail.fileType && fileDetail.fileType.includes('video')">

              <video width="665" class="detail-left-style" height="auto" :src="`https://arseed.web3infra.dev/${fileItemId}`" controls="controls">
                Your browser does not support the video tag
              </video>
            </div>
            <div v-else-if="fileDetail.fileType && (fileDetail.fileType.includes('pdf') || fileDetail.fileType.includes('text'))">
              <iframe id="iframe" width="665" height="665" :src="`https://arseed.web3infra.dev/${fileItemId}`"></iframe>
            </div>
            <div v-else-if="fileDetail.isMSCText && fileDetail.fileType.includes('json')">
              <p v-html="fileDetail.info" style="width: 665px;height: 665px"></p>
            </div>
            <div v-else-if="fileDetail.fileType && !fileDetail.isMSCText && (fileDetail.fileType.includes('json') || fileDetail.fileType.includes('text'))">
              <div class="json-text-style">
                <pre>{{fileDetail.info}}</pre>
                <!--                {{JSON.stringify(JSON.parse(fileDetail.body), null, '\t')}}-->
              </div>
            </div>
            <div v-else>
              <p class="file-detail-other-type-show" @click="viewFile">
                <i class="el-icon-paperclip"></i>
                {{ fileDetail.fileName }}({{fileDetail.fileSize}})
              </p>
            </div>
          </div>
          <div class="dile-detail-right">
            <div class="file-detail-tight-title">
              <div class="file-detail-fight-name-info">
                <div>
                  <p
                      class="span-table-text"
                      style="display: flex;align-items: center">
                    <fileIconView :file-type="fileDetail.fileType"></fileIconView>
                    {{ fileDetail.fileName }}
                  </p>
                </div>
                <p style="width: 300px">
                  <el-tag v-for="item in fileDetail.newTags" :key="item.name" type="info">{{ item.name }}</el-tag>
                </p>
              </div>
              <div class="file-detail-button">
                <p class="download-button" style="display: flex;align-items: center;justify-content: center" @click="download">
                  <img src="../assets/svg/Download.svg" style="margin-right: 5px" alt="">
                  DOWNLOAD ({{fileDetail.fileSize}})
                </p>
                <p class="copy-button" style="display: flex;align-items: center;justify-content: center" id="copyBtn" @click="copyUrl">
                  <img src="../assets/svg/link.svg" style="margin-right: 5px" alt="">
                  COPY URL
                </p>
                <p class="copy-button explorer-style" style="display: flex;align-items: center;justify-content: center" @click="clickToARTxPage">
                  <img src="../assets/svg/icon_logo.svg" style="margin-right: 5px" alt="">
                  AR EXPLORER
                </p>
              </div>
            </div>
            <el-divider></el-divider>
            <div class="file-detail-tight-content">
              <p><span class="file-detail-content-name">
              Timestamp:</span> {{ txInfoByHash.timeStampStr }}</p>
              <p><span class="file-detail-content-name">
              Size:</span> {{ fileDetail.fileSize }}</p>
              <p><span class="file-detail-content-name">
              File Type:</span> {{ fileDetail.fileType }}</p>
              <!--            <p><span class="file-detail-content-name">Age:</span> </p>-->
              <!--            <p><span class="file-detail-content-name">Tx Index:</span> </p>-->
              <!--            <p><span class="file-detail-content-name">Height:</span> {{ txInfoByHash.rawId }}</p>-->
              <!--            <p><span class="file-detail-content-name">Confirmations:</span> </p>-->
              <p><span class="file-detail-content-name">
              Fee:</span> {{ `${fileDetail.fee / (Math.pow(10, Number(fileDetail.decimals)))}${fileDetail.currency}` }}</p>
            </div>
            <div v-if="txInfoByHash.sig" class="file-detail-tight-footer">
              <p class="title">Signature:</p>
              <p class="content">{{ txInfoByHash.sig }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex"
// import {exportOrderExcel} from "@/utils/util"
import clipboard from 'clipboard'
import fileIconView from "@/components/commonComponent/fileIconView"

export default {
  name: "fileDetailPage",
  components: {
    fileIconView
  },
  data() {
    return {
      detailInfo: undefined,
      // url: undefined,
      textInfo: undefined,
      chooseConsume: undefined,
      clipboard: null,
      loading: false,
      fileItemId: false,
      fileDetail: {}
    }
  },
  computed: {
    ...mapGetters({
      accountStr: 'account/account',
      allOrderList: 'order/getAllOrder',
      txInfoByHash: 'order/txInfoByHash'
    }),
    copyText() {
      return `https://arseed.web3infra.dev/${this.$route.params.id}`
    },
  },
  async mounted() {
    let obj = JSON.parse(sessionStorage.getItem('FILE_DETAIL_JSON'))
    obj.newTags = obj.tags.filter(item => !((item.name.toUpperCase()).indexOf('Name'.toUpperCase()) >= 0 || (item.name.toUpperCase()).indexOf('type'.toUpperCase()) >= 0))
    if (obj.tags.find(item => item.name.toUpperCase() === 'weave-collect'.toUpperCase())) {
      obj.isCollet = true
    }
    this.fileDetail = obj
    this.$nextTick(async () => {
      if (this.fileDetail.isCollet) {
        const info = await this.getOrderDetail(this.fileDetail.itemId)
        this.fileDetail.collectHash = info.hash ? info.hash : info.itemId
        this.fileItemId = info.hash ? info.hash : info.itemId
        this.fileDetail.info = info.info
      } else {
        this.fileItemId = this.$route.params.id
      }
    })

    this.initCopyBtn()
  },
  destroyed() {
    if (this.clipboard) {
      // this.clipboard.destroyed()
    }
  },
  methods: {
    ...mapActions({
      getOrders: 'order/getOrderList',
      getOrderDetail: 'order/getOrderDetail',
      getTxInfo: 'order/getTxByHash'
    }),
    backToHome() {
      // this.$router.push({
      //   name: "Main"
      // })
      this.$router.go(-1)
      sessionStorage.setItem('FILE_DETAIL_JSON', '')
    },
    clickToARTxPage() {
      window.open(`https://viewblock.io/arweave/tx/${this.fileDetail.itemId}`, "_blank")
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
      this.clipboard = new clipboard("#copyBtn", { text: () => this.copyText })
    },
    download() {
      // const data = new Blob([this.detailInfo])
      // const name = this.fileDetail.fileName
      // exportOrderExcel(data, name)
      // window.open(`https://arweave.net/${this.fileDetail.itemId}`, "_blank")
      if (this.fileDetail.isCollet) {
        window.open(`https://arseed.web3infra.dev/${this.fileDetail.collectHash}`, "_blank")
      } else {
        window.open(`https://arseed.web3infra.dev/${this.fileDetail.itemId}`, "_blank")
      }
    },
    viewFile() {
      if (this.fileDetail.isCollet) {
        window.open(`https://arseed.web3infra.dev/${this.fileDetail.collectHash}`)
      } else {
        window.open(`https://arseed.web3infra.dev/${this.fileDetail.itemId}`)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.file-detail-page-style {
  width: 100%;
  min-height: 85vh;
  /*height: 90vh;*/
}
.file-detail-page__main {
  width: 1350px;
  min-height: 500px;
  /*height: 90vh;*/
  margin: 36px auto;
  text-align: center;
  .file-detail-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
  .download-button {
    width: 250px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    border: 2px solid #000000;
    background: #000000;
    color: #ffffff;
    border-radius: 10px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
  }
  .copy-button {
    width: 142px;
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
  }
  .explorer-style {
    width: 163px;
  }
  .json-text-style {
    max-height: 400px;
    padding: 10px 10px;
    overflow: scroll;
    text-align: left;
    //word-wrap: break-word;
    //word-break: normal;
    pre {
      //  white-space: pre-wrap;
      //  word-break: break-word;
    }
  }
}
.file-detail-page-back-homepage {
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
.file-detail-page-back-homepage:hover {
  border-color: #000000;
  max-width: 665px;
}
.file-detail-content {
  display: flex;
  justify-content: space-between;
  min-height: 665px;
}
.dile-detail-left {
  margin-top: 28px;
}
.dile-detail-right {
  width: 611px;
  /*height: 665px;*/
  text-align: left;
}
.file-detail-content-name {
  display: inline-block;
  min-width: 96px;
  margin-right: 32px;
  color: #09244B;
  font-weight: bold;
}
.file-detail-tight-content span {
  font-size: 14px;
  color: #09244B;
}
.file-detail-tight-content p {
  font-size: 14px;
  color: #09244B;
  height: 29px;
}
.file-detail-fight-name-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.file-detail-fight-name-info .span-table-text {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #09244B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.file-detail-fight-name-info .el-tag {
  margin: 0 4px 8px 4px;
}
.file-detail-tag-list {
  margin-bottom: 8px;
  border: none;
}

.file-detail-tight-footer {
  width: 611px;
  height: 97px;
  background: #FBFBFB;
  padding: 10px;
  border-radius: 10px;
  margin-top: 40px;
}
.file-detail-tight-footer .content{
  font-size: 11px;
  color: #A9A8B0;
  width: 611px;
  line-height: 19px;
  word-wrap: break-word;
  word-break: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
.file-detail-tight-footer .title{
  font-size: 12px;
  font-weight: 700;
  color: #606770;
}
.detail-left-style {
  max-width: 665px;
  max-height: 665px;
}
.file-detail-other-type-show {
  display: inline-block;
  background: #F7F6FE;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}
</style>