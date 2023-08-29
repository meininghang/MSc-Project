<template>
  <div class="deposit-page__main">
    <div class="deposit-page-back-homepage" @click="backToHome">
      <i class="el-icon-back"></i>
      BACK
    </div>
    <div class="deposit-box-content">
      <div class="deposit-page-box">
        <div class="deposit-page-title">
          <div class="deposit-page-name">
            <p style="font-size: 18px;color: #09244B;font-weight: 600;margin-bottom: 6px">BUY SPACE</p>
            <p style="color: #A9A8B0;font-size: 14px">Powered by the everpay protocol</p>
          </div>
          <div>
            <el-select
                class="deposit-select-style"
                v-model="value"
                :disabled="false"
                placeholder="choose network"
                @change="changeConnectChain">
              <template slot="prefix">
                <img v-if="value && value === 'Ethereum'" src="../assets/svg/icon_ethereum.svg" alt="" style="margin-top: 7px;">
                <img v-else-if="value && value === 'BSC'" src="../assets/svg/icon_bsc.svg" alt="" style="margin-top: 7px">
                <img v-else-if="value && value === 'Moonbeam'" src="../assets/svg/icon_mbm.svg" alt="" style="margin-top: 7px">
                <i v-else class="el-icon-loading" style="font-size: 24px;margin-top: 7px"></i>
              </template>
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :class="item.iconStyle"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="deposit-page-content">
          <el-form label-position="top" label-width="80px">
            <el-form-item label="CONSUME">
              <el-input placeholder="Input deposit amount" v-model="consumeNumber" @change="inputConsumeNumber"
                        class="input-with-select">
                <el-select v-model="chooseConsume" :disabled="false" slot="append" @change="buySapce" placeholder="choose token"
                           style="padding-left: 5px">
                  <template slot="prefix">
                    <img v-if="chooseConsume && tokenListHasLogo.some(name => name === chooseConsume.toLowerCase())"
                         :src="require(`../assets/token/${chooseConsume.toLowerCase()}.png`)" alt="" width="24" height="24"
                         style="margin-top: 7px;margin-right: 9px">
                    <img v-else :src="require(`../assets/token/default.svg`)" alt="" width="22" height="22" style="margin-top: 7px;margin-right: 9px">
                  </template>
                  <el-option
                      v-for="(item, index) in symbolList"
                      :key="index"
                      :label="item.symbol"
                      :value="item.symbol"
                      style="display: flex;align-items: center;justify-content: flex-start;padding-left: 5px">
                    <img v-if="item.symbol && tokenListHasLogo.some(name => name === item.symbol.toLowerCase())"
                         :src="require(`../assets/token/${item.symbol && item.symbol.toLowerCase()}.png`)" alt="" width="24" height="24"
                         style="margin-right: 5px">
                    <img v-else :src="require(`../assets/token/default.svg`)" alt="" width="22" height="22" style="margin-right: 5px">
                    <span>{{ item.symbol }}</span>
                  </el-option>
                </el-select>
              </el-input>
              <p class="deposit-page-Reminder-content">
              </p>
            </el-form-item>
            <p class="exchange-icon-title">
              <i class="el-icon-sort" style="font-weight: bold"></i>
            </p>
            <el-form-item label="BUY">
              <el-input v-model="buyNumber" :disabled="true">
                <p slot="append" style="display: flex;justify-content: center;align-items: center">
                  <img src="../assets/svg/database-power.svg" alt="">
                  <span style="margin-left: 8px">MB</span>
                </p>
              </el-input>
              <p v-if="chooseConsume" class="deposit-page-Reminder-content">
                <!--              <span v-if="chooseConsume && chooseConsume !== 'AR' && hasPriceNumber">-->
                <!--                1 {{ chooseConsume }} ≈ <i :class="toARPrice ? '' : 'el-icon-loading'">{{ toARPrice }}</i> AR，-->
                <!--              </span>-->
                1{{ chooseConsume }} ≈ <i :class="toARPrice ? '' : 'el-icon-loading'">{{ toARPrice }}</i> GB Storage
              </p>
            </el-form-item>
          </el-form>
          <p class="deposit-page-button" @click="buyStorage">DEPOSIT</p>
          <p class="deposit-page-Reminder-content" style="margin-left: 10px">
            The purchase space size is based on AR Token conversion, showing that the space size will fluctuate slightly
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex"
import {ChainType, tokenListHasLogo} from '@/utils/constant/chainConst'
import {toBN} from '@/utils/util'
import {providers} from "ethers"
import redStone from 'redstone-api'

