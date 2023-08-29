<template>
  <div class="footer-layout__main">
    <div class="footer-bottom-text">
      <span>Copyright © 2023 Msc-Project. All rights reserved.</span>
      <div class="footer-box-left">
        <div class="footer-box-left-icon"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "footerLayout"
}
</script>

<style lang="scss">
.footer-layout__main {
  background: #f5f5f5;
  height: 60px;
  padding: 0 40px;

  .footer-bottom-text {
    height: 100%;
    color: #A9A8B0;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-box-left {
    display: flex;
    justify-content: right;
    align-items: center;
  }

  .footer-box-left-icon {
    height: 20px;
    width: 100px;
    background: url("../assets/img/Social-Icon.png");
  }
}
</style>