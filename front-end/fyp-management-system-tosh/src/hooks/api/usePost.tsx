import {useReducer } from 'react';
import { InitialState, postReducer } from '../../reducer/postReducer';
import { actionTypes } from '../../types/actionType';

const usePost = () => {
    const [state, dispatch] = useReducer(postReducer, InitialState);

    const handlePost = (url:string, data: any) => {
        dispatch({type: actionTypes.start});
        fetch(url, {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }).then((response) => {
            if(response.ok){
                return response.json();
            } else {
                throw response;
            }
        }).then((data) => {
            dispatch({type: actionTypes.success, payload: data});
        }).catch((error) => {
            dispatch({type: actionTypes.error, payload: error});
        })
    }

    return { state, handlePost };
}

export default usePost;