<template>
  <div>
    <el-container>
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple-light">
              <el-button type="primary" class="user-btn3" @click="addSortShow">添加分类</el-button>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="grid-content bg-purple-light"></div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-table
          :data="sortData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="cat_id"
          border
          :tree-props="{children: 'children'}"
        >
          <el-table-column prop="cat_name" label="分类名称" width="180"></el-table-column>
          <el-table-column prop="cat_level" label="级别" width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.cat_level == 0">一级</span>
              <span v-if="scope.row.cat_level == 1">二级</span>
              <span v-if="scope.row.cat_level == 2">三级</span>
            </template>
          </el-table-column>
          <el-table-column prop="cat_deleted" label="是否有效">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.cat_deleted == false">无效</el-tag>
              <el-tag type="danger" v-if="scope.row.cat_deleted == true">有效</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="140">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="editCatShow(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="delSort(scope.row)"
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
        <el-dialog title="编辑分类" :visible.sync="dialogEditsort">
          <el-form
            :model="editGoodsSortList"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
            :rules="rules"
            status-icon
          >
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="editGoodsSortList.cat_name"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditsort = false">取 消</el-button>
            <el-button type="primary" @click="editSort">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="添加分类" :visible.sync="dialogAddsort">
          <el-form
            :model="addGoodsSortList"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
            :rules="rules"
            status-icon
          >
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="addGoodsSortList.cat_name"></el-input>
            </el-form-item>
            <span style="margin-left:31px;margin-top:10px;float:left; font-size:14px">分类名称</span>
            <div class="block" style="margin-left:100px">
              <el-cascader
                v-model="addSortLevel"
                :options="addGoodsSortData"
                :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id' }"
              ></el-cascader>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddsort = false">取 消</el-button>
            <el-button type="primary" @click="addSort">确 定</el-button>
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
      sortData: [],
      pageSize: 5,
      pageSizes: [1, 3, 5, 10],
      pageNum: 1,
      pageTotal: 0,
      dialogEditsort: false,
      editGoodsSort: "",
      editGoodsSortList: {},
      cat_id: "",
      dialogAddsort: false,
      addSortLevel: "",
      addGoodsSortList: {},
      addGoodsSortData: [],
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //添加分类
    addSort() {
      // console.log(this.addSortLevel)
      this.addGoodsSortList.cat_pid = this.addSortLevel[0];
      this.addGoodsSortList.cat_level = Number(this.addSortLevel[0]);
      // console.log(this.addGoodsSortList)
      var that = this;
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.$Axios({
          url: "categories",
          method: "post",
          data: this.addGoodsSortList
        }).then(back => {
          let { data, meta } = back.data;
          if (meta.status == 201) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.dialogAddsort = false;
            this.getGoodsSort();
          } else {
            this.$message({
              message: "添加失败",
              type: "error"
            });
          }
        });
      });
    },
    addSortShow() {
      this.dialogAddsort = true;
      this.$Axios({
        url: "categories"
      }).then(back => {
        let { data, meta } = back.data;
        if (meta.status == 200) {
          this.addGoodsSortData = data;
        }
      });
    },
    //删除分类
    delSort(row) {
      this.$confirm("您确定删除该商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        // center: true
      }).then(() => {
        this.$Axios({
          url: "categories/" + row.cat_id,
          method: "delete"
        }).then(back => {
          let { meta } = back.data;
          if (meta.status == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getGoodsSort();
          } else {
            this.$message({
              message: "删除失败",
              type: "error"
            });
          }
        });
      });
    },
    //修改分类
    editSort() {
      var that = this;
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.$Axios({
          url: "categories/" + this.cat_id,
          method: "put",
          data: this.editGoodsSortList
        }).then(back => {
          let { data, meta } = back.data;
          if (meta.status == 200) {
            this.$message({
              message: meta.msg,
              type: "success"
            });
            this.dialogEditsort = false;
            this.getGoodsSort();
          } else {
            this.$message({
              message: "更新失败",
              type: "error"
            });
          }
        });
      });
    },

    //展示修改框
    editCatShow(row) {
      this.dialogEditsort = true;
      this.editGoodsSortList = row;
      this.cat_id = row.cat_id;
    },
    handleSizeChange(page) {
      this.pageSize = page;
      this.getGoodsSort();
    },
    handleCurrentChange(num) {
      this.pageNum = num;
      this.getGoodsSort();
    },
    getGoodsSort() {
      this.$Axios({
        url: `categories?pagenum=${this.pageNum}&pagesize=${this.pageSize}`
      }).then(back => {
        let { data, meta } = back.data;
        this.sortData = data.result;
        this.pageTotal = data.total;
        // console.log(data);
      });
    }
  },
  mounted() {
    this.getGoodsSort();
  }
};
</script>

<style>
.user-btn3 {
  height: 40px;
  color: #fff;
  width: 95px;
  margin-top: 20px;
}
</style>
