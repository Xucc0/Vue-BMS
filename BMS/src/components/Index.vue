<template>
  <div>
    <el-container>
      <el-header class="index-one">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <img src="../assets/logo.png" alt />
            <span class="index-title">后台管理系统</span>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="grid-content bg-purple bg-purple-btn">
            <i class="el-icon-user-solid"></i>
            <span class="index-user">您好，{{username}}</span>
            <el-button type="warning" round size="mini" @click="clearUser">退出</el-button>
          </div>
        </el-col>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-col :span="12">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo index-menu"
              background-color="#F6F6F8"
              text-color="#000"
              router
            >
              <el-submenu v-for="v in indexList" :index="v.id.toString()" :key="v.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{v.authName}}</span>
                </template>
                <el-menu-item v-for="v2 in v.children" :index="v2.path" :key="v2.id">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    {{v2.authName}}
                  </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      indexList: [],
      username: ""
    };
  },
  methods: {
    clearUser() {
      localStorage.clear();
      this.$router.push({ path: "/login" });
      this.$message({
        message: "退出成功",
        type: "success"
      });
    }
  },
  mounted() {
    this.username = localStorage.username;
    this.$Axios({
      url: "menus"
    }).then(back => {
      let { data, meta } = back.data;
      if (meta.status == 200) {
        this.indexList = data;
      }
    });
  }
};
</script>

<style>
img {
  float: left;
  width: 60px;
  height: 60px;
}
.index-one {
  background-color: #5dd5c8;
  height: 60px;
  line-height: 60px;
}
.bg-purple-btn {
  float: right;
  margin-right: 50px;
}
.index-title {
  float: left;
  margin-left: -10px;
  color: #ffffff;
  font-size: 20px;
}
.index-user {
  color: #ffffff;
  font-size: 20px;
  margin-right: 30px;
}
.index-menu {
  height: 670px;
  width: 199px;
}
.index-left {
  width: 60px;
}
.index-div {
  height: 590px;
  background-color: #f6f6f8;
  padding: 20px;
}
</style>
