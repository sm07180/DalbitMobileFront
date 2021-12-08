/**
 * @title error페이지
 * @url https://devwww2.dalbitlive.com/ctrl/check/ip
 *
 * 변경사항 : 요청 URL API서버로 변경
 */
import React, {useState, useEffect, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'

//context
import {Context} from 'context'
import Api from 'context/api'
import {OS_TYPE, API_SERVER, PHOTO_SERVER} from 'context/config.js'
import {Hybrid} from "context/hybrid";
import Utility from "components/lib/utility";

export default () => {
  const history = useHistory();
  const customHeader = JSON.parse(Api.customHeader);
  const context = useContext(Context);
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

  useEffect(() => {
    if (history && history.location.pathname === '/') {  //메인페이지에서만 서버 리스트를 보여줍니다.
      const clientIp = localStorage.getItem('innerChk');
      if (!clientIp) {
        getInnerServerList();
      } else {
        innerIpChk(clientIp) && getInnerServerList();
        setRedirectList([]);
      }
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
                Hybrid('setAppHost', {host, api, photo, socketURL});
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
