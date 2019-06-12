/** 20190611 by Wang
 * 移动端的meta标签设置
 * 接受: 'h5'或空
 */
const h5Config = function () { }
h5Config.setMeta = function (cf) {
  cf = cf || 'h5';
  let meta = document.createElement('meta');
  let head = document.querySelector('head');
  // h5页面且禁止缩放
  if (cf == 'h5') {
    // let ma = '<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" /> ';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
    meta.name = 'viewport';
    head.appendChild(meta);
  } else {

  }
}
export default h5Config;