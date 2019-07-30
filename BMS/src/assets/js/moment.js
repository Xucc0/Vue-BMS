import moment from 'moment';
var myData = {};
myData.install=function(vue){
    vue.prototype.$moment = moment
}
export default myData;