/**
 * Created by wang on 18/08/02.
 */

import Cookies from 'js-cookie';

export default {

  /********************************************
   * cookie
   * ********************************************/

  getToken(TokenKey) {
    return Cookies.get(TokenKey);
  },

  setToken(TokenKey, token) {
    return Cookies.set(TokenKey, token);
  },

  removeToken(TokenKey) {
    return Cookies.remove(TokenKey);
  },

}
