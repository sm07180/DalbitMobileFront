import { useEffect, useRef } from "react";
import {isAndroid} from "../../context/hybrid";
import {
  setGlobalCtxBackEventCallback,
  setGlobalCtxBackFunction, setGlobalCtxBackFunctionEnd,
  setGlobalCtxBackState
} from "../../redux/actions/globalCtx";

export function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export const useAddBackEvent = (dispatch, globalState, name= '', callback = () => {} ) => {
  useEffect(() => {
    if(isAndroid() && dispatch) {
      dispatch(setGlobalCtxBackState(true));
      dispatch(setGlobalCtxBackFunction({name: 'callback'}));
      dispatch(setGlobalCtxBackEventCallback(callback));
    }

    return () => {
      if (isAndroid() && dispatch) {
        dispatch(setGlobalCtxBackFunctionEnd(''));
        dispatch(setGlobalCtxBackEventCallback(null));
      }
    }
  },[]);

  return null;
}
