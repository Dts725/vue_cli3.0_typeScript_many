/** 20190611 by Wang
 * 设置网页的整体属性 如 title
 * 
 */
const htmlConfig = function () { }
htmlConfig.setTitle = function (name) {
  name = name || '';
  if (!name) { return; }
  let title = document.querySelector('title');
  title.text = name;
}
export default htmlConfig;
