<template>
  <div class="layout__main">
    <el-container>
      <el-header style="height: 60px">
        <HeaderLayout></HeaderLayout>
      </el-header>
      <el-main>
        <router-view/>
        <footerLayout></footerLayout>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import HeaderLayout from "@/components/headerLayout"
import footerLayout from "@/components/footerLayout"

export default {
  name: "Layout",
  components: {
    HeaderLayout,
    footerLayout
  }
}
</script>

<style lang="scss">
.layout__main {
  height: 100%;
  width: 100%;
  //background: #f6f6f6;
  //display: flex;
  //flex-direction: row;

  .el-header {
    padding: 0;
  }


  .el-main {
    padding: 0;
  }

  .el-container {
    padding: 0;
    margin: 0;
    height: calc(100vh);
  }
}

html, body, #app, .el-container {
  height: 100%;
}
</style>