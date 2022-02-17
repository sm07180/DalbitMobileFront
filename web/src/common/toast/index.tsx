import React, { useEffect, useContext, useState, useMemo } from "react";
import styled from "styled-components";

import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxSetToastStatus} from "../../redux/actions/globalCtx";

const lifeTime = 2800; // milisec
let msgArray: string[] = [];
let copyArray: string[] = [];
export default function ToastUI() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { message } = globalState.toastStatus;

  const [last, setLast] = useState(false);
  const [isBroadcast, setIsBroadcast] = useState(false);

  useEffect(() => {
    if(window.location.pathname.indexOf("/broadcast") > -1) {
      setIsBroadcast(true);
    }
  }, []);

  useEffect(() => {
    if (message && message !== "") {
      msgArray.push(message);
      copyArray.push(message);
    }
  }, [globalState.toastStatus]);

  const msgData = useMemo(() => {
    if (last === true) {
      return [];
    }
    if (message && message !== "") {
      if (copyArray.length > 0) {
        return [...msgArray, message];
      } else {
        return [message];
      }
    } else {
      return [];
    }
  }, [globalState.toastStatus, last]);
  useEffect(() => {
    if (msgData.length > 0) {
      setTimeout(() => {
        copyArray.shift();
        if (copyArray.length === 0) {
          msgArray = [];
          setLast(true);
        }
      }, lifeTime);
    }
  }, [msgData]);
  useEffect(() => {
    if (last === true && msgData.length === 0) {
      dispatch(setGlobalCtxSetToastStatus({ status: false }));
      setLast(false);
    }
  }, [last, msgData]);

  return (
    <>
      {msgData.length > 0 &&
        msgData.map((v, i) => {
          return (
            <React.Fragment key={i}>
              {isBroadcast ?
                <MiddleToast>
                  <div>
                    {v.split('\n').map( (line, index) => {
                      return (<React.Fragment key={index}>{line}<br/></React.Fragment>)} )}
                  </div>
                </MiddleToast>
                :
                <Toast>
                  <div>{v}</div>
                </Toast>
              }
            </React.Fragment>
          );
        })
      // Memozized(msgData)
      }
    </>
  );
}

const Toast = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  opacity: 0;
  transform: translateX(-50%);
  animation-name: toastFadeInOut;
  animation-duration: 2.8s;
  animation-timing-function: ease-in-out;

  max-width: 428px;
  width: 90%;
  height: auto;
  padding: 10px;
  font-size: 16px;
  text-align: center;
  background-color: rgba(99, 43, 235, 0.9);
  color: #fff;
  border-radius: 12px;
  z-index: 120;

  @keyframes toastFadeInOut {
    0% {
      bottom: -50px;
    }
    15% {
      bottom: 24px;
      opacity: 1;
    }
    90% {
      bottom: 24px;
      opacity: 1;
    }
    100% {
      bottom: 50px;
      opacity: 0;
    }
  }
`;

const MiddleToast = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  opacity: 0;
  transform: translateX(-50%);
  animation-name: toastFadeInOut;
  animation-duration: 2.8s;
  animation-timing-function: ease-in-out;

  max-width: 428px;
  width: 90%;
  height: auto;
  padding: 10px;
  font-size: 16px;
  text-align: center;
  background-color: rgba(99, 43, 235, 0.9);
  color: #fff;
  border-radius: 12px;
  z-index: 120;

  @keyframes toastFadeInOut {
    0% {
      bottom: 50px;
    }
    15% {
      bottom: 50%;
      opacity: 1;
    }
    90% {
      bottom: 50%;
      opacity: 1;
    }
    100% {
      bottom: 100%;
      opacity: 0;
    }
  }
`;
