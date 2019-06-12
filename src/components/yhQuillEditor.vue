<template>
  <!-------------------------------------------------------------------
   说明：组件使用了element ui 和 quillEditor，记得引用组件
   getQuillData：function   父组件绑定getQuillData方法接收本组件的数据
   uploadUrl：string 上传图片的地址
   imgShowUrl：string 显示图片的地址
   isdisabled: Boolean 是否禁止编辑
   ------------------------------------------------------------------->
  <div class="yh-quill-editor">
    <!--<el-upload class="avatar-uploader"-->
    <el-upload :action="uploadUrl"
               name="file"
               :headers="{}"
               :show-file-list="false"
               :on-success="uploadSuccess"
               :on-error="uploadError"
               :before-upload="beforeUpload">
    </el-upload>
    <!--<quill-editor v-model="content" ref="shQuillEditor" class="editer" :options="editorOption"></quill-editor>-->
    <quill-editor v-model="content" ref="shQuillEditor" class="editer" :options="editorOption"></quill-editor>
  </div>

</template>

<script>
  import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor,
  },
  props: {
    uploadUrl:{
      type: String,
      default: 'https://apijcdj.shyunhua.com/file/upload'
    },
    imgShowUrl:{
      type: String,
      default: 'https://file.shyunhua.com'
    },
    quillData: {
      type: String,
      default: ''
    },
    isdisabled:{
      type: Boolean,
      default:false
    }

  },

  data() {
    return {
      timer:'', // 存储定时器
      quillUpdateImg:'',  // 上传图片时的loading
      content:'',   //  富文本的数据
      // 富文本编辑器配置
      editorOption: {
        placeholder: "在此填写内容……",
        theme: 'snow',  // or 'bubble'
        modules: {
          // 工具栏
          toolbar: {
            // 自定义工具栏
            container:[
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              [{ header: 1 }, { header: 2 }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ direction: "rtl" }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ font: [] }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ['image'],
              // ['link', 'image', 'video'],
              ["clean"]
            ],
            handlers: {
              'image': function (value) {
                console.log('image::::',value);
                if (value) {
                  document.querySelector('.yh-quill-editor input').click()
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          },
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        }
      },
    };
  },
  watch:{
    'quillData':function(v){
      // if(v){
        this.content = v;
      // }
    },
    'content':function(val){
      // if(val){
      if(this.timer){
        clearTimeout(this.timer);
      }
        this.timer = setTimeout(()=>{
          this.$emit('getQuillData',val);
        },400);
      // }
    },
    'isdisabled':function(val){
      console.log('isdisabled:::',this.isdisabled);
      let quill = this.$refs.shQuillEditor.quill;
      if(val){
        quill.enable(false);
      }else{
        quill.enable();
      }
    }
  },
  computed: {
    // quillData() {
    //   return this.content;
    // }
  },
  methods: {
    // 富文本图片上传前
    beforeUpload(e,f,g) {
      // 如果名字有中文，则不许上传
      let reg = /[\u4E00-\u9FA5]/;
      if(e&&e.name && reg.test(e.name)){
        this.$message.error('名字不可有汉字！')
        return ;
      }
      // 显示loading动画
      this.quillUpdateImg = true;
    },

    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.shQuillEditor.quill
      // 如果上传成功
      if (res.code == 0 && res.data.store_result) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', this.imgShowUrl+'/'+res.data.store_result)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },

    // 富文本图片上传失败
    uploadError(e,f) {
      // 如果名字有中文，则不许上传
      let reg = /[\u4E00-\u9FA5]/;
      if(f&&f.name && reg.test(f.name)){
        this.$message.error('名字不可有汉字！')
        return ;
      }
      // loading动画消失
      this.quillUpdateImg = false
      this.$message.error('图片插入失败')
    },


  }
};
</script>

<style lang="less" scoped>

</style>
