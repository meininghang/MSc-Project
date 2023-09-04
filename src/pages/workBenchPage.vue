<template>
  <div class="work-bench-page__main">
    <div class="chart-display-show">
      <chartBanner ref="chartMain"></chartBanner>
    </div>
    <div class="content-top">
      <div class="box-style left-storage">
        <storage ref="storage" :loading="loading" :usedNumber="usedNumber"></storage>
      </div>
      <div class="box-style right-upload">
        <el-upload
            class="upload-box"
            :file-list="fileList"
            :show-file-list="false"
            drag
            action
            :http-request="uploadFile"
            multiple>
          <div class="upload-box-content">
            <i class="el-icon-upload upload-icon-i" style="margin-right: 5px"></i>
            <p>
              Drop file here, or <span style="color: #6447F2">browse. </span>one file at a time.
            </p>
          </div>
        </el-upload>
      </div>
    </div>
    <div class="content-list">
      <fileList
          :allOrderList="tableData"
          :totalTableLength="totalTableLength"
          :loading="loading"
          @changeTableData="changeTableData"
          @changePagination="changePagination"></fileList>
    </div>
    <uploadFile
        ref="uploadFile"
        @uploadTagAndFile="uploadTagAndFile"
        @changeName="changeName"></uploadFile>
    <commentDialog></commentDialog>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import Storage from "@/components/storage"
import {getBundleFee, getItemMeta, genAPI} from "arseeding-js"
import Bignumber from "bignumber.js"
import fileList from "@/components/commonComponent/list"
import {reportUrl} from '@/utils/constant/apiConst'
import {paymentStatus} from '@/utils/constant/chainConst'
import uploadFile from '@/components/__dialog/uploadFileDialog'
import chartBanner from "@/components/chartBanner"
import commentDialog from "@/components/__dialog/commentDialog"

