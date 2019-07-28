<template>
  <div>
    <div class="ebox">
      <div class="ebox-content">
        <el-form ref="form" :model="searchForm">
          <el-form-item>
            <el-col :span="3">
              <el-input placeholder="文章ID" v-model="searchForm.article_id"></el-input>
            </el-col>
            <el-col class="line" :span="1">&nbsp;</el-col>
            <el-col :span="3">
              <el-input placeholder="标题" v-model="searchForm.title"></el-input>
            </el-col>
            <el-col class="line" :span="1">&nbsp;</el-col>
            <el-col :span="3">
              <el-button type="primary" @click="onSearch">搜索</el-button>
              <el-button type="primary" @click="onReset">重置</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="ebox">
      <div class="ebox-title">
        <h5>数据列表</h5>
      </div>
      <div class="ebox-content">
        <el-row>
          <el-col :span="24"><el-button type="primary" @click="onAdd">添加</el-button></el-col>
        </el-row>
        <el-table :data="lists" border size="small" v-loading="listsLoading">
          <el-table-column prop="article_id" label="ID"></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1" class="text-green">显示</span>
              <span v-if="scope.row.status == 2" class="text-red">隐藏</span>
              <span v-if="scope.row.status == 3" class="text-gray">回收站</span>
            </template>
          </el-table-column>
          <el-table-column prop="author" label="作者"></el-table-column>
          <el-table-column prop="tags" label="标签"></el-table-column>
          <el-table-column prop="create_time" label="创建时间"></el-table-column>
          <el-table-column prop="update_time" label="更新时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="onEdit(scope.row.article_id,2)" >编辑</el-button>
              <el-button size="mini" type="danger" @click="onDelete(scope.row.article_id)">删除</el-button>
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
export default {
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
    getPageResult(page) {
      this.listsLoading = true;
      let pageParams = {
        page: page,
        size: this.size
      };
      let params = Object.assign(pageParams, this.searchForm);
      this.$request.post('/backend.article/lists', params, res => {
        if (res.code) {
          this.lists = res.data.lists;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
        this.listsLoading = false;
      });
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
      this.$confirm('确认删除吗？').then(f => {
        this.$request.post('/backend.article/delete', {
          id: id
        }, res => {
          if (res.code) {
            this.$message.success(res.msg);
            this.lists = this.lists.filter(f => {
              return f.article_id !== id;
            });
          } else {
            this.$message.error(res.msg);
          }
        });
      }).catch(f => {});
    }
  }
};
</script>
