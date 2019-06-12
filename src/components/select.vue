<!--
    <select :selectArr="arr" :type="1" @dataFun="change"></select>

    数组：selectArr (必传) 
          格式：selectArr: [
                    {
                        title: "",  //标题
                        selectValue: "",    //选中的值
                        keys: { key: "", lable: "", value: "" }, //key：传接口的key，label：选中显示字段的key，value：选中传出字段的key
                        url: "",    //下拉内容的请求接口
                        options:[]  //下拉内容
                    },
                    {
                        title: "名称",
                        selectValue: "",
                        keys: { key: "", lable: "", value: "" },
                        url: "",
                        options:[]
                    }
                ]
    函数: dataFun   (必传) //用来接收传来的对象
    类型: type  (可传，多个调用时需传) //用来区分多个组件

-->
<template>
  <div class="select">
    <div v-for="(item,index) in arr" :key="index" class="sel-contain">
      <span class="sel-title">{{item.title}}</span>
      <el-select
        class="sel-content"
        v-model="item.selectValue"
        placeholder="请选择"
        filterable
        clearable
      >
        <el-option
          v-for="(element,i) in item.options"
          :key="i"
          :label="element[item.keys.lable]"
          :value="element[item.keys.value]"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import axios from "../fetch/url";
export default {
  props: ['selectArr','type'],
  data() {
    return {
      obj: {}
    };
  },
  computed: {
    arr() {
      this.selectArr.forEach(element => {
        if (element.selectValue) {
          this.obj[element.keys.key] = element.selectValue;
        }
        if (element.url) {
          axios.get(element.url).then(res => {
            if (res.data.code == 0) {
              if (Array.isArray(res.data.data)) {
                element.options = res.data.data;
              }
              if (Array.isArray(res.data.data.data)) {
                element.options = res.data.data.data;
              }
            }
          });
        }
      });
      this.$emit("dataFun", this.obj,this.type);
      return this.selectArr
    }
  },
  methods: {
    // change(key, value) {
    //   if (value) {
    //     this.obj[key] = value;
    //   } else {
    //     delete this.obj[key];
    //   }
    // //   this.$emit("dataFun", this.obj);
    // }
  }
};
</script>

<style>

</style>
