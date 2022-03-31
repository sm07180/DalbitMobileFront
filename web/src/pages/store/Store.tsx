import React, {useContext, useEffect, useState} from "react";
import {Context} from "context";
import {
  ModeTabType,
  ModeType,
  OsType,
  PAYMENT_TAB,
  StoreInfoType,
  StorePagePropsType,
  StoreTabInfoType
} from "../../redux/types/pay/storeType";
import StorePage from "./contents/StorePage";
import {getDalPriceList, getStoreIndexData} from "../../common/api";

const index = ()=>{
  const context = useContext(Context);
  const [storeInfo, setStoreInfo] = useState<StoreInfoType>({
    dalCnt: 0, defaultNum: 0, dalPriceList: [], mode:ModeType.all, modeTab:ModeTabType.none,
    deviceInfo:{}
  });
  const [storeTabInfo, setStoreTabInfo] = useState<Array<StoreTabInfoType>>(PAYMENT_TAB);

  const getIndexData = async ()=>{
    const res = await getStoreIndexData();
    setStoreInfo({
      ...storeInfo,
      dalCnt: res.data.dalCnt,
      defaultNum: res.data.defaultNum,
      deviceInfo: res.data.deviceInfo,
      mode: res.data.mode,
      modeTab: res.data.platform,
    });
    setStoreTabInfo(storeTabInfo.map((m,i)=>{
      m.active = res.data.mode === ModeType.all ? true : m.modeTab === res.data.platform;

      m.selected = res.data.mode === ModeType.all ?
        m.modeTab === ModeTabType.inApp
        : m.modeTab === res.data.mode;

      return m;
    }));

  }
  const getPriceList = async (platform:ModeTabType)=>{
    setStoreInfo({
      ...storeInfo,
      dalPriceList: [],
    });
    const res = await getDalPriceList({platform});
    setStoreInfo({
      ...storeInfo,
      dalPriceList: res.data.dalPriceList,
    });
  }
  useEffect(() => {
    if(!context.token.isLogin){
      history.back();
      return;
    }
    getIndexData();
  }, []);
  useEffect(() => {
    if(storeInfo.modeTab === ModeTabType.none){
      return;
    }
    const platform = storeTabInfo.find(f=>f.selected);
    if(!platform){
      return
    }
    getPriceList(platform.modeTab);
  }, [storeTabInfo]);

  const storePageProps:StorePagePropsType = {
    storeInfo : storeInfo,
    storeTabInfo,
    setStoreTabInfo
  }
  return (
    <>
      {
        storeInfo.deviceInfo.os !== OsType.Unknown && storeInfo.mode !== ModeType.none &&
        <StorePage {...storePageProps} />
      }
    </>
  )

}

export default index
