/**
 * 简单封装echarts4，接收容器id
 **/

import echarts from 'echarts'
const install = function(Vue) {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        /** echarts所有组件方法写在这里 **/
        return {
          /** pie 饼图 环形图 **/
          pie(id,data){
            let arr = [], color = [];
            let color1 = ['#E2465B','#14B158','#3F75E2','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
            data.forEach((element,index) => {
              if(element.value){
                arr.push(element)
                color.push(color1[index])
              }
            });
            // let chart = this.chart = echarts.init(document.getElementById(id));
            let chart = this.chart = echarts.init(id);
            this.chart.clear();
            let option = {
              tooltip: {
                trigger: 'item',
                // formatter: "{b}: {c}  {d}%",
                formatter: "{b}:{d}%",
                // position:['50%','50%']
              },
              // legend: {
              //     orient: 'vertical',
              //     x: 'left',
              //     data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
              // },
              // legend:{
              //             show:true
              //         },
              series: [
                {
                  // name:'访问来源',
                  type:'pie',
                  radius: ['45%', '65%'],
                  avoidLabelOverlap: false,
                  label: {
                    // position:'inside',
                    normal: {
                      show: true,
                      position: 'inside',
                      formatter: "{d}%",
                      textBorderWidth:0,
                      color:'#fff'
                    },

                    emphasis: {
                      show: true,
                      textStyle: {
                        fontSize: '20',
                        fontWeight: 'bold'
                      }
                    }
                  },
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                    }
                  },
                  // labelLine: {
                  //   normal: {
                  //       show: true
                  //   }
                  // },
                  data:arr||[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'},
                    {value:234, name:'联盟广告'},
                    {value:135, name:'视频广告'},
                    {value:1548, name:'搜索引擎'}
                  ]
                }
              ],
              color:color,
            };
            this.chart.setOption(option);
            return new Promise((resolve,reject)=>{
              resolve(this.chart || chart);
            });
          },

          /** bar 柱图
           * id: Number/String 容器的id
           * dat：Object 数据，如：{name:'小明',value:90}
           * key: Array  说明数据dat的字段，如：['name1','value1']，即当dat数据为{name1:'小明',value1:90}时使用
           * filter: String 名字中要过滤掉的文字
           * color: Array 柱子的颜色 如：['red','blue','green']
           * **/
          bar(id,dat,key,filter='',color=[]){
            let chart = this.chart = echarts.init(document.getElementById(id));
            this.chart.clear();


            // x轴数据
            // let dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
            let dataAxis = [];
            // bar使用的数据 - 即y轴数据
            // let data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
            let data = [];
            let reg = new RegExp(filter);
            if(Array.isArray(dat) && dat.length>0){
              dat.forEach(el=>{
                if(!Array.isArray(dat)){
                  dataAxis.push(el.name.replace(reg,''));
                  // data.push(el.value);
                }else{
                  dataAxis.push(el[key[0]].replace(reg,''));
                  el.id = el.community_id
                  el.value = el[key[1]]
                  // data.push(el[key[1]]);
                }
              });
              data = dat
              // console.log('x轴数据::::',dataAxis,'y轴数据:::',data);
            }
            // var yMax = 500;
            // var dataShadow = [];
            //
            // for (var i = 0; i < data.length; i++) {
            //   dataShadow.push(yMax);
            // }

            let option = {
              // title: {
              //   text: '特性示例：渐变色 阴影 点击缩放',
              //   subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
              // },

              grid:{
                top:20,
                bottom:60,
                left:40,
                right:20
              },
              // x轴
              xAxis: {
                data: dataAxis,
                axisLabel: {
                  // inside: true,
                  textStyle: {
                    color: '#f1f1f1'
                  },
                  formatter(value){
                    return value.split('').join('\n');
                  }
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  lineStyle:{
                    color:'#203E6A'
                  }
                },
                z: 10
              },
              // y轴
              yAxis: {
                axisLine: {
                  show: true,
                  lineStyle:{
                    color:'#203E6A'
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  textStyle: {
                    color: '#557db8'
                  }
                },
                splitLine:{
                  show:false
                },
                minInterval : 1
              },
              tooltip:{
                show:true,
              },
              // dataZoom: [
              //   {
              //     type: 'inside'
              //   }
              // ],
              series: [
                // { // For shadow
                //   type: 'bar',
                //   data: dataShadow,
                //   itemStyle: {
                //     // normal: {color: 'rgba(0,0,0,0.05)'}
                //     normal: {color: 'transparent'}
                //   },
                //   barGap:'-100%',
                //   barCategoryGap:'40%',
                //   animation: false
                // },
                {
                  type: 'bar',
                  data: data,
                  // label:{
                  //     show:true,
                  //     position:'top',
                  // },
                  barGap:'-100%',
                  barCategoryGap:'40%',
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                          {offset: 0, color: color[2]||'#3A1CEF'},
                          {offset: 0.5, color: color[1]||'#1a57e5'},
                          {offset: 1, color: color[0]||'#0086DD'}
                        ]
                      )
                    },
                    emphasis: {
                      color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                          {offset: 0, color: color[0]||'#0086DD'},
                          {offset: 0.7, color: color[1]||'#1a57e5'},
                          {offset: 1, color: color[2]||'#3A1CEF'}
                        ]
                      )
                    }
                  },
                }
              ]
            };

            // Enable data zoom when user click bar.
            let zoomSize = 6;
            chart.on('click',(params) => {
              let time = new Object();
              time.url = params.data.url
              time.seat = 1
              time.community_id = params.data.community_id
              if(params.data.start_time){
                time.start_time = params.data.start_time
                time.end_time = params.data.end_time
              }
              if(params.data.start_day){
                time.start_day = params.data.start_day
                time.end_day = params.data.end_day
              }
              time.id = window.localStorage.getItem('id')
              window.localStorage.setItem('type',0)
              // console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
              // debugger;
              // chart.dispatchAction({
              //   type: 'dataZoom',
              //   startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
              //   endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
              // });
            });
            this.chart.setOption(option,true);
            // window.onresize = function(){
            //   setTimeout(()=>{
            //     chart.resize();
            //   },200)
            // }
            return new Promise((resolve,reject)=>{
              resolve(this.chart || chart);
            });
          }
        }
      }
    }
  })
};

export default {
  install
};
