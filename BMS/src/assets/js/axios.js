//封装axios插件
import axios from 'axios';
var Axios = {};
Axios.install=function(vue){
    //设置自定义请求路由
    var my_axios = axios.create({
        baseURL: 'http://localhost:8888/api/private/v1/'
      });
       // 回调函数中的参数是axios对象本身
       my_axios.interceptors.request.use(function(config){
        // console.log(config);
        if(config.url != 'login'){
          // 利用axios拦截器，判断并添加请求头
          config.headers.Authorization = localStorage.getItem('token')
        }
        // 设置完参数后，一定要返回，如果不返回，请求不再发送，（就拦截在此）
        return config
      })
    vue.prototype.$Axios = my_axios;
}
export default Axios;