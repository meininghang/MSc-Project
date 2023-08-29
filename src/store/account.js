import {providers} from "ethers";
import getCurrency from "bundlr-arseeding-client/build/web/currencies";
// import {sign} from "arseeding-arbundles/src/ar-data-bundle";
import Everpay from 'everpay'
import axios from 'axios'
import {redstoneUrl, web3infuraIoUrl} from '@/utils/constant/apiConst'
// import {genAPI} from "arseeding-js";
const everpay = new Everpay()


const ajax = axios.create({
    baseURL: redstoneUrl
})
const ajaxIo = axios.create({
    baseURL: web3infuraIoUrl
})

export default {
    namespaced: true,
    state: {
        accountInfo: null,
        signer: null,
        instance: null,
        symbol: null,
        selectedSymbol: null,
        balance: null,
        tokenBalance: null
    },
    getters: {
        account(state) {
            if (!state.accountInfo) {
                return sessionStorage.getItem('ACCOUNT_STRING') || ''
            }
            if(state.accountInfo && state.accountInfo.length !== 0) {
                sessionStorage.setItem('ACCOUNT_STRING', state.accountInfo)
                return state.accountInfo
            }
            return ''
        },
        symbolList(state) {
            if (state.symbol && state.symbol.length !== 0) {
                return state.symbol.map((item) => {
                    // item.value = (`${item.id}-${index}`).toString()
                    item.label = item.symbol
                    item.value = item.symbol
                    return item
                })
            } else {
                return []
            }
        },
        selectedSymbol(state) {
            return state.selectedSymbol
        },
        balance(state) {
            return state.balance
        }
    },
    mutations: {
        METE_MASK_ACCOUNT(state, account) {
            state.accountInfo = account
        },
        SIGNER_INFO(state, signer) {
            state.signer = signer
        },
        SYMBOL_LIST_INFO(state, symbol) {
            state.symbol = symbol
        },
        GET_BALANCE(state, balance) {
            state.balance = balance
        },
        TOKEN_BALANCE(state, tokenBalance) {
            state.tokenBalance = tokenBalance
        }
    },
    actions: {
        async getMetaMaskAccount({commit}) {
            await window.ethereum.enable()
            // const instance = await genAPI(window.ethereum)
            const provider = new providers.Web3Provider(window.ethereum)
            await provider._ready()
            const accounts = await provider.listAccounts()
            console.log("getCurrency")
            const currencyConfig = getCurrency('ethereum', provider)
            await currencyConfig.ready()
            console.log(currencyConfig)
            const signer = await currencyConfig.getSigner()
            // commit('METE_MASK_ACCOUNT', accounts)
            commit('SIGNER_INFO', signer)
            // commit('INSTANCE_INFO', instance)
            return accounts
        },
        async getNewMetaMaskAccount({commit}) {
            const account = await window.ethereum.request({method: 'eth_requestAccounts'})
            commit('METE_MASK_ACCOUNT', account[0])
            return account[0]
        },
        // eslint-disable-next-line no-empty-pattern
        async getAccountBalances({commit}, accountId) {
            const result = await everpay.balances({account: accountId})
            commit('TOKEN_BALANCE', result)
            return result
        },
        async getAccountInfo({commit}) {
            const info = await everpay.info()
            const symbols = info.tokenList
            commit('SYMBOL_LIST_INFO', symbols)
            return symbols
        },
        async updateSelectSymbol({commit}, symbol) {
            const balance = await everpay.balance({
                symbol: symbol,
                account: window.ethereum.selectedAddress
            })
            commit('GET_BALANCE', balance)
            return balance
        },
        // eslint-disable-next-line no-empty-pattern
        getAllSymbolPrice({}, symbolStr) {
            return ajax.get(`/prices?provider=redstone&symbols=${symbolStr}`)
        },
        // eslint-disable-next-line no-empty-pattern
        async buyDeposit({}, params) {
            // await window.ethereum.enable()
            const provider = new providers.Web3Provider(window.ethereum)
            const signer = await provider.getSigner()
            const pay = new Everpay({
                account: window.ethereum.selectedAddress,
                chainType: params.chainType,
                ethConnectedSigner: signer
            })
            const result = await pay.deposit({
                tag: params.tag,
                amount: params.amount
            })
            return result
        },
        // eslint-disable-next-line no-empty-pattern
        getFeeInfo({}, param) {
            return ajaxIo.get(`/bundle/fee/1048576/${param}`)
        },
        // eslint-disable-next-line no-empty-pattern
        getFee({}, param) {
            return ajaxIo.get(`/bundle/fee/${param.size}/${param.currency}`)
        }
    }
}