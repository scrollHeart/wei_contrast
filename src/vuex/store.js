import Vue from 'vue'
import Vuex from 'vuex'
import {
    setDate,
    getStartTime,
    getEndTime,
    setMd5,
    nowMonth
} from 'utilJs/unit'

// 告诉 vue “使用” vuex
Vue.use(Vuex)

// 创建一个对象来保存应用启动时的初始状态
const state = {
    // TODO: 放置初始状态
    show: false,
    error: false,
    StartTime: getStartTime(setDate(false)),
    EndTime: getEndTime(setDate(false)),
    nowMonth: nowMonth(),
    selMonth: parseInt(setDate().substr(0, 4) + setDate().substr(5, 2)),
    timeShow: true,
    mdId: ["03280", "03289"],
    supId: ["S1572", "S1263"],
    claId: ["I", "P"],
    UserCode: window.localStorage.getItem('userId'),
    // 200.1.3.89:1209 shda.91onix.com http://shda.bookmall.com.cn
    apiUrl1: 'http://shda.bookmall.com.cn',
    // 121.69.42.34:9089 http://shxh.pms.com http://pms.bookmall.com.cn
    apiUrl2: 'http://pms.bookmall.com.cn'
}

// 创建一个对象存储一系列我们接下来要写的 mutation 函数
const mutations = {
    // TODO: 放置我们的状态变更函数
    LOADING(state, payload) {
        state.show = payload.show
    },
    ERROR(state, payload) {
        state.error = payload.error
    },
    STARTTIME(state, payload) {
        state.StartTime = payload.StartTime
    },
    ENDTIME(state, payload) {
        state.EndTime = payload.EndTime
    },
    NOWMONTH(state, payload) {
        state.nowMonth = payload.nowMonth
    },
    SELMONTH(state, payload) {
        state.selMonth = payload.selMonth
    },
    TIMESHOW(state, payload) {
        state.timeShow = payload.timeShow
    },
    MDID(state, payload) {
        state.mdId = payload.mdId
    },
    SUPID(state, payload) {
        state.supId = payload.supId
    },
    CLAID(state, payload) {
        state.claId = payload.claId
    }
}


export default new Vuex.Store({
    state,
    mutations
})