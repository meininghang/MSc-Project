import {getDataByGW, getItemMeta, getOrders, } from "arseeding-js";
import {chainStatus, paymentStatus} from '@/utils/constant/chainConst'
import {reportUrl, adotArUrl} from '@/utils/constant/apiConst'
import {getFileSize} from '@/utils/util'
import moment from 'moment'
import Everpay from 'everpay'
import axios from "axios";
const everpay = new Everpay()


const ajaxAdot = axios.create({
    baseURL: adotArUrl,
    headers: {
        'Adot-Token': '213dfs56a1f2da54f2as5f1215',
        'Content-Type': 'application/json'
    }
})


export default {
    namespaced: true,
    state: {
        orderList: [],
        txInfo: {}
    },
    getters: {
        /**
         * Serialize all the list information,
         * @param state
         * @returns {*[]}
         */
        getAllOrder(state) {
            return state.orderList.map(item => {
                if (item.createdAt || item.updatedAt) {
                    item.time = item.updatedAt ? item.createdAt.slice(0, 10) : item.updatedAt.slice(0, 10)
                } else {
                    item.time = ''
                }
                if (item.metaInfo && item.metaInfo.tags && item.metaInfo.tags.length !== 0) {
                    const list = item.metaInfo.tags.filter(item => item.name && (item.name.toUpperCase() === 'name'.toUpperCase() || item.name.toUpperCase() === 'fileName'.toUpperCase()))
                    const typeList = item.metaInfo.tags.filter(item => item.name && (item.name.toUpperCase() === 'Content-Type'.toUpperCase() || item.name.toUpperCase() === 'type'.toUpperCase()))
                    item.fileName = list && list.length !==0 ? list[0].value : item.id
                    item.fileType = typeList && typeList.length !==0 ? typeList[0].value : ''
                    item.tags = item.metaInfo.tags
                } else {
                    item.fileName = item.id
                    item.fileType = ''
                    item.tags = []
                }
                item.showButton = false
                item.fileSize = getFileSize(item.size)
                return item
            })
        },
        getOrders(state) {
            return state.orderList.map(item => {
                if (item.createdAt || item.updatedAt) {
                    item.time = item.updatedAt ? item.createdAt.slice(0, 10) : item.updatedAt.slice(0, 10)
                } else {
                    item.time = '--'
                }
                // item.time = item.updatedAt ? item.createdAt.slice(0, 10) : item.updatedAt.slice(0, 10)
                // item.fileName = ''
                item.fileType = ''
                item.tags = []
                item.showButton = false
                item.fileSize = getFileSize(item.size)
                return item
            })
        },
        getPublishOrders(state) {
            if (state.orderList && state.orderList.length !== 0) {
                return state.orderList.filter(item => item.onChainStatus === chainStatus.SUCCESS || item.onChainStatus === chainStatus.PENDING)
            }
            return []
        },
        txInfoByHash(state) {
            return {
                ...state.txInfo,
                // timeStampStr: moment(state.txInfo.timestamp).format('MMM.D.YYYY  HH:mm:SS  A')
                timeStampStr: moment(state.txInfo.timestamp).format('YYYY.MM.D  HH:mm:SS  A')
            }
        }
    },
    mutations: {
        ORDER_LIST(state, order) {
            state.orderList = order
        },
        GET_TX_INFO_BY_HASH(state, tx) {
            state.txInfo = tx
        },
        ORDERS(state, order) {
            state.orderList = order
        }
    },
    actions: {
        async getOrderList({commit}, account) {
            let list = []
            let orders = await getOrders(reportUrl, account)
            // commit('ORDER_LIST', orders)
            for (let i = 0; i < orders.length; i++) {
                if (orders[i].paymentStatus !== paymentStatus.EXPIRED) {
                    orders[i].metaInfo = await getItemMeta(reportUrl, orders[i].itemId)
                    list.push(orders[i])
                } else {
                    orders[i].metaInfo = {}
                    list.push(orders[i])
                }
            }
            Promise.all(list).then(() => {
                commit('ORDER_LIST', list)
            })
        },
        async getOrders({ commit }, account) {
            let orders = await getOrders(reportUrl, account)
            commit('ORDERS', orders)
            return orders
        },
        // eslint-disable-next-line no-empty-pattern
        getItemMeta({}, id) {
            return getItemMeta(reportUrl, id)
        },
        // eslint-disable-next-line no-empty-pattern
        getOrderDetail({}, id) {
            return getDataByGW(reportUrl, id)
        },
        /**
         * Transactions paid for on everpay
         * @param commit
         * @param id
         * @returns {Promise<void>}
         */
        async getTxByHash({commit}, id) {
            const info = await everpay.txByHash(id)
            commit('GET_TX_INFO_BY_HASH', info)
            return info
        },
        // eslint-disable-next-line no-empty-pattern
        async searchArweave({}, param) {
            const { data } = await ajaxAdot.post('/arweave/search/test', param)
            return data
        }
    }
}