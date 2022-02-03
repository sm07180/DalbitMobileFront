import React, {useContext, useEffect, useState} from "react";
import { useLocation } from "react-router-dom";

// context
import { GlobalContext } from "context";

import "../asset/scss/index.scss";
import Footer from "./footer";
import GNB from "./gnb";
import Guide from "./guide";
import ToastUI from "./toast";
import RealTimeBroadUI from "./realtime_broad";
import ImageViewer from "./image_viewer";
import MultiImageViewer from "./multi_image_viewer";
import PipPlayer from "./pip/index";
import Player from "./player";
import Navigation from "./navigation";
import {isDesktop, isDesktopViewRouter} from "../lib/agent";

const common = () => {
  const { globalState, globalAction } = useContext(GlobalContext);
  const { toastStatus, realtimeBroadStatus } = globalState;
  const { clipPlayer, clipInfo } = globalState;
  const { setImgViewerPath } = globalAction;
  const location = useLocation();

  const broadcastPage = window.location.pathname.startsWith("/broadcast");
  const clipPlayerPage = window.location.pathname.startsWith("/clip/");
  const clipMain = window.location.pathname.startsWith("/clip");
  const searchPage = window.location.pathname.startsWith("/search");
  const rankPage = window.location.pathname.startsWith("/rank");
  const storyPage = window.location.pathname.startsWith("/story");
  const eventPage = window.location.pathname.startsWith("/event_list");
  const specialdjPage = window.location.pathname.startsWith("/event_specialdj");
  const mailboxChatting = window.location.pathname.startsWith("/mailbox");
  const event = window.location.pathname.startsWith("/event");

  useEffect(() => {
    globalAction.setMultiViewer?.({ show: false }); // when location change set multiviewer hide
  }, [location]);
  const [ pcMenuState , setPcMenuState ] = useState(false);

  useEffect(()=>{
    setPcMenuState(isDesktopViewRouter());
  },[])
  return (
      <>
        <Navigation />
        {pcMenuState && <Guide />}
        <PipPlayer/>
        {globalState.imgViewerPath !== ""  && <ImageViewer path={globalState.imgViewerPath} setImgViewerPath={setImgViewerPath} />}
        {globalState.multiViewer.show && <MultiImageViewer />}
        {/* {makeFooter()} */}
        {toastStatus.status === true && <ToastUI />}
        {realtimeBroadStatus !== null && realtimeBroadStatus.status === true && <RealTimeBroadUI />}
      </>
  );
};
export default common
