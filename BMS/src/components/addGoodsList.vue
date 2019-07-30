<template>
  <div class="addgood-div">
    <el-container>
      <el-header class="goods-header">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top:20px">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品列表</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main class="add-main">
        <div class="main-div">
          <el-steps :active="listActive" space="20%" class="addSteps" style="margin-bottom">
            <el-step title="基本信息" icon="el-icon-edit"></el-step>
            <el-step title="商品参数" icon="el-icon-s-data"></el-step>
            <el-step title="商品属性" icon="el-icon-s-goods"></el-step>
            <el-step title="商品图片" icon="el-icon-picture"></el-step>
            <el-step title="商品内容" icon="el-icon-tickets"></el-step>
          </el-steps>
            <el-tabs
              :tab-position="tabPosition"
              style="height: 370  px;"
              class="goods-tabs"
              @tab-click="list"
              :before-leave="beforeLeave"
            >
              <el-tab-pane label="基本信息">
                <div class="add-list">
                  <el-form
                    :model="addGoodsData"
                    ref="ruleForm"
                    label-width="100px"
                    class="demo-ruleForm"
                    :rules="rules"
                    status-icon
                  >
                    <el-form-item label="商品名称" prop="goods_name">
                      <el-input v-model="addGoodsData.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price" style="margin-top:40px">
                      <el-input v-model.number="addGoodsData.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight" style="margin-top:40px">
                      <el-input v-model.number="addGoodsData.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number" style="margin-top:40px">
                      <el-input v-model.number="addGoodsData.goods_number"></el-input>
                    </el-form-item>
                    <span style="margin-left:31px;margin-top:10px;float:left; font-size:14px">商品分类</span>
                    <div class="block" style="margin-left:100px">
                      <el-cascader
                        v-model="addGoodsSort"
                        :options="addGoodsSortList"
                        :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id' }"
                        @change="handleChange"
                      ></el-cascader>
                    </div>
                  </el-form>
                </div>
              </el-tab-pane>
              <el-tab-pane label="商品参数" :before-leave="list">
                <el-form>
                  <el-form-item v-for="v in addDynamicData" :key="v.attr_id" :label="v.attr_name">
                    <el-checkbox
                      v-model="v.checked"
                      v-for="(v1, k) in v.tags"
                      border
                      :key="k"
                      :label="v1"
                      @change="handleChange"
                    ></el-checkbox>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="商品属性">
                <el-form class="goods-form">
                  <el-form-item v-for="v in addStaticData" :key="v.attr_id" :label="v.attr_name">
                    <el-input v-model="v.attr_vals"></el-input>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="商品图片">
                <el-upload
                  action="http://127.0.0.1:8888/api/private/v1/upload"
                  :headers="uploadHeaders"
                  name="file"
                  :on-success="uploadSuccess"
                  list-type="picture"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-tab-pane>
              <el-tab-pane label="商品内容">
                <el-button type="primary" class="user-btn6" @click="addGoods">添加商品</el-button>
                <quillEditor class="editor" ref="myTextEditor" v-model="content"></quillEditor>
              </el-tab-pane>
            </el-tabs>
         
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import "../../node_modules/quill/dist/quill.core";
import "../../node_modules/quill/dist/quill.snow.css";
import "../../node_modules/quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      checked: false,
      tabPosition: "left",
      listActive: 0,
      addGoodsSortList: [],
      addGoodsSort: "",
      addSort_id: "",
      addDynamicData: [],
      addPar_id: "",
      addStaticData: [],
      addGoodsData: {},
      content: "",
      fileList: [],
      uploadHeaders: {
        Authorization: localStorage.getItem("token")
      },
      pic: [],
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { type: "number", message: "只能输入数字", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          { type: "number", message: "只能输入数字", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
          { type: "number", message: "只能输入数字", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    beforeLeave(newTags, oldTags) {
      var that = this;
      if (newTags != "0") {
        this.$refs.ruleForm.validate(valid => {
          if (!valid) {
            // that.listActive = 0;
            that.$message({
              message: "请先填写基本信息",
              type: "error"
            });
            that.list();
          }
        });
      }
    },
    //上传图片
    uploadSuccess(response, file) {
      if (response.meta.status === 200) {
        this.$message({
          message: "图片上传成功",
          type: "success"
        });
        this.pic.push(file.data.tmp_path);
      } else {
        this.$message({
          message: "图片上传失败",
          type: "error"
        });
      }
    },
    //添加商品
    addGoods() {
      this.addGoodsData.goods_introduce = this.content;
      this.addGoodsData.goods_cat = this.addGoodsSort.join();
      this.addGoodsData.pics = this.pic;
      var data = new Date().getTime();
      this.addGoodsData.upd_time = data;
      var that = this;
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.$Axios({
          url: "goods",
          method: "post",
          data: this.addGoodsData
        }).then(back => {
          let { data, meta } = back.data;
          if (meta.status == 201) {
            this.$message({
              message: meta.msg,
              type: "success"
            });

            this.addGoodsData = {};
            this.$router.push({ path: "/goods" });
          } else {
            this.$message({
              message: meta.msg,
              type: "error"
            });
          }
        });
      });
    },
    list(one) {
      this.listActive = 0;
      this.listActive = Number(one.index);
    },
    handleChange() {
      var sort_id = this.addGoodsSort[this.addGoodsSort.length - 1];
      this.addSort_id = sort_id;
      this.$Axios({
        url: `categories/${sort_id}/attributes?sel=many`
      }).then(back => {
        let { data, meta } = back.data;
        if (meta.status == 200) {
          this.addPar_id = data.cat_id;
          data.forEach((v, k) => {
            data[k].tags = data[k].attr_vals.split(",");
          });
          this.addDynamicData = data;
        }
      });

      this.$Axios({
        url: `categories/${sort_id}/attributes?sel=only`
      }).then(back => {
        let { data, meta } = back.data;
        this.addStaticData = data;
      });
    }
  },

  mounted() {
    this.$Axios({
      url: "categories"
    }).then(back => {
      let { data, meta } = back.data;
      if (meta.status == 200) {
        this.addGoodsSortList = data;
      }
    });
  }
};
</script>

<style>
.addSteps {
  margin-left: 100px;
  margin-top: -17px;
}
.goods-header {
  height: 50px;
}
.goods-tabs {
  margin-top: 35px;
  height: 420px;
}
.add-list {
  width: 600px;
}
.editor {
  height: 370px;
  width: 1000px;
  border-bottom: 1px solid #cccccc;
}
.add-main {
  margin-top: -15px;
  height: 586px;
}
.user-btn6 {
  height: 40px;
  color: #fff;
  width: 95px;
}
.addgood-div {
  background-color: #f6f6f8;
  /* height: 400px; */
}
.main-div {
  background-color: #fff;
  height: 496px;
  padding-top: 50px;
}
.goods-form {
  width: 950px;
}
</style>
