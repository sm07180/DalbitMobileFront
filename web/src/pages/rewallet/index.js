import React, {useState, useEffect, useContext, useMemo} from 'react'
import Utility ,{addComma} from 'components/lib/utility'
import Api from 'context/api'

// global components
import Header from 'components/ui/header/Header'
// components
import Tabmenu from './components/tabmenu'
// contents
import HistoryList from './contents/HistoryList'
import Exchange from './contents/exchange/Exchange'
// css

import './style.scss'
import {useHistory, useLocation} from "react-router-dom";
import {Context} from "context";
import {OS_TYPE} from 'context/config.js';
import {getDeviceOSTypeChk} from "common/DeviceCommon";

const WalletPage = (props) => {
  const history = useHistory();
  const location = useLocation();
  const context = useContext(Context);
  const {walletData, token} = context;

  const isIOS = useMemo(() => getDeviceOSTypeChk() === OS_TYPE['IOS'] ,[]);  //아이폰이면 환전 메뉴를 다르게 보여주는 정책!
  const walletTabMenu = ['달 내역', '별 내역', isIOS? '달 교환' : '환전'];

  if(!token?.isLogin) history.push('/login');

  const {walletType, byeolTotCnt, dalTotCnt, popHistory, listHistory} = walletData;

  //달, 별 내역 조회하기
  //상세조건 옵션리스트, 지갑 내역 리스트 조회 
  const getWalletHistory = () => {
    //환전하기 return;
    if(walletType === walletTabMenu[2]) return;

    const type = walletType === walletTabMenu[0]? 1 : 0;
    const popParam = {walletType: type};
    const listParam = {
      walletType: type,  // [0: 별, 1: 달]
      walletCode: 0, // '0' or '0|1|2|3'
      page: 1,
      records: 20
    };
    context.globalAction.dispatchWalletData({
      type: 'ADD_HISTORY',
      data: {listHistory: [], popHistory: []}
    });

    Promise.all([
      Api.getMypageWalletPop(popParam),
      Api.getMypageWalletList(listParam)])
      .then(([popRes, listRes]) => {
        if (popRes.result === 'success' && listRes.result === 'success') {
          //값을 이상하게 줘서 타입에따라서 받고 안받고 처리함...
          const byeolAndDal = walletType === walletTabMenu[0]?
            {dalTotCnt : listRes.data?.dalTotCnt}: {byeolTotCnt : listRes.data?.byeolTotCnt};

          context.globalAction.dispatchWalletData({
            type: 'ADD_DATA',
            data: {
              ...byeolAndDal,
              listHistory: listRes.data?.list,
              popHistory: popRes.data?.list,
            }
          });
        } else {
          context.globalAction.dispatchWalletData({
            type: 'ADD_HISTORY',
            data: {listHistory: [], popHistory: []}
          });
        }

      });
  }

  //별 수치가 안맞음.
  const getNewWallet = async () => {
    const {result, data, message} = await Api.getMyPageNewWallet();

    if(result === 'success'){
      context.globalAction.dispatchWalletData({type:'ADD_DATA',
        data:{
          byeolTotCnt : data?.byeol,
          dalTotCnt : data?.dal,
      }});
    }
  };

  //tab 이동
  const setTabType = (walletType) => {
    context.globalAction.dispatchWalletData({type:'ADD_DATA', data: {walletType}})
  }

  useEffect(() => {
    if(walletType !== walletTabMenu[2]){ //환전하기
      getWalletHistory(); 
    }
    // getWalletList();
    // context.globalAction.dispatchWalletData({type:'ADD_HISTORY', data: {listHistory: [], popHistory:[], dalCnt:0, byeolCnt:0}});
  },[walletType]);


  useEffect(() => {
    ///wallet?exchange로 주소로 들어올경우 기본탭을 환전탭으로 지정하기
    const toExchangeTab = location?.search.indexOf('exchange') > -1;
    if(toExchangeTab){
      setTabType(walletTabMenu[2]);
    }
  },[]);

  // 환전취소
  async function cancelExchangeFetch() {
    const {result, data, message} = await Api.postExchangeCancel({
      exchangeIdx: 0 // 환전취소 글번호
    })
    if (result === 'success') {
      context.action.alert({
        title: '환전 취소가 완료되었습니다.',
        className: 'mobile',
        msg: message,
        callback: () => {
        }
      })
    } else {
      context.action.alert({
        msg: message,
        callback: () => {
        }
      })
    }
  }

  return (
    <div id="walletPage">
      <Header type='back' title='내 지갑'>
        {walletType === walletTabMenu[1] ? (
          <div className="buttonGroup">
            <button className="payCount" onClick={() => {history.push('/store')}}>
              <i className='iconStar'/>
              <span>{Utility.addComma(byeolTotCnt)}</span>
            </button>
          </div>
        ) : (
          <div className="buttonGroup">
            <button className="payCount" onClick={() => {history.push('/store')}}>
              <i className='iconDal'/>
              <span>{Utility.addComma(dalTotCnt)}</span>
            </button>
          </div>
        )}
      </Header>
      <Tabmenu data={walletTabMenu} tab={walletType} setTab={setTabType} />

      {/*달 내역 & 별 내역*/}
      {walletType !== walletTabMenu[2] ?
        <HistoryList walletData={walletData}/>
        :
        /*환전 ( = ios : 달 교환)*/
        <Exchange isIOS={isIOS}/>
      }
    </div>
  )
}

export default WalletPage