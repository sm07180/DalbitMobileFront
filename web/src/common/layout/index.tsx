import React, {useEffect, useMemo, useState} from "react";

import Footer from "../../common/footer";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

const Layout = (props) => {
  const {children} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const locationStateHistory = useHistory();
  const pathName = window.location.pathname;
  const mailboxChattingUrl = pathName.startsWith("/mailbox");
  const makeFooter = useMemo(() => {
    if (pathName === "/") {
      return <Footer/>;
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
        <div className={`content ${playerState}`}>
          {children}
          {makeFooter}
        </div>
      </div>
    </div>
  );
};

export default Layout;
