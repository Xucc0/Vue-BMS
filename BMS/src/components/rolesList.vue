<template>
  <div class="rolr-div">
    <el-container>
      <el-header >
        <el-breadcrumb separator-class="el-icon-arrow-right" class="role-header">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main class="role-min">
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple-light">
              <el-button type="primary" class="user-btn3" @click="addShow">添加角色</el-button>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="grid-content bg-purple-light"></div>
          </el-col>
        </el-row>
        <el-table :data="rolesList" style="width: 100%;margin-top:10px">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-row v-for="(v,k) in scope.row.children" :key="v.id">
                  <el-col :span="4">
                    <div class="grid-content bg-purple bg-purple1">
                      <el-tag
                        closable
                        type
                        class="tag1"
                        @close="delRight(v.id,scope.row.id,scope.row.children,k)"
                      >{{v.authName}}</el-tag>
                      <i class="el-icon-arrow-right"></i>
                    </div>
                  </el-col>
                  <!-- <i class="el-icon-arrow-right"></i> -->
                  <el-col :span="20">
                    <el-row v-for="(v1,k1) in v.children" :key="v1.id">
                      <div class="grid-content bg-purple-light">
                        <el-col :span="5">
                          <div class="grid-content bg-purple bg-purple2">
                            <el-tag
                              closable
                              type="success"
                              @close="delRight(v1.id,scope.row.id,v.children,k1)"
                            >{{v1.authName}}</el-tag>
                            <i class="el-icon-arrow-right"></i>
                          </div>
                        </el-col>
                        <!-- <i class="el-icon-arrow-right"></i> -->
                        <el-col :span="19">
                          <div class="grid-content bg-purple-light">
                            <el-col :span="24">
                              <div class="grid-content bg-purple bg-purple3">
                                <el-tag
                                  v-for="(v2,k2) in v1.children"
                                  :key="v2.id"
                                  closable
                                  type="warning"
                                  class="tag2"
                                  @close="delRight(v2.id,scope.row.id,v1.children,k2)"
                                >{{v2.authName}}</el-tag>
                              </div>
                            </el-col>
                          </div>
                        </el-col>
                      </div>
                    </el-row>
                  </el-col>
                </el-row>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="editRolesShow(scope.row.id)"
              ></el-button>
              <el-button
                type="success"
                icon="el-icon-check"
                circle
                size="mini"
                @click="editRightShow(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="delRoles(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 添加角色弹窗 -->
        <el-dialog title="添加角色" :visible.sync="dialogAddRoles" width="30%" height="60%">
          <el-form
            :model="addRolesData"
            size="small"
            :rules="rules"
            ref="ruleForm"
            class="demo-ruleForm"
            status-icon
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addRolesData.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="addRolesData.roleDesc" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddRoles = false">取 消</el-button>
            <el-button type="primary" @click="addRoles">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 编辑角色弹窗 -->
        <el-dialog title="编辑角色" :visible.sync="dialogEditRoles" width="30%" height="60%">
          <el-form
            :model="editRolesData"
            size="small"
            :rules="rules"
            ref="ruleForm"
            class="demo-ruleForm"
            status-icon
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="editRolesData.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="editRolesData.roleDesc" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditRoles = false">取 消</el-button>
            <el-button type="primary" @click="editRoles">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="角色授权" :visible.sync="dialogEditRight" width="30%" height="60%">
          <div slot="footer" class="dialog-footer">
            <el-tree
              :data="rightData"
              show-checkbox
              node-key="id"
              default-expand-all
              :default-checked-keys="keys"
              :props="defaultProps"
              ref="tree"
            ></el-tree>
            <el-button @click="dialogEditRight = false">取 消</el-button>
            <el-button type="primary" @click="editRight">确 定</el-button>
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
      rolesList: [],
      dialogAddRoles: false,
      addRolesData: {},
      dialogEditRoles: false,
      editRolesData: {},
      role_id: "",
      dialogEditRight: false,
      rightData: [],
      keys: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      right_id: "",
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 5 到 12 个字符", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    //删除角色权限
    delRight(right_id, id, rows, k) {
      this.$Axios({
        url: `roles/${id}/rights/${right_id}`,
        method: "delete"
      }).then(back => {
        let { meta } = back.data;
        if (meta.status == 200) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
          rows.splice(k, 1);
        }
      });
    },
    //提交角色权限
    editRight() {
      var key1 = this.$refs.tree.getCheckedKeys();
      var key2 = this.$refs.tree.getHalfCheckedKeys();
      var key3 = key1.concat(key2).join();
      console.log(key3);
      this.$Axios({
        url: `roles/${this.right_id}/rights`,
        method: "post",
        data: { rids: key3 }
      }).then(back => {
        let { meta } = back.data;
        if (meta.status == 200) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
          this.dialogEditRight = false;
          this.getRoles();
        }
      });
    },
    //角色权限弹窗展示
    editRightShow(row) {
      this.right_id = row.id;
      this.keys = [];
      this.dialogEditRight = true;
      this.$Axios({
        url: "rights/tree"
      }).then(back => {
        let { data, meta } = back.data;
        this.rightData = data;
      });
      row.children.forEach(v => {
        v.children.forEach(v1 => {
          v1.children.forEach(v2 => {
            this.keys.push(v2.id);
          });
        });
      });
    },
    //提交角色信息
    editRoles() {
      this.$Axios({
        url: "roles/" + this.role_id,
        method: "put",
        data: this.editRolesData
      }).then(back => {
        let { meta } = back.data;
        if (meta.status == 200) {
          this.$message({
            type: "success",
            message: meta.msg
          });
          this.dialogEditRoles = false;
          this.getRoles();
        }
      });
    },
    //编辑角色弹窗
    editRolesShow(id) {
      this.role_id = id;
      this.dialogEditRoles = true;
      var that = this;
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.$Axios({
          url: "roles/" + id
        }).then(back => {
          let { data, meta } = back.data;
          if (meta.status == 200) {
            this.editRolesData = data;
          }
        });
      });
    },
    //删除角色
    delRoles(id) {
      this.$confirm("您确定删除该角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        // center: true
      }).then(() => {
        this.$Axios({
          url: "roles/" + id,
          method: "delete",
          data: this.addRolesData
        }).then(back => {
          let { data, meta } = back.data;
          if (meta.status == 200) {
            this.$message({
              type: "success",
              message: meta.msg
            });
            this.getRoles();
          }
        });
      });
    },
    //添加角色
    addRoles() {
      var that = this;
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.$Axios({
          url: "roles",
          method: "post",
          data: this.addRolesData
        }).then(back => {
          // console.log(back);
          let { data, meta } = back.data;
          if (meta.status == 201) {
            this.$message({
              message: meta.msg,
              type: "success"
            });
            this.dialogAddRoles = false;
            this.getRoles();
          } else {
            this.$message({
              message: "添加失败",
              type: "error"
            });
          }
        });
      });
    },
    //角色弹窗
    addShow() {
      this.dialogAddRoles = true;
    },
    getRoles() {
      this.$Axios({
        url: "roles"
      }).then(back => {
        let { data, meta } = back.data;
        //   console.log(data)
        this.rolesList = data;
      });
    }
  },
  mounted() {
    this.getRoles();
  }
};
</script>

<style>
.user-btn3 {
  background-color: #5dd5c8;
  height: 40px;
  width: 95px;
  margin-left: 0;
}
.bg-purple3 {
  float: left;
  margin-top: 10px;
}
.tag2 {
  margin-left: 10px;
}
.rolr-div {
  background-color: #f6f6f8;
  height: 100%;
}
.role-header {
  margin-top:22px;
}
.role-min {
  margin-top:-20px;
}
el-tag {
  margin-top:5px;
}
</style>
