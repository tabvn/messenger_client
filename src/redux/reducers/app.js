import _ from 'lodash'
import { INIT_APP, SET_APP_INIT_FETCHED, SET_CURRENT_USER } from '../types'

const initState = {
  fetched: false,
  token: {
    id: '',
    token: '',
    user_id: '',
    created: ''
  },
  user: {},
  giphy: {
    api: '',
    exclude: []
  },
  theme: {}
}

export default (state = initState, action) => {

  switch (action.type) {

    case INIT_APP:

      const payload = action.payload

      return {
        ...state,
        token: _.get(payload, 'account', {}),
        user: _.get(payload, 'account.user', {}),
        giphy: _.get(payload, 'giphy', {}),
        theme: _.get(payload, 'theme', {})
      }

    case SET_APP_INIT_FETCHED:

      return {

        ...state,
        fetched: action.payload,
      }

    case SET_CURRENT_USER:

      return {
        ...state,
        user: action.payload
      }

    default:

      return state
  }
}