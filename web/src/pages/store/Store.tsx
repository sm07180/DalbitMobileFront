import React, {useEffect} from "react";
import {ModeTabType, ModeType, OsType,} from "../../redux/types/pay/storeType";
import StorePage from "./contents/StorePage";
import {useDispatch, useSelector} from "react-redux";
import {getIndexData, getPriceList} from "../../redux/actions/payStore";

const index = ()=>{
  const dispatch = useDispatch();
  const memberRdx = useSelector(({member}) => member);
  const payStoreRdx = useSelector(({payStore})=> payStore);

  useEffect(() => {
    if(!memberRdx.memNo){
      history.back();
      return;
    }
    dispatch(getIndexData());
  }, []);

  useEffect(() => {
    if(payStoreRdx.storeInfo.modeTab === ModeTabType.none){
      return;
    }

    const platform = payStoreRdx.storeTabInfo.find(f=>f.selected);
    if(!platform){
      return
    }
    dispatch(getPriceList(platform.modeTab));
  }, [payStoreRdx.storeTabInfo]);

  return (
    <>
      {
        payStoreRdx.storeInfo.deviceInfo.os !== OsType.Unknown &&
        payStoreRdx.storeInfo.mode !== ModeType.none &&
        <StorePage />
      }
    </>
  )

}

export default index
