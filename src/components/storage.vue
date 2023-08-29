<template>
  <div class="storage-component__main">
    <!--    <el-skeleton :rows="3" animated />-->
    <div class="storage-left">
      <p class="storage-title">Storage</p>
      <div class="storage-number">
        <div class="storage-number-box">
          <p class="storage-text-title">TOTAL</p>
          <p class="storage-text-bold">{{ totalNumber || '--MB' }}</p>
          <p class="storage-text-number">≈ {{ ARNumber || '--' }}AR</p>
        </div>
        <div class="storage-number-box">
          <p class="storage-text-title">USED</p>
          <!--          <p class="storage-text-bold">{{ usedNumber || 0 }} GB</p>-->
          <p class="storage-text-bold">{{ usedNumber || '--' }} MB</p>
        </div>
      </div>
      <div class="storage-deposit-box">
        <p class="storage-deposit-text" @click="toDeposit">DEPOSIT</p>
        <!--        <p class="storage-deposit-text">COME SOON</p>-->
        <p class="storage-deposit-info">The purchase space size is based on AR Token conversion, showing that the space size will fluctuate
          slightly</p>
      </div>
    </div>
    <!--    <div class="storage-pie-roseType">-->
    <!--      <div class="pie" ref="pie" style="width: 281px; height: 281px;z-index: 10"></div>-->
    <!--      <div class="center-pie-style"></div>-->
    <!--      <div class="center-pie-bg"></div>-->
    <!--    </div>-->
  </div>
</template>

<script>
export default {
  name: "accountInfo",
  data() {
    return {
      usedNumber: undefined,
      totalNumber: undefined,
      ARNumber: undefined,
    }
  },
  methods: {
    getStorage(usedNumber, totalNumber) {
      this.usedNumber = usedNumber
      this.totalNumber = this.formatTotalNumber(totalNumber)
      this.ARNumber = Math.round(((totalNumber / 1024) / 0.76) * 100) / 100
    },
    formatTotalNumber(number) {
      const formatN = Math.round(number / 1024 * 100) / 100
      if (formatN > 1) {
        return `${formatN} GB`
      } else {
        return `${number} MB`
      }
    },
    toDeposit() {
      this.$router.push({
        name: "Deposit",
      })
    }
  }
}
</script>

<style lang="scss">
.storage-component__main {
  /*background: #FCFCFB;*/
  /*width: 804px;*/
  border-radius: 30px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .storage-left {
    padding: 10px 0 0 30px;
  }

  .storage-title {
    font-size: 30px;
    font-family: "Baloo Tamma 2";
    color: #09244B;
    margin-bottom: 33px;
    text-align: left;
    font-weight: bold;
  }

  .storage-number {
    width: 278px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
  }

  .storage-number-box {
    text-align: left;
  }

  .storage-text-title {
    color: #6447F2;
    font-size: 14px;
    margin-bottom: 6px;
  }

  .storage-text-bold {
    font-weight: bold;
    font-size: 26px;
    color: #09244B;
  }

  .storage-text-number {
    color: #A8A5B7;
    font-size: 14px;
  }

  .storage-deposit-text {
    width: 173px;
    padding: 11px 40px;
    font-size: 19px;
    font-weight: bold;
    color: white;
    background: #000000;
    /*background: #7E8597;*/
    border-radius: 14px;
    border: 2px solid #000000;
    cursor: pointer;
    margin-bottom: 17px;
    /*cursor: not-allowed;*/
  }

  .storage-deposit-info {
    font-size: 11px;
    color: #A9A8B0;
    text-align: left;
    width: 400px;
  }

  .storage-pie-roseType {
    position: relative;
    z-index: 10;
  }

  .center-pie-bg {
    width: 172px;
    height: 172px;
    border-radius: 50%;
    background: #ECEDEE;
    position: absolute;
    top: 30px;
    left: 15px;
    z-index: -1;
  }

  .center-pie-style {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: radial-gradient(32.08% 32.08% at 50.94% 49.06%, #8268FF 0%, #6C4EFF 100%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */
  ;
    /* #6447F2 */

    border: 2px solid #6447F2;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 0px 10px rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 110px;
    left: 110px;
    z-index: 12;
  }
}
</style>