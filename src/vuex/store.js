import Vue from 'vue'
import Vuex from 'vuex'
import {
    setDate,
    getStartTime,
    getEndTime,
    setMd5
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
    timeShow: true,
    mdId: ["03280", "03289"],
    supId: ["S1572", "S1263"],
    claId: ["I", "P"]
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