<template>
  <!-- 
  使用说明：
  两种数据方式：1、:data-url="'/xxx'"  :auto-data="true"   自动通过地址更新数据，更新可以在'/xxx'后面加上参数 '?time=xxxxxx'
  2、:data-url=""  :auto-data="false" :option="option"    数据在option.data：[{....}]
  -->
  <!------------------------ options 数据说明 ------------------------------------------------------------
  {
    // 表头及对应的字段
    header:[
      // {name:'序号',key:'auto',width:'100',},
      // {name:'标题',key:'title',},
      // {name:'内容',key:'content',trim:30}, trim:30显示字符长度
      // {name:'时间',key:'create_time',filter:"yyyy-MM-dd"},
      // {name:'性别',key:'create_time',cnKey:[{name:'男',value:1},{name:'女',value:2}],},
    ],
    // 右侧功能按钮
    columnRightBtns:{
      headName:'操作',
      width:'180',
      btns:[
       // {name:'预览',fun:'',class:"mini_btn", size:"mini",type:"primary"},
       // {name:'编辑',fun:'',class:"mini_btn", size:"mini",type:""},
       // {name:'删除',fun:'',class:"mini_btn", size:"mini",type:"danger"},
     ],
   },
  ------------------------------------------------------------------------------------>
  <div class="compTableList">
    {{initData}}
    <el-table
      ref="multipleTableList"
      :data="list"
      style="width: 100%"
      @select="tabSelect"
      @select-all="tabSelectAll"
    >
      <!--<el-table ref="multipleTableList" :data="list" style="width: 100%" @select-all="tabSelectAll" @selection-change="tabSelectChange">-->
      <el-table-column v-if="canSelect" width="50" type="selection" :selectable="selectable"></el-table-column>

      <!--<el-table-column width="100" align="center" label="序号">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{ data.per_page*(pagination.current_page-1)+scope.$index+1 }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column
        :label="he.name"
        align="center"
        v-for="he in option.header"
        :key="he.key"
        :width="he.width"
      >
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span
              style="margin-left:10px;"
              v-if="he.key=='auto'"
            >{{(pagination.per_page||10)*((pagination.current_page||1)-1)+scope.$index+1 }}</span>
            <!--<span size="medium" v-else :title="formatData(scope.row[he.key],he.cnKey)">{{ formatData(scope.row[he.key],he.cnKey,he.trim,he.filter) }}</span>-->
            <span
              style="cursor:default;"
              size="medium"
              v-else
              :title="formatData({data:scope.row[he.key],cnKey:he.cnKey,filter:he.filter})"
            >{{ formatData({data:scope.row[he.key],cnKey:he.cnKey,trim:he.trim,filter:he.filter}) }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="option.columnRightBtns.headName||'操作'"
        v-if="option.columnRightBtns&&option.columnRightBtns.btns&&option.columnRightBtns.btns.length>0"
        :width="option.columnRightBtns.width"
      >
        <template slot-scope="scope">
          <el-button-group>
            <!--<el-button v-for="(btn,i) in option.columnRightBtns.btns" :key="'btn'+i" :class="btn.class" :size="btn.size" :type="btn.type" @click="btn.fun(scope.$index, scope.row)">{{btn.name}}</el-button>-->
            <el-button
              v-for="(btn,i) in option.columnRightBtns.btns"
              :key="'btn'+i"
              :class="btn.class"
              :size="btn.size"
              :type="btn.type"
              @click="btn.fun(scope.$index, scope.row)"
            >{{btn.key?formatData({data:scope.row[btn.key],cnKey:btn.cnKey}):btn.name}}</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size.sync="pagination.per_page"
        :current-page.sync="pagination.current_page"
        layout="prev, pager, next"
        :total="pagination.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    option: {
      type: Object,
      default: () => {
        return {
          // 表头及对应的字段
          header: [
            // {name:'序号',key:'auto',width:'100',fun:''},
            // {name:'标题',key:'title',fun:''},
            // {name:'内容',key:'content',fun:''},
            // {name:'时间',key:'create_time',fun:''},
            // {name:'性别',key:'create_time',cnKey:[{name:'男',value:1},{name:'女',value:2}],fun:''},
          ],
          // 右侧功能按钮
          columnRightBtns: {
            headName: "操作",
            width: "180",
            btns: [
              // {name:'预览',fun:'',class:"mini_btn", size:"mini",type:"primary"},
              // {name:'编辑',fun:'',class:"mini_btn", size:"mini",type:""},
              // {name:'删除',fun:'',class:"mini_btn", size:"mini",type:"danger"},
            ]
          },
          // 数据
          data: [],
          // 自动数据-为true时将自动请求pagination.url接口中的数据
          autoData: false,
          // 选中的
          selected: [],
          // 分页的
          pagination: {
            url: "", // 点击页码时自动请求数据的地址
            per_page: 1, // 每页数量
            current_page: 1, // 当前页码
            total: 10
          }
        };
      }
    },
    selectedList: {
      type: [Array, String, Number],
      default: () => []
    },
    // 是否使用自动的数据-使用的话需要填写dataUrl字段
    autoData: {
      type: Boolean,
      default: false
    },
    dataUrl: {
      type: String,
      default: ""
    },
    // 是否可选
    canSelect: {
      type: Boolean,
      default: false
    },
    // 单选
    singleElection: {
      type: Boolean,
      default: false
    },
    // 可选数量控制 - 0 和 单选为true时 无效
    canSelectNum: {
      type: Number,
      default: 0
    },

    // 重置选中的数据
    resetSelected: {
      type: Number,
      default: 1
    },
    // 禁止选择的项目
    listDisabled: {
      type: Array,
      default: () => []
    },

    // // 强制更新列表数据
    // update:{
    //   type: Number,
    //   default:1
    // },
    /** 数据分类
     * 如果列表的外层有tab标签切换数据，需要将tab对应的类型传入，方便存储
     * 默认只有一类数据
     * **/
    dataType: {
      type: Array,
      default: () => ["base"]
    },
    // 当前激活的数据分类，不传入的话默认激活第一个，否则tab标签切换失效
    dataCurrent: {
      type: String,
      default: "base"
    }
  },
  components: {},
  data() {
    return {
      list: [],
      selected: "", // 列表选中的数据的id集合
      tmp: {
        // 临时存储选中的列表数据
        selectedTabObjs: [],
        update: 0,
        selected: "", // 当前页面选中的数据
        selectedPropsUnchanged: [] // 接收的未改变的选中数据：即每次列表数据变动后，从selectedList中将当页默认选中的数据去掉，剩余selectedList中其他分页的数据
      },
      // 列表选择时的数据存放 -- 历史页面的选中数据
      dat: {
        base: [] // 对应外部绑定的属性 datatype,如果
        // ...
      },
      // 分页使用的数据
      pagination: {
        total: 1,
        url: "", // 点击页码时自动请求数据的地址
        per_page: 1, // 每页数量
        current_page: 1 // 当前页码
      },
      // 弹窗使用的数据
      dialog: {
        topTitle: "",
        data: [],
        show: false,
        showBtn: true
      }
    };
  },
  watch: {
    selectedList(val) {
      this.changeSelected(this.selectedList);
    },
    resetSelected(n, o) {
      if (n) {
        // 初始化 dataType 对应的数据 -- 即清除掉this.dat中之前点击产生的数据
        for (let i = 0; i < this.dataType.length; i++) {
          this.dat[this.dataType[i]] = [];
        }
        this.arrangeSelectedArray();
      }
    },
    list(value) {
      this.arrangeSelectedArray();
    }
  },
  computed: {
    headers() {
      return {};
    },
    // 初次加载时 如果不使用url获取数据
    initData() {
      // console.log('initData:::',this.autoData);
      if (this.option.pagination) {
        this.pagination.per_page = this.option.pagination.per_page || 20;
        this.pagination.current_page = this.option.pagination.current_page || 1;
        this.pagination.total = this.option.pagination.total || 20;
        this.pagination.url = this.dataUrl || this.option.pagination.url;
      }
      if (!this.autoData) {
        this.list = this.option.data;
      } else {
        this.pageChangeData(this.dataUrl || this.option.pagination.url);
      }
    }
  },
  mounted() {
    // 初次加载时 如果试用url获取数据
    if (this.autoData) {
      this.pageChangeData(this.dataUrl || this.option.pagination.url);
    }
    // 初始化 dataType 对应的数据
    for (let i = 0; i < this.dataType.length; i++) {
      this.dat[this.dataType[i]] = [];
    }
    // 初始化 接收的未改变的选中数据
    switch (typeof this.selectedList) {
      case "string":
        if (this.selectedList.indexOf(",") > -1) {
          this.tmp.selectedPropsUnchanged = this.selectedList.split(",");
        } else {
          this.tmp.selectedPropsUnchanged = [this.selectedList];
        }
        break;
      case "array":
        this.tmp.selectedPropsUnchanged = this.selectedList;
        break;
      case "number":
        this.tmp.selectedPropsUnchanged = [this.selectedList];
        break;
      default:
        this.tmp.selectedPropsUnchanged = [];
    }
    // this.tmp.selectedPropsUnchanged = (typeof(this.selectedList)=='string'&&this.selectedList.indexOf(',')>-1)?this.selectedList.split(','):this.selectedList;
  },
  updated() {
    /** 设置table头部背景色 */
    if (
      document.querySelector(".el-table__header-wrapper table thead tr th")
        .style.backgroundColor != "#eee"
    ) {
      let ths = document.querySelectorAll(
        ".el-table__header-wrapper table thead tr th"
      );
      if (ths.length > 0) {
        ths.forEach(el => {
          el.style.backgroundColor = "#eee";
        });
      }
    }
  },
  methods: {
    // 整理默认选中的数据，并设置选中
    arrangeSelectedArray() {
      // let arr = Array.from(new Set([...this.tmp.selectedHis.map(i=>i.id),...(typeof(this.selectedList)=='string'&&this.selectedList.indexOf(',')>-1)?this.selectedList.split(','):this.selectedList]));
      let arr =
          typeof this.selectedList == "string" &&
          this.selectedList.indexOf(",") > -1
            ? this.selectedList.split(",")
            : this.selectedList,
        arr2 = [];
      // 单选
      if (this.singleElection) {
      } else {
        // 多选
        // arr = Array.from(new Set([
        //   ...(this.tmp.selectedHis[this.pagination.current_page-1]?this.tmp.selectedHis[this.pagination.current_page-1].map(i=>i.id):[]), // 组件自己存的选中项
        //   ...(typeof(this.selectedList)=='string'&&this.selectedList.indexOf(',')>-1)?this.selectedList.split(','):this.selectedList  // 接收的选中项 如'1,2,22,35'
        // ]));
        for (let i in this.dat) {
          for (let j = 0; j < this.dat[i].length; j++) {
            arr2 = [...arr2, ...this.dat[i][j]];
          }
        }
        arr2 = arr2.map(a => a.id);
        // console.log('组件自己存的选中项：：：',arr2, '   接收的选中项:::',arr);
        arr = Array.from(
          new Set([
            ...arr2, // 组件自己存的选中项
            ...arr // 接收的选中项 如'1,2,22,35'
          ])
        );
        arr = Array.from(new Set(arr.join(",").split(","))); // 去重
      }
      this.changeSelected(arr);
      // this.changeSelected(this.selectedList);
    },
    changeSelected(val) {
      let _this = this,
        selection = "";
      let arr = this.tmp.selectedPropsUnchanged;
      setTimeout(() => {
        if (Array.isArray(val)) {
          this.setSelectedLists(val);
        } else if (typeof val == "string" && val.indexOf(",") > -1) {
          this.setSelectedLists(val.split(","));
        } else if (typeof val == "number" || typeof Number(val) == "number") {
          this.setSelectedLists([val]);
        }
        // console.log('table:::',_this.$refs.multipleTableList);
        // 存储当前页面默认选中的
        _this.dat[_this.dataCurrent][_this.pagination.current_page - 1] =
          _this.$refs.multipleTableList.selection;

        selection = _this.$refs.multipleTableList.selection.map(i => i.id);
        for (let i = 0; i < selection.length; i++) {
          if (arr.findIndex(j => j == selection[i]) > -1) {
            arr.splice(arr.findIndex(j => j == selection[i]), 1);
          }
        }
        _this.tmp.selectedPropsUnchanged = arr;
        // console.log('接收的未改变的选中数据：',_this.tmp.selectedPropsUnchanged);
      }, 200);
    },
    // 设置是否禁止选择
    selectable(row, index) {
      // console.log('设置是否禁止选择:::',this.listDisabled);
      if (this.listDisabled.filter(i => i == row.id).length > 0) {
        return 0; // 禁用
      } else {
        return 1; // 启用
      }
    },
    // 列表选中事件，
    tabSelect(d) {
      let ar = [];
      // 单选
      if (this.singleElection) {
        // 清空选中
        this.$refs.multipleTableList.clearSelection();
        // 设置最后一次选中
        this.$refs.multipleTableList.toggleRowSelection(
          d.length > 0 ? d[d.length - 1] : d,
          true
        );
        // 将选中的id发到父级
        // this.tabSelectSet(this.setSelectedObjs(d[d.length-1]));
        this.tabSelectSet(
          this.setSelectedObjs(d.length > 0 ? [d[d.length - 1]] : d)
        );
      } else {
        // 多选
        this.tmp.selected = d;
        // this.tmp.selectedHis[this.pagination.current_page-1] = d;
        // if(this.tmp.selectedHis.length>0){
        //   for(let i=0;i<this.tmp.selectedHis.length;i++){
        //     // ar.push(this.tmp.selectedHis[i]);
        //     ar= [...ar,...this.tmp.selectedHis[i]];
        //   }
        // }
        this.dat[this.dataCurrent][this.pagination.current_page - 1] = d;
        for (let j in this.dat) {
          for (let i = 0; i < this.dat[j].length; i++) {
            ar = [...ar, ...this.dat[j][i]];
          }
        }
        // 将选中的id发到父级
        this.tabSelectSet(this.setSelectedObjs(this.filterArray(ar, "id")));
      }
    },
    // 列表全选事件，
    tabSelectAll(sec, row) {
      let ar = [];
      // 单选
      if (this.singleElection) {
        this.$refs.multipleTableList.clearSelection();
        this.$refs.multipleTableList.toggleRowSelection(
          this.tmp.selectedTabObjs,
          true
        );
      } else {
        // 多选
        // this.tabSelectSet(sec);
        this.dat[this.dataCurrent][this.pagination.current_page - 1] = sec;
        for (let d in this.dat) {
          for (let i = 0; i < this.dat[d].length; i++) {
            ar = [...ar, ...this.dat[d][i]];
          }
        }
        // 将选中的id发到父级
        this.tabSelectSet(this.setSelectedObjs(this.filterArray(ar, "id")));
      }
    },

    // 发送数据到父级， 父级使用：new + unChanged 即为全部选中的数据
    tabSelectSet(rows) {
      this.$emit("selected", {
        new: this.setSelectedObjs(rows),
        old: this.selectedList,
        unChanged: this.tmp.selectedPropsUnchanged
      });
      // console.log('组件选中的行rows:::',{new:this.setSelectedObjs(rows),old:this.selectedList},rows);
    },
    // 设置选中 - 接收id集合
    setSelectedLists(ids) {
      let _this = this;
      this.$refs.multipleTableList.clearSelection();
      // setTimeout(()=>{
      for (let j = 0; j < _this.list.length; j++) {
        for (let i = 0; i < ids.length; i++) {
          if (_this.list[j].id == Number(ids[i])) {
            _this.$refs.multipleTableList.toggleRowSelection(
              _this.list[j],
              true
            );
          }
        }
      }
      // },300);
    },
    // 格式化选中的ids
    setSelectedIds(arr, key = "id") {
      let ids = [];
      if (!arr) {
        return;
      }
      if (Array.isArray(arr)) {
        ids = arr.map(ele => {
          return ele[key];
        });
      } else if (typeof arr == "object") {
        ids[0] = arr[key];
      }
      // this.tmp.selected = ids;
      return ids;
    },
    // 格式化发送给父级的选中的对象
    setSelectedObjs(arr) {
      let objs = [];
      if (!arr) {
        return;
      }
      if (Array.isArray(arr)) {
        objs = arr.map(ele => {
          return {
            id: ele.id || "",
            name: ele.name || ""
          };
        });
      } else if (typeof arr == "object") {
        objs = {
          id: arr.id || "",
          name: arr.name || ""
        };
      }
      // this.tmp.selectedTabObjs = objs;
      return objs;
    },

    // 上一页下一页
    handleCurrentChange(i) {
      this.pagination.cur_page = i;
      this.pageChangeData(
        this.pagination.url +
          (this.pagination.url.indexOf("?") > -1 ? "&page=" : "?page=") +
          i
      );
    },
    // 格式化接收的数据
    // formatData(data,fill,trim=''){
    formatData(data) {
      // console.log(arguments);
      if (!data.data) {
        return "";
      }
      let d = "";
      if (data.cnKey && Array.isArray(data.cnKey) && data.cnKey.length > 0) {
        // console.log('格式化接收的数据:::',data);
        debugger;
        data.cnKey.forEach(el => {
          if (el.value == data.data) {
            d = el.name;
            return;
          }
        });
      } else {
        d = data.data;
      }
      if (data.trim && typeof data.trim == "number") {
        d = this.sliceText(d, data.trim);
      }
      // 去掉html标签
      d = typeof d == "string" ? d.replace(/<.+?>/g, "") : d;
      if (data.filter) {
        // console.log(data.data);
        switch (data.filter) {
          case "yyyy-MM-dd":
            d = this.formatDate(
              new Date(
                typeof d == "number" && String(d).length == 10 ? d * 1000 : d
              ),
              "yyyy-MM-dd"
            );
            break;
          case "yyyy-MM-dd hh:mm:ss":
            d = this.formatDate(
              new Date(
                typeof d == "number" && String(d).length == 10 ? d * 1000 : d
              ),
              "yyyy-MM-dd hh:mm:ss"
            );
            break;
        }
      }
      return d;
    },
    // 裁切字体
    sliceText(str, len) {
      if (!str) {
        return "";
      }
      len = len || 20;
      return str.length > len ? str.slice(0, len) + "..." : str;
    },

    pageChangeData(url) {
      // console.log('dataUrl变化了：：',url);
      let _this = this;
      _this.getData(url).then(res => {
        let val = _this.selectedList;
        _this.list = res.data.data;
        // _this.pagination.url = _this.dataUrl||_this.option.pagination.url;
        _this.pagination.per_page = res.data.per_page;
        _this.pagination.current_page = res.data.current_page;
        _this.pagination.total = res.data.total;
      });
    },
    getData(url, type = "get", data = {}) {
      return new Promise((resolve, reject) => {
        axios({
          method: type,
          url: url,
          // data: JSON.stringify(data)
          data: type == "put" ? data : JSON.stringify(data)
        })
          .then(response => {
            resolve(response.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    // 数组对象去重
    filterArray(arr, key) {
      if (!Array.isArray(arr)) {
        return arr;
      }
      let a = Array.from(new Set(arr.map(k => (key ? k[key] : k)))),
        ar = [];
      for (let i = 0; i < a.length; i++) {
        ar.push(arr.filter(j => a[i] == (key ? j[key] : j))[0]);
      }
      return ar;
    },
    //转换日期方法
    formatDate(date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
      };
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + "";
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : padLeftZero(str)
          );
        }
      }
      function padLeftZero(str) {
        return ("00" + str).substr(str.length);
      }
      return fmt;
    }
  }
};
</script>

<style lang="less" scoped>
.compTableList {
  // .el-table__header-wrapper table thead tr th {
  //   background-color: #f00 !important;
  // }
}
.pagination {
  text-align: left;
}
/*@import "../style/mixin";*/

/*.m-waper-box{*/
/*border:1px solid #ddd;*/
/*min-height: 23vh;*/
/*border-radius:0.5vh;*/
/*padding:0 1vh;*/
/*.m-waper-block{*/
/*margin:0 1vh;*/
/*}*/
/*}*/

/*.editer {*/
/*padding: 10px 0;*/
/*}*/

/*.el-col .el-input {*/
/*padding: 5px 0;*/
/*width: 100%;*/
/*}*/

/*.submit_btn {*/
/*text-align: right;*/
/*}*/
</style>
