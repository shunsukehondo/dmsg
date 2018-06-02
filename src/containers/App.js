import 'babel-polyfill'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStore } from 'redux'
import { drizzleConnect } from 'drizzle-react'

import { store } from '../store'
import ChatInput from '../components/ChatInput'
import ChatHistory from '../components/ChatHistory'
import ChangeFriend from '../components/ChangeFriend'
import * as actionTypes from '../constants/actionTypes'

class App extends Component {
  componentWillMount() {
  }

  componentDidUpdate() {
      this.scrollDown()
  }

  render() {
    const { userAddress, friendAddress, history, fetchHistory, changeFriend, sendMessage } = this.props
    console.log(this.props)
    return (
      <div className="App">
        <ChangeFriend friendAddress={ friendAddress } changeFriend={ changeFriend } />
        <ChatHistory history={ history } fetchHistory={ fetchHistory }/>
        <ChatInput userAddress={ userAddress } friendAddress={ friendAddress } sendMessage={ sendMessage } />
      </div>
    );
  }

  scrollDown() {
      window.scrollTo(0, document.body.scrollHeight);
  }
}

function mapDispatchToProps (dispatch, ownProps) {
    return {
        fetchHistory: () => dispatch({ type: actionTypes.FETCH_HISTORY_REQUESTED }),
        sendMessage: (msg) => dispatch({ type: actionTypes.SEND_MESSAGE_REQUESTED, payload: msg }),
        changeFriend: (address) => {
            dispatch({ type: actionTypes.SET_FRIEND_ADDRESS, payload: address })
            dispatch({ type: actionTypes.FETCH_HISTORY_REQUESTED })
        },
    }
}

function selector (state, ownProps) {
    return {
        history: state.dmsg.history,
        userAddress: state.dmsg.userAddress,
        friendAddress: state.dmsg.friendAddress,
    }
}

export default drizzleConnect(
    App,
    selector,
    mapDispatchToProps
)
