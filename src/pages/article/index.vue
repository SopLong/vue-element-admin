<template>
  <div>
    <div class="ebox">
      <div class="ebox-content">
        <el-form ref="form" :model="searchForm">
          <el-form-item>
            <el-col :span="5">
              <el-input placeholder="请输入标题，简介进行查询" v-model="searchForm.keyWords"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="onSearch">搜索</el-button>
              <el-button type="primary" @click="onReset">重置</el-button>
              <el-button type="primary" @click="onAdd">添加</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="ebox">
      <div class="ebox-content">
        <el-table :data="lists" border size="small" v-loading="listsLoading" ref="table">
          <el-table-column prop="id" label="ID"></el-table-column>
          <!-- <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1" class="text-green">显示</span>
              <span v-if="scope.row.status == 2" class="text-red">隐藏</span>
              <span v-if="scope.row.status == 3" class="text-gray">回收站</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="summary" label="简介"></el-table-column>
          <el-table-column prop="isTop" label="是否置顶"></el-table-column>
          <el-table-column prop="createtime" label="创建时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="onEdit(scope.row.article_id,2)" >编辑</el-button>
              <el-button size="mini" type="danger" @click="onDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination background :small="true" layout="total, prev, pager, next" :page-size="size" :total="total" @current-change="getPageResult"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as articleService from '@/api/article';
export default {
  components: {
    articleService
  },
  data() {
    return {
      listsLoading: false,
      // 数据列表
      lists: [],
      total: null,
      page: 1,
      size: 10,
      // 查询参数
      searchForm: {}
    };
  },
  created() {
    this.getPageResult(1);
  },
  methods: {

    // 获取数据列表
    async getPageResult(page) {
      this.listsLoading = true;
      let pageParams = {
        page: page,
        size: this.size
      };
      let params = Object.assign(pageParams, this.searchForm);
      const res = await articleService.getArticleList(params);
      if (res.code === 20000) {
        this.$set(this, 'lists', res.data.records);

        this.$set(this, 'total', res.data.total);
      }
      this.listsLoading = false;
    },

    // 搜索
    onSearch() {
      this.getPageResult(1);
    },

    // 重置搜索
    onReset() {
      this.searchForm = {};
      this.getPageResult(1);
    },
    // 新增
    onAdd() {
      this.$router.push({path: '/article/add'});
    },

    // 编辑
    onEdit(id) {
      this.$router.push({path: '/article/edit/' + id});
    },

    // 删除
    onDelete(id) {
      console.log(this.$refs.table);
      this.$confirm('确认删除吗？').then(async f => {
        const res = await articleService.deleteArticle(id);
        if (res.code === 20000) {
          this.$message.success('删除成功!');
        }
        this.getPageResult(1);
      }).catch(f => {});
    }
  }
};
</script>
