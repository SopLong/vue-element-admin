<template>
  <div>
    <div class="ebox">
      <div class="ebox-title">
        <h5>数据列表</h5>
      </div>
      <div class="ebox-content">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" @click="onEdit(null, '添加后台接口')">添加</el-button>
          </el-col>
        </el-row>
        <el-table :data="lists" border size="small" v-loading="listsLoading">
          <el-table-column prop="name" label="接口名称"></el-table-column>
          <el-table-column prop="path" label="路径"></el-table-column>
          <el-table-column prop="create_time" label="创建时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="onEdit(scope.row.id,'编辑后台接口')">编辑</el-button>
              <el-button size="mini" type="danger" @click="onDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            :small="true"
            layout="total, prev, pager, next"
            :page-size="size"
            :total="total"
            @current-change="getPageResult"
          ></el-pagination>
        </div>

        <!--edit dialog-->
        <el-dialog
          :title="showEditDialogTitle"
          :visible.sync="showEditDialog"
          width="30%"
          :center="true"
        >
          <el-form ref="form" :model="formData" label-width="80px">
            <el-input type="hidden" v-model="formData.id"></el-input>
            <el-form-item label="名称">
              <el-input placeholder="请填写名称" v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="接口路径">
              <el-input placeholder="如/backend.admin.login/verify" v-model="formData.path"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="info" @click="showEditDialog = false">取 消</el-button>
            <el-button type="primary" @click="onSave" :loading="saveLoading">确 定</el-button>
          </span>
        </el-dialog>
        <!--end edit dialog-->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      listsLoading: false,
      saveLoading: false,
      // 数据列表
      lists: [],
      total: null,
      page: 1,
      size: 10,
      showEditDialog: false,
      showEditDialogTitle: null,
      formData: {}
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
      this.$request.post('/backend.admin.api/lists', params, res => {
        if (res.code) {
          this.lists = res.data.lists;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
        this.listsLoading = false;
      });
    },

    // 打开添加/编辑框
    onEdit(id, title) {
      this.formData = {};
      this.showEditDialog = true;
      this.showEditTitle = title;
      if (!id) return;
      this.$request.post(
        '/backend.admin.api/detail',
        {
          id: id
        },
        res => {
          if (res.code) {
            this.formData = res.data;
          } else {
            this.$message.error(res.msg);
          }
        }
      );
    },
    // 保存数据
    onSave() {
      this.saveLoading = true;
      this.$request.post('/backend.admin.api/save', this.formData, res => {
        if (res.code) {
          this.$message.success('保存成功');
          this.showEditDialog = false;
          this.getPageResult(this.page);
        } else {
          this.$message.error(res.msg);
        }
        this.saveLoading = false;
      });
    },

    // 删除数据
    onDelete(id) {
      this.$confirm('确认执行该操作吗？')
        .then(f => {
          this.$request.post(
            '/backend.admin.api/delete',
            {
              id: id
            },
            res => {
              if (res.code) {
                this.$message.success(res.msg);
                this.getPageResult(this.page);
              } else {
                this.$message.error(res.msg);
              }
            }
          );
        })
        .catch(f => {});
    }
  }
};
</script>
