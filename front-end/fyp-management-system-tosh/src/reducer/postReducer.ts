import { actionTypes } from '../types/actionType'

export const InitialState = {
    loading: false,
    error: false,
    errorDetails: null,
    data: null,
}

export const postReducer = (state: typeof InitialState, action: any) => {
    switch (action.type) {
        case actionTypes.start:
            return {
                loading: false,
                error: false,
                errorDetails: null,
                data: null,
            }
        case actionTypes.success:
            return {
                loading: false,
                error: false,
                errorDetails: null,
                data: action.payload,
            }
        case actionTypes.error:
            return {
                loading: false,
                error: true,
                errorDetails: action.payload,
                data: null,
            }
        default:
            return state
    }
}
