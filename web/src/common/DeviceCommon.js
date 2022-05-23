//userAgent 체크후 os 값 반환
import {OS_TYPE} from "context/config";
import {isHybrid} from "context/hybrid";

const getDeviceOSTypeChk = () => {
  if(typeof window ==='undefined') return;
  const userAgent = window.navigator.userAgent;
  let osName;
  if(userAgent) { // return: Array or null
    osName = userAgent.match(/(ios webview)/gi) || userAgent.match(/(android webview)/gi) || userAgent.match(/(iPhone)/gi) || userAgent.match(/(iPad)/gi) || userAgent.match(/(Windows)/gi);
  }

  osName = osName? osName[0] : 'Windows'; // null이면 Desktop으로 세팅
  return osName === 'android webview' ? OS_TYPE['Android'] :
    osName === 'ios webview' ? OS_TYPE['IOS'] :
        osName === 'Windows' ? OS_TYPE['Desktop'] : OS_TYPE['Desktop'];
};

const getDeviceConfig = () => {
  if(typeof window ==='undefined') return;
  const userAgent = window.navigator.userAgent;
  let osName;
  if(userAgent) { // return: Array or null
    osName = userAgent.match(/(ios webview)/gi) || userAgent.match(/(android webview)/gi) || userAgent.match(/(iPhone)/gi) || userAgent.match(/(iPad)/gi) || userAgent.match(/(Windows)/gi);
  }

  osName = osName? osName[0] : 'Windows'; // null이면 Desktop으로 세팅
  return osName === 'android webview' ? OS_TYPE['Android'] :
      osName === 'ios webview' ? OS_TYPE['IOS'] :
      isHybrid() ? 4 :
      osName === 'Windows' ? OS_TYPE['Desktop'] : OS_TYPE['Desktop'];
};


export {getDeviceOSTypeChk, getDeviceConfig};