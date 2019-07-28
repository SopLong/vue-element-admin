<template>
  <div>
    <div class="ebox">
      <div class="ebox-content">
        <el-form ref="form" :model="searchForm">
          <el-form-item>
            <el-col :span="3">
              <el-input placeholder="姓名" v-model="searchForm.truename"></el-input>
            </el-col>
            <el-col class="line" :span="1">&nbsp;</el-col>
            <el-col :span="3">
              <el-select v-model="searchForm.group_id" placeholder="请选择管理组">
                <el-option :label="group.name" :key="group.id" :value="group.id" v-for="group in adminGroups"></el-option>
              </el-select>
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
          <el-col :span="24"><el-button type="primary" @click="showEditDialog = true">添加</el-button></el-col>
        </el-row>
        <el-table :data="lists" border size="small" v-loading="listsLoading">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="account" label="账号"></el-table-column>
          <el-table-column prop="group.name" label="用户组"></el-table-column>
          <el-table-column prop="truename" label="姓名"></el-table-column>
          <el-table-column prop="create_time" label="创建时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="onDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination background :small="true" layout="total, prev, pager, next" :page-size="size" :total="total" @current-change="getPageResult"></el-pagination>
        </div>

        <!--edit dialog-->
        <el-dialog title="添加管理员" :visible.sync="showEditDialog" width="30%" :center="true">
          <el-form ref="form" :model="formData" label-width="80px">
            <el-form-item label="账号">
              <el-input placeholder="请填写账号" v-model="formData.account"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="formData.password"></el-input>
            </el-form-item>
            <el-form-item label="管理组">
              <el-select v-model="formData.group_id" placeholder="请选择管理组">
                <el-option :label="group.name" :key="group.id" :value="group.id" v-for="group in adminGroups"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="formData.truename"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="formData.remark"></el-input>
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
      // 管理组数据列表
      adminGroups: [],
      total: null,
      page: 1,
      size: 10,
      showEditDialog: false,
      // 查询参数
      searchForm: {},
      formData: {}
    };
  },
  created() {
    this.getPageResult(1);
    this.getAdminGroups();
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
      this.$request.post('/backend.admin.user/lists', params, res => {
        if (res.code) {
          this.lists = res.data.lists;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
        this.listsLoading = false;
      });
    },

    // 获取管理组
    getAdminGroups() {
      this.$request.post('/backend.admin.group/lists', {
      }, res => {
        if (res.code) {
          this.adminGroups = res.data;
        }
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

    // 保存数据
    onSave() {
      this.saveLoading = true;
      this.$request.post('/backend.admin.user/save', this.formData, res => {
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
      this.$confirm('确认删除吗？').then(f => {
        this.$request.post('/backend.admin.user/delete', {
          id: id
        }, res => {
          if (res.code) {
            this.$message.success(res.msg);
            this.lists = this.lists.filter(f => {
              return f.id !== id;
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
