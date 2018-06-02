import { combineReducers } from 'redux'
import { drizzleReducers, generateContractsInitialState } from 'drizzle'

import * as actionTypes from '../constants/actionTypes';
import drizzleOptions from '../drizzleOptions'

export const INITIAL_STATE = {
    dmsg: {
        friendAddress: "0x0",
        history: [],
    },
    contracts: generateContractsInitialState(drizzleOptions)
}

const reducer = combineReducers({
  dmsg: dmsgReducer,
  ...drizzleReducers
})

function dmsgReducer(state = INITIAL_STATE, action = {})
{
    switch (action.type)
    {
        case actionTypes.ADD_MESSAGE:
            return Object.assign({}, state, {
                history: state.history.concat(action.payload)
            })
        case actionTypes.SET_FRIEND_ADDRESS:
            return Object.assign({}, state, {
                friendAddress: action.payload
            })
        case actionTypes.FETCH_HISTORY_SUCCESS:
            return Object.assign({}, state, {
                history: action.payload
            })
        default:
            return state
    }
}

export default reducer
