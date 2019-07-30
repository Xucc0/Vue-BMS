<template>
  <div class="order-div">
    <el-container>
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top:30px">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main class="rights-main">
        <el-table :data="ordersData" style="width: 100%" height="500">
          <el-table-column type="index" :index="1"></el-table-column>
          <el-table-column prop="order_number" label="订单编号"></el-table-column>
          <el-table-column prop="order_price" label="订单价格"></el-table-column>
          <el-table-column prop="order_pay" label="是否付款">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.order_pay == '0'">未付款</el-tag>
              <el-tag type="success" v-if="scope.row.order_pay == '1'">已付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货" width="180">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.is_send =='否'">未发货</el-tag>
              <el-tag type="success" v-if="scope.row.is_send =='是'">已发货</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="update_time" label="下单时间" width="180" :formatter="formData"></el-table-column>
          <el-table-column prop="address" label="操作" width="140">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="editOrderShow(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 编辑用户订单信息弹窗 -->
        <el-dialog title="修改订单" :visible.sync="dialogOrder">
          <!-- <div>
            <span>是否付款：</span>
            <el-radio v-model="pay_status" label="1">已付款</el-radio>
            <el-radio v-model="pay_status" label="2">未付款</el-radio>
          </div>
          <div>
            <span>是否发货：</span>
            <el-radio v-model="is_send" label="1">已发货</el-radio>
            <el-radio v-model="is_send" label="2">未发货</el-radio>
          </div>-->
          <div class="block">
            <span class="demonstration">地区选择:</span>
            <el-cascader v-model="cityValue" :options="options" :props="{ expandTrigger: 'hover' }"></el-cascader>
          </div>
          <div class="order-edit">
            <span>具体地址:</span>
            <el-input v-model="addresData" placeholder="请输入内容" style="width:500px"></el-input>
          </div>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogOrder = false">取 消</el-button>
            <el-button type="primary" @click="editOrder">确 定</el-button>
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

<script>
import cityData from "../assets/js/city";
export default {
  data() {
    return {
      ordersData: [],
      pageSize: 5,
      pageSizes: [1, 3, 5, 10],
      pageNum: 1,
      pageTotal: 0,
      dialogOrder: false,
      options: cityData,
      addresData: "",
      // pay_status: "",
      // is_send: "",
      addresData: "",
      order_id: "",
      cityValue: "",
      orderAllData: {},
      order_price: ""
    };
  },
  methods: {
    editOrderShow(row) {
      this.cityValue = "";
      this.dialogOrder = true;
      this.$Axios({
        url: "orders/" + row.order_id,
        method: "get"
      }).then(back => {
        let { data, meta } = back.data;
        if (meta.status == 200) {
          // this.pay_status = data.pay_status == '0' ? "2" : "1";
          // this.is_send = data.is_send == "否" ? "2" : "1";
          // this.addresData = data.consignee_addr;
          this.order_id = data.order_id;
          this.order_price = data.order_price;
          // this.orderAllData = data;
          console.log(data);
        }
      });
    },
    editOrder() {
      // this.orderAllData.is_send = this.is_send == 2 ? "否" : "是";
      // this.orderAllData.pay_status = this.pay_status == 2 ? '0' : '1';
      this.orderAllData.consignee_addr = this.cityValue + this.addresData;
      this.orderAllData.order_price = this.order_price;
      console.log(this.orderAllData);
      this.$Axios({
        url: "orders/" + this.order_id,
        method: "put",
        // headers: { Authorization: "" },
        data: this.orderAllData
      }).then(back => {
        let { data, meta } = back.data;
        console.log(back);
        if (meta.status == 201) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
          this.dialogOrder = false;
          this.getOrders();
        }
      });
    },
    //格式化时间
    formData(row) {
      return this.$moment(row.update_time).format("YYYY-MM-DD HH:mm:ss");
    },
    handleSizeChange(page) {
      this.pageSize = page;
      this.getOrders();
    },
    handleCurrentChange(num) {
      this.pageNum = num;
      this.getOrders();
    },
    getOrders() {
      this.$Axios({
        url: `orders?pagenum=${this.pageNum}&pagesize=${this.pageSize}`
      }).then(back => {
        let { data, meta } = back.data;
        if (meta.status == 200) {
          this.ordersData = data.goods;

          this.pageTotal = data.total;
        }
      });
    }
  },
  mounted() {
    this.getOrders();
  }
};
</script>

<style>
.order-div {
  height: 100%;
  background-color: #f6f6f8;
}
.order-edit{
  margin-top: 30px;
}
</style>
