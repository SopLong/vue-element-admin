<template>
  <div class="ebox">
    <div class="ebox-title">
      <h3>添加文章</h3>
    </div>
    <div class="ebox-content">
      <el-form
        ref="form"
        :model="formData"
        label-width="80px"
      >
        <el-form-item label="分类">
          <el-select
            v-model="formData.category"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
            style="width:100%"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            type="text"
            v-model="formData.summary"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否置顶">
          <el-switch
            v-model="formData.isTop"
            active-color="red"
            inactive-color="blue"
            active-value=1
            inactive-value=0
            style="float:left;margin-top:5px;"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="内容">
          <richTextForm ref="richText"></richTextForm>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSave"
            :loading="saveLoading"
          >保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import richTextForm from '../richText/richTextForm';
import * as systemService from '@/api/system';
import * as articleService from '@/api/article';

export default {
  components: {
    richTextForm,
    systemService,
    articleService
  },
  data() {
    return {
      formData: {
        isTop: 0
      },
      loading: false,
      categoryList: [],
      saveLoading: false
    };
  },

  mounted() {
    this.getCategoryList('blogType');
  },

  methods: {
    // 保存数据
    async onSave() {
      // this.saveLoading = true;
      const content = this.$refs.richText.getContent();
      this.formData.content = content;
      console.log(this.formData);
      const res = await articleService.addBlogArticle(this.formData);
      console.log(res);
    },
    // 类别下拉列表获取远程数据
    async getCategoryList(type) {
      const res = await systemService.getCodeDropList(type);
      this.$set(this, 'categoryList', res.data);
    },
    // 下拉框查询
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.categoryList = this.categoryList.filter(item => {
            return item.name.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.categoryList = [];
      }
    }

  }
};
</script>
<style>
</style>
