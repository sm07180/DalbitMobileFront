import React, {useContext, useEffect, useState} from "react";
import Api from "../../context/api";
import _ from "lodash";
import {Context} from "context";
import {OsType, PayInfoType, StoreInfoType} from "../../redux/types/pay/storeType";
import StorePage from "./contents/StorePage";

const index = ()=>{
  const context = useContext(Context);
  const [select, setSelect] = useState(3);
  const [storeInfo, setStoreInfo] = useState<StoreInfoType>({
    myDal: 0, defaultNum: 0, dalPriceList: [], os: OsType.Android, mode:'all', modeTab:'other'
  })
  const [payInfo, setPayInfo] = useState<PayInfoType>({
    itemNm: "달 300", dal: "300", price: "33000", itemNo: "A1555"
  })
  // TODO API 하나로 합쳐
  const getStoreInfo = () => {
    Api.store_list().then((response) => {
      if (response.result !== 'success' || !_.hasIn(response, 'data')) {
        context.action.alert({msg: response.message})
        return;
      }
      setStoreInfo({
        ...storeInfo,
        myDal: response.data.dalCnt,
        dalPriceList: response.data.dalPriceList,
        defaultNum: response.data.defaultNum
      })
    });

    /**
     * 외부결제 활성화 체크, 이외 조건 체크 결과를 받아서 처리
      setStoreInfo({
        ...storeInfo,
        os: res.data.os,
        mode: res.data.mode
      })
     */

  }

  const test = ()=>{
    Api.getStoreIndexData({}).then(res=>{
      console.log(res)
    })
  }
  useEffect(() => {
    getStoreInfo();
    test();
  }, []);

  return (
    <>
      {
        storeInfo.os !== OsType.Unknown && storeInfo.mode !== 'none' &&
        storeInfo.dalPriceList && storeInfo.dalPriceList.length > 0 &&
        <StorePage storeInfo={storeInfo} select={select} setSelect={setSelect} payInfo={payInfo} setPayInfo={setPayInfo}/>
      }
    </>
  )

}

export default index
