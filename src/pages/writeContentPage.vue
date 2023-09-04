<template>
    <div class="write-content__main">
      <el-row :gutter="20" style="margin: 0">
        <el-col :span="4">
          <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :span="16">
          <div style="text-align: right">
            <span id="submit" class="submit-draft-button" @click="combineFileList">Submit</span>
            <span class="submit-draft-button" @click="BackTo">Back</span>
          </div>
          <div @input="handleChangeTitle">
            <editor :text='title' :options='options' custom-tag='h1' :edit='applyTextEdit'></editor>
          </div>
          <div class="content-info">
            <el-avatar
              slot="reference"
              size="medium"
              style="margin: 0 20px 0 0"
              :style="`background-image: linear-gradient(${accountColor.top}, #fff, ${accountColor.bottom})`">
            </el-avatar>
            {{ accountString }}
          </div>
          <div @input="handleChangeContent">
            <editor :text='content' :options='optionsContent' custom-tag='div' :edit='applyTextEdit'></editor>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple"></div>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import editor from "vue2-medium-editor"
  import Everpay from 'everpay'
  import {mapActions, mapGetters} from "vuex"
  import {strToHexCharCode, strToUtf8Bytes, encodeAddress} from "@/utils/util"
  import {genAPI} from "arseeding-js";
  import {reportUrl} from "@/utils/constant/apiConst";
  import SHA256 from 'crypto-js/sha256'
  // import Bignumber from "bignumber.js";
  
  // vue2-medium-editor Configuration item
  const buttonList = ['bold',
        'italic',
        {
          name: 'h1',
          action: 'append-h2',
          aria: 'header type 1',
          tagNames: ['h2'],
          contentDefault: '<b>H1</b>',
          classList: ['custom-class-h1'],
          attrs: {
            'data-custom-attr': 'attr-value-h1'
          }
        },
        {
          name: 'h2',
          action: 'append-h3',
          aria: 'header type 2',
          tagNames: ['h3'],
          contentDefault: '<b>H2</b>',
          classList: ['custom-class-h2'],
          attrs: {
            'data-custom-attr': 'attr-value-h2'
          }
        },
        {
          name: 'justifyCenter',
          contentDefault: '<b>C</b>',
          classList: ['custom-class-h2'],
          style: {
            prop: 'font-size',
            value: '20px'
          }
        },
        // 'justifyCenter',
        'quote',
        'anchor'
      ]
  
  export default {
    name: "writeContent",
    components: {
      editor
    },
    data() {
      return {
        title: "",
        content: "",
        selectedSymbol: '',
        isShowEditor: true,
        options: {
          delay: 0,
          targetBlank: true,
          toolbar: {
            allowMultiParagraphSelection: true,
            // buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
            buttons: buttonList,
            diffLeft: 0,
            diffTop: -10,
            firstButtonClass: 'medium-editor-button-first',
            lastButtonClass: 'medium-editor-button-last',
            relativeContainer: null,
            standardizeSelectionStart: true,
            static: true,
            /* options which only apply when static is true */
            align: 'left',
            sticky: true,
            updateOnEmptySelection: false
          },
          anchor: {
            placeholderText: 'Type a link',
            customClassOption: 'btn',
            customClassOptionText: 'Create Button'
          },
          paste: {
            cleanPastedHTML: true,
            cleanAttrs: ['style', 'dir'],
            cleanTags: ['label', 'meta'],
            unwrapTags: ['sub', 'sup']
          },
          anchorPreview: {
            hideDelay: 300
          },
          placeholder: {
            text: 'please enter you Title'
          }
        },
        optionsContent: {
          delay: 0,
          targetBlank: true,
          toolbar: {
            allowMultiParagraphSelection: true,
            // buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
            buttons: buttonList,
            diffLeft: 0,
            diffTop: -10,
            firstButtonClass: 'medium-editor-button-first',
            lastButtonClass: 'medium-editor-button-last',
            relativeContainer: null,
            standardizeSelectionStart: true,
            static: true,
            /* options which only apply when static is true */
            align: 'left',
            sticky: true,
            updateOnEmptySelection: false
          },
          anchor: {
            placeholderText: 'Type a link',
            customClassOption: 'btn',
            customClassOptionText: 'Create Button'
          },
          paste: {
            cleanPastedHTML: true,
            cleanAttrs: ['style', 'dir'],
            cleanTags: ['label', 'meta'],
            unwrapTags: ['sub', 'sup']
          },
          anchorPreview: {
            hideDelay: 300
          },
          placeholder: {
            text: 'please enter you Content'
          }
        },
        applyTextEdit: undefined,
        pay: Everpay,
      }
    },
    computed: {
      ...mapGetters({
        accountStr: 'account/account',
      }),
      accountColor() {
        if (!this.accountStr) return '#ffffff'
        const str = strToHexCharCode(strToUtf8Bytes(this.accountStr))
        return {
          top: `#${str.slice(0, 6)}`,
          bottom: `#${str.substring(str.length - 6)}`
        }
      },
      accountString() {
        return `${this.accountStr.slice(0, 4)}......${this.accountStr.substring(this.accountStr.length-4)}`
      }
    },
    async mounted() {
      await this.getList()
    },
    methods: {
      ...mapActions({
        getBalances: "account/getAccountBalances",
        getInfo: 'account/getAccountInfo',
      }),
      // get symbol info
      async getList() {
        // await this.getAccount()
        const list = await this.getBalances(this.accountStr)
        list.sort((a, b) => {
          return b.balance - a.balance
        })
        this.selectedSymbol = list[0].symbol
      },
      // submit content
      async combineFileList() {
        if (!this.title || !this.content) {
          this.$message.error('Please enter title or content')
          return
        }
        const size = this.content.replace('/[^\x00-\xff]/g', "00").length
        // All data is encrypted for the first time
        const content = {
          "body": encodeAddress(this.content),
          "timestamp": Date.parse(new Date()) / 1000,
          "title": this.title
        }
        const contentDigest = SHA256(JSON.stringify(content)).toString()
  
        const data = JSON.stringify({
          "content": content,
          "digest": contentDigest
        })
  
          const ops = {
          // The tag on this place is different from the tag uploaded to that place
            tags: [
              {name: "FileName", value: this.title},
              // The content is encrypted a second time
              {name: "MSC-body", value: encodeAddress(this.content)},
              {name: "Content-Type", value: 'application/json'},
              // The official version has two new fixed tags
              {name: "APP-Name", value: "Msc-Project"},
              // Facilitate adot to obtain data and display increased
              {name: "file-size", value: String(size)},
              {name: "MSC-TYPE", value: 'Encrypted-content'}
            ]
          }
          if (!this.sendApi) {
            this.sendApi = await genAPI(window.ethereum)
          }
          try {
            //
            const res = await this.sendApi.sendAndPay(reportUrl, data, this.selectedSymbol, ops)
            this.submitResp = JSON.stringify(res)
            console.log(this.submitResp)
          } catch (e) {
            this.$message.error(e.message)
          }
          this.BackTo()
      },
      handleChangeTitle(e) {
        this.title = e.target.innerHTML
      },
      handleChangeContent(e) {
        this.content = e.target.innerHTML
      },
      BackTo() {
        this.$router.push({
          name: "Main"
        })
      }
    }
  }
  </script>
  
  <style>
  .write-content__main {
    min-height: 90vh;
    margin-top: 30px;
    position: relative;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .submit-draft-button {
    display: inline-block;
    margin-right: 25px;
    width: 200px;
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    color: #222326;
    border: 1px solid #222326;
    box-shadow: 5px 5px 0 0 rgba(34, 35, 38, .5);
    text-align: center;
    font-weight: bold;
    cursor: pointer;
  }
  .submit-draft-button:hover {
    box-shadow: 5px 5px 0 0 rgba(34, 35, 38, 1);
  }
  .content-info {
    padding: 20px 0;
    display: flex;
    justify-content: start;
    align-items: center;
  }
  </style>
  