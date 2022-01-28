import React, {useContext, useEffect, useMemo, useState} from "react";
import { GlobalContext } from "context";

import Footer from "../../common/footer";
let isFooter;
const Layout = (props) => {
  const { children } = props;
  const { globalState, globalAction } = useContext(GlobalContext);
  let pathName = window.location.pathname;
  const mailboxChattingUrl = pathName.startsWith("/mailbox");
  const makeFooter = useMemo(() => {
    if (pathName === "/" || pathName === "/customer/service") {
      return <Footer />;
    }
  }, []);

  const [ pcMenuState , setPcMenuState ] = useState(false);
  useEffect(()=>{
    if( location.pathname.indexOf("/broadcast") > -1
        || location.pathname.indexOf("/clip_recoding") > -1
        || location.pathname.indexOf("/clip_upload") > -1
        || location.pathname.indexOf("/clip/") > -1
        || location.pathname.indexOf("/mailbox") > -1
    ){
      setPcMenuState(true);
    }else{
      setPcMenuState(false);
    }
  })
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
        <div className={`rightContent`}>
          <div className={"subContent"}>
            asdsads
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
