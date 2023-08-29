<template>
  <div class="home-page__main">
    <el-button type="primary" @click="connectWalletDialog">login</el-button>
    <loginWallet ref="loginWallet"></loginWallet>
  </div>
</template>

<script>
import loginWallet from "@/components/__dialog/loginWallet"

export default {
  name: "homePage",
  components: {
    loginWallet
  },
  methods: {
    connectWalletDialog() {
      this.$refs['loginWallet'].openDialog()
    }
  }
}
</script>

<style lang="scss">
.home-page__main {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>