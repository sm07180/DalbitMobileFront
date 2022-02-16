import React, {useState, useEffect, useContext} from 'react'
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
import {useHistory} from "react-router-dom";
import {Context} from "context";

const walletTabMenu = ['달 내역', '별 내역', '환전']

const WalletPage = (props) => {
  const [walletType, setWalletType] = useState(walletTabMenu[2])
  const history = useHistory();
  const context = useContext(Context);
  const {walletData} = context;

  //달, 별 상세조건 옵션리스트
  const getWalletPop = () => {
    Api.getMypageWalletPop({walletType: 0})
      .then((res) => {
      const {result, data, message} = res;

      if(result ==='success'){
        const {list} = data;
        // cnt: 1
        // order: 1
        // text: "환전 사용"
        // type: "use"
        // walletCode: 1

      } else {
      }
    });
  }

  // 지갑 내역
  const getWalletList = () => {
    Api.getMypageWalletList({
      walletType: 1,  //walletType [0: 별, 1: 달]
      walletCode: 0,
      page: 1,
      records: 20
    }).then((res) => {
      const {result, data, message} = res;

      if (result === 'success') {
        const {list, paging, byeolTotCnt, dalTotCnt} = data;
      } else {
      }
    });
  }
  useEffect(() => {
    getWalletPop();
    getWalletList();
    context.globalAction.dispatchWalletData({type:'ADD_HISTORY', data: {listHistory: [], popHistory:[]}});
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



  //ios 본인인증 체크
  const checkSelfAuth = async () => {
    //2020_10_12 환전눌렀을때 본인인증 나이 제한 없이 모두 가능
    let myBirth
    const baseYear = new Date().getFullYear() - 11
    const myInfoRes = await Api.mypage()
    if (myInfoRes.result === 'success') {
      myBirth = myInfoRes.data.birth.slice(0, 4)
    }

    async function fetchSelfAuth() {
      const res = await Api.self_auth_check({})
      if (res.result === 'success') {
        if (res.data.company === '기타') {
          return context.action.alert({
            msg: `휴대폰 본인인증을 받지 않은 경우\n환전이 제한되는 점 양해부탁드립니다`
          })
        }
        const {parentsAgreeYn, adultYn} = res.data
        if (parentsAgreeYn === 'n' && adultYn === 'n') return history.push('/selfauth_result')
        if (myBirth > baseYear) {
          return context.action.alert({
            msg: `만 14세 미만 미성년자 회원은\n서비스 이용을 제한합니다.`
          })
        } else {
          history.push('/money_exchange')
        }
      } else if (res.result === 'fail' && res.code === '0') {
        history.push('/selfauth')
      } else {
        context.action.alert({
          msg: res.message
        })
      }
    }
    fetchSelfAuth()
    // history.push('/money_exchange')
  }
  
  return (
    <div id="walletPage">
      <Header type='back' title='내 지갑'>
        {walletType === walletTabMenu[1] ? (
          <div className="buttonGroup">
            <button className="payCount" onClick={() => {history.push('/store')}}>
              <i className='iconStar'></i>
              <span>{Utility.addComma(33000)}</span>
            </button>
          </div>
        ) : (
          <div className="buttonGroup">
            <button className="payCount" onClick={() => {history.push('/store')}}>
              <i className='iconDal'></i>
              <span>{Utility.addComma(33000)}</span>
            </button>
          </div>
        )}
      </Header>
      <Tabmenu data={walletTabMenu} tab={walletType} setTab={setWalletType} />
      {/*달 내역 & 별 내역*/}
      {walletType !== walletTabMenu[2] ?
        <HistoryList />
        :
        /*환전*/
        <Exchange />
      }
    </div>
  )
}

export default WalletPage