import Vue from 'vue'
import axios from 'axios'

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
Vue.prototype.axios = axios;
/* eslint-disable no-new */

axios.defaults.baseURL = window.urlConfig.url;

export default axios;

