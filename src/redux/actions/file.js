import { setError } from './error'

export const upload = (file, cb) => {

  return (dispatch, getState, {service}) => {

    return service.upload(file, (e) => {
      cb(e)
      if (e.type === 'error') {
        dispatch(setError(e.payload))
      }
    })
  }
}