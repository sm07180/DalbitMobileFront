import React from 'react';

import Utility from "components/lib/utility";
import {useHistory} from 'react-router-dom';
import {useSelector} from "react-redux";
import {storeButtonEvent} from "components/ui/header/TitleButton";

const MydalDetail = (props) => {
  const history = useHistory();
  const memberRdx = useSelector((state)=> state.member);
  const payStoreRdx = useSelector(({payStore})=> payStore);
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {profile} = globalState;

  //충전하기 버튼
  const storeAndCharge = () => {
    storeButtonEvent({history, memberRdx, payStoreRdx});

    // if (context.customHeader['os'] === OS_TYPE['IOS']) {
    //   // return webkit.messageHandlers.openInApp.postMessage('')
    //   return history.push('/store')
    // } else {
    //   history.push('/store')
    // }
  }

  return (
    <div className="mydalDetail">
      <div className="dalCount">
        <span>달 지갑</span>
        <div>
          <span>{Utility.addComma(profile?.dalCnt)}</span>개
        </div>
      </div>
      <div className="buttonGroup">
        <button className="charge" onClick={storeAndCharge}>+ 충전하기</button>
      </div>
    </div>
  )
}

export default MydalDetail;