export default {
  name: 'Deposit',
  data() {
    return {
      tokenListHasLogo,
      value: "",
      chooseConsume: '',
      inputNumber: undefined,
      buyNumber: undefined,
      consumeNumber: undefined,
      sendParam: undefined,
      amount: '0',
      balance: '0',
      toARPrice: undefined,
      newCurrencyInfo: undefined,
      isReady: false,
      canNotPay: false,
      hasPriceNumber: false,
      options: [
        {
          value: 'Ethereum',
          label: 'Ethereum',
          iconStyle: 'eth-icon-style'
        },
        {
          value: 'BSC',
          label: 'BSC',
          iconStyle: 'bsc-icon-style'
        },
        {
          value: 'Moonbeam',
          label: 'Moonbeam',
          iconStyle: 'mbm-icon-style'
        }],
      symbolList: [],
      allTokenList: [],
    }
  },
  computed: {
    ...mapGetters({
      accountStr: 'account/account',
      publishOrderList: 'order/getPublishOrders',
    }),
  },
  async mounted() {
    this.isReady = true
    await this.getSelectList()
    this.isReady = true
    // const network = await window.ethereum.networkVersion
    const provider = new providers.Web3Provider(window.ethereum)
    const network = await provider.getNetwork()
    this.checkChainId(network.chainId)
    this.changeConnectChain()
  },
  methods: {
    ...mapActions({
      getInfo: 'account/getAccountInfo',
      getAllSymbolPrice: "account/getAllSymbolPrice",
      buyDeposit: 'account/buyDeposit',
      getBalances: "account/getAccountBalances",
      getFeeInfo: "account/getFeeInfo",
      getFee: "account/getFee"
    }),
    backToHome() {
      this.$router.push({
        name: "Main"
      })
    },
    //
    checkChainId(id) {
      if (id === 1) {
        this.value = 'Ethereum'
      } else if (id === 1284) {
        this.value = 'Moonbeam'
      } else if (id === 56) {
        this.value = 'BSC'
      }
      this.symbolList = this.allTokenList.filter(item => item.chainType.toLocaleLowerCase().includes(this.value.toLocaleLowerCase()))
    },
    async getSelectList() {
      // Gets the tokenList for the current account
      const tokenList = await this.getInfo()
      const formatToken = tokenList.map(item => {
        return {
          tag: item.tag,
          symbol: item.symbol,
          crossChainInfoList: item.crossChainInfoList
        }
      })
      const balances = await this.getBalances(this.accountStr)
      // Merge the tokenList and balance list
      let list = balances.reduce((pre, cur) => {
        let target = pre.find(ee => ee.symbol === cur.symbol)
        if (target) {
          Object.assign(target, cur)
        }
        return pre
      }, formatToken)
      // Extract the symbol from the list and use it to find the price
      let symbolStr = list.map(item => item.symbol)
      symbolStr = symbolStr.join(",")
      // Get the corresponding price from the symbol list
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
      this.allTokenList = final
    },

    inputConsumeNumber() {
      if (!this.consumeNumber) {
        return
      }
      this.buyNumber = Math.round((Number(this.consumeNumber) * Number(this.toARPrice) * 1024) * 1000) / 1000 || 0
      this.sendParam = {
        ...this.sendParam,
        amount: this.consumeNumber
      }
    },
    // Calculate the storage of the selected currency in real time
    async buySapce() {
      if (!this.chooseConsume) {
        return
      }
      this.toARPrice = undefined

      const pricceObj = this.symbolList.filter(item => item.symbol === this.chooseConsume)
      this.balance = pricceObj[0].balance
      const provider = new providers.Web3Provider(window.ethereum)
      const balanceList = await provider.getBalance(this.accountStr)
      console.log(balanceList)

      try {
        this.hasPriceNumber = true
        const pri = await redStone.getPrice(["AR", `${this.chooseConsume}`])
        this.newCurrencyInfo = pri[`${this.chooseConsume}`]
        this.canNotPay = !pri[`${this.chooseConsume}`].symbol
        this.amount = Math.round((pri[`${this.chooseConsume}`].value * this.balance) * 100) / 100
        const total = Math.round((pri[`${this.chooseConsume}`].value / pri['AR'].value) * 100) / 100 || 0
        this.toARPrice = Math.round(total * 0.76 * 100) / 100
      } catch (e) {
        this.amount = 0
        this.hasPriceNumber = false
        this.chooseConsume = ''
        this.canNotPay = false
        this.$message.error('This currency is not supported')
      }
      this.buyNumber = undefined
      this.sendParam = {
        account: this.accountStr,
        tag: pricceObj[0].tag,
        amount: this.consumeNumber,
        chainType: this.value.toLowerCase()
      }
    },
    async buyStorage() {
      if (!this.sendParam) {
        return this.$message.error("please input amount")
      }
      try {
        await this.buyDeposit(this.sendParam)
        this.$message.success('deposit success')
      } catch (e) {
        this.consumeNumber = ''
        this.buyNumber = ''
        this.$message.error('deposit error')
      }
    },
    async connectAfterAddAsync(chainId, params) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId}]
        })
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [params]
          })
        } else {
          // handle other "switch" errors
          throw switchError
        }
      }
    },
    // Modify the connection network. Currently, three types are supported
    async changeConnectChain(type) {
      const chainType = type
      if (chainType === ChainType.ethereum) {
        const chainId = '0x' + toBN(1).toString(16)
        await this.connectAfterAddAsync(chainId, {})
      } else if (chainType === ChainType.moon) {
        const chainId = '0x' + toBN(1284).toString(16)
        await this.connectAfterAddAsync(chainId, {
          chainId: chainId,
          chainName: 'Moonbeam',
          nativeCurrency: {
            name: 'GLMR',
            symbol: 'GLMR',
            decimals: 18
          },
          rpcUrls: ['https://rpc.api.moonbeam.network'],
          blockExplorerUrls: ['https://moonscan.io/']
        })
        // } else if (chainType === ChainType.bsc) {
        //   const chainId = '0x' + toBN(97).toString(16)
        //   await this.connectAfterAddAsync(chainId, {
        //     chainId: chainId,
        //     chainName: 'BSC Testnet',
        //     nativeCurrency: {
        //       name: 'BNB',
        //       symbol: 'BNB',
        //       decimals: 18
        //     },
        //     rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
        //     blockExplorerUrls: ['https://testnet.bscscan.com/']
        //   })
      } else if (chainType === ChainType.bsc) {
        const chainId = '0x' + toBN(56).toString(16)
        await this.connectAfterAddAsync(chainId, {
          chainId: chainId,
          chainName: 'BSC Mainnet',
          nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
          },
          rpcUrls: ['https://bsc-dataseed1.ninicoin.io'],
          blockExplorerUrls: ['https://bscscan.com/']
        })
      }
      this.symbolList = this.allTokenList.filter(item => item.chainType.toLocaleLowerCase().includes(this.value.toLocaleLowerCase()))
    }

  }
}
</script>

