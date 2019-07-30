<template>
  <div class="right-div">
    <el-container>
      <el-header class="right-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main class="rights-main">
        <el-table :data="rightsList" style="width: 100%;margin-top:20px" height="550">
          <el-table-column type="index" :index="1"></el-table-column>
          <el-table-column prop="authName" label="权限名称" ></el-table-column>
          <el-table-column prop="path" label="路径" ></el-table-column>
          <el-table-column prop="level" label="层级" >
            <template slot-scope="scope">
              <span v-if="scope.row.level == 0">一级</span>
              <span v-if="scope.row.level == 1">二级</span>
              <span v-if="scope.row.level == 2">三级</span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  mounted() {
    this.$Axios({
      url: "rights/list"
    }).then(back => {
      let { data, meta } = back.data;
      if (meta.status == 200) {
        this.rightsList = data;
        console.log(data);
      }
    });
  }
};
</script>

<style>
.rights-main {
  margin-top: -65px;
}
.right-div{
  background-color: #f6f6f8;
}
.right-header {
  margin-top:20px;
}
</style>
