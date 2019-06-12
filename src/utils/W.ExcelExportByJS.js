/**
 * Created by wang on 18/10/15.
 */
function ExcelExportByJS() {
}

/**
 * @param config  type Object
 * config 的格式为 {
    title: 'Sheet1',  // excel的名字
    thead: [ // 表格头部的中文名字 和 对应的字段
      {name: '姓名', key: 'name'},
      {name: '年龄', key: 'age'},
    ],
    data: [{name:'xxx', age: 12}], // 或者 '<table><tr><td>xxxxxx</td>...</tr>...</table>' 此字符串包含中文头部
  }
 */
/** 使用 demo
 * this.ExcelExportByJS.export({
        title: "业务办理列表--" + this.dateformat.format(new Date(), "yyyy-MM-dd"),
        thead:[
          {name: '编号', key: 'num'},
          {name: '标题', key: 'title'},
          {name: '类型', key: 'type'},
          {name: '状态', key: 'is_show'},
          {name: '社区', key: 'community_name'},
          {name: '最后编辑时间', key: 'date_time'},
        ],
        data: con
      });
 * **/
ExcelExportByJS.export = function (config) {
  if (typeof config == 'object' && !Array.isArray(config)) {
    // config = {
    //   title: 'Sheet1',  // excel的名字
    //   thead: [ // 表格头部的中文名字 和 对应的字段
    //     {name: '姓名', key: 'name'},
    //     {name: '年龄', key: 'age'},
    //   ],
    //   data: [{name:'xxx', age: 12}], // 或者 '<table><tr><td>xxxxxx</td>...</tr>...</table>' 此字符串包含中文头部
    // }
    // var worksheet = 'Sheet1';
    var worksheet = config.title ? config.title : 'Sheet1';
    var str = typeof(config.data)=='string' ? config.data : createStrs(config.data,config.thead);
    var uri = 'data:application/vnd.ms-excel;base64,';       // 下载的表格模板数据
    // var uri = 'data:text/csv;charset=utf-8,base64,';       // 下载的表格模板数据
    var template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"       xmlns:x="urn:schemas-microsoft-com:office:excel"       xmlns="http://www.w3.org/TR/REC-html40">      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>        <x:Name>${worksheet}</x:Name>        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->     <style type="text/css">table td {text-align: center;mso-number-format:'\\@';}</style>   </head><body>${str}</body></html>`;

    var a = document.createElement('a');
    a.href = uri + ExcelExportByJS.base64(template);
    a.download = config.title ? config.title : '下载';
    a.click();


    // 下载模板
    // window.location.href = uri + ExcelExportByJS.base64(template);   // 输出base64编码
  }
  function createStrs(arr,head){
    let header = '',str='',td='';
    if(!Array.isArray(arr)){
      return [];
    }
    for(let i=0;i<head.length;i++){
      header += `<th>${head[i].name}</th>`;
    }
    header = `<tr>${header}</tr>`;
    for(let j=0;j<arr.length;j++){
      str+=`<tr>${createTds(arr[j],head)}</tr>`;
    }
    return `<table>${header}${str}</table>`;
  }
  function createTds(obj,head){
    let td='';
    for(let k=0;k<head.length;k++){
      td+= `<td>${obj[head[k].key]}</td>`;
    }
    return td;
  }
};

ExcelExportByJS.base64 = function (s) {
  return window.btoa(unescape(encodeURIComponent(s)))
};

export default ExcelExportByJS;
