import React, {useContext, useEffect} from "react";
import '../style.scss'
import Header from "../../../components/ui/header/Header";
import Utility from "../../../components/lib/utility";
import {useHistory, useLocation} from "react-router-dom";
import {
  DalPriceType,
  ModeTabType,
  ModeType,
  OsType,
  StoreTabInfoType
} from "../../../redux/types/pay/storeType";
import {Hybrid, isHybrid} from "../../../context/hybrid";
import {OS_TYPE} from "../../../context/config";
import Tabmenu from "../../broadcast/content/right_content/component/tabmenu";
import {useDispatch, useSelector} from "react-redux";
import {getPriceList, setStoreInfo, setStoreTabInfo} from "../../../redux/actions/payStore";
import qs from 'query-string';
import moment from "moment";

import { GlobalContext } from "context";
import Api from "../../../context/api";
import {parentCertChk} from "../../../common/api";
import {authReq} from "pages/self_auth";

const StorePage = ()=>{
  const context = useContext(GlobalContext)
  const { globalAction } = useContext(GlobalContext);

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const payStoreRdx = useSelector(({payStore})=> payStore);
  const memberRdx = useSelector(({member})=> member);
  const {webview} = qs.parse(location.search);

  const movePayment = (item:DalPriceType) => {
    if(payStoreRdx.storeInfo.mode === ModeType.none){
      console.log(`storeInfo.mode none`)
      return;
    }
    if(payStoreRdx.storeInfo.state === 'progress'){
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: `잠시 후 다시 시도해 주세요.`,
        callback: () => {
        },
      });
      return;
    }
    const tabInfo = payStoreRdx.storeTabInfo.find(f=>f.selected);
    if(!tabInfo){
      return;
    }

    if(tabInfo.modeTab === ModeTabType.inApp){
      dispatch(setStoreInfo({state:"progress"}));
      setTimeout(()=>{
        dispatch(setStoreInfo({state:"ready"}));
      }, 2000)
      if(payStoreRdx.storeInfo.deviceInfo?.os === OS_TYPE.Android){
        Hybrid('doBilling', {
          itemCode: item.itemNo,
          itemKey: `${memberRdx.memNo}_${moment(moment.now()).format('YYYYMMDDHHmmss')}`
        });
      }
      if(payStoreRdx.storeInfo.deviceInfo?.os === OS_TYPE.IOS){
        Hybrid('openChargeWithItemCode', {
          productNm: item.itemNo
          , productPrice: item.itemPriceDefault
        });
      }
      return;
    }else{
      const otherPageLocation = {
        pathname: '/store/dalcharge',
        search: `?itemNm=${encodeURIComponent(item.itemNm)}&price=${item.itemPrice}&itemNo=${item.itemNo}&dal=${item.givenDal}`
      }
      history.push(otherPageLocation);
    }
  }

  const golink = (path) => {
      history.push(path);
  }

  const tabMenuPros = {
    data: Array.from(payStoreRdx.storeTabInfo, a=>a.text),
    tab: payStoreRdx.storeTabInfo.find(f=>f.selected)?.text,
    setTab: (text)=>{
      const copy:Array<StoreTabInfoType> = [...payStoreRdx.storeTabInfo].map(m=>{
        m.selected = m.text === text;
        return m;
      });
      dispatch(setStoreTabInfo(copy));
      const sel = copy.find(f=>f.selected);
      if(sel && sel.modeTab){
        dispatch(getPriceList(sel.modeTab));
      }

    }
  }
  const nowTab = payStoreRdx.storeTabInfo.find(f=>f.selected);

  return (
    <div id="storePage">
      <Header title={'스토어'} position="sticky" type="back" backEvent={()=>{
        if (isHybrid() && webview && webview === 'new') {
          Hybrid('CloseLayerPopup', undefined);
        }else{
          // 스토어 페이지는 직접 접근 케이스가 있어 강제 메인으로
          history.replace('/');
        }
      }}/>
      <section className="eventBanner">
        <div className="bannerImg" onClick={() => {golink("/notice/617")}}>
          <img src="https://image.dalbitlive.com/store/banner/store_banner-7951.png" alt=""/>
        </div>
        <div className="bannerInfo">
          <p className="bannerText point">※ 단, 무통장입금, 계좌이체, 카드결제 방식에 한합니다.</p>
          <p className="bannerText">※ 실제 보너스 지급은 다음날 지급됩니다. (휴일제외)</p>
        </div>
      </section>
      <section className="myhaveDal">
        <div className="title">내가 보유한 달</div>
        <span className="dal">{Utility.addComma(payStoreRdx.storeInfo.dalCnt)}</span>
      </section>
      <section className="storeTabWrap">
        {
          payStoreRdx.storeTabInfo.filter(f => f.active).length === payStoreRdx.storeTabInfo.length &&
          <Tabmenu {...tabMenuPros} />
        }

        {
          nowTab?.hasTip && payStoreRdx.storeInfo.deviceInfo?.os === OS_TYPE.Android &&
          <div className="tipWrap">
            <div className="title">
              <i/>결제 TIP
            </div>
            <p>PC 또는 {payStoreRdx.storeInfo.deviceInfo?.os === OsType.IOS ? '사파리를':'크롬을'} 통해 달 구입시, 훨씬 더 많은 달을 받을 수 있습니다.</p>
            <p>
              www.dallalive.com
            </p>
          </div>
        }
      </section>

      <section className="storeDalList">
        {
          payStoreRdx.storeInfo.dalPriceList && payStoreRdx.storeInfo.dalPriceList.map((item, index) =>
            <div className={`item`} data-target-index={index} key={index}
                 onClick={()=>{
                   movePayment(item);
                 }} >
              <div className="icon">
                <img src={`${item.img}`} alt={`이미지`} />
              </div>
              <div className="dal">{Utility.addComma(item.givenDal)}</div>
              {item.salePrice === 1100000 && <div className='bonus'>{`+${Utility.addComma(500)}`}</div>}
              <div className="price">{`￦${Utility.addComma(item.salePrice)}`}</div>
            </div>
          )}

        {/*<SubmitBtn onClick={movePayment} text="결제하기" />*/}
      </section>
    </div>
  )
}

export default StorePage
