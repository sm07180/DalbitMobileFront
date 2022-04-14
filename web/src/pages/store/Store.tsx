import React, {useContext, useEffect} from "react";
import {ModeTabType, ModeType, OsType} from "../../redux/types/pay/storeType";
import StorePage from "./contents/StorePage";
import {useDispatch, useSelector} from "react-redux";
import {getIndexData, getPriceList, setStateHeaderVisible} from "../../redux/actions/payStore";
import {useHistory} from "react-router-dom";
import {Hybrid, isHybrid} from "../../context/hybrid";
import {Context} from "context";
import qs from 'query-string';

const index = ()=>{
  const dispatch = useDispatch();
  const history = useHistory();
  const memberRdx = useSelector(({member}) => member);
  const payStoreRdx = useSelector(({payStore})=> payStore);
  const context = useContext(Context);
  const {webview} = qs.parse(location.search);

  useEffect(() => {
    if(!memberRdx.isLogin){
      history.goBack();
      return;
    }
    dispatch(getIndexData(history.action));
    dispatch(setStateHeaderVisible(false));

    // PG사 취소버튼 누르고 돌아왔을때 뒤로가기 처리
    context.action.updateSetBack(true);
    context.action.updateBackFunction({name: 'callback'});
    context.action.updateBackEventCallback(()=>{
      if (isHybrid() && webview && webview === 'new') {
        Hybrid('CloseLayerPopup', undefined);
      }else{
        history.replace('/');
      }
    });
  }, []);

  useEffect(() => {
    if(payStoreRdx.storeInfo.modeTab === ModeTabType.none){
      return;
    }

    const platform = payStoreRdx.storeTabInfo.find(f=>f.selected);
    if(!platform || !platform.modeTab){
      return
    }
    dispatch(getPriceList(platform.modeTab));
  }, [payStoreRdx.storeTabInfo]);

  return (
    <>
      {
        payStoreRdx.storeInfo.deviceInfo?.os !== OsType.Unknown &&
        payStoreRdx.storeInfo.mode !== ModeType.none &&
        <StorePage />
      }
    </>
  )

}

export default index
