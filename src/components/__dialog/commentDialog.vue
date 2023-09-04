<template>
  <div>
    <el-dialog
        title="Connect Wallet"
        :visible.sync="showComment"
        width="630px"
        center>
      <div style="min-height: 300px">
        <iframe
            height="400"
            width="540"
            :src="`https://widget.0xecho.com?color-theme=light&desc=&has-h-padding=true&has-v-padding=true&modules=tip%2Ccomment%2Clike&receiver=${receiver}&target_uri=${planetIrl}/${fileId}`"
            frameborder="0"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "commentDialog",
  data() {
    return {
      showComment: false,
      // todo... 4everland url
      planetIrl: 'https://msc.4everland.app/#/main',
      fileId: '',
      receiver: ''
    }
  },
  methods: {
    openDialog(id, receiver) {
      this.showComment = true
      this.fileId = id
      this.receiver = receiver ? receiver : ''
    }
  }
}
</script>

<style scoped>

</style>