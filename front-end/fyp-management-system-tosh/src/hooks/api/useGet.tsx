import { useReducer } from 'react'
import { InitialState, postReducer } from '../../reducer/postReducer'
import { actionTypes } from '../../types/actionType'

const useGet = () => {
    const [state, dispatch] = useReducer(postReducer, InitialState)

    const handleGet = (url: string) => {
        dispatch({ type: actionTypes.start })
        fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw response
                }
            })
            .then((data) => {
                dispatch({ type: actionTypes.success, payload: data })
            })
            .catch((error) => {
                dispatch({ type: actionTypes.error, payload: error })
            })
    }

    return { state, handleGet }
}

export default useGet
