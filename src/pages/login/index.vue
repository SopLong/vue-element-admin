<template>
  <div class="login-box">
    <el-row>
      <el-col :span="12">
        <h2>后台管理系统</h2>
        <p class="login-help">建议使用谷歌、火狐、360极速模式等高级浏览器进行后台操作</p>
      </el-col>
      <el-col :span="12">
        <div class="login-input">
          <el-form ref="form" :model="formData" label-width="80px">
            <el-form-item label="账号">
              <el-input v-model="formData.name" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input type="password" v-model="formData.password" placeholder="请输入密码" @keyup.enter.native="onLogin"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" rel="login-btn" :loading="showLoading" @click="onLogin">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import * as loginService from '@/api/login';
export default {
  components: {
    loginService
  },
  data() {
    return {
      formData: {
        name: '',
        password: ''
      },
      // 是否显示按钮loading状态
      showLoading: false
    };
  },
  methods: {
    // 请求登录
    async onLogin() {
      const res = await loginService.login(this.formData);
      console.log(res);
      if (res.code === 20000) {
        this.$message.success('登录成功');
        window.localStorage.setItem('token', '15865526870');
        window.localStorage.setItem('user', '15865526870');
        setTimeout(f => {
          this.$router.push({path: '/'});
        }, 500);
      } else {
        this.$message.error(res.msg);
      }
    }
  }
};
</script>
<style>
  .login-box {
    max-width: 800px;
    margin: 0 auto;
    padding: 100px 20px 20px;
  }
  .login-box h2 {
    font-size: 26px;
  }
  .login-help {
    padding: 10px 0;
  }
  .login-input {
    background: #ffffff;
    padding: 40px 20px 20px;
    border-radius: 5px;
  }
</style>
