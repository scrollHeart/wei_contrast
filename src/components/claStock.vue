<template>
  <div class="main">      
    <div class="main1">
      <div class="salesEcharts" id="salesEcharts"></div>
      <div class="dataShow">
        <div class="noneData" v-if="noneData1">暂无数据</div>
        <p class="tit">
          <i class="echartsColor" v-el:echarts-color1></i>
          {{ tabClassify }}: {{ claName1 }}
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
          {{ tabClassify }}: {{ claName2 }}
        </p>
        <p>{{ duty2 }}  {{ scale2 }}</p>
        <p>{{ tabName2 }} {{ total2 }}</p>  
      </div>
    </div> 
    <a href="javascript:;" class="left-icon" :class="{'active-icon': !yes}" @click="goEcharts1"></a>
    <a href="javascript:;" class="right-icon" :class="{'active-icon': yes}" @click="goEcharts2"></a
  </div>
</template>
<script>
  import echarts from 'echarts'
  import macarons from 'echarts/theme/macarons'
  import { setDate, getStartTime, getEndTime, setMd5 } from 'utilJs/unit'
  import store from '../vuex/store'
  import { getClaId } from '../vuex/getters'
  export default {
    data () {
      return {
        urlApi: [
          // sk_07 200.1.3.89:1209 shda.91onix.com http://shda.test.com
          'http://shda.bookmall.com.cn/App/AppStock/ContrastFacetByVariety'
        ],
        yes: true,
        isShow: false,
        myChart1: Object,
        myChart2: Object,
        tabClassify: '分类',             
        claName1: '',
        claName2: '',        
        duty1: '库存码洋占比',
        tabName1: '库存码洋',
        duty2: '库存品种数占比',
        tabName2: '库存品种数',        
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
            text: "库存码洋",
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
        claList: getClaId
      }  
    },
    route:{
      data({to,from}){

        store.dispatch('TIMESHOW',{timeShow: false})

        this.$parent.switName = '库存'
        this.$parent.$els.editIcon.style.top = 2+ 'rem'     
      }
    },        
    watch: {
      lists: function(val, oldVal){

        // 找到this.lists[i].MyRate里的第一个不为空的index
        this.eachData()

          // 先判断当前是哪个echarts图
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
        "Classifies": this.claList,
        "UserCode": "0"
      })      
    },
    events: {
      changeEcharts () {

        this.$set('noneData1',false) 
        this.$set('noneData2',false) 

        this.getPieChart({
          "Classifies": this.claList,
          "UserCode": "0"
        })
      }    
    },               
    methods: {
      goEcharts1 () {
        this.isShow = false;
        this.yes = true;

        this.whichEcharts (this.lists,'MyRate','MyRate','FormatMy',1)
      },
      goEcharts2 () {
        this.isShow = true;
        this.yes = false;

        this.whichEcharts (this.lists,'VarietyRate','VarietyRate','Variety',2)
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
            this.$set('claName'+n,arr[this['tapE'+ n]].Classify)          
            this.$els['echartsColor'+n].style.backgroundColor = this.color[this['tapE'+ n]]

          }else{

            this.$set('scale'+n,arr[this.num][op1] + '%')
            this.$set('total'+n,arr[this.num][op2])
            this.$set('claName'+n,arr[this.num].Classify)
            this.$els['echartsColor'+n].style.backgroundColor = this.color[this.num]
          }
        }         
      },               
      clickEcharts (arr,params,_this,op1,op2,n) {

        for(let i=0; i<arr.length; i++){

          if(arr[i].Classify == params.name){

            _this.$set('claName'+n,arr[i].Classify)
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

          sP.push(
            {value: arr[i].MyRate ,name: arr[i].Classify}
          )
          pzP.push(
            {value: arr[i].VarietyRate , name: arr[i].Classify}
          )

          newLegend.push(arr[i].Classify)

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
        let url = this.urlApi[0]
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
<style scoped>
  .main{
    margin-top: 0;
    height: 84%;
  }
</style>

