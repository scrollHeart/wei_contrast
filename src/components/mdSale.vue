<template>
  <div class="main">
    <div class="main1">
      <div class="salesEcharts" id="salesEcharts"></div>
      <div class="dataShow">
        <div class="noneData" v-if="noneData1">暂无数据</div>
        <p class="tit">
          <i class="echartsColor" v-el:echarts-color1></i>
          {{ tabClassify }}: {{ mdName1 }}
        </p>
        <p>{{ duty1 }}  {{ scale1 }}</p>
        <p>{{ tabName1 }} {{ total1 }}</p>  
      </div>
    </div>
    <div class="main2 goEcharts" :class="{'goEcharts-enter': isShow,'goEcharts-leave': !isShow}">
      <div id="salesEcharts2" class="salesEcharts"></div>
      <div class="dataShow">
        <div class="noneData" v-if="noneData2">暂无数据</div>
        <p class="tit">
          <i class="echartsColor" v-el:echarts-color2></i>
          {{ tabClassify }}: {{ mdName2 }}
        </p>
        <p>{{ duty2 }}  {{ scale2 }}</p>
        <p>{{ tabName2 }} {{ total2 }}</p>  
      </div>
    </div> 
    <a href="javascript:;" class="left-icon" :class="{'active-icon': !yes}" @click="goEcharts1"></a>
    <a href="javascript:;" class="right-icon" :class="{'active-icon': yes}" @click="goEcharts2"></a>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import macarons from 'echarts/theme/macarons'
  import { setDate, getStartTime, getEndTime, setMd5 } from 'utilJs/unit'
  import { getStartT, getEndT, getMdId, getNowMonth, getSelMonth, getUserCode, getApiUrl1 } from '../vuex/getters'
  import store from '../vuex/store'
  export default {
    data () {
      return {      
        // urlApi: [
        //   // S-06 200.1.3.89:1209 shda.91onix.com http://shda.test.com/ http://shda.bookmall.com.cn
        //   'http://shda.bookmall.com.cn/App/AppSales/ContrastFacetByMd'
        // ],
        yes: true,
        isShow: false,
        myChart1: Object,
        myChart2: Object,
        tabClassify: '门店',             
        mdName1: '',
        mdName2: '',
        duty1: '销售码洋占比',
        tabName1: '销售码洋',
        duty2: '销售品种数占比',
        tabName2: '销售品种数',        
        scale1: '',
        total1: '',
        scale2: '',
        total2: '',        
        color: ['#bd9dde','#00c7cc', '#3eb0ee', '#ffba81', '#e17980','#e8d11f',  '#99706e', '#e667aa', '#546570', '#c4ccd3'],
        option1: {
          series: [
            {
              type:'pie',
              radius: '50%',
              center: ['50%', '70%'],
              label: {
                normal: {
                  show: true,
                  formatter: '{c}%'
                }
              },
              data:[]
            }
          ],
          grid:{
            top: 0,
            bottom: -20,
            containLabel: true
          },
          title: {
            text: "销售码洋",
            left: "center",
            top: "0",
            bottom: "0",
            padding: 10,
            textStyle: {
                fontSize: 16,
                color: "rgb(67, 67, 67)"
            }
          },
          legend: {
            orient: 'horizontal',
            left: 'left',
            right: '10px',
            top: '40px',
            data: ['上海书城福州店','上海书城五角场店'],
            itemWidth: 10,
            itemHeight: 12,
            itemGap: 15,
            padding: 10
          },
          color: ['#bd9dde','#00c7cc', '#3eb0ee', '#ffba81', '#e17980','#e8d11f',  '#99706e', '#e667aa', '#546570', '#c4ccd3']
        },
        option2: {
          series: [
            {
              name:'访问来源',
              type:'pie',
              radius: '50%',
              center: ['50%', '70%'],
              label: {
                normal: {
                  show: true,
                  formatter: '{c}%'
                }
              },
              data:[]            
            }
          ],
          grid:{
            top: 0,
            bottom: -20,
            containLabel: true
          },
          title: {
            text: "品种数",
            left: "center",
            top: "0",
            bottom: "0",
            padding: 10,
            textStyle: {
              fontSize: 16,
              color: "rgb(67, 67, 67)"
            }
          },
          legend: {
            orient: 'horizontal',
            left: 'left',
            top: '40px',
            right: '10px',
            data: [],
            itemWidth: 10,
            itemHeight: 12,
            itemGap: 15,
            padding: 10
          },
          color: ['#bd9dde','#00c7cc', '#3eb0ee', '#ffba81', '#e17980','#e8d11f',  '#99706e', '#e667aa', '#546570', '#c4ccd3']
        },
        lists: [],
        num: Number(),
        noneData1: false,
        noneData2: false,
        tapE1: '',
        tapE2: ''
      }
    },
    vuex: {
      getters:{
        StartT: getStartT,
        EndT: getEndT,
        mdsList: getMdId,
        nowMonth: getNowMonth,
        selMonth: getSelMonth,
        UserCode: getUserCode,
        ApiUrl1: getApiUrl1     
      }  
    },
    route:{
      data({to,from}){

        store.dispatch('TIMESHOW',{timeShow: true})

        this.$parent.switName = '销售'
        this.$parent.$els.editIcon.style.top = 4+ 'rem'
      }
    }, 
    watch: {
      lists(val, oldVal){

        // 找到this.lists[i].MyRate里的第一个不为空的index
        this.eachData()

        if(this.yes){
          this.whichEcharts (this.lists,'MyRate','MyRate','FormatMy',1)
        }else{
          this.whichEcharts (this.lists,'VarietyRate','VarietyRate','Variety',2)
        }

      }    
    },
    ready () {
      // 初始化echarts图
      this.$set('myChart1',echarts.init(document.querySelector('#salesEcharts'),'macarons'));
      this.$set('myChart2',echarts.init(document.querySelector('#salesEcharts2'),'macarons'));

      this.getPieChart({
        "StartTime":this.StartT,
        "EndTime":this.EndT,
        "Mds": this.mdsList,
        "UserCode": this.UserCode
      }) 
    }, 
    computed: {
      urlApi(){
        return this.ApiUrl1 + '/App/AppSales/ContrastFacetByMd'
      }
    },   
    events: {
      changeEcharts () {

        this.$set('noneData1',false) 
        this.$set('noneData2',false) 

        // 要对比的门店名称发生变化时，请求对应数据，渲染到页面上
        this.getPieChart({
          "StartTime":this.StartT,
          "EndTime":this.EndT,
          "Mds": this.mdsList,
          "UserCode": this.UserCode        
        })        
      }, 
      changeTime(){
        
        this.$set('noneData1',false) 
        this.$set('noneData2',false) 
       
        this.getPieChart({
          "StartTime":this.StartT,
          "EndTime":this.EndT,
          "Mds": this.mdsList,
          "UserCode": this.UserCode
        })
      },
      noData(){

        // 暂无数据界面展示，echarts图显示数据为0

        this.$set('noneData1',true) 
        this.$set('noneData2',true) 

        console.log(this.myChart1)

        // this.mychart1.clear()
        // this.mychart2.clear()

        let legendName = this.option1.legend.data

        let seriesData = [] 

        for(let i=0; i<legendName.length; i++){

          seriesData.push({value: 0 ,name: legendName[i]})


        }

        this.option1.series[0].data = seriesData
        this.option1.legend.data = legendName

        this.option2.series[0].data = seriesData
        this.option2.legend.data = legendName


        this.myChart1.setOption(this.option1)
        this.myChart2.setOption(this.option2); 

      }       
    },    
    methods: {     
      goEcharts1 () {
        this.isShow = false;
        this.yes = true;

        if(this.selMonth >= this.nowMonth){

          this.$emit('noData')

        }else{

          this.whichEcharts (this.lists,'MyRate','MyRate','FormatMy',1)
        }
      },
      goEcharts2 () {
        this.isShow = true;
        this.yes = false;

        if(this.selMonth >= this.nowMonth){

          this.$emit('noData')

        }else{  

          this.whichEcharts (this.lists,'VarietyRate','VarietyRate','Variety',2)
        }
      },
      whichEcharts (arr,condition,op1,op2,n) {

        let valNum = 0

        for(let i=0; i< arr.length; i++){

          if(arr[i][condition] == '0'){
            valNum ++
          } 
        }

        if(valNum == arr.length){
          
          this.$set('noneData'+n,true) 

          this['myChart'+n].dispatchAction({
            type: 'downplay',
            dataIndex: 0          
          }) 
        }else{

          this.$set('noneData'+n,false) 

          if(this['tapE'+ n] != ''){

            this.$set('scale'+n,arr[this['tapE'+ n]][op1] + '%')
            this.$set('total'+n,arr[this['tapE'+ n]][op2])
            this.$set('mdName'+n,arr[this['tapE'+ n]].Md)          
            this.$els['echartsColor'+n].style.backgroundColor = this.color[this['tapE'+ n]]

          }else{

            this.$set('scale'+n,arr[this.num][op1] + '%')
            this.$set('total'+n,arr[this.num][op2])
            this.$set('mdName'+n,arr[this.num].Md)
            this.$els['echartsColor'+n].style.backgroundColor = this.color[this.num]
          }         
        }         
      },       
      clickEcharts (arr,params,_this,op1,op2,n) {

        for(let i=0; i<arr.length; i++){

          let mdStr = arr[i].Md

          if(mdStr.length>6){
            mdStr = mdStr.substring(0,6)
          } 

          if(mdStr == params.name){

            _this.$set('mdName'+n,arr[i].Md)
            _this.$set('scale'+n,arr[i][op1] + '%')
            _this.$set('total'+n,arr[i][op2])

          }
        } 
      },
      setEcharts (arr) {

        let sP = []
        let pzP = []
        let newLegend = []

        // 将请求到数据放到echarts图data中

        for(let i=0; i<arr.length; i++){

          let mdStr = arr[i].Md

          if(mdStr.length>6){
            mdStr = mdStr.substring(0,6)
          } 

          sP.push(
            {value: arr[i].MyRate ,name: mdStr}
          )
          pzP.push(
            {value: arr[i].VarietyRate , name: mdStr}
          )

          newLegend.push(mdStr)

          this.option1.color[i] = this.color[i]            
          this.option2.color[i] = this.color[i]

        }

        this.option1.series[0].data = sP
        this.option1.legend.data = newLegend

        this.option2.series[0].data = pzP
        this.option2.legend.data = newLegend

        this.myChart1.setOption(this.option1)
        this.myChart2.setOption(this.option2);

      },
      eachData () {

        // 找到this.lists[i].MyRate里的第一个不为空的index
        for(let i=0; i<this.lists.length; i++){
          if(this.lists[i].MyRate != 0){
            this.num = i
            return this.num
          }
        }
      },
      getPieChart(postProps){
        // 门店销售数据
        let url = this.urlApi
        // md5加密
        let md5Obj = setMd5(postProps)
        let sign = md5Obj.sign
        let obj = md5Obj.obj  

        this.$http.post(`${url}?appkey=123&sign=${sign}`, JSON.stringify(obj)).then((response) => {

            let resList = response.body.List

            this.lists = resList
            console.log(resList)

           // 将它渲染到echarts图中
            this.setEcharts(resList)

          let _this = this

          // 点击销售码洋的echarts对应数据展示
          this.myChart1.on('click', function (params) {

            _this.clickEcharts(resList,params,_this,'MyRate','FormatMy',1)
            _this.$els.echartsColor1.style.backgroundColor = params.color 
            _this.tapE1 =  params.dataIndex

            if(params.dataIndex != 0){

              _this.myChart1.dispatchAction({
                type: 'downplay',
                dataIndex: 0          
              })                
            }

          });

          // 点击品种数的echarts对应数据展示
          this.myChart2.on('click', function (params) {

            _this.clickEcharts(resList,params,_this,'VarietyRate','Variety',2)
            _this.$els.echartsColor2.style.backgroundColor = params.color
            _this.tapE2 =  params.dataIndex 

            if(params.dataIndex != 0){

              _this.myChart2.dispatchAction({
                type: 'downplay',
                dataIndex: 0          
              })                
            }

          });

          this.myChart1.dispatchAction({
            type: 'highlight',
            dataIndex: 0          
          })        
          this.myChart2.dispatchAction({
            type: 'highlight',
            dataIndex: 0          
          })         
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '../css/myMixin/vars.scss';
  @import '~vux/dist/vux.css';
  @import '../css/myMixin/onePX.scss';

   .main{
    width: 100%;
    height: 77%;
    position: relative;
    margin-top: 2rem;
    background-color: $bgc_f8!important;
  }
  .main1,
  .main2{
    height: 100%;
    background-color: $bgc_f8!important;
  }
  .salesEcharts{
    width: 100%;
    height: 77%;
  }
  .left-icon,
  .right-icon{
    display: block;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px; 
    position: absolute;
    z-index: 100;
    top: 50%;    
    color: $cor_ccc;   
    &:after{
      font: 28px iconfont;
    }
  }
  .left-icon{
    left: 20px;
    &:after{
      content: '\e61d';
    }
  }
  .right-icon{
    right: 20px;
    &:after{
      content: '\e636';
    }
  }
  .active-icon{
    color: $cor_389;
  }
  .dataShow{
    padding-top: 10px;
    height: 5rem;
      p{
        color: $fs_666;
        font-size: 16px;
        text-align: center;
      }
      .tit{
        color: $fs_444; 
        .echartsColor{
          width: 14px;
          height: 14px;
          display: inline-block;
          // background-color: #bd9dde;
          border-radius: 4px;
        }                   
      }
  }
.goEcharts{
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  -webkit-transform: translate3d(100%,0,0);
  transform: translate3d(100%,0,0);  
  -webkit-transition: all .3s ease;
  transition: all .3s ease;
}
.noneData{
  position: absolute;
  width: 100%;
  height: 5rem;
  z-index: 2;
  background: $bgc_f8;
  font-size: 16px;
  text-align: center;
  padding-top: 10px;
  color: #666;
}
/* 过度动画
 */
.goEcharts-enter{
  -webkit-transform: translate3d(0,0,0);
  transform: translate3d(0,0,0);  
}   
.goEcharts-leave{
  -webkit-transform: translate3d(100%,0,0);
  transform: translate3d(100%,0,0);    
}
 
</style>
