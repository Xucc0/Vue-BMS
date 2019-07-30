<template>
  <div class="login-div">
    <el-form
      :model="userData"
      status-icon
      label-width="100px"
      class="demo-ruleForm login-from"
      :rules="rules"
      ref="ruleForm"
    >
      <h3 class="login-title">管理登录</h3>
      <el-form-item label="用户名" prop="username">
        <el-input type="name" autocomplete="off" v-model="userData.username"></el-input>
      </el-form-item>
      <el-form-item label="密    码" prop="password">
        <el-input type="password" autocomplete="off" v-model="userData.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="loginSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: {
        username:"",
        checkPass:""
      },
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
    loginSubmit() {
      var that = this;
      // console.log(this.userData);
      this.$refs.ruleForm.validate((valid)=>{
        if (!valid) {
          return;
        }
        that.$Axios({
          url: "/login",
          method: "post",
          data: this.userData
        }).then(back => {
          let { data, meta } = back.data;
          if (meta.status == 200) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            this.$router.push({ path: "/" });
            this.$message({
              message:'恭喜你，登录成功',
              type:'success'
            })
          }
        });
      });
    }
  }
};
</script>

<style>
.login-div {
  height: 100%;
  /* background-color: #324152; */
  background-image: url(../assets/beijing.png);
  display: flex;
  justify-content: center;
  align-items: center;
  
}
.login-from {
  background-color: #fff;
  width: 400px;
  padding: 30px 60px 30px 30px;
  border-radius: 5px;
  margin-top: -10px;
  /* box-shadow: 3px 3px 3px 3px; */
}
.login-title {
  margin-bottom: 30px;
  margin-left: 185px;
  color:#414A60;
}
.login-btn {
  width: 300px;
}
</style>
