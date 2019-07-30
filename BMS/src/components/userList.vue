<template>
  <div   class="user-div">
    <el-container>
      <el-header class="user-header">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="one">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple" >
              <el-input placeholder="请输入内容" v-model="searchValue" clearable class="user-inp"></el-input>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple-light">
              <el-button type="primary" class="user-btn" @click="searchUser">
                <i class="el-icon-search"></i>
              </el-button>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple-light">
              <el-button type="primary" class="user-btn2" @click="addShow">添加用户</el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light"></div>
          </el-col>
        </el-row>
        <el-table :data="userList" style="width: 100%; margin-top:10px">
          <el-table-column type="index" :index="1"></el-table-column>
          <el-table-column prop="username" label="姓名" ></el-table-column>
          <el-table-column prop="email" label="邮箱" ></el-table-column>
          <el-table-column prop="mobile" label="电话" ></el-table-column>
          <el-table-column prop="mg_state" label="用户状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#5dd5c8"
                inactive-color="#cccccc"
                @change="statusChange(scope.row.id,scope.row.mg_state)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="140">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="editShow(scope.row)"
              ></el-button>
              <el-button
                type="success"
                icon="el-icon-check"
                circle
                size="mini"
                @click="roleShow(scope.row)"
              ></el-button>
              <el-button  v-if="scope.row.username != 'admin'"
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="delUser(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal"
        ></el-pagination>
        <!-- 编辑用户信息弹窗 -->
        <el-dialog title="修改用户" :visible.sync="dialogUser">
          <el-form :model="userData">
            <el-form-item label="姓名">
              <el-input v-model="userData.username" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="userData.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogUser = false">取 消</el-button>
            <el-button type="primary" @click="editUserData">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 添加用户信息弹窗 -->

        <el-dialog title="添加用户" :visible.sync="dialogAdd" width="30%" height="60%">
          <el-form :model="addData" :rules="rules" ref="ruleForm" class="demo-ruleForm" status-icon>
            <el-form-item label="姓名" prop="username">
              <el-input v-model="addData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addData.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="addData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="addData.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAdd = false">取 消</el-button>
            <el-button type="primary" @click="addUserData">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 角色编辑弹窗 -->
        <el-dialog title="选择角色" :visible.sync="dialogRole" width="30%" height="20%">
          <div>{{userName}}</div>
          <el-select v-model="role_id" placeholder>
            <el-option
              v-for="item in userRoleData"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogRole = false">取 消</el-button>
            <el-button type="primary" @click="setUserRole">确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      mg_state: false,
      pageSize: 5,
      pageSizes: [1, 3, 5, 10],
      pageNum: 1,
      pageTotal: 0,
      searchValue: "",
      dialogUser: false,
      userData: {},
      user_id: 0,
      addData: {
        username: "",
        password: ""
      },
      dialogAdd: false,
      dialogRole: false,
      userRoleData: [],
      role_id: "",
      userName: "",
      user_id: 0,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 12, message: "长度在 5 到 12 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //删除角色
    delUser(row) {
      this.$confirm("您确定删除该用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        // center: true
      }).then(() => {
        this.$Axios({
          url: "users/" + row.id,
          method: "delete"
        }).then(back => {
          let { data, meta } = back.data;
          if (meta.status == 200) {
            this.success(meta.msg);
            this.getInit();
          } else {
            this.error(meta.msg);
          }
        });
      });
    },
    //提交用户角色
    setUserRole() {
      this.$Axios({
        url: `users/${this.user_id}/role`,
        method: "put",
        data: { rid: this.role_id }
      }).then(back => {
        let { meta } = back.data;
        if (meta.status == 200) {
          this.dialogRole = false;
          this.success(meta.msg);
        } else {
          this.error(meta.msg);
        }
      });
    },
    //展示编辑角色弹窗
    roleShow(row) {
      this.user_id = row.id;
      this.userName = row.username;
      this.dialogRole = true;
      this.$Axios({
        url: "roles"
      }).then(back => {
        let { data, meta } = back.data;
        if (meta.status == 200) {
          // console.log(data)
          this.userRoleData = data;
        }
      });
      this.$Axios({
        url: "users/" + row.id
      }).then(back => {
        let { data, meta } = back.data;
        if (meta.status == 200) {
          this.role_id = data.rid;
        }
      });
    },
    //添加用户
    addUserData() {
      var that = this;
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return;
        }
        that
          .$Axios({
            url: "users",
            method: "post",
            data: this.addData
          })
          .then(back => {
            let { meta } = back.data;
            if (meta.status == 201) {
              this.success(meta.msg);
              this.dialogAdd = false;
              this.getInit();
            } else {
              this.error(meta.msg);
            }
          });
      });
    },
    //添加用户弹窗
    addShow() {
      this.dialogAdd = true;
    },
    //编辑用户信息
    editUserData() {
      this.$Axios({
        url: "users/" + this.user_id,
        method: "put",
        data: this.userData
      }).then(back => {
        let { meta } = back.data;
        if (meta.status == 200) {
          this.dialogUser = false;
          this.success(meta.msg);
          this.getInit();
        } else {
          this.error(meta.msg);
        }
      });
    },
    //展示编辑信息弹窗
    editShow(row) {
      // console.log(row)
      this.dialogUser = true;
      this.user_id = row.id;
      this.$Axios({
        url: "users/" + row.id,
        method: "get"
      }).then(back => {
        console.log(back);
        let { data, meta } = back.data;
        if (meta.status == 200) {
          console.log(data);
          this.userData = data;
        }
      });
    },
    //失败情况封装
    error(msg) {
      this.$message({
        message: msg,
        type: "error"
      });
    },
    // 成功封装
    success(msg) {
      this.$message({
        message: msg,
        type: "success"
      });
    },
    //状态改变
    statusChange(id, status) {
      this.$Axios({
        url: `users/${id}/state/${status}`,
        method: "put"
      }).then(back => {
        let { meta } = back.data;
        if (meta.status == 200) {
          this.success(meta.msg);
        } else {
          this.error(meta.msg);
        }
      });
    },
    //搜索功能
    searchUser() {
      this.getInit();
    },
    //分页功能
    handleSizeChange(page) {
      this.pageSize = page;
      this.getInit();
    },
    handleCurrentChange(num) {
      this.pageNum = num;
    },
    //获取用户列表页面
    getInit() {
      this.$Axios({
        url: `users?pagenum=${this.pageNum}&pagesize=${this.pageSize}&query=${this.searchValue}`
      }).then(back => {
        let { data, meta } = back.data;
        // console.log(data);
        if (meta.status == 200) {
          this.userList = data.users;
          this.pageTotal = data.total;
          // console.log(data)
        }
      });
    }
  },
  mounted() {
    this.getInit();
  }
};
</script>

<style>
.user-inp {
  float: left;
}
.user-btn {
  height: 40px;
  width: 55px;
  color: #fff;
}
.user-btn2 {
  float: left;
  height: 40px;
  width: 95px;
  margin-left: -120px;
}
.add-form {
  width: 400px;
  height: 600px;
}
.user-header {
  background-color: #F6F6F8;
  margin-top:5px
}
.one {
  margin-top:22px;
  color:#FFF;
}
.user-div {
  background-color: #F6F6F8;
  height: 100%;
}
</style>
