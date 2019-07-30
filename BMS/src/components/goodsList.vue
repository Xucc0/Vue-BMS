<template>
  <div class="goods-div">
    <el-container>
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top:20px">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main style="margin-top:-15px">
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-input placeholder="请输入内容" clearable class="user-inp" v-model="searchGoods"></el-input>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple-light">
              <el-button type="primary" class="user-btn" @click="searchGoodsData">
                <i class="el-icon-search"></i>
              </el-button>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple-light">
              <el-button type="primary" class="user-btn2" @click="addGoodsShow">添加商品</el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light"></div>
          </el-col>
        </el-row>
        <el-table :data="goodsList" style="width: 100%;margin-top:10px" height="460">
          <el-table-column type="index" :index="1"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)" width="180"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="180"></el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="180" :formatter="formData"></el-table-column>
          <el-table-column prop="upd_time" label="更新时间" width="180" :formatter="formData"></el-table-column>
          <el-table-column prop="address" label="操作" width="140">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="editGoodsShow(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="delGoods(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 编辑商品弹窗 -->
        <el-dialog title="编辑商品" :visible.sync="dialogEditGoods">
          <el-form
            :model="editGoodsData"
            :rules="rules"
            ref="ruleForm"
            class="demo-ruleForm"
            status-icon
          >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="editGoodsData.goods_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="goods_price">
              <el-input v-model="editGoodsData.goods_price" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="goods_number">
              <el-input v-model="editGoodsData.goods_number" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="重量" prop="goods_weight">
              <el-input v-model="editGoodsData.goods_weight" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditGoods = false">取 消</el-button>
            <el-button type="primary" @click="editGoods">确 定</el-button>
          </div>
        </el-dialog>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal"
        ></el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      pageSize: 5,
      pageSizes: [1, 3, 5, 10],
      pageNum: 1,
      pageTotal: 0,
      searchGoods: "",
      editGoodsData: {},
      dialogEditGoods: false,
      goods_id: "",
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    delGoods(row) {
      this.$confirm("您确定删除该商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        // center: true
      }).then(() => {
        this.$Axios({
          url: "goods/" + row.goods_id,
          method: "delete"
        }).then(back => {
          let { data, meta } = back.data;
          if (meta.status == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getGoods();
          } else {
            this.$message({
              message: "删除失败",
              type: "error"
            });
          }
        });
      });
    },
    //编辑商品信息
    editGoods() {
      var that = this;
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.editGoodsData.upd_time = new Date().getTime();
        this.$Axios({
          url: "goods/" + this.goods_id,
          method: "put",
          data: this.editGoodsData
        }).then(back => {
          let { data, meta } = back.data;
          if (meta.status == 200) {
            this.$message({
              message: "编辑成功",
              type: "success"
            });
            this.dialogEditGoods = false;
            this.getGoods();
          } else {
            this.$message({
              message: meta.msg,
              type: "error"
            });
          }
        });
      });
    },
    editGoodsShow(row) {
      this.dialogEditGoods = true;
      this.goods_id = row.goods_id;
      this.$Axios({
        url: `goods/${row.goods_id}`
      }).then(back => {
        let { data, meta } = back.data;
        this.editGoodsData = data;
      });
    },
    addGoodsShow() {
      this.$router.push({ path: "/goods/add" });
    },
    formData(row) {
      return this.$moment(row.add_time).format("YYYY-MM-DD HH:mm:ss");
    },
    searchGoodsData() {
      this.getGoods();
    },
    handleSizeChange(page) {
      this.pageSize = page;
      this.getGoods();
    },
    handleCurrentChange(num) {
      this.pageNum = num;
      this.getGoods();
    },
    getGoods() {
      this.$Axios({
        url: `goods?pagenum=${this.pageNum}&pagesize=${this.pageSize}&query=${this.searchGoods}`
      }).then(back => {
        let { data, meta } = back.data;
        if (meta.status == 200) {
          this.goodsList = data.goods;
          this.pageTotal = data.total;
        }
      });
    }
  },

  mounted() {
    this.getGoods();
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
}
.user-btn2 {
  float: left;
  height: 40px;
  width: 95px;
  margin-left: -140px;
}
.goods-div {
  background-color: #f6f6f8;
  height: 100%;
}
</style>
