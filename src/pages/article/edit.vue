<template>
  <div class="ebox" v-loading="detailLoading">
    <div class="ebox-title">
      <h3>编辑文章 - {{formData.title}}</h3>
    </div>
    <div class="ebox-content">
      <el-form ref="form" :model="formData" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            name="image"
            :headers="uploadHeaders"
            :action="uploadUrl"
            :on-remove="uploadRemove"
            :file-list="imageLists"
            :on-success="uploadSuccess"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="formData.author"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-tag
            :key="tag"
            v-for="tag in formData.tags"
            closable
            :disable-transitions="false"
            size="medium"
            @close="tagClose(tag)"
          >{{tag}}</el-tag>
          <el-input
            class="input-new-tag"
            v-model="inputValue"
            placeholder="输入后按回车键"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="tagInputConfirm"
            @blur="tagInputConfirm"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <div id="editor"></div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSave" :loading="saveLoading">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import config from '@/config/index.sample';
import Editor from 'wangeditor';
export default {
  data() {
    return {
      articleId: null,
      formData: {
        title: '',
        author: '',
        tags: [],
        content: '',
        images: []
      },
      detailLoading: false,
      inputVisible: false,
      inputValue: '',
      saveLoading: false,
      uploadUrl: config.apiHost + '/backend.upload/image',
      uploadHeaders: {
        token: window.localStorage.getItem('token')
      },
      imageLists: []
    };
  },

  created() {
    this.articleId = this.formData.article_id = this.$route.params.id;
  },

  mounted() {
    this.detailLoading = true;
    this.$request.post(
      '/backend.article/detail',
      {
        id: this.articleId
      },
      res => {
        if (res.code) {
          this.formData.title = res.data.title;
          this.formData.author = res.data.author;
          this.formData.tags = res.data.tags;
          this.formData.content = res.data.content;
          for (let i = 0; i < res.data.images.length; i++) {
            this.formData.images.push(res.data.images[i].save_url);
            let imageItem = {
              name: '',
              url: res.data.images[i].show_url
            };
            this.imageLists.push(imageItem);
          }
          // 初始化编辑器内容
          this.initEditor(this.formData.content);
        } else {
          this.$message.error(res.msg);
        }
        this.detailLoading = false;
      }
    );
    console.log(this.formData);
  },

  methods: {
    // 删除tag
    tagClose(tag) {
      this.formData.tags.splice(this.formData.tags.indexOf(tag), 1);
    },

    // 删除图片
    uploadRemove(file, fileList) {
      this.formData.images.splice(
        this.formData.images.indexOf(file.save_url),
        1
      );
      console.log(this.formData);
    },

    // 添加标签
    tagInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.formData.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },

    // 上传成功
    uploadSuccess(response, file, fileList) {
      this.formData.images.push(response.data.save_url);
      this.imageLists.push({
        name: '',
        url: response.data.show_url,
        save_url: response.data.save_url
      });
      console.log(this.formData);
    },

    // 保存数据
    onSave() {
      this.saveLoading = true;
      console.log(this.formData);
      this.$request.post('/backend.article/save', this.formData, res => {
        if (res.code) {
          this.$message.success('保存成功');
          setTimeout(f => {
            this.$router.push({ path: '/article/index' });
          }, 500);
        } else {
          this.$message.error(res.msg);
        }
        this.saveLoading = false;
      });
    },

    // 初始化文本编辑器
    initEditor(content) {
      console.log(content);

      this.editor = new Editor('#editor');

      // base 64 存储图片
      this.editor.customConfig.uploadImgShowBase64 = true;
      // 配置服务器端地址
      this.editor.customConfig.uploadImgServer = this.uploadUrl;
      // 自定义 header
      this.editor.customConfig.uploadImgHeaders = {
        token: window.localStorage.getItem('token')
      };
      // 后端接受上传文件的参数名
      this.editor.customConfig.uploadFileName = 'image';
      // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024;
      // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgMaxLength = 6;
      // 设置超时时间
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000;

      // 配置菜单
      this.editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ];

      this.editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          // 图片上传成功，插入图片的回调
          console.log(result);
          editor.uploadImg.insertLinkImg(result.data.show_url);
        }
      };
      // 文本内容改变时
      this.editor.customConfig.onchange = html => {
        this.formData.content = html;
      };

      // 创建富文本编辑器
      this.editor.create();

      this.editor.txt.html(this.formData.content);
    }
  }
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.input-new-tag {
  width: 180px;
  vertical-align: bottom;
}
/* 重置图片上传预览样式*/
.el-upload-list--picture .el-upload-list__item {
  float: left;
  width: 160px;
  margin-right: 10px;
}
</style>
