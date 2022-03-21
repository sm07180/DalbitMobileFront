/**
 * @title error페이지
 * @url https://devwww2.dalbitlive.com/ctrl/check/ip
 *
 * 변경사항 : 요청 URL API서버로 변경
 */
import React, {useCallback, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'

//context
import Api from 'context/api'
import {OS_TYPE} from 'context/config.js'
import {Hybrid, isHybrid} from "context/hybrid";
import {getDeviceOSTypeChk} from '../../../common/DeviceCommon';
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxUpdateProfile, setGlobalCtxUpdateToken} from "redux/actions/globalCtx";

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory();
  const customHeader = JSON.parse(Api.customHeader);
  const [redirectList, setRedirectList] = useState([]);

  /** host 주소값으로 리스트에서 같은 값이 있는지 검색
   * @return : undefined or {host, api, photo, socketURL} */
  const readDevInfoData = useCallback((selectHost = '') => redirectList.find((v, i) => (v.host === selectHost)), [redirectList]);

  /** 요청 전에 내부서버 아이피 확인
   * @param : string (ex : '192.168.0.1')
   * @return : boolean */
  const innerIpChk = (ip = '') => {
    const ipArr = ip.split('.');
    if (ip === 'undefined' || ipArr.length !== 4) return false;

    const [g1, g2, g3, g4] = ipArr;
    return g1 === '61' && g2 === '80' && g3 === '148' && (parseInt(g4) > 0 && parseInt(g4) < 256) || ip === '59.13.127.250' || ip === '59.13.127.251';
  };

  //API서버에 내부서버리스트 요청
  const getInnerServerList = async () => {
    const {list, innerChk} = await Api.getInnerServerList();

    if (Array.isArray(list) && list.length) {
      setRedirectList(list);
      localStorage.setItem('innerChk', innerChk); //client ip
    }
  };

  //서버 이동 브릿지 호출 함수 : (로그아웃 후 서버 이동 시킴)
  const serverChangeAction = async (host, api, photo, socketURL) => {
    if (globalState.token.isLogin) {
      const logoutInfo = await Api.member_logout();
      if (logoutInfo.result === 'success') {
        Hybrid('GetLogoutToken', logoutInfo.data);
        clearInterval(globalState.intervalId);
        dispatch(setGlobalCtxUpdateToken(logoutInfo.data));
        dispatch(setGlobalCtxUpdateProfile(null));

        Hybrid('setAppHost', {host, api, photo, socketURL});
      }
    } else {
      Hybrid('setAppHost', {host, api, photo, socketURL});
    }
  };

  useEffect(() => {
    const clientIp = localStorage.getItem('innerChk');
    if (!clientIp) {
      getInnerServerList();
    } else {
      innerIpChk(clientIp) ? getInnerServerList() : setRedirectList([]);
    }
  }, []);

  return (<>
    {redirectList.length > 0 &&
    <select style={{display: 'inline-block', position: 'fixed', bottom: '100px', right: '10px', backgroundColor: 'blue', color: 'white', zIndex: '500', padding: '5px 5px', marginBottom: '-50px'}}
            value={location.origin}
            onChange={(e) => {
              const obj = readDevInfoData(e.target.value);
              if (obj) {
                const {host, api, photo, socketURL} = obj;
                if(!isHybrid()) { //web
                  location.href = host;
                } else { //mobile
                  serverChangeAction(host, api, photo, socketURL); //bridge Call
                }
              }
            }}>
      {redirectList.map((info, idx) => {
        return (
          <option key={`url-${idx}`} value={info.host}>
            {info.name}
          </option>
        )
      })}
    </select>
    }
  </>);
}
