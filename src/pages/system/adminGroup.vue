<template>
  <div>
    <div class="ebox">
      <div class="ebox-title">
        <h5>数据列表</h5>
      </div>
      <div class="ebox-content">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" @click="showEditDialog = true">添加</el-button>
          </el-col>
        </el-row>
        <el-table :data="lists" border size="small" v-loading="listsLoading">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1" class="text-green">启用</span>
              <span v-if="scope.row.status != 1" class="text-gray">禁用</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="onStatus(scope.row.id,2)"
                v-if="scope.row.status == 1"
              >禁用</el-button>
              <el-button
                size="mini"
                type="success"
                @click="onStatus(scope.row.id,1)"
                v-if="scope.row.status == 2"
              >启用</el-button>
              <el-button size="mini" type="primary" @click="onApiPermission(scope.row.id)">接口权限</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--edit dialog-->
        <el-dialog title="添加管理组" :visible.sync="showEditDialog" width="30%" :center="true">
          <el-form ref="form" :model="formData" label-width="80px">
            <el-form-item label="名称">
              <el-input placeholder="请填写名称" v-model="formData.name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="info" @click="showEditDialog = false">取 消</el-button>
            <el-button type="primary" @click="onSave" :loading="saveLoading">确 定</el-button>
          </span>
        </el-dialog>
        <!--end edit dialog-->

        <!--edit dialog-->
        <el-dialog title="编辑接口权限" :visible.sync="showApiDialog" width="60%" :center="true">
          <el-form ref="form" :model="apiFormData">
            <ul class="clearfix">
              <li class="api-item-lists" v-for="api in apiLists" :key="api.id">
                <el-form-item>
                  <el-checkbox-group v-model="apiFormData.apis">
                    <el-checkbox :label="api.id" border>{{api.name}}&nbsp;&nbsp;{{api.path}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </li>
            </ul>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="info" @click="showApiDialog = false">取 消</el-button>
            <el-button
              type="primary"
              @click="onSaveApiPermission"
              :loading="savePermissionLoading"
            >确 定</el-button>
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
      savePermissionLoading: false,
      // 数据列表
      lists: [],
      apiLists: [],
      showEditDialog: false,
      showApiDialog: false,
      formData: {},
      apiFormData: {
        group_id: null,
        apis: []
      }
    };
  },
  created() {
    this.getPageResult();
  },
  methods: {
    // 获取数据列表
    getPageResult() {
      this.$request.post('/backend.admin.group/lists', {}, res => {
        if (res.code) {
          this.lists = res.data;
        } else {
          this.$message.error(res.msg);
        }
        this.listsLoading = false;
      });
    },

    // 保存数据
    onSave() {
      this.saveLoading = true;
      this.$request.post('/backend.admin.group/save', this.formData, res => {
        if (res.code) {
          this.$message.success('保存成功');
          this.showEditDialog = false;
          this.getPageResult();
        } else {
          this.$message.error(res.msg);
        }
        this.saveLoading = false;
      });
    },

    // 更改状态
    onStatus(id, status) {
      this.$confirm('确认执行该操作吗？')
        .then(f => {
          this.$request.post(
            '/backend.admin.group/set_status',
            {
              id: id,
              status: status
            },
            res => {
              if (res.code) {
                this.$message.success(res.msg);
                this.getPageResult();
              } else {
                this.$message.error(res.msg);
              }
            }
          );
        })
        .catch(f => {});
    },

    // 后台接口权限设置
    onApiPermission(id) {
      this.showApiDialog = true;
      this.apiFormData.group_id = id;
      this.apiFormData.apis = [];
      this.apiLists = [];
      this.$request.post(
        '/backend.admin.api/all',
        {
          group_id: id
        },
        res => {
          if (res.code) {
            this.apiLists = res.data;
            for (let i = 0; i < this.apiLists.length; i++) {
              if (this.apiLists[i].allowed === 1) {
                // 已设置的权限
                this.apiFormData.apis.push(this.apiLists[i].id);
              }
            }
          } else {
            this.$message.error(res.msg);
          }
        }
      );
    },

    // 保存
    onSaveApiPermission() {
      console.log(this.apiFormData);
      this.savePermissionLoading = true;
      this.$request.post(
        '/backend.admin.group/set_api_permission',
        {
          id: this.apiFormData.group_id,
          apis: this.apiFormData.apis
        },
        res => {
          if (res.code) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
          this.savePermissionLoading = false;
        }
      );
    }
  }
};
</script>
<style>
.api-item-lists {
  width: 50%;
  float: left;
}
</style>
