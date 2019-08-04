<template>
  <div>
    <div class="nav-header">
      <div class="nav-profile">
        <img class="avatar" src="http://img3.imgtn.bdimg.com/it/u=400062461,2874561526&fm=26&gp=0.jpg"/>
        <p class="account">{{account}}</p>
        <p class="group">{{group}}</p>
      </div>
    </div>
    <el-menu
      class="nav-menu-lists"
      :default-active="currentRoute"
      unique-opened
      background-color="#2f4050"
      text-color="#999"
      active-text-color="#fff">
      <el-submenu v-for="menu in menus" :index="menu.index" :key="menu.index">
        <template slot="title">
          <i :class="menu.icon"></i>
          <span>{{menu.name}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="subMenu in menu.subMenus" :key="subMenu.path" :index="subMenu.path">
            <router-link :to="{path: subMenu.path}" class="menu-link">{{subMenu.name}}</router-link>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      account: null,
      group: null,
      menus: [
        {
          index: 'content',
          icon: 'el-icon-document',
          name: '内容管理',
          subMenus: [
            {
              name: '文章列表',
              path: '/article/index'
            }
          ]
        },
        {
          index: 'richText',
          icon: 'el-icon-document',
          name: '富文本编辑器',
          subMenus: [
            {
              name: '富文本编辑器',
              path: '/richText/richTextForm'
            }
          ]
        },
        {
          index: 'workpoint',
          icon: 'el-icon-document',
          name: '记工时',
          subMenus: [
            {
              name: '记工时',
              path: '/workpoint/RecordWorkPoint'
            }
          ]
        },
        {
          index: 'system',
          icon: 'el-icon-setting',
          name: '系统设置',
          subMenus: [
            {
              name: '系统信息',
              path: '/system/index'
            },
            {
              name: '管理员',
              path: '/system/adminUser'
            },
            {
              name: '管理组',
              path: '/system/adminGroup'
            },
            {
              name: '后台接口',
              path: '/system/adminApi'
            }
          ]
        }
      ]
    };
  },
  created() {
    let user = window.localStorage.getItem('user');
    user = JSON.parse(user);
    this.account = user.account;
    this.group = user.group;
  },
  computed: {
    currentRoute() {
      return this.$route.path;
    }
  },
  methods: {

  }
};
</script>
<style>

  .nav-header {
    padding: 35px 25px 25px;
    width: 100%;
    height: 170px;
    box-sizing: border-box;
    background: url('../assets/nav-header-bg-2.png') left center no-repeat #0e9aef;
    background-size: 220px 170px;
  }

  .nav-profile {
    text-align: center;
  }

  .nav-profile .avatar {
    width: 64px;
    height: 64px;
    border-radius: 5px;
  }

  .nav-profile .account {
    color: #fff;
    padding: 5px 0;
    font-weight: 600;
  }

  .nav-profile .group {
    color: #ddd;
  }

  .nav-menu-lists {
    height: 100%;
    border: none !important;
  }

  .el-submenu .el-menu-item {
    height: 40px !important;
    line-height: 40px !important;
  }

  .el-submenu__title {
    height: 50px !important;
    font-size: 13px !important;
    line-height: 50px !important;
  }

  .el-menu-item-group .menu-link {
    display: inline-block;
    width: 100%;
    height: 100%;
    font-size: 12px;
    padding-left: 12px;
    color: #999;
  }

  .el-menu-item-group .is-active {
    background-color: rgb(38, 51, 64) !important;
  }

  .el-menu-item-group .is-active .menu-link {
    color: #ddd;
  }

  .el-menu-item-group__title {
    display: none;
  }

</style>
