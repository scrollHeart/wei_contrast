<template>
  <div class="wrap">
    <time-select :time.sync="time" v-if="timeShow" v-el:time-select></time-select> 
   <router-view  v-on:display="displayFoot" v-on:control="showFoot" v-on:change-time="change" :sort-name.sync="sortName" keep-alive></router-view>
    <div class="footBox" v-el:footer>
      <tabbar slot="bottom">
        <tabbar-item v-link="{ path: '/' }" :selected="sortName === '门店'" @click="triggleSortName('门店')">
          <span slot="icon" class="icon md"></span>
          <span slot="label">门店</span>
        </tabbar-item>
        <tabbar-item v-link="{ path: '/supplier' }" :selected="sortName === '供应商'" @click="triggleSortName('供应商')">
          <span slot="icon" class="icon supplier"></span>
          <span slot="label">供应商</span>
        </tabbar-item>
        <tabbar-item v-link="{ path: '/classify' }" :selected="sortName === '分类'" @click="triggleSortName('分类')">
          <span slot="icon" class="icon classify"></span>
          <span slot="label">分类</span>
        </tabbar-item>
      </tabbar>
    </div>
    <div class="loadingWrap" v-if="show" :transition="fade">
      <load v-if="show"></load> 
    </div>
    <div class="errorWrap" v-if="error">
      <div>     
        <img src="assets/dataError.png">
        <span>数据请求失败，请重新刷新页面</span> 
        <span class="refreshBtn" @click="refresh">点击刷新</span>     
      </div>
    </div>
  </div>
</template>

<script>

import Tabbar from 'vuxModule/tabbar'
import TabbarItem from 'vuxModule/tabbar-item'
import Group from 'vuxModule/group'
import store from './vuex/store'
import TimeSelect from 'components/timeSelect'
import Load from 'components/loading'
import { setDate, getStartTime, getEndTime, setMd5 } from 'utilJs/unit'
import {getShow, getError, getTimeShow} from './vuex/getters'

export default {
  data () {
    return {
      sortName: '门店',
      time: setDate(false)
    }
  },
  components: {
    Tabbar,
    TabbarItem,
    TimeSelect,
    Load
  },
  store,
  vuex: {
    getters:{
      show: getShow,
      error: getError,
      timeShow: getTimeShow
    }  
  },
  computed: {
    StartTime() {
      let date = getStartTime(this.time)

      return date
    },
    EndTime() {

      let date = getEndTime(this.time)

      return date
    },
    ymN() {

      let date = new Date()
      let y = date.getFullYear();
      let m = date.getMonth() + 1

      if(m<10){

          m = '0' + m
      }
      let ym = y + m
      let ymN = parseInt(ym)
      return ymN
    }
  },
  watch: {
    time(val, oldVal) {
      store.dispatch('STARTTIME', {
        StartTime: this.StartTime
      })
      store.dispatch('ENDTIME', {
        EndTime: this.EndTime
      })

      let corNext = this.$els.timeSelect.getElementsByClassName('next')[0]
      let corPrev = this.$els.timeSelect.getElementsByClassName('prev')[0]

      // 当前时间（如2016-09）转换成数字类型，和所选时间进行比较

      let valN = parseInt(val.substr(0,4) + val.substr(5,2))

      // 判断所选时间是否大于当前月份，是则不再请求数据，否则继续请求，同时界面显示暂无数据
      if(valN >= this.ymN){

        corNext.style.color = '#ddd'

        this.$broadcast('noData')

        
      }else{

      // 监测时间变化，重新请求数据，渲染页面,下一月按钮置灰

        corNext.style.color = '#444'

        this.$broadcast('changeTime')
      }
      // 当时间大于2015-01 则上一月按钮高亮，否则置灰
      if(val == '2015-01'){

        corPrev.style.color = '#ddd'
      }else{
        corPrev.style.color = '#444'
      }     
    } 
  },
  methods: {
    // tab分类切换
    triggleSortName(sort) {
      if (sort === '门店') {
        this.sortName = '门店'

      } else if (sort === '供应商') {
        this.sortName = '供应商'
      } else {
        this.sortName = '分类'
      }
    },
    displayFoot () {
    // 点击选择按钮时派发display事件到根组件的displayFoot,控制底部菜单隐藏
      this.$els.footer.style.display = 'none';
    },
    showFoot () {
    //点击确认按钮时派发control事件到根组件showFoot，控制底部菜单显示
      this.$els.footer.style.display = 'block';
    },
    refresh(){
      location.reload();
    }  
  }
}
</script>

<style lang='scss'>
  @import './css/myMixin/vars.scss';
  @import './css/myMixin/reset.scss';
  @import '~vux/dist/vux.css';
  @import './css/myMixin/onePX.scss';
  @import './css/myMixin/_onePXBorder.scss';
  @import './css/myMixin/myFoot.scss';

  @font-face {
    font-family: 'iconfont';  /* project id 211629 */
    src: url('http://at.alicdn.com/t/font_12orcmwvcxr.eot');
    src: url('http://at.alicdn.com/t/font_12orcmwvcxr.eot?#iefix') format('embedded-opentype'),
    url('http://at.alicdn.com/t/font_12orcmwvcxr.woff') format('woff'),
    url('http://at.alicdn.com/t/font_12orcmwvcxr.ttf') format('truetype'),
    url('http://at.alicdn.com/t/font_12orcmwvcxr.svg#iconfont') format('svg');
  }
  html,
  body{
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  body{
    font-family: "Helvetica", "Tahoma", "Arial", "Hiragino Sans GB", "冬青黑体", "Microsoft YaHei", "微软雅黑", "STXihei", "华文细黑", "SimSun", "宋体", "Heiti", "黑体", "sans-serif";
    overflow: hidden;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  #contrast{
    height: 100%;
    position: relative;
  }
  .wrap{
      height: 100%;
      position: relative;
  }
  /* 修改tab切换的样式 */
  .weui_tab_bd{
      overflow-x: hidden!important;
  }
  .vux-tab{
    height: 2rem;
  }
  .vux-tab-selected{
    color: $cor_389!important;
  }
  .vux-tab .vux-tab-item{
    background: none!important;
    height: 2rem;
    line-height: 2rem !important;
    font-size: 16px;
    border-bottom: 1px solid transparent!important;
  }
  .vux-tab .vux-tab-item.vux-tab-selected {
    color: $cor_389;     
    border-bottom: 1px solid $cor_389!important;
  }
  .tab{
      @include onePX ($bor_e0);
  }
  .tab{
    padding: 0 0.75rem;
  }
  .vux-tab .vux-tab-item{
    color: $fs_444;
  }
.loadingWrap{
    width: 100%;
    top: 0;
    left: 0;
    height: 100%;
    background-color: rgba(0,0,0,0.3);
    position: absolute;
    z-index: 100;
}
.errorWrap{
  width: 100%;
  top: 0;
  left: 0;
  height: 100%;
  background-color: $fs_fff;
  position: absolute;
  z-index: 100;
  font-size: 14px;
  color:  $fs_d1;
  display: flex;
  justify-content: center;  
  align-items: center;
  img{
    display: block;
    margin: 0 auto 20px;
  }
}
/* 加载页面动画 */
.fade-transition{
  transition: all .3s ease;
  opacity: 1;
}
.fade-enter,
.fade-leave{
  opacity: 0;
}
.refreshBtn{
  width: 60px;
  height: 22px;
  line-height: 22px;
  border-radius: 5px;
  color: $fs_fff;
  background-color: $cor_389;
  font-size: 12px;
  display: block;
  text-align: center;
  margin: 10px auto 0;
}
</style>
