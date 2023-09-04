<template>
  <div class="wallet-list-dialog__main">
    <el-dialog
        title="Connect Wallet"
        :visible.sync="walletDialogVisible"
        width="430px"
        center>
      <div class="wallet-list-content">
        <div class="wallet-name-box" @click="connectWallet">
          <img class="logo-style" src="../../assets/img/MetaMask_Fox.svg.png" alt="MetaMask">
          MetaMask
        </div>
<!--        <div class="wallet-name-box" @click="openGoogle">-->
<!--          <img class="logo-style" src="../../assets/img/MetaMask_Fox.svg.png" alt="MetaMask">-->
<!--          Othent-->
<!--        </div>-->
      </div>
      <p class="needing-attention">By connecting your wallet you agree to <br/> the Terms of Service and Privacy Policy</p>
    </el-dialog>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
// import { Othent } from 'othent'

export default {
  name: "loginWallet",
  data() {
    return {
      walletDialogVisible: false
    }
  },
  computed: {
    ...mapGetters({
      account: 'account/account'
    }),
  },
  methods: {
    ...mapActions({
      getAccount: 'account/getNewMetaMaskAccount'
    }),
    openDialog() {
      this.walletDialogVisible = true
    },
    /**
     * The old version of getting the account, because it will call the public key,
     * it is not useful when logging in, so only get the account information when logging in
     * @returns {Promise<void>}
     */
    async connectWallet() {
      const account = await this.getAccount()
      if (account && account.length !== 0) {
        this.$router.push({
          name: 'Main'
        })
      } else {
        this.$message.error('Account verification failed')
      }
    },
    async openGoogle() {
      // const othent = await Othent({
      //   API_ID: '64e59f795c581daf3c18f9e7be2ea917'
      // })
      // // const response = await othent.ping()
      // const userInfo = await othent.logIn()
      // console.log(userInfo)
    }
  }
}
</script>

<style lang="scss">
.wallet-list-dialog__main {
  .wallet-list-content {
    width: 100%;
  }

  .wallet-name-box {
    /*width: 320px;*/
    width: 90%;
    height: 48px;
    border-radius: 5px;
    background-color: #ececec;
    margin: 0 auto;
    text-align: center;
    color: #222326;
    font-size: 15px;
    line-height: 48px;
    box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, .3);
    cursor: pointer;
    position: relative;

    .logo-style {
      width: 30px;
      height: 30px;
      position: absolute;
      top: 8px;
      left: 20px;
    }
  }

  .wallet-name-box:hover {
    box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 1);
  }

  .wallet-name-box:nth-child(2) {
    margin: 20px auto;
  }

  .needing-attention {
    width: 260px;
    margin: 60px auto 30px;
    text-align: center;
    color: #acacac;
  }
}

</style>