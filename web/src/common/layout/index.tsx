import React, {useContext, useEffect, useMemo, useState} from "react";
import { GlobalContext } from "context";

import Footer from "../../common/footer";
import {useSelector} from "react-redux";

const Layout = (props) => {
  const { children } = props;
  const { globalState, globalAction } = useContext(GlobalContext);
  const isDesktop = useSelector((state)=> state.common.isDesktop)
  let pathName = window.location.pathname;
  const mailboxChattingUrl = pathName.startsWith("/mailbox");
  const makeFooter = useMemo(() => {
    if (pathName === "/" || pathName === "/customer/service") {
      return <Footer />;
    }
  }, []);


  const clipPlayState = globalState.isShowPlayer || (globalState.clipPlayer !== null && globalState.clipInfo);
  const mailBoxState = clipPlayState && mailboxChattingUrl !== true;
  const playerState = mailBoxState ? "player" : "";
  return (
    <div className="container">
      <div className="totalWrap">
        <div className={`content ${playerState}`}>
          {children}
          {makeFooter}
        </div>
        {/*<div className={`rightContent`}>
          <div className={"subContent"}>
            asdsads
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default Layout;
