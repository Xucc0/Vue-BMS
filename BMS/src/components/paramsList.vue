<template>
  <div class="param-div">
    <el-container>
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top:20px">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>分类列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon class="two"></el-alert>
      </el-header>
      <el-main>
        <div class="sort-div">
        <span>请选择商品分类：</span>
        <div class="block">
          <el-cascader
            v-model="goodsSort"
            :options="goodsSortList"
            :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id' }"
            @change="handleChange"
          ></el-cascader>
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="静态参数" name="first">
            <div class="grid-content bg-purple-light">
              <el-button type="primary"  :disabled="disabled" @click="addStaticShow">添加静态参数</el-button>
            </div>
            <el-table :data="staticData" style="width: 100%;margin-top: 20px;" border>
              <el-table-column type="index" :index="1"></el-table-column>
              <el-table-column prop="attr_name" label="商品参数"></el-table-column>
              <el-table-column prop="attr_vals" label="属性值"></el-table-column>

              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    size="mini"
                    @click="editParShow(scope.row)"
                  ></el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    size="mini"
                    @click="delStatic(scope.row)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="动态参数" name="second">
            <div class="grid-content bg-purple-light">
              <el-button type="primary"  :disabled="disabled" @click="addDynamicShow">添加动态参数</el-button>
            </div>
            <el-table :data="dynamicData" style="width: 100%;margin-top:20px;" border>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag
                    type="success"
                    v-for="(v,k) in scope.row.tags"
                    :key="v.id"
                    class="tags"
                    closable
                    @close="delTag(scope.row,k)"
                  >{{v}}</el-tag>
                  <!-- 添加标签 -->
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="mini"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm"
                    style="width:100px"
                  ></el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                </template>
              </el-table-column>

              <el-table-column prop="attr_name" label="商品参数"></el-table-column>
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    size="mini"
                    @click="dynamicShow(scope.row)"
                  ></el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    size="mini"
                    @click="delDynamic(scope.row)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <!-- 添加静态参数弹窗 -->
        <el-dialog title="添加静态参数" :visible.sync="dialogAddPar">
          <el-form :model="addstaticData">
            <el-form-item label="参数名称">
              <el-input v-model="addstaticData.attr_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="参数值">
              <el-input v-model="addstaticData.attr_vals" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddPar = false">取 消</el-button>
            <el-button type="primary" @click="addStaticData">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 编辑静态参数弹窗 -->
        <el-dialog title="编辑静态参数" :visible.sync="dialogEditPar">
          <el-form :model="editStaticData">
            <el-form-item label="参数名称">
              <el-input v-model="editStaticData.attr_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="参数值">
              <el-input v-model="editStaticData.attr_vals" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditPar = false">取 消</el-button>
            <el-button type="primary" @click="editStaticBtn">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 添加动态参数弹窗 -->
        <el-dialog title="添加动态参数" :visible.sync="dialogAddDynamic">
          <el-form :model="addDynamicData">
            <el-form-item label="参数名称">
              <el-input v-model="addDynamicData.attr_name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddDynamic = false">取 消</el-button>
            <el-button type="primary" @click="addDynamicBtn">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 编辑动态参数弹窗 -->
        <el-dialog title="编辑动态参数" :visible.sync="dialogEditDynamic">
          <el-form :model="editDynamicData">
            <el-form-item label="参数名称">
              <el-input v-model="editDynamicData.attr_name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditDynamic = false">取 消</el-button>
            <el-button type="primary" @click="editDynamicBtn">确 定</el-button>
          </div>
        </el-dialog>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
      goodsSortList: [],
      goodsSort: "",
      disabled: true,
      dynamicData: [],
      staticData: [],
      par_id: "",
      inputValue: "",
      inputVisible: false,
      dialogAddPar: false,
      addstaticData: {},
      sort_id: "",
      dialogEditPar: false,
      editStaticData: {},
      staticAttr_id: "",
      staticCat_id: "",
      dialogAddDynamic: false,
      addDynamicData: {},
      editDynamicData: {},
      dialogEditDynamic: false
    };
  },
  methods: {
    //删除动态参数
    delDynamic(row) {
      this.$confirm("您确定删除该参数吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        // center: true
      }).then(() => {
        this.$Axios({
          url: `categories/${row.cat_id}/attributes/${row.attr_id}`,
          method: "delete"
        }).then(back => {
          let { meta } = back.data;
          if (meta.status == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.handleChange();
          } else {
            this.$message({
              message: "删除失败",
              type: "error"
            });
          }
        });
      });
    },
    //编辑动态参数
    editDynamicBtn() {
      this.$Axios({
        url: `categories/${this.staticCat_id}/attributes/${this.staticAttr_id}`,
        method: "put",
        data: this.editDynamicData
      }).then(back => {
        let { meta } = back.data;
        if (meta.status == 200) {
          this.$message({
            message: "编辑成功",
            type: "success"
          });
          this.dialogEditDynamic = false;
          this.activeName = "second";
          this.handleChange();
        } else {
          this.$message({
            message: "编辑失败",
            type: "error"
          });
        }
      });
    },
    //展示编辑动态信息弹窗
    dynamicShow(row) {
      // console.log(row)
      this.editDynamicData = row;
      this.dialogEditDynamic = true;
      this.staticAttr_id = row.attr_id;
      this.staticCat_id = row.cat_id;
    },
    //添加动态参数名称
    addDynamicBtn() {
      this.addDynamicData.attr_sel = "many";
      this.$Axios({
        url: `categories/${this.sort_id}/attributes`,
        method: "post",
        data: this.addDynamicData
      }).then(back => {
        let { meta } = back.data;
        if (meta.status == 201) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.dialogAddDynamic = false;
          this.activeName = "second";
          this.handleChange();
        } else {
          this.$message({
            message: "添加失败",
            type: "error"
          });
        }
      });
    },
    //展示添加动态展示栏
    addDynamicShow() {
      this.dialogAddDynamic = true;
    },
    //删除静态参数
    delStatic(row) {
      this.$confirm("您确定删除该参数吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        // center: true
      }).then(() => {
        this.$Axios({
          url: `categories/${row.cat_id}/attributes/${row.attr_id}`,
          method: "delete"
        }).then(back => {
          let { meta } = back.data;
          if (meta.status == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.handleChange();
          } else {
            this.$message({
              message: "删除失败",
              type: "error"
            });
          }
        });
      });
    },
    editStaticBtn() {
      // console.log(this.editStaticData);
      this.$Axios({
        url: `categories/${this.staticCat_id}/attributes/${this.staticAttr_id}`,
        method: "put",
        data: this.editStaticData
      }).then(back => {
        let { meta } = back.data;
        if (meta.status == 200) {
          this.$message({
            message: "编辑成功",
            type: "success"
          });
          this.dialogEditPar = false;
          this.handleChange();
        } else {
          this.$message({
            message: "编辑失败",
            type: "error"
          });
        }
      });
    },
    editParShow(row) {
      this.dialogEditPar = true;
      this.editStaticData = row;
      this.staticAttr_id = row.attr_id;
      this.staticCat_id = row.cat_id;
    },
    addStaticData() {
      this.addstaticData.attr_sel = "only";
      this.$Axios({
        url: `categories/${this.sort_id}/attributes`,
        method: "post",
        data: this.addstaticData
      }).then(back => {
        let { meta } = back.data;
        if (meta.status == 201) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
          this.dialogAddPar = false;
          //调用选择分类后的事件
          this.handleChange();
        } else {
          this.$message({
            message: meta.msg,
            type: "error"
          });
        }
      });
    },
    addStaticShow() {
      this.dialogAddPar = true;
    },
    handleInputConfirm(row) {
      let inputValue = this.inputValue;
      if (inputValue) {
        var tags = row.tags.push(inputValue);
        var newTags = {};
        newTags.attr_vals = row.tags.join();
        newTags.attr_sel = row.attr_sel;
        newTags.attr_name = row.attr_name;
        this.$Axios({
          url: `categories/${row.cat_id}/attributes/${row.attr_id}`,
          method: "put",
          data: newTags
        }).then(back => {
          let { meta } = back.data;
          if (meta.status == 200) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "添加失败",
              type: "error"
            });
          }
        });
      }

      this.inputVisible = false;
      this.inputValue = "";
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    delTag(row, k) {
      row.tags.splice(k, 1);
      var newData = {};
      newData.attr_vals = row.tags.join();
      newData.attr_sel = row.attr_sel;
      newData.attr_name = row.attr_name;
      this.$Axios({
        url: `categories/${row.cat_id}/attributes/${row.attr_id}`,
        method: "put",
        data: newData
      }).then(back => {
        let { meta } = back.data;
        if (meta.status == 200) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
        } else {
          this.$message({
            message: meta.msg,
            type: "error"
          });
        }
      });
    },
    handleChange() {
      var sort_id = this.goodsSort[this.goodsSort.length - 1];
      this.sort_id = sort_id;
      // console.log(sort_id);
      this.disabled = false;
      this.$Axios({
        url: `categories/${sort_id}/attributes?sel=many`
      }).then(back => {
        let { data, meta } = back.data;
        if (meta.status == 200) {
          this.par_id = data.cat_id;
          data.forEach((v, k) => {
            data[k].tags = data[k].attr_vals.split(",");
          });
          this.dynamicData = data;
        }
      });

      this.$Axios({
        url: `categories/${sort_id}/attributes?sel=only`
      }).then(back => {
        let { data, meta } = back.data;
        this.staticData = data;
      });
    }
  },
  mounted() {
    this.$Axios({
      url: "categories"
    }).then(back => {
      let { data, meta } = back.data;
      if (meta.status == 200) {
        this.goodsSortList = data;
      }
    });
  }
};
</script>

<style>
.user-btn4 {
  float: left;
  height: 40px;
  line-height: 40px;
  color: #fff;
  border-radius: 3px;
  text-align: center;
  width: 100px;
  margin-left: 0;
  margin-top: 10px;
}
.tags {
  margin-left: 10px;
}
.two {
  margin-top: 20px;
}
.param-div {
  background-color: #f6f6f8;
  height: 630px;
}
.sort-div {
  background-color: #fff;
  padding: 20px;
  height: 100%;
  margin-top:20px;
}
</style>
