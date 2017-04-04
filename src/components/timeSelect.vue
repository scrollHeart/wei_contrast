<template>
    <div class="timeSelect">
        <div class="fixedBox">
            <p class="prev" @click="prev">
                <i class="icon-prev"></i>
                <span>上一月</span>
            </p>
            <group class="dateMadel">
                <i class="icon-date"></i>
                <datetime :value.sync="time" format="YYYY-MM" :min-year="2015" :max-year="maxYear" v-ref:dataTime1 title="" ></datetime>
                <i class="icon-arrow"></i>
            </group>
             <p class="next" @click="next">
                <span>下一月</span>
                <i class="icon-next"></i>
            </p>
        </div>
    </div>
</template>
<script>
import Datetime from 'vux/dist/components/datetime'
import Group from 'vux/dist/components/group'
export default {
  components: {
    Datetime,
    Group
  },
  props: {
    time: String
  },
  methods: {
    prev () {
      var month = Number((this.$refs.datatime1.value).substr(5))
      var year = Number((this.$refs.datatime1.value).substr(0,4))

      if(this.time == '2015-01'){

      }else{
        
        if(month == 1){
            month = 12
            year -=1
        }else{
            month -=1
        }
        if(month<10){
            month = '0' + month
        }
        this.$refs.datatime1.value = year + '-' + month;
      }
    },
    next () {

        var month = Number((this.$refs.datatime1.value).substr(5))
        var year = Number((this.$refs.datatime1.value).substr(0,4))
        
        let date = new Date()
        let y = date.getFullYear();
        let m = date.getMonth() + 1

        if(m<10){

            m = '0' + m
        }
        let ym = y + '-' + m

        if(this.time == ym){

        }else{

          if(month == 12){
              month = 1
              year +=1
          }else{
              month +=1
          }
          if(month<10){
              month = '0' + month
          }
          this.$refs.datatime1.value = year + '-' + month;
        }

    }
  },
  computed:{
    maxYear(){
      let date = new Date()
      let y = date.getFullYear()
      return y
    }
  }
}
</script>
 <style lang="scss">
    @import '../css/myMixin/vars.scss';
    .timeSelect{
        height: 2rem;
        line-height: 2rem;
        position: absolute;
        top: 2rem;
        z-index: 2;
        width: 100%;
        .fixedBox{
            border-bottom: 1px solid $bor_e0;
            height: 2rem;
            line-height: 2rem;
            padding: 0 0.75rem;
            display: flex;
            justify-content: space-between;
            background-color: $fs_fff;
            font-size: 14px;
        }
        .prev,
        .next{
            height: 2rem;
            line-height: 2rem;
            color: $fs_444;
            i:before{
                font: 16px iconfont;
                vertical-align: middle;
            }
            span{
                display: inline-block;
                vertical-align: middle;
            }
        }
        .prev{
            i:before{
                content: '\e61d';
            }
        }
        .next{
            i:before{
                content: '\e636';
            }
        }
        .dateMadel{
            height: 1.9rem;
            line-height: 1,9rem;
            display: flex;
            .icon-date{
                position: relative;
                color: $fs_444;
            }
            .icon-date{
                left: 26px;
                line-height: 1.9rem;
            }
            .icon-date:before{
                display: inline-block;
                content: '\e62e';
                font: 18px/36px iconfont;
            }
            .icon-arrow{
                position: relative;
                right: 24px;
                line-height: 1.9rem;
            }
            .icon-arrow:before{
                display: inline-block;
                margin-top: -2px;
                content: '\e644';
                font: 14px iconfont;
            }
        }
    }
    .weui_cells:before,
    .weui_cell:before,
    .weui_cells:after{
        display: none!important;
    }
   .dateMadel .vux-no-group-title{
        margin-top: 0!important;
        display: flex;
    }
    .weui_cell_ft.with_arrow{
        text-align: center!important;
        font-size: 14px;
        color: $fs_444;
    }
   .weui_cell_ft.with_arrow:after{
    display: none!important;
  }
  .weui_cell{
      padding: 0 30px;
  }
  .weui_cells{
    background-color:$fs_fff!important;
  }

</style>
