<template>
  <div class="file-icon-view__main">
    <img :src="require(`../../assets/svg/fileTypeIcon/${formatType()}.svg`)" alt="" style="margin-right: 13px">
  </div>
</template>

<script>
const fileTypes = {
  image: 'image',
  audio: 'audio',
  word: 'word',
  pdf: 'pdf',
  video: 'video',
  other: 'other'
}
const iconType = {
  [fileTypes.image]: 'icon-one',
  [fileTypes.audio]: 'icon-four',
  [fileTypes.word]: 'icon-three',
  [fileTypes.pdf]: 'icon-three',
  [fileTypes.video]: 'icon-five',
  [fileTypes.other]: 'icon-two',
}

export default {
  name: "fileIconView",
  props: {
    fileType: {
      type: String,
      default: 'other'
    }
  },
  data() {
    return {
      fileTypes,
      iconType,
    }
  },
  methods: {
    formatType() {
      let icon
      if (this.fileType.includes(fileTypes.image)) {
        icon = iconType[fileTypes.image]
      } else if (this.fileType.includes(fileTypes.audio)) {
        icon = iconType[fileTypes.audio]
      } else if (this.fileType.includes(fileTypes.word)) {
        icon = iconType[fileTypes.word]
      } else if (this.fileType.includes(fileTypes.pdf)) {
        icon = iconType[fileTypes.pdf]
      } else if (this.fileType.includes(fileTypes.video)) {
        icon = iconType[fileTypes.video]
      } else {
        icon = iconType[fileTypes.other]
      }
      return icon
    }
  }
}
</script>

<style lang="scss">
.file-icon-view__main {

}
</style>