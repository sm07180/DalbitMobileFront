import React, {useContext, useEffect, useState, useMemo, useRef} from 'react'
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
import {useHistory, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxMessage,
  setGlobalCtxWalletAddData,
  setGlobalCtxWalletAddHistory,
  setGlobalCtxWalletInitData
} from "redux/actions/globalCtx";
import {isHybrid, isIos} from "context/hybrid";
import {storeButtonEvent} from "components/ui/header/TitleButton";

const WalletPage = (props) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {walletData, token} = globalState;
  const tabMenuRef = useRef(null);  //우편번호 팝업 위치 설정용...
  const memberRdx = useSelector((state)=> state.member);
  const payStoreRdx = useSelector(({payStore})=> payStore);

  //아이폰 앱에서 달교환 버튼 클릭시 새창 띄움
  const isIOS = useMemo(() => {
    const agent = window.navigator.userAgent.match(/(ios webview)/gi);
    return !agent? false : agent[0] === 'ios webview';
    } ,[]);  //아이폰이면 환전 메뉴를 다르게 보여주는 정책!
  const isDesktop = useSelector((state)=> state.common.isDesktop)

  const search = location?.search || '';

  if(!token?.isLogin) history.push(`/login?${location.pathname + search}`);

  const walletTabMenu = ['달 내역', '별 내역', isIOS? '달 교환' : '환전'];
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

          let popHistoryCnt = 0;
          popRes.data?.list.map((v) => {
            popHistoryCnt += v?.cnt;
          })

          dispatch(setGlobalCtxWalletAddData({
            ...byeolAndDal,
            listHistory: pageNo === 1 ? listRes.data?.list : walletData.listHistory.concat(listRes.data?.list),
            popHistory: popRes.data?.list,
            popHistoryCnt
          }));
          setIsLoading(false);
        } else if (listRes.message === "사용내역이 없습니다.") {
          dispatch(setGlobalCtxWalletAddHistory({
            listHistory: [],
            popHistory: popRes.data?.list,
            popHistoryCnt: 0
          }));
        }

      });
  }

  //별 수치가 안맞음.
  // const getNewWallet = async () => {
  //   const {result, data, message} = await Api.getMyPageNewWallet();
  //
  //   if(result === 'success'){
  //     context.globalAction.dispatchWalletData({type:'ADD_DATA',
  //       data:{
  //         byeolTotCnt : data?.byeol,
  //         dalTotCnt : data?.dal,
  //     }});
  //   }
  // };

  //tab 이동
  const setTabType = (walletType) => {
    dispatch(setGlobalCtxWalletAddData({walletType}));
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


  useEffect(() => {
    ///wallet?exchange로 주소로 들어올경우 기본탭을 환전탭으로 지정하기
    const toExchangeTab = location?.search.indexOf('exchange') > -1;
    if(toExchangeTab){
      setTabType(walletTabMenu[2]);
    }

    return () => {
      dispatch(setGlobalCtxWalletInitData());
    };
  },[]);

  // 환전취소
  function cancelExchangeFetch(exchangeIdx) {
    async function callback() {
      const {result, data, message} = await Api.postExchangeCancel({
        exchangeIdx, // 환전취소 글번호
      })
      if (result === 'success') {
        getWalletHistory(1, walletType === walletTabMenu[0] ? 1 : 0);
        dispatch(setGlobalCtxMessage({type: "alert",
          title: '환전 취소가 완료되었습니다.',
          msg: message
        }));
      } else {
        dispatch(setGlobalCtxMessage({type: "alert",
          msg: message,
        }))
      }
    }

    dispatch(setGlobalCtxMessage({type: "confirm",
      msg: '환전신청을 취소 하시겠습니까?',
      callback
    }));
  }

  // 스토어로 이동
  const goStoreHandler = () => {
    storeButtonEvent({history, memberRdx, payStoreRdx});

    // if(isIos()) {
    //   // return webkit.messageHandlers.openInApp.postMessage('')
    //   return history.push('/store')
    // }else {
    //   history.push('/store')
    // }
  }

  return (
    <div id="walletPage">
      {(isDesktop || isHybrid()) ?
        <Header type="back" title="내 지갑"/>
        :
        <Header type="sub" title="내 지갑"/>
      }
      <Tabmenu data={walletTabMenu} tab={walletType} setTab={setTabType} tabMenuRef={tabMenuRef}/>

      {/*달 내역 & 별 내역*/}
      {walletType !== walletTabMenu[2] ?
        <HistoryList walletData={walletData} pageNo={pageNo} setPageNo={setPageNo} selectedCode={selectedCode}
                     setSelectedCode={setSelectedCode} isLoading={isLoading} setIsLoading={setIsLoading}
                     getWalletHistory={getWalletHistory} lastPage={lastPage} cancelExchangeFetch={cancelExchangeFetch}
                     walletType={walletType} isIOS={isIOS}/>
        :
        /*환전 ( = ios : 달 교환)*/
        <Exchange isIOS={isIOS} tabMenuRef={tabMenuRef}/>
      }
    </div>
  )
}

export default WalletPage
