<template>
  <div class="main"> 
    <div class="main1">
      <div class="salesEcharts" id="salesEcharts"></div>
      <div class="dataShow">
        <div class="noneData" v-if="noneData1">暂无数据</div>
        <p class="tit">
          <i class="echartsColor" v-el:echarts-color1></i>
          {{ tabClassify }}: {{ supplierName1 }}
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
          {{ tabClassify }}: {{ supplierName2 }}
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
  import { getStartT, getEndT, getSupId, getNowMonth, getSelMonth, getUserCode, getApiUrl1} from '../vuex/getters'
  import store from '../vuex/store'

  export default {
    data () {
      return {       
        // urlApi: [
        //   // s_07 200.1.3.89:1209 shda.91onix.com http://shda.test.com/ http://shda.bookmall.com.cn
        //   'http://shda.bookmall.com.cn/App/AppSales/ContrastFacetBySupplier'
        // ],
        yes: true,
        isShow: false,
        myChart1: Object,
        myChart2: Object,
        tabClassify: '供应商',             
        supplierName1: '',
        supplierName2: '',
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
        tapE2: '',
        repeatIndex: [],
        supNewStr: []
      }
    },
    vuex: {
      getters:{
        StartT: getStartT,
        EndT: getEndT,
        supList: getSupId,
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
      lists: function(val, oldVal){
        // 默认供应商数据

        this.eachData()

          // 先判断当前是哪个echarts图
        if(this.yes){

          this.whichEcharts (this.lists,'MyRate','MyRate','FormatMy',1)
          

        }else{

          this.whichEcharts (this.lists,'VarietyRate','VarietyRate','Variety',2)

        }
      }    
    },
    computed:{
      urlApi(){
        return this.ApiUrl1 + '/App/AppSales/ContrastFacetBySupplier'
      }
    },
    ready () {

    // 初始化echarts图
      this.$set('myChart1',echarts.init(document.querySelector('#salesEcharts'),'macarons'));
      this.$set('myChart2',echarts.init(document.querySelector('#salesEcharts2'),'macarons'));

      this.getPieChart({
        "StartTime":this.StartT,
        "EndTime":this.EndT,
        "Supps": this.supList,
        "UserCode": this.UserCode
      })      
    },    
    events: {
      changeEcharts () {

        this.$set('noneData1',false) 
        this.$set('noneData2',false) 

        // 要对比的门店名称发生变化时，请求对应数据，渲染到页面上        
        this.getPieChart({
          "StartTime":this.StartT,
          "EndTime":this.EndT,
          "Supps": this.supList,
          "UserCode": this.UserCode
        })        
      }, 
      changeTime(){
        
        this.$set('noneData1',false) 
        this.$set('noneData2',false) 

        this.getPieChart({
          "StartTime":this.StartT,
          "EndTime":this.EndT,
          "Supps": this.supList,
          "UserCode": this.UserCode
        })
      },
      noData(){

        // 暂无数据界面展示，echarts图显示数据为0

        this.$set('noneData1',true) 
        this.$set('noneData2',true) 


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
        this.myChart2.setOption(this.option2) 
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
            this.$set('supplierName'+n,arr[this['tapE'+ n]].Supplier)          
            this.$els['echartsColor'+n].style.backgroundColor = this.color[this['tapE'+ n]]

          }else{

            this.$set('scale'+n,arr[this.num][op1] + '%')
            this.$set('total'+n,arr[this.num][op2])
            this.$set('supplierName'+n,arr[this.num].Supplier)
            this.$els['echartsColor'+n].style.backgroundColor = this.color[this.num]
          }
        }         
      }, 
      clickEcharts (arr,params,_this,op1,op2,n) {


        let compare

        for(let i=0; i<arr.length; i++){

          let supStr = arr[i].Supplier


          if(this.repeatIndex.length == 0){

            if(supStr.length>6){
              supStr = supStr.substring(0,6)
            } 
            if(supStr.substr(5,1) == "("){
              supStr = supStr.substring(0,5)
            }

            compare = supStr
          }else{

            compare = this.supNewStr[i]

          }

          if(compare == params.name){

            _this.$set('supplierName'+n,arr[i].Supplier)
            _this.$set('scale'+n,arr[i][op1] + '%')
            _this.$set('total'+n,arr[i][op2])

            // _this.$els.echartsColor.style.backgroundColor = params.color

          }
        }      
      },
      setEcharts (arr) {

        // sP(echarts1 data) pzP(echarts2 data) newLegend(截取legend data sort) sortLegend(备份legend data) repeatIndex(重复供应商 在arr中索引) supNewStr（去重后的legend data）numArr(元素为arr中索引值)

        let sP,pzP,newLegend,sortLegend,numArr

        sP = [], pzP = [], newLegend = [], sortLegend = [], numArr = []

        // this.repeatIndex 清空上次选中的重复供应商
        
        this.repeatIndex = []
        this.supNewStr = []

        // 进行供应商名称去重
        
        // 一、截取前6位

        for(let i=0; i<arr.length; i++){

            let supStr = arr[i].Supplier


            if(supStr.length>6){
              supStr = supStr.substring(0,6)
            } 
            if(supStr.substr(5,1) == "("){
              supStr = supStr.substring(0,5)
            }

            newLegend.push(supStr)

            sortLegend.push(supStr)

            newLegend.sort()

            numArr.push(i)
        }

        // 二、判断是否有重复的供应商

        for(let j=0; j<newLegend.length; j++){


          if(newLegend[j] == newLegend[j+1]){


            for(let k=0; k< sortLegend.length; k++){

              if(sortLegend[k] == newLegend[j]){

                this.repeatIndex.push(k)

              }
            }

          }


        }

        // 二、有重复的供应商，截取名称前4位+...+后两位，若没有就直接截取前6位放到图例数组supNewStr中
        
        if(this.repeatIndex.length >0){

          // 找出没有重复的元素索引值放到difference数组中

          let difference = numArr.filter(x => this.repeatIndex.indexOf(x) == -1).concat(this.repeatIndex.filter(x => numArr.indexOf(x) == -1));

          // 重复的元素索引特殊处理
          
          for(let w=0; w< this.repeatIndex.length; w++){

            let q = this.repeatIndex[w]

            // 若以）为结束，则从后向前找到和它匹配的（
            if(arr[q].Supplier.substr(arr[q].Supplier.length-1,1) == ")"){

              let afterStart = arr[q].Supplier.lastIndexOf('(')

              this.supNewStr[q] = arr[q].Supplier.substring(0,4) + '...' +  arr[q].Supplier.substring(afterStart,arr[q].Supplier.length)


            }else{

              this.supNewStr[q] = arr[q].Supplier.substring(0,4) + '...' +  arr[q].Supplier.substring(arr[q].Supplier.length-2,arr[q].Supplier.length)

            }

          }

          // 没有重复的元素就直接按对应的索引值截取前6位

          for(let l=0; l<difference.length; l++){

            this.supNewStr[difference[l]] = sortLegend[difference[l]]          
          }

        }else{

          // 全部没有重复就直接按对应的索引值截取前6位
          
          this.supNewStr = sortLegend
        }

        // 三、将echarts用到的数据推进sP,pzP中
        
        for(let i=0; i<arr.length; i++){

          sP.push(
            {value: arr[i].MyRate ,name: this.supNewStr[i]}
          )
          pzP.push(
            {value: arr[i].VarietyRate , name: this.supNewStr[i]}
          )

          this.option1.color[i] = this.color[i]            
          this.option2.color[i] = this.color[i]
        }

        // 四、渲染echarts图
        
        this.option1.series[0].data = sP
        this.option1.legend.data = this.supNewStr

        this.option2.series[0].data = pzP
        this.option2.legend.data = this.supNewStr

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
<style>

</style>

