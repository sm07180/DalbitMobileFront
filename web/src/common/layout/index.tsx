import React, {useContext, useEffect, useMemo, useState} from "react";

import Footer from "../../common/footer";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

const Layout = (props) => {
  const { children } = props;
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const isDesktop = useSelector((state)=> state.common.isDesktop)
  const locationStateHistory = useHistory();
  const pathName = window.location.pathname;
  const mailboxChattingUrl = pathName.startsWith("/mailbox");
  const makeFooter = useMemo(() => {
    if (pathName === "/" || pathName === "/customer/service") {
      return <Footer />;
    }
  }, []);


  const clipPlayState = globalState.isShowPlayer || (globalState.clipPlayer !== null && globalState.clipInfo);
  const mailBoxState = clipPlayState && mailboxChattingUrl !== true;
  const playerState = mailBoxState ? "player" : "";
  const nonContainerPath = /\/broadcast\/|\/clip\//;
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
        <div className={`content ${playerState}`}>
          {children}
          {makeFooter}
        </div>
      </div>
    </div>
  );
};

export default Layout;
