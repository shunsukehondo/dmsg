import { takeEvery, takeLatest, take, select, fork, call, put, all } from 'redux-saga/effects'
import { drizzleSagas } from 'drizzle'

import * as actionTypes from '../constants/actionTypes'
import store from '../store'

function* watchAndLog() {
  while (true) {
    const action = yield take('*')
    const state = yield select()
    // console.log('state', state)
  }
}

function* fetchHistoryAsync (action)
{
    const state = yield select()
    console.log(state)
    const { contracts, accounts, dmsg } = state
    if (typeof accounts === 'undefined' || accounts.length === 0) {
        console.log("Invalid accounts[0]")
        return
    }

    const messageIds = yield getMessages(contracts.Dmsg, accounts[0], dmsg.friendAddress)
    const getMessageWorkers = []
    for (var i=0; i<messageIds.length; i++) {
        if (messageIds[i] == 0) break;
        getMessageWorkers.push(call(getMessage, contracts.Dmsg, messageIds[i], accounts[0]))
    }

    const messages = yield all(getMessageWorkers)
    yield put({
        type: actionTypes.FETCH_HISTORY_SUCCESS,
        payload: messages.map(msg => {
            return {
            Id: msg[0],
            Who: msg[1],
            What: msg[3],
            When: msg[4]
        }}).sort(messageComparer)
    })
}

function* sendMessageAsync (action)
{
    const { contractInstance, userAddress, friendAddress } = yield select()

    // マイニング完了まで表示する仮メッセージ
    const dummyMsg = {
        Id: Math.floor(Math.random() * 100000000),
        Who: userAddress,
        What: action.payload,
        When: (new Date().valueOf()) / 1000
    }
    yield put({ type: actionTypes.ADD_MESSAGE, payload: dummyMsg })

    // 本メッセージを送信
    yield sendMessage(contractInstance, userAddress, friendAddress, action.payload)
}

const getMessage = (dmsgContractInstance, messageId, userAddress) => {
    return dmsgContractInstance.methods.getMessage.cacheCall(messageId, {from: userAddress})
}

const getMessages = (dmsgContractInstance, userAddress, friendAddress) => {
    console.log(dmsgContractInstance)
    console.log(dmsgContractInstance.getMessages)
    return dmsgContractInstance.getMessages.cacheCall(friendAddress, {from: userAddress})
}

const sendMessage = (dmsgContractInstance, userAddress, friendAddress, message) => {
    // return dmsgContractInstance.methods.sendMessage(friendAddress, message).send({from: userAddress})
    return null
}

const messageComparer = (m1, m2) => {
    if (m1.When > m2.When) {
        return 1;
    } else if (m1.When < m2.When) {
        return -1;
    } else {
        return 0;
    }
}

function* drizzleRoot() {
  yield all(
    drizzleSagas.map(saga => fork(saga))
  )
}

export default function* rootSaga ()
{
    yield takeLatest(actionTypes.FETCH_HISTORY_REQUESTED, fetchHistoryAsync)
    yield takeEvery(actionTypes.SEND_MESSAGE_REQUESTED, sendMessageAsync)
    yield fork(watchAndLog)
    yield fork(drizzleRoot)
}
