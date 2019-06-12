/**
 * Created by wang on 18/08/02.
 */

export default {

  /**
   * 设置本地存储
   * **/
  setStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  /**
   * 读取本地存储
   * **/
  getStorage(key) {
    let data = localStorage.getItem(key);
    return JSON.parse(data);
  },
  /**
   * 存取本地存储-自动判断
   * **/
  storage: (data) => {
    let tmp = '';
    if (data && JSON.stringify(data) !== '{}') {
      localStorage.setItem('tmpData', JSON.stringify(data));
      tmp = data
    } else {
      tmp = JSON.parse(localStorage.getItem('tmpData'))
    }
    return tmp
  },

}
