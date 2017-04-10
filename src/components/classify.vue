<template>
  <div class="tab">
    <tab class="normalTab" :animate="false" >  
      <tab-item v-link="{path: 'claSale'}" :selected="switName === '销售'" @click="triggleswitName('销售')">销售</tab-item>        
      <tab-item v-link="{path: 'claStock'}" :selected="switName === '库存'" @click="triggleswitName('库存')">库存</tab-item>       
    </tab>
  </div>
  <router-view></router-view>
  <span class="editBtn" v-el:edit-icon @click="editGo">
    <i class="edit-icon"></i>
    <i class="edit-txt">选择分类</i>
  </span>  
  <div class="wrap edit" :class="{'edit-enter': editShow,'edit-leave': !editShow}">
    <div class="prompt">
      <span class="cancelBtn" @click="cancelBtn"></span>
      选择分类（最少2个，最多8个）     
      <button v-el:sure  @click="sure">确认</button>
    </div>
    <section class="options">
      <div class="con">
        <ul v-el:list-item>
          <li v-for="list in lists" @click="selectEvent($index)">
            <div class="scale-border ">
                <div class="content">{{ list['value'] }}</div>
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

  export default{
    data () {
      return {
        switName: '销售',
        lists: [],
        apiUrl: [
        // C_03 200.1.3.89:1209 shda.91onix.com
          'http://shda.bookmall.com.cn/App/AppCommon/GetFirstSaleClassify'
        ],        
        editShow: false,
        selectArr: [],
        listsId: []
      }
    },
    props: {
      sortName: String
    },
    ready(){
      this.getNameData()
    },
    watch:{
      $route(val,oldVal){
        if(val.path == '/classify/claSale'){
          this.switName = '销售'
          this.$els.editIcon.style.top = 4+ 'rem'
        }else if(val.path == '/classify/claStock'){
          this.switName = '库存'
          this.$els.editIcon.style.top = 2+ 'rem'
        }
      }
    },
    route:{
      data({to,from}){
        this.sortName = '分类'
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
        for(let i = 0; i<lis.length; i++){

          lis[i].className = ''
        }      
      },
      sure () {
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

          store.dispatch('CLAID',{claId: this.listsId})
          
          this.$broadcast('changeEcharts') 
        }
      },
      getNameData (getProps) {

        let url = this.apiUrl[0]
        //  md5加密
        let md5Obj = setMd5(getProps)
        let sign = md5Obj.sign
        let obj = md5Obj.obj
               
        this.$http.get(`${url}?appkey=123&sign=${sign}`,obj).then((response) => {

          let res = response.body.List
          let resLen = res.length
          for(let i=0;i<resLen;i++){
            this.lists.push({key: res[i]['Key'],value: res[i]['Value']})              
          }
          return this.lists
        })
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