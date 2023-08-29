<template>
  <div class="upload-file__main">
    <el-dialog
        title="Upload File"
        :visible="uploadDialogShow"
        width="530px"
        center>
      <div class="upload-style">
<!--        <div class="file-size-show">-->
<!--          Size: {{ fileSize }}-->
<!--        </div>-->
        <div class="upload-box-file-name">
          <p class="span-table-text">
            <span style="display:inline-block;width: 100px">Size:</span>
            <span>{{ fileSize }}</span>
          </p>
          <p class="span-table-text">
            <span style="display:inline-block;width: 100px">File Name:</span>
            <el-input
                v-model="changeName"
                style="width: 100%"
                @keyup.enter.native="changeFileName"
                @change="changeFileName"
                class="upload-input-tag-list">
            </el-input>
          </p>
        </div>
        <div class="upload-input-tag-list">
          <span style="display:inline-block;width: 100px">Tags:</span>
          <el-input
              v-model="inputTag"
              style="width: 100%"
              placeholder="Enter a keyword, ENTER next"
              @keyup.enter.native="addTag"
              class="upload-box-input-tag-list">
          </el-input>
        </div>
      </div>
      <div class="tags-list-style">
        <p>
          <el-tag
              v-for="(item, index) in tagList"
              :key="index.name"
              type="info"
              closable
              style="margin: 5px 4px;"
              @close="closeTag(item)">{{ item.name }}
          </el-tag>
        </p>
      </div>
      <div class="upload-file-upload-button">
        <p class="normal-upload-btn upload-box-cancel" @click="cancelUpload">
          CANCEL
        </p>
        <p class="normal-upload-btn upload-box-btn" @click="uploadTagAndFile">
          <i v-if="showLoading" class="el-icon-loading"></i>
          {{ uploadText }}
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getFileSize} from '@/utils/util'
// import fileIconView from "@/components/commonComponent/fileIconView"

export default {
  name: "uploadBox",
  // components: {
  //   fileIconView
  // },
  data() {
    return {
      uploadDialogShow: false,
      inputTag: '',
      changeName: '',
      tagList: [],
      showLoading: false,
      uploadText: 'UPLOAD',
      fileInfo: null,
      fileSize: 0,
    }
  },
  methods: {
    openDialog(fileInfo) {
      this.uploadDialogShow = true
      this.fileInfo = fileInfo
      this.fileSize = getFileSize(this.fileInfo.file.size)
      this.changeName = this.fileInfo.file.name
    },
    addTag() {
      const obj = {
        name: this.inputTag,
        value: this.inputTag
      }
      this.tagList.push(obj)
      this.inputTag = ''
    },
    closeTag(item) {
      this.tagList = this.tagList.filter(value => value.name !== item.name)
    },
    uploadTagAndFile() {
      this.$emit('uploadTagAndFile', this.tagList)
      this.uploadText = 'UPLOADING...'
      this.showLoading = true
    },
    cancelUpload() {
      this.showLoading = false
      this.uploadDialogShow = false
      this.fileInfo = null
      this.fileSize = 0
      this.changeName = ''
    },
    changeFileName() {
      const fileName = this.changeName
      this.$emit('changeName', fileName)
    }
  }
}
</script>

<style lang="scss">
.upload-file__main {
  .upload-style {
    width: 480px;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-wrap: wrap;
    flex-direction: column;
  }

  /*width: 778px;*/
  .tags-list-style {
    width: 100%;
    min-height: 35px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .file-size-show {
    font-size: 14px;
    color: #09244B;
    height: 50px;
    line-height: 50px;
    text-align: left;
  }

  .upload-file-upload-button {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 8px 0;
  }

  .normal-upload-btn {
    width: 102px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    font-size: 10px;
    font-weight: bold;
    border-radius: 10px;
    cursor: pointer;
  }

  .upload-box-file-name {
    /*width: 300px;*/
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .span-table-text {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #09244B;
    height: 50px;
  }

  .upload-input-tag-list {
    /*width: 100%;*/
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .upload-input-tag-list .el-input__inner {
    /*width: 278px;*/
    border: none;
    background: none;
    border-bottom: 2px solid #FAF9F8;
  }

  .upload-box-cancel {
    border: 2px solid #FAF9F8;
    background: #fbfbfb;
    color: #A9A8B0;
  }

  .upload-box-btn {
    border: 2px solid #6447F2;
    background: #715EFF;
    color: #ffffff;
    margin-left: 30px;
  }
}
</style>