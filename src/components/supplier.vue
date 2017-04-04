<template>
  <div class="tab">
    <tab class="normalTab" :animate="false" >  
      <tab-item v-link="{path: 'supSale'}" :selected="switName === '销售'" @click="triggleswitName('销售')">销售</tab-item>        
      <tab-item v-link="{path: 'supStock'}" :selected="switName === '库存'" @click="triggleswitName('库存')">库存</tab-item>       
    </tab>
  </div>
  <router-view></router-view>  
  <span class="editBtn" v-el:edit-icon @click="editGo">
    <i class="edit-icon"></i>
    <i class="edit-txt">选择供应商</i>
  </span>
  <div class="wrap edit" :class="{'edit-enter': editShow,'edit-leave': !editShow}">
    <div class="prompt">
      <span class="cancelBtn" @click="cancelBtn"></span>
      选择供应商（最少2个，最多8个）
      <button v-el:sure  @click="sure($event)">确认</button>
    </div>
    <div class="filterBtn" v-el:filter-ch>
      <span class="activeBlue" @click="AD_event($event)">A-D</span>
      <span @click="EH_event($event)">E-H</span>
      <span @click="IL_event($event)">I-L</span>
      <span @click="MP_event($event)">M-P</span>
      <span @click="QU_event($event)">Q-U</span>
      <span @click="VZ_event($event)">V-Z</span>
    </div>
    <section class="options" v-el:scroll-box>
      <div class="con">
        <ul v-el:list-item>
          <li v-for="list in listsPX" @click="selectEvent($index)">
            <div class="scale-border ">
                <div class="content">{{ list }}</div>
                <div class="border border-color"></div>
            </div> 
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
<script>
import tab from 'vux/dist/components/tab'
import tabItem from 'vux/dist/components/tab-item'
import {setMd5} from 'utilJs/unit'
import  '../assets/pinyinUtil.js'
import store from '../vuex/store'

  export default{
    data () {
      return {
        switName: '销售',
        lists: [],
        listsPX: [],
        resData: [],
        apiUrl: [

         // 121.69.42.34:9089 http://shxh.pms.com
          'http://shxh.pms.com/api/SJFX/GetPreTopSupplierList'
        ],
        editShow: false,
        selectArr: [],
        listsId: [],
        AD: ['A','B','C','D'],
        EH: ['E','F','G','H'],
        IL: ['I','J','K','L'],
        MP: ['M','N','O','P'],
        QU: ['Q','R','S','T','U'],
        VZ: ['V','W','X','Y','Z']
      }
    },   
    props: {
      sortName: String
    },
    watch:{
      $route(val,oldVal){
        if(val.path == '/supplier/supSale'){
          this.switName = '销售'
          this.$els.editIcon.style.top = 4+ 'rem'
        }else if(val.path == '/supplier/supStock'){
          this.switName = '库存'
          this.$els.editIcon.style.top = 2+ 'rem'
        }
      }
    },
    route:{
      data({to,from}){
        this.sortName = '供应商'
      }
    }, 
    ready(){

        this.getNameData({"UserCode": "0"})
    },
    components: {
      tab,
      tabItem
    },
    computed: {
      ADlocation () {
        return this.firstZMIndex(this.AD)
      },      
      EHlocation () {
        return this.firstZMIndex(this.EH)
      },            
      ILlocation () {
        return this.firstZMIndex(this.IL)
      },            
      MPlocation () {
        return this.firstZMIndex(this.MP)
      },            
      QUlocation () {
        return this.firstZMIndex(this.QU)
      },            
      VZlocation () {
        return this.firstZMIndex(this.VZ)
      }        
    },
    events: {
      activeBlue (e) {
        let filChild = this.$els.filterCh.children
        let len = filChild.length
        for(let i=0;i<len;i++){
          filChild[i].className = ''
        } 
        e.target.className = 'activeBlue' 
      }
    },
    methods: {
      triggleswitName (swit) {
        if (swit === '销售') {
          this.switName = '销售'
        } else {
          this.switName = '库存'
        }    
      },
      editGo () {
        this.editShow = true;
        this.$dispatch('display')
        this.selectArr = []
        this.listsId = []
        this.$els.scrollBox.scrollTop = 0

        let filChild = this.$els.filterCh.children
        let len = filChild.length

        for(let i=0;i<len;i++){
          filChild[i].className = ''
        }

        filChild[0].className = 'activeBlue'
      },
      sure (event) {
        
        if(this.selectArr.length > 1){

          this.editShow = !this.editShow;
          this.$dispatch('control')
          event.target.className = ""
          let lis = this.$els.listItem.children
          for(let key in lis){
            if (lis.hasOwnProperty(key)) {
              lis[key].className = ""
            }          
          }

          for(let i=0; i<this.selectArr.length; i++){

            for(let j=0; j<this.lists.length; j++){

              if(this.selectArr[i] == this.lists[j]['value']){

                this.listsId.push(this.lists[j]['key']);            
              }

            }
          }

          store.dispatch('SUPID',{supId: this.listsId})

          this.$broadcast('changeEcharts') 
        }
      },
      getNameData (getProps) {

        let url = this.apiUrl[0]
        //  md5加密
        let md5Obj = setMd5(getProps)
        let sign = md5Obj.sign
        let obj = md5Obj.obj
               
        this.$http.post(`${url}?appkey=123&sign=${sign}`,obj).then((response) => {
          let res = response.body.List
          let resLen = res.length

          let A=[] 
          let B=[] 
          let C=[] 
          let D=[] 
          let E=[] 
          let F=[] 
          let G=[] 
          let H=[] 
          let I=[] 
          let J=[] 
          let K=[] 
          let L=[] 
          let M=[] 
          let N=[] 
          let O=[] 
          let P=[] 
          let Q=[] 
          let R=[] 
          let S=[] 
          let T=[] 
          let U=[] 
          let V=[] 
          let W=[] 
          let X=[] 
          let Y=[] 
          let Z=[] 
          for(let i=0;i<resLen;i++){
          // console.log(res[i]['Value'])  
            this.lists.push({value: res[i]['Value'] + "("+ res[i]['Key'] + ")",key: res[i]['Key']}) 
            let str = pinyinUtil.getFirstLetter(this.lists[i]['value'])

            let re = /[a-zA-Z]/
            let str1 = str.match(re)

            if(str1 == 'A'){
              A.push(this.lists[i]['value'])
            }else if(str1 == 'B'){
              B.push(this.lists[i]['value'])
            }else if(str1 == 'C'){
              C.push(this.lists[i]['value'])
            }else if(str1 == 'D'){
              D.push(this.lists[i]['value'])
            }else if(str1 == 'E'){
              E.push(this.lists[i]['value'])
            }else if(str1 == 'F'){
              F.push(this.lists[i]['value'])
            }else if(str1 == 'G'){
              G.push(this.lists[i]['value'])
            }else if(str1 == 'H'){
              H.push(this.lists[i]['value'])
            }else if(str1 == 'I'){
              I.push(this.lists[i]['value'])
            }else if(str1 == 'J'){
              J.push(this.lists[i]['value'])
            }else if(str1 == 'K'){
              K.push(this.lists[i]['value'])
            }else if(str1 == 'L'){
              L.push(this.lists[i]['value'])
            }else if(str1 == 'M'){
              M.push(this.lists[i]['value'])
            }else if(str1 == 'N'){
              N.push(this.lists[i]['value'])
            }else if(str1 == 'O'){
              O.push(this.lists[i]['value'])
            }else if(str1 == 'P'){
              P.push(this.lists[i]['value'])
            }else if(str1 == 'Q'){
              Q.push(this.lists[i]['value'])
            }else if(str1 == 'R'){
              R.push(this.lists[i]['value'])
            }else if(str1 == 'S'){
              S.push(this.lists[i]['value'])
            }else if(str1 == 'T'){
              T.push(this.lists[i]['value'])
            }else if(str1 == 'U'){
              U.push(this.lists[i]['value'])
            }else if(str1 == 'V'){
              V.push(this.lists[i]['value'])
            }else if(str1 == 'W'){
              W.push(this.lists[i]['value'])
            }else if(str1 == 'X'){
              X.push(this.lists[i]['value'])
            }else if(str1 == 'Y'){
              Y.push(this.lists[i]['value'])
            }else if(str1 == 'Z'){
              Z.push(this.lists[i]['value'])
            }                    
          }  
          this.listsPX = A.concat(B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z)
          // console.log(this.listsPX)
        })
      },
      firstZMIndex (firstZM) {

        let strArr = []

        for(let i= 0;i<this.lists.length; i++){

          let str = pinyinUtil.getFirstLetter(this.listsPX[i])
          let re = /[a-zA-Z]/
          let str1 = str.match(re)
          str1 = str1 + ''
          strArr.push(str1)
        }

        // 先判断是否有A,E,I,M,Q,V开头的供应商名称      
        if(strArr.indexOf(firstZM[0]) >= 0){
          return strArr.indexOf(firstZM[0])
        }else if(strArr.indexOf(firstZM[1]) >= 0){
          return strArr.indexOf(firstZM[1])
        }else if(strArr.indexOf(firstZM[2]) >= 0){
          return strArr.indexOf(firstZM[2])
        }else if(strArr.indexOf(firstZM[3]) >= 0){
          return strArr.indexOf(firstZM[3])
        }else{
          return strArr.indexOf(firstZM[firstZM[length-1]])
        }          
      },
      scrollDistance (n) {

        let distance = this.$els.listItem.children[n].offsetTop - 10

        this.$els.scrollBox.scrollTop = distance      
      },
      AD_event (event) { 

        this.scrollDistance(this.ADlocation)

        this.$emit('activeBlue', event)  
      },
      EH_event (event) { 

        this.scrollDistance(this.EHlocation)

        this.$emit('activeBlue', event)  
      },
      IL_event (event) { 

         this.scrollDistance(this.ILlocation)
       
         this.$emit('activeBlue', event)  
      },
      MP_event (event) { 

        this.scrollDistance(this.MPlocation)

        this.$emit('activeBlue', event)  
      },
      QU_event (event) { 

        this.scrollDistance(this.QUlocation)

        this.$emit('activeBlue', event)  
      },
      VZ_event (event) { 

        this.scrollDistance(this.VZlocation)

        this.$emit('activeBlue', event)  
      },
      selectEvent($index){
        let _this = this.$els.listItem.children[$index];
        let _innerHtml = _this.children[0].children[0].innerHTML;

        if(_this.className == 'selected'){

          _this.className = '';
          this.selectArr.$remove(_innerHtml);

        }else if(_this.className == ''){

          if(this.selectArr.length > 7){
            alert('您最多选择8项内容');
            return this.selectArr
          }else{
            _this.className = 'selected'
            this.selectArr.push(_innerHtml);            
          }

        }
        if(this.selectArr.length > 1){
          this.$els.sure.className = 'sureBg'
        }else{
          this.$els.sure.className = ''
        }
        return this.selectArr            
      },
      cancelBtn() {
        this.editShow = !this.editShow;
        this.$dispatch('control')
        // this.selectArr = []

        let lis = this.$els.listItem.children
        for(let key in lis){
          if (lis.hasOwnProperty(key)) {
            lis[key].className = ""
          }
        } 
      }
    }    
  }
</script>
<style lang="scss" scoped>
@import '../css/myMixin/vars.scss';
@import '../css/myMixin/onePX.scss';

  .filterBtn{
    @include onePX($bor_e0);
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    height: 34px;
    line-height: 34px;
    padding: 0 0.75rem; 
    background-color: $cor_f8; 
    color: $fs_999;
    font-size: 14px;
    display: flex;
    span{
      flex: 1 1 20%;  
      text-align: center;
      &:first-child{
        text-align: left;
      }      
      &:last-child{
        text-align: right;
      }    
    }
  }
  .activeBlue{
    color: $cor_389;
  }
  .options{
    width: 100%;
    padding: 0 0.75rem;
    top: 74px;    
    position: absolute;
    bottom: 0;
    padding-top: 10px;
    overflow-y: auto;  
  }
</style>