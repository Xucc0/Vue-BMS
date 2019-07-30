<template>
  <div class="report-div">
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-left:10px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div ref="f" style="width: 800px; height: 500px;" class="min"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      option: {
        title: {
          text: "用户来源图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {},
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [],
        yAxis: [],
        series: []
      }
    };
  },
  mounted() {
    this.$Axios({
      url: "reports/type/1"
    }).then(back => {
      let { data, meta } = back.data;
      if (meta.status == 200) {
        console.log(data);
        this.option.legend = data.legend;
        this.option.series = data.series;
        this.option.xAxis = data.xAxis;
        this.option.xAxis[0].boundaryGap = false;
        this.option.yAxis = data.yAxis;
        let myChart = echarts.init(this.$refs.f);
        myChart.setOption(this.option);
      }
    });
  }
};
</script>

<style>
.min {
  margin-left: 175px;
  margin-top: 35px;
}
.report-div {
  padding-top: 30px;
  height: 584px;
  background-color: #f6f6f8;
}
</style>
