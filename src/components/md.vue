<template>
  <div class="tab">
    <tab class="normalTab" :animate="false" >  
      <tab-item v-link="{path: 'mdSale'}" :selected="switName === '销售'"  @click="triggleswitName('销售')">销售</tab-item>        
      <tab-item v-link="{path: 'mdStock'}" :selected="switName === '库存'" @click="triggleswitName('库存')">库存</tab-item>       
    </tab>
  </div>
  <router-view></router-view>
  <span class="editBtn" v-el:edit-icon @click="editGo">
    <i class="edit-icon"></i>
    <i class="edit-txt">选择门店</i>
  </span>
  <div class="wrap edit" :class="{'edit-enter': editShow,'edit-leave': !editShow}">
    <div class="prompt">
      <div>
        <span class="cancelBtn" @click="cancelBtn"></span>
        选择门店（最少2个，最多8个）
        <button v-el:sure  @click="sure" :change-echarts="sure">确认</button>
      </div>
    </div>
    <section class="options">
      <div class="con" v-el:list-item>
        <div>A级</div>
        <ul>
          <li v-for="list in listsA" @click="selectEvent($event)" track-by="$index">
            <div class="scale-border ">
                <div class="content">{{ list }}</div>
                <div class="border border-color"></div>
            </div> 
          </li>
        </ul>
        <div>B级</div>
        <ul>
          <li v-for="list in listsB" @click="selectEvent($event)" track-by="$index">
            <div class="scale-border ">
                <div class="content">{{ list }}</div>
                <div class="border border-color"></div>
            </div> 
          </li>
        </ul>
        <div>C级</div>
        <ul>
          <li v-for="list in listsC" @click="selectEvent($event)" track-by="$index">
            <div class="scale-border ">
                <div class="content">{{ list }}</div>
                <div class="border border-color"></div>
            </div> 
          </li>
        </ul>
        <div>D级</div>
        <ul>
          <li v-for="list in listsD" @click="selectEvent($event)" track-by="$index">
            <div class="scale-border ">
                <div class="content">{{ list }}</div>
                <div class="border border-color"></div>
            </div> 
          </li>
        </ul>      
        <div>E级</div>
        <ul>
          <li v-for="list in listsE" @click="selectEvent($event)" track-by="$index">
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
import store from '../vuex/store'
import { getUserCode, getApiUrl2 } from '../vuex/getters'
  export default{
    data () {
      return {
        switName: '销售',
        lists: [],
        // listsId（储存用户选中的名称和id对象）
        listsId: [],
        listsA: [],
        listsB: [],
        listsC: [],
        listsD: [],
        listsE: [],
        // editShow(控制选择页面的显示与隐藏)
        editShow: false,
        // apiUrl: [
        // // C_01 121.69.42.34:9089 http://shxh.pms.com http://pms.bookmall.com.cn
        //   this.ApiUrl2 + '/api/SJFX/GetMdList'
        // ],
        // selectArr(储存用户选中的门店名称)
        selectArr: []
      }
    },
    props: {
      // sortName 和父组件的sortName是双向绑定的
      sortName: String     
    },
    vuex:{
      getters:{
        UserCode: getUserCode,
        ApiUrl2: getApiUrl2
      }
    },
    watch:{
      $route(val,oldVal){
        if(val.path == '/md/mdSale'){
          this.switName = '销售'
          this.$els.editIcon.style.top = 4+ 'rem'
        }else if(val.path == '/md/mdStock'){
          this.switName = '库存'
          this.$els.editIcon.style.top = 2+ 'rem'
        }
      }
    },
    route:{
      data({to,from}){

        this.sortName = '门店'      
      }    
    }, 
    ready(){
      this.getNameData({"UserCode": this.UserCode})
      console.log(this.apiUrl)
    },
    computed:{
      apiUrl(){
        return this.ApiUrl2 + '/api/SJFX/GetMdList'
      }
    },
    components: {
      tab,
      tabItem
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
        let lis = this.$els.listItem.getElementsByTagName('li')

        for(let key in lis){
          if (lis.hasOwnProperty(key)) {
            lis[key].className = ""
          }
        }      
      },
      sure () {
        // 用户选中至少2个，才执行确认操作，编辑页面消失
        if(this.selectArr.length > 1){

          this.editShow = !this.editShow;
          this.$dispatch('control')
          event.target.className = ""

          let lis = this.$els.listItem.getElementsByTagName('li')
          for(let key in lis){
            if (lis.hasOwnProperty(key)) {
              lis[key].className = ""
            }
          }

          for(let i=0; i<this.selectArr.length; i++){

            for(let j=0; j<this.lists.length; j++){

              if(this.selectArr[i] == this.lists[j]['Value']){

                this.listsId.push(this.lists[j]['Key']);            
              }
            }
          }

          store.dispatch('MDID',{mdId: this.listsId})

        // 广播changeEcharts到对应销售和库存路由，数据重新渲染
          this.$broadcast('changeEcharts') 
        }
      },
      getNameData (getProps) {

        let url = this.apiUrl
        //  md5加密
        let md5Obj = setMd5(getProps)
        let sign = md5Obj.sign
        let obj = md5Obj.obj
         // 请求门店名称数据      
        this.$http.post(`${url}?appkey=123&sign=${sign}`,obj).then((response) => {
          let res = response.body.List
          let resLen = res.length
          for(let i=0;i<resLen;i++){

            if(res[i]['Leve'] == 'A'){
              this.listsA.push(res[i]['Value'])
            }else if(res[i]['Leve'] == 'B'){
              this.listsB.push(res[i]['Value'])
            }else if(res[i]['Leve'] == 'C'){
              this.listsC.push(res[i]['Value'])
            }else if(res[i]['Leve'] == 'D'){
              this.listsD.push(res[i]['Value'])
            }else if(res[i]['Leve'] == 'E'){
              this.listsE.push(res[i]['Value'])
            } 
          }

          this.lists = res
          console.log(res)

          return this.lists

        })
      },
      selectEvent(event) {

        let _innerHtml = ''
        if(event.target.className == 'content'){
          _innerHtml = event.target.innerHTML;
        }else {
          _innerHtml = event.target.parentNode.children[0].innerHTML;
        }
        let li = event.target.parentNode.parentNode
        if(li.className == 'selected'){

          li.className = '';
          // this.selectArr.$remove(_innerHtml);

        }else if(li.className == ''){

          if(this.selectArr.length > 7){
            alert('您最多选择8项内容');
            return this.selectArr
          }else{
            li.className = 'selected'
            this.selectArr.push(_innerHtml)
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

        let lis = this.$els.listItem.getElementsByTagName('li')
        for(let key in lis){
          if (lis.hasOwnProperty(key)) {
            lis[key].className = ""
          }
        } 
      }    
    }  
  }
</script>
<style lang="scss">
  @import '../css/myMixin/vars.scss';
  @import '../css/myMixin/_onePXBorder.scss';
  @import '../css/myMixin/onePX.scss';

  .editBtn{
    position: absolute;
    top: 4rem;
    right: 0.75rem;    
    height: 34px;
    line-height: 34px;
    color: $cor_389;
    z-index: 100;   
    .edit-icon:before{
      content: '\e687';
      font: 15px iconfont;
    }
    .edit-txt{
      font-size: 14px;
    }
  }
  .edit{
    width: 100%;
    height: 100%;            
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
    -webkit-transform: translate3d(100%,0,0);
    transform: translate3d(100%,0,0);  
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
    background-color: #fff;
  }
  .edit-enter{
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);  
  }   
  .edit-leave{
    -webkit-transform: translate3d(100%,0,0);
    transform: translate3d(100%,0,0);    
  }
  .prompt{
    font-size: 14px;
    width: 100%;
    height: 40px;
    line-height: 40px; 
    color: $cor_389;
    padding: 0 0.75rem 0 0;
    @include onePX($bor_e0);
    position: absolute;
    .cancelBtn{
      display: inline-block;
      width: 40px;
      text-align: center;
      color: $cor_ccc;
      &:before{
        content: '\e616';
        font: 16px iconfont;
      }
    }
    button{
      display: inline-block;
      outline: none;
      border: none;
      width: 46px;
      height: 24px;
      line-height: 24px;      
      border-radius: 4px;
      color: $fs_fff;
      position: absolute;
      right: 20px;
      top: 8px;
      background-color: $cor_ccc;
    }
  }
  .options{
    width: 100%;
    padding: 0 0.75rem;
    top: 40px;
    position: absolute;
    bottom: 0;
    overflow-y: auto; 
    -webkit-overflow-scrolling: touch;
    padding-top: 15px; 
  }
  .con{
    >div{
      margin-bottom: 10px;      
      color: #999;    
    }
    ul{
      width: 100%;
      li{
        display: inline-block;
        width: 30%;
        height: 26px;
        @include onePXBorder ('.scale-border','.content','.border',4px,$bor_bbb,$bgc_f4);
        margin-bottom: 15px;
        text-align: center;
        line-height: 26px;
        color: $fs_444;
        a:active,
        a:visited{
          background-color: $cor_389;
        }
        .content{
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;        
        }
      }
      li:nth-child(3n-1){
        margin: 0 5%;
      }
    }
  }
  .selected{
    color: $fs_fff!important;
    .border{
      background-color: $cor_389!important;
      border-color: #389bff!important;
    }
  }
  .sureBg{
    background-color: $cor_389!important;
  }
</style>