<style lang="scss">
.deposit-page__main {
  width: 100%;
  min-height: 90vh;
  //overflow: hidden;
  //position: relative;
  .el-input--prefix .el-input__inner {
    padding-left: 34px;
  }
}

.deposit-page-back-homepage {
  width: 107px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin: 15px 0 0 50px;
  border: 2px solid #EFECFD;
  background: #F7F6FE;
  color: #6447F2;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.deposit-page-back-homepage:hover {
  border-color: #6447F2;
}

.deposit-box-content {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.deposit-page-box {
  width: 498px;
  height: 605px;
  background: #FFFFFF;
  box-shadow: 0px 6px 6px -6px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.4);
  border-radius: 12px;
}

.deposit-page-title {
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #EFEEF1;
}

.exchange-icon-title {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #FAF9F8;
  color: #09244B;
  font-size: 17px;
  font-weight: bold;
  text-align: center;
  line-height: 42px;
  margin: 0px auto;
}

.deposit-page-title .deposit-select-style {
  width: 148px;
  /*height: 44px;*/
  border-radius: 10px;
  background: #FAF9F8;
}

.deposit-page-content {
  padding: 28px 45px 0 53px;
}

.deposit-page-Reminder-content {
  font-size: 12px;
  color: #A9A8AF;
}

.deposit-page-button {
  /*width: 173px;*/
  padding: 11px 40px;
  text-align: center;
  font-size: 19px;
  font-weight: bold;
  color: white;
  background: #6447F2;
  border-radius: 14px;
  border: 2px solid #09244B;
  cursor: pointer;
  margin-bottom: 17px;
  margin-top: 40px;
  /*cursor: not-allowed;*/
}

.eth-icon-style {
  background: url("../assets/svg/icon_ethereum.svg") no-repeat;
  background-position-x: 5px;
  background-position-y: 5px;
}

.bsc-icon-style {
  /*background: url("../assets/svg/icon_bsc.svg") no-repeat;*/
  background-position-x: 5px;
  background-position-y: 5px;
}

.mbm-icon-style {
  /*background: url("../assets/svg/icon_mbm.svg") no-repeat;*/
  background-position-x: 5px;
  background-position-y: 5px;
}

.el-select-dropdown__item {
  padding: 0 20px 0 35px;
}

.deposit-page__main .el-form-item__label {
  color: #A9A8AF;
  font-weight: bold;
}

/*.deposit-page-content .el-select-dropdown__item {*/
/*  padding: 0;*/
/*}*/
.deposit-page__main .el-input-group {
  border-radius: 10px;
  /*border: 1px solid #e5e3e6;*/
}

.deposit-page__main .el-input-group__append {
  width: 94px;
}

.deposit-page__main .el-form--label-top .el-form-item__label {
  padding: 0;
}

</style>