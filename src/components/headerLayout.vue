<template>
  <div class="header-layout__main">
    <div class="header-style-about">
      <span class="link-btn">Msc-Project</span>
    </div>
   <div class="header-right-content">
     <div class="layout-header-input">
       <el-button icon="el-icon-edit" style="width: 150px;margin-right: 10px" @click="writeContent">Write Content</el-button>
     </div>
     <div class="layout-header-input">
       <el-input
           v-model="searchInputValue"
           prefix-icon="el-icon-search"
           placeholder="Basic usage"
           width="360"
           @change="searchValue"
       ></el-input>
     </div>
     <div class="layout-header-select">
       <!-- account-->
       <div class="layout-header-right-box">
         <el-dropdown trigger="click" @command="handleCommand">
              <span class="layout-header-balance">
                <img src="../assets/img/MetaMask.png" alt="" width="25" height="25" style="margin-right: 5px">
                <!--              {{ selectedSymbol ? balance : 0 }}{{selectedSymbol && balance ? selectedSymbol.symbol : ''}}-->
              {{ account ? `${account.slice(0, 4)}....${account.slice(-4)}` : '' }}
            </span>
           <el-dropdown-menu slot="dropdown">
             <el-dropdown-item icon="el-icon-switch-button" command="logout">LogOut</el-dropdown-item>
           </el-dropdown-menu>
         </el-dropdown>
       </div>
     </div>
   </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'headerLayout',
  data() {
    return {
      searchInputValue: null,
    }
  },
  computed: {
    ...mapGetters({
      account: 'account/account'
    }),
  },
  methods: {
    clickToHomePage() {

    },
    searchValue() {
      this.$router.push({
        name: 'Search',
        params: {
          searchValue: this.searchInputValue
        },
        query: {
          searchTab: this.$route.query.searchTab ? this.$route.query.searchTab : 'myFile'
        }
      })
      this.searchInputValue = ''
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.logOut()
      }
    },
    logOut() {
      sessionStorage.setItem('ACCOUNT_STRING', '')
      this.$router.push({
        name: 'HomePage'
      })
    },
    writeContent() {
      this.$router.push({
        name: "write"
      })
    }
  }
}
</script>

<style lang="scss">
.header-layout__main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f5f5;
  padding: 0 40px;
  font-size: 24px;
  height: 100%;
  border-bottom: 1px solid #f5f5f5;

  .header-style-about {
    font-size: 16px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .link-btn {
      display: inline-block;
      width: 100px;
      height: 30px;
      /*background-color: white;*/
      //border-bottom: 2px solid #222326;
      text-align: center;
      line-height: 30px;
      margin-right: 40px;
      /*border-radius: 5px;*/
      font-weight: bold;
    }

    .link-btn:hover {
      box-shadow: 8px 0px 8px 0 rgba(34, 35, 38, .3);
    }
  }

  .header-right-content {
    width: 550px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .layout-header-input {
    .el-input__inner {
      border-radius: 10px;
    }
  }

  .layout-header-select {
    display: flex;
  }

  .layout-header-right-box {
    margin-left: 10px;
    width: 150px;
    border-radius: 10px;
    background: #FAF9F8;
    border: 2px solid #EFECFD;
    text-align: center;
    cursor: pointer;

    .layout-header-balance {
      width: 113px;
      height: 40px;
      line-height: 43px;
      font-size: 12px;
      color: #7E8597;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