export default {
  name: "HomePage",
  components: {
    Storage,
    fileList,
    uploadFile,
    chartBanner,
    commentDialog
  },
  data() {
    return {
      fileList: [],
      instance: {},
      pubId: undefined,
      tableData: undefined,
      fileInfo: undefined,
      ShowNextStep: false,
      balance: undefined,
      selectedSymbol: '',
      loading: false,
      symbolList: [],
      selectSymbolValue: "ETH",
      totalTableLength: 0,
      sendApi: undefined,
      changeFileName: '',
    }
  },
  computed: {
    ...mapGetters({
      accountStr: 'account/account',
      allOrderList: 'order/getOrders',
      // selectedSymbol: 'account/selectedSymbol',
      // balance: 'account/balance',
      // instance: 'account/instanceInfo'
    }),
    usedNumber() {
      return Math.round((this.balance * 0.76) * 100) / 100
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'FileDetail') {
      this.setKeepAliveInclude(['HomePage'])
    } else if (to.name === 'Deposit') {
      this.setKeepAliveInclude(['HomePage'])
    } else {
      this.setKeepAliveInclude([])
    }
    // next()
    setTimeout(() => {
      next();
    }, 10);
  },
  async mounted() {
    await this.getList()
  },
  methods: {
    ...mapActions({
      getAccount: 'account/getMetaMaskAccount',
      getBalances: "account/getAccountBalances",
      getOrders: 'order/getOrders',
      searchList: 'order/searchArweave',
      getInfo: 'account/getAccountInfo',
      updateSelectSymbol: "account/updateSelectSymbol",
      getAllSymbolPrice: "account/getAllSymbolPrice",
      getFeeInfo: "account/getFeeInfo",
      setKeepAliveInclude: "keepAliveInclude/setKeepAliveInclude"
    }),
    /**
     * Pull the file list and calculate the storage size
     * @returns {Promise<void>}
     */
    async getList() {
      this.loading = true
      // await this.getAccount()
      await this.getOrders(this.accountStr)
      const tokenList = await this.getInfo()
      const list = await this.getBalances(this.accountStr)
      const totalStorage = await this.formatSymbol(tokenList, list)
      list.sort((a, b) => {
        return b.balance - a.balance
      })
      this.selectedSymbol = list[0].symbol
      this.balance = list[0].balance
      const usedNumber = this.getUsedStorage()
      this.$refs['storage'].getStorage(usedNumber, totalStorage)
      this.$refs['chartMain'].inOrigin(usedNumber, totalStorage)
      await this.getMyStorageList()
    },
    /**
     * Gets tags for each file message(The pull list interface does not return tags and other information, need to pull again)
     * @returns {Promise<void>}
     */
    async getMyStorageList() {
      this.tableData = this.allOrderList.slice(0, 10)
      this.totalTableLength = this.allOrderList.length
      this.loading = false
      this.$nextTick(async () => {
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].paymentStatus !== paymentStatus.EXPIRED) {
            const id = this.tableData[i].itemId
            this.tableData[i].metaInfo = await getItemMeta(reportUrl, id)
            this.tableData[i] = this.formatMetaInfo(this.tableData[i])
          } else {
            this.tableData[i].metaInfo = {}
          }
        }
      })
    },
    /**
     * Upload submission files, send transactions
     * @param files
     * @param tags
     * @returns {Promise<void>}
     */
    async combineFileList(files, tags) {
      // const selectedSymbol = this.selectedSymbol ? this.selectedSymbol : JSON.parse(sessionStorage.getItem("SELECT_SYMBOL_INFO"))
      const file = files.file
      const fee = await getBundleFee(reportUrl, files.file.size, this.selectedSymbol)
      const formatedFee = new Bignumber(fee.finalFee).dividedBy(new Bignumber(10).pow(fee.decimals)).toString()
      if (+this.balance >= +formatedFee) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
          const data = reader.result
          const ops = {
            tags: [
              {name: "FileName", value: this.changeFileName ? this.changeFileName : file.name},
              {name: "Content-Type", value: file.type},
              // The official version has two new fixed tags
              {name: "APP-Name", value: "Msc-Project"},
              // Facilitate adot to obtain data and display increased
              {name: "file-size", value: String(files.file.size)},
              ...tags
            ]
          }
          if (!this.sendApi) {
            this.sendApi = await genAPI(window.ethereum)
          }
          try {
            //
            const res = await this.sendApi.sendAndPay(reportUrl, data, this.selectedSymbol, ops)
            this.submitResp = JSON.stringify(res)
            this.$refs['uploadFile'].cancelUpload()
            console.log(this.submitResp)
          } catch (e) {
            this.$message.error(e.message)
            this.$refs['uploadFile'].cancelUpload()
          }
          await this.getOrders(this.accountStr)
          await this.getList()
        }
      } else {
        alert(`need ${formatedFee} ${this.selectedSymbol} to upload`)
      }
    },
    uploadTagAndFile(tagList) {
      this.combineFileList(this.fileInfo, tagList)
    },
    changeName(name) {
      this.changeFileName = name
    },
    /**
     * Serialize the pulled tags information(Corresponds to the tags in the combineFileList method)
     * @param item
     * @returns {*&{fileName, fileType: string, tags: *[]}}
     */
    formatMetaInfo(item) {
      let info = {
        ...item,
        fileName: item.id,
        fileType: '',
        tags: []
      }
      if (item.metaInfo && item.metaInfo.tags && item.metaInfo.tags.length !== 0) {
        const list = item.metaInfo.tags.filter(item => item.name && (item.name.toUpperCase() === 'name'.toUpperCase() || item.name.toUpperCase() === 'fileName'.toUpperCase()))
        const typeList = item.metaInfo.tags.filter(item => item.name && (item.name.toUpperCase() === 'Content-Type'.toUpperCase() || item.name.toUpperCase() === 'type'.toUpperCase()))
        info.fileName = list && list.length !== 0 ? list[0].value : item.id
        info.fileType = typeList && typeList.length !== 0 ? typeList[0].value : ''
        info.tags = item.metaInfo.tags
        const collectList = info.tags.filter(item => item.name.toUpperCase() === 'weave-collect'.toUpperCase())
        item.isCollect = collectList && collectList.length !== 0
      }
      return info
    },
    uploadFile(fileList) {
      this.fileInfo = fileList
      // this.ShowNextStep = true
      // if (this.ShowNextStep) {
        this.$refs['uploadFile'].openDialog(fileList)
      // }
    },
    changeTableData(value) {
      this.tableData = this.tableData.map(item => {
        if (item.itemId === value.itemId) {
          item.showButton = true
        } else {
          item.showButton = false
        }
        return item
      })
    },
    /**
     * Page turning
     * @param pageIndex
     */
    changePagination(pageIndex) {
      this.tableData = this.allOrderList.slice((pageIndex - 1) * 10, pageIndex * 10)
      this.$nextTick(async () => {
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].paymentStatus !== paymentStatus.EXPIRED) {
            const id = this.tableData[i].itemId
            this.tableData[i].metaInfo = await getItemMeta(reportUrl, id)
            this.tableData[i] = this.formatMetaInfo(this.tableData[i])
          } else {
            this.tableData[i].metaInfo = {}
          }
        }
      })
    },
    /**
     * Computing symbol
     * @param tokenList
     * @param balances
     * @returns {Promise<number>}
     */
    async formatSymbol(tokenList, balances) {
      const formatToken = tokenList.map(item => {
        return {
          tag: item.tag,
          symbol: item.symbol
        }
      })
      let list = balances.reduce((pre, cur) => {
        let target = pre.find(ee => ee.symbol === cur.symbol)
        if (target) {
          Object.assign(target, cur)
        }
        return pre
      }, formatToken)
      let symbolStr = list.map(item => item.symbol)
      symbolStr = symbolStr.join(",")
      const resultObj = await this.getAllSymbolPrice(symbolStr)
      const resultList = Object.values(resultObj.data).map(item => {
        return {
          value: item.value,
          symbol: item.symbol
        }
      })
      let final = list.reduce((pre, cur) => {
        let target = pre.find(ee => ee.symbol === cur.symbol)
        if (target) {
          Object.assign(target, cur)
        } else {
          pre.push(cur)
        }
        return pre
      }, resultList)
      this.symbolList = final
      const number = final.reduce(function(total, cur) {
        const value = cur.value ? cur.value : 0
        return total + Math.round((cur.balance * value) * 100) / 100
      }, 0)
      const feeInfo = await this.getFeeInfo('USDC')
      // total*（10^decimals）/ finalFee
      const decimalNumber = (Math.pow(10, Number(feeInfo.data.decimals)))
      const resul = number * decimalNumber / Number(feeInfo.data.finalFee)
      return Math.round(resul * 100) / 100
    },
    getUsedStorage() {
      const sizeList = this.allOrderList.map(item => item.size)
      const sizeTotal = sizeList.reduce(function(total, cur) {
        return total + cur
      }, 0)
      return Math.round((sizeTotal / 1024 / 1024) * 100) / 100
    }
  }
}
</script>

<style lang="scss">
.work-bench-page__main {
  width: 1024px;
  min-height: 90vh;
  text-align: center;
  margin: 0 auto;

  .chart-display-show {
    margin-top: 30px;
  }

  .content-top {
    margin-top: 30px;
    margin-bottom: 20px;
    height: 300px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .box-style {
      height: 300px;
      //border: 3px solid #222326;
      border-radius: 20px;
      background: #f5f5f5;
    }

    .left-storage {
      width: 600px;

    }

    .right-upload {
      width: 400px;
    }

    .upload-box-content {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      flex-direction: column;
    }

    .upload-box {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .el-icon-upload {
      font-size: 48px;
      //line-height: 100px;
    }

    .upload-icon-i {
      display: inline-block;
    }
  }

  .content-list {
    min-height: 300px;
    border-radius: 20px;
    //background: #f5f5f5;
    margin-bottom: 30px;
    margin-top: 30px;
  }

  .el-upload, .el-upload-dragger {
    width: 100%;
    height: 100%;
    //border: 3px solid #222326;
  }

  .el-upload-dragger {
    border-radius: 20px;
    border: 3px dashed #d9d9d9;
  }

  .el-upload-dragger .el-icon-upload {
    margin: 0;
  }
}
</style>