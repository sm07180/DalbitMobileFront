import { useEffect, useRef } from "react";
import {isAndroid} from "../../context/hybrid";

export function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export const useAddBackEvent = (context, name= '', callback = () => {} ) => {
  useEffect(() => {
    if(isAndroid() && context) {
      context.action.updateSetBack(true);
      context.action.updateBackFunction({name: 'callback'});
      context.action.updateBackEventCallback(callback);
    }

    return () => {
      if (isAndroid() && context) {
        if (context.backFunction.name.length === 1) {
          context.action.updateSetBack(null);
        }
        context.action.updateBackFunction({name: ''});
        context.action.updateBackEventCallback(null);
      }
    }
  },[]);

  return null;
}
