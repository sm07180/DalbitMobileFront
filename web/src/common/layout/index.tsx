import React, {useContext, useEffect, useMemo, useState} from "react";
import {GlobalContext} from "context";

import Footer from "../../common/footer";
import {useHistory} from "react-router-dom";

const Layout = (props) => {
  const { children } = props;
  const { globalState } = useContext(GlobalContext);
  const locationStateHistory = useHistory();
  const pathName = window.location.pathname;
  const mailboxChattingUrl = pathName.startsWith("/mailbox");
  const makeFooter = useMemo(() => {
    if (pathName === "/") {
      return <Footer />;
    }
  }, [pathName]);


  const clipPlayState = globalState.isShowPlayer || (globalState.clipPlayer !== null && globalState.clipInfo);
  const mailBoxState = clipPlayState && mailboxChattingUrl !== true;
  const playerState = mailBoxState ? "player" : "";
  const nonContainerPath = /\/broadcast\/|\/clip\/[0-9]/;
  const [container , setContainer] = useState("container");
  useEffect(()=>{
    if(locationStateHistory.location.pathname.search(nonContainerPath) > -1){
      setContainer("")
    }else{
      setContainer("container")
    }
  },[locationStateHistory.location])
  return (
    <div className={container}>
      <div className="totalWrap">
        <div className={`content pcType ${playerState}`}>
          {children}
          {makeFooter}
        </div>
        <div className="rightContent">
          <div className="loginBefore">
            <div className="mainText">
              <span>누구나 친구가 되는</span>
              <span>나만의 세상</span>
            </div>
            <p>로그인하고 새로운 친구들을 만나세요.</p>
            <button onClick={() => locationStateHistory.push('/login')}>로그인</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
