<template>
  <div class="wrapper">
    <div class="nav-bar">
      <com-navmenu></com-navmenu>
    </div>
    <div class="page-wrapper">
      <div class="container">
        <div class="container-top">
          <div class="container-header">
            <div class="nav-bar-tomini"></div>
            <ul class="nav-bar-top-links">
              <li>
                <el-dropdown trigger="click" @command="handleCommand">
                  <el-button type="primary">
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu split-button slot="dropdown">
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </li>
            </ul>
          </div>
          <ul class="container-tab">
            <li><i class="el-icon-menu"></i></li>
            <li v-for="tab in tabs" :key="tab.path" :class="[isActiveTab(tab.path) ? 'active' : '', 'tab-link' ]">
              <router-link :to="tab.path">{{tab.name}}
              </router-link>
              <i class="el-icon-error" @click="removeTab(tab.path)"></i>
            </li>
          </ul>
        </div>
        <div class="container-content">
          <router-view></router-view>
          <!--
          <transition name="fade">
            <router-view></router-view>
          </transition>
          -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ComNavmenu from './navMenu';
import * as loginService from '@/api/login';
export default {
  data() {
    return {
      tabs: []
    };
  },
  created() {
    this.addTab(this.$route);
  },
  components: {
    'com-navmenu': ComNavmenu,
    loginService
  },
  watch: {
    // 监听路由变化,加入到tabs中
    $route(to, from) {
      this.addTab(to);
    }
  },
  methods: {
    // 是否为当前tab
    isActiveTab(path) {
      return path === this.$route.fullPath;
    },
    addTab(route) {
      // 检查tabs中是否已存在path
      let check = this.tabs.some(f => {
        return f.path === route.fullPath;
      });
      if (check) return;
      this.tabs.push({
        name: route.name,
        path: route.fullPath
      });
    },
    // 移除tab
    removeTab(path) {
      this.tabs = this.tabs.filter(f => {
        return f.path !== path;
      });
      if (this.tabs.length > 0) {
        this.$router.push(this.tabs[0].path);
      } else {
        this.$router.push('/');
      }
    },
    async handleCommand(cmd) {
      if (cmd === 'logout') {
        const res = await loginService.logout();
        if (res.code === 20000) {
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('user');
          this.$router.push('/login');
        }
      }
    }
  }
};
</script>
<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
