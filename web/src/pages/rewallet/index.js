import React, {useContext, useEffect, useState} from 'react'
import Utility from 'components/lib/utility'
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

const walletTabMenu = ['달 내역', '별 내역', '환전'];

const WalletPage = (props) => {
  const history = useHistory();
  const context = useContext(Context);
  const {walletData} = context;
  const {walletType, byeolTotCnt, dalTotCnt, popHistory, listHistory} = walletData;
  //선택 코드
  const [selectedCode, setSelectedCode] = useState('0');
  //pageNo
  const [pageNo, setPageNo] = useState(1);
  //loadingFlag
  const [isLoading, setIsLoading] = useState(false);
  //마지막 페이지
  const [lastPage, setLastPage] = useState(0);

  //탭 이동 데이터 리셋
  const dataReset = () => {
    setSelectedCode('0');
    setPageNo(1);
  };
  //공용 변수
  let pagePerCnt = 20;

  //달, 별 내역 조회하기
  //상세조건 옵션리스트, 지갑 내역 리스트 조회 
  const getWalletHistory = (pageNo, code) => {
    //환전하기 return;
    if(walletType === walletTabMenu[2]) return;

    const type = walletType === walletTabMenu[0]? 1 : 0;
    const popParam = {walletType: type};
    const listParam = {
      walletType: type,  // [0: 별, 1: 달]
      walletCode: code, // '0' or '0|1|2|3'
      page: pageNo,
      records: pagePerCnt
    };

    Promise.all([
      Api.getMypageWalletPop(popParam),
      Api.getMypageWalletList(listParam)])
      .then(([popRes, listRes]) => {
        if (popRes.result === 'success' && listRes.result === 'success') {
          //값을 이상하게 줘서 타입에따라서 받고 안받고 처리함...
          const byeolAndDal = walletType === walletTabMenu[0]?
            {dalTotCnt : listRes.data?.dalTotCnt}: {byeolTotCnt : listRes.data?.byeolTotCnt};
          setLastPage(Math.ceil(listRes.data.paging.total / pagePerCnt));
          context.globalAction.dispatchWalletData({
            type: 'ADD_DATA',
            data: {
              ...byeolAndDal,
              listHistory: pageNo === 1 ? listRes.data?.list : walletData.listHistory.concat(listRes.data?.list),
              popHistory: popRes.data?.list,
            }
          });
          setIsLoading(false);
        } else if (listRes.message === "사용내역이 없습니다.") {
          context.globalAction.dispatchWalletData({
            type: 'ADD_HISTORY',
            data: {
              listHistory: [],
              popHistory: popRes.data?.list
            }
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
      getWalletHistory(1, '0');
      //데이터 초기화
      dataReset();
    }
    //스크롤 초기화
    document.documentElement.scrollTop = 0;
    // getWalletList();
    // context.globalAction.dispatchWalletData({type:'ADD_HISTORY', data: {listHistory: [], popHistory:[], dalCnt:0, byeolCnt:0}});
  },[walletType]);

  //내역 선택
  useEffect(() => {
    getWalletHistory(1, selectedCode);
    setPageNo(0);
    document.documentElement.scrollTop = 0;
  }, [selectedCode]);

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
            <button className="payCount" onClick={() => {history.push('/pay/store')}}>
              <i className='iconStar'/>
              <span>{Utility.addComma(byeolTotCnt)}</span>
            </button>
          </div>
        ) : (
          <div className="buttonGroup">
            <button className="payCount" onClick={() => {history.push('/pay/store')}}>
              <i className='iconDal'/>
              <span>{Utility.addComma(dalTotCnt)}</span>
            </button>
          </div>
        )}
      </Header>
      <Tabmenu data={walletTabMenu} tab={walletType} setTab={setTabType} />

      {/*달 내역 & 별 내역*/}
      {walletType !== walletTabMenu[2] ?
        <HistoryList walletData={walletData} pageNo={pageNo} setPageNo={setPageNo} selectedCode={selectedCode} setSelectedCode={setSelectedCode} isLoading={isLoading} setIsLoading={setIsLoading} getWalletHistory={getWalletHistory} lastPage={lastPage} cancelExchangeFetch={cancelExchangeFetch} walletType={walletType}/>
        :
        /*환전*/
        <Exchange />
      }
    </div>
  )
}

export default WalletPage