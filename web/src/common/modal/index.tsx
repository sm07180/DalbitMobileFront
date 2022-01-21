import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";

import "./modal.scss";

// components
import FanList from "./contents/mypage/mypage_myfanlist";
import StarList from "./contents/mypage/mypage_starlist";
import FanRankList from "./contents/mypage/mypage_ranklist";
import MyRank from "./contents/mypage/mypage_myrank";
import UserRank from "./contents/mypage/mypage_userrank";
import MyFanRankList from "./contents/mypage/mypage_myfanranklist";
import Gift from "./contents/mypage/mypage_gift";
import ReportUser from "./contents/mypage/mypage_reportlist";
import MoneyExchange from "./contents/mypage/money_exchange";
import Service from "./contents/policy/service";
import Individual from "./contents/policy/individual_info";
import YouthProtect from "./contents/policy/youth_protect";
import Operation from "./contents/policy/operation_policy";
import Payment from "../../pages/pay/content/payment";
import PayBank from "../../pages/pay/content/pay_bank";
import PayBankWait from "../../pages/pay/content/pay_bank_wait";
import PayResult from "../../pages/pay/content/result";
import Login from "../../pages/login/content/login";
import DalExchange from "./contents/mypage/dal_exchange";
import EventRigingDetail from "../../pages/event_rising/content/detail";
import EventRigingGiftDetail from "../../pages/event_rising/content/gift-detail";
import RankReward from "./contents/rank/rank_reward";
import RankBenefit from "./contents/rank/rank_guide/benefit";
import RankGuide from "./contents/rank/rank_guide/guide";
import ProofShotPop from "./contents/event/proof_shot_pop";
import PopupclipOpen from "./contents/clip_open/clipopen";
import PopupclipEvent from "./contents/clip_event/clipevent";
import BroadCastJoin from "./contents/broadcast_join";
// import SpecialDjList from "./contents/mypage/mypage_special_list";
import BroadcastSettingTitle from "./contents/broadcast_setting/title";
import BroadcastSettingWelcome from "./contents/broadcast_setting/welcome";
import MyClipInfo from "./contents/myclip_info";
import FanEdit from "./contents/mypage/mypage_fan_edit";
import FanListNew from "./contents/mypage/mypage_fanlist";
//clip
import ClipUpload from "./contents/clip/mypage_upload";

export default function Modal() {
  const history = useHistory();
  const { type } = useParams<{ type: string }>();

  const lastLocation = useLastLocation();

  const [dragging, setDragging] = useState({
    down: false,
    move: false,
  });

  const typeRender = (type) => {
    switch (type) {
      case "fanList": {
        return <FanList />;
      }
      case "starList": {
        return <StarList />;
      }
      case "fanRankList": {
        return <FanRankList />;
      }
      case "myRank": {
        return <MyRank />;
      }
      case "userRank": {
        return <UserRank />;
      }
      case "gift": {
        return <Gift />;
      }
      case "reportUser": {
        return <ReportUser />;
      }
      case "myfanRankList": {
        return <MyFanRankList />;
      }
      // case "specialdj_list": {
      //   return <SpecialDjList />;
      // }
      case "moneyExchange":
        return <MoneyExchange />;
      case "dalExchange":
        return <DalExchange />;
      case "service":
        return <Service />;
      case "individualInfo":
        return <Individual />;
      case "youthProtect":
        return <YouthProtect />;
      case "operationPolicy":
        return <Operation />;
      case "payment":
        return <Payment />;
      case "payBank":
        return <PayBank />;
      case "payBankWait":
        return <PayBankWait />;
      case "payResult":
        return <PayResult />;
      case "login":
        return <Login />;
      case "fan_edit":
        return <FanEdit />;
      case "eventRigingDetail":
        return <EventRigingDetail />;
      case "eventRigingGiftDetail":
        return <EventRigingGiftDetail />;
      case "eventProofShot":
        return <ProofShotPop />;

      case "cilpOpen":
        return <PopupclipOpen />;
      case "cilpEvent":
        return <PopupclipEvent />;

      case "rank_reward":
        return <RankReward state={history.location.state || {}} />;
      case "rank_benefit":
        return <RankBenefit />;
      case "my_clipUpload":
        return <ClipUpload />;
      case "rank_guide":
        return <RankGuide state={history.location.state} />;
      case "broadcast_join":
        return <BroadCastJoin />;

      case "broadcast_setting_title":
        return <BroadcastSettingTitle />;
      case "broadcast_setting_welcome":
        return <BroadcastSettingWelcome />;
      case "myclip_info":
        return <MyClipInfo />;
      case "fan_list":
        return <FanListNew />;
      default: {
        throw new Error("No modal type");
      }
    }
  };

  useEffect(() => {
    const removeDefulatAndPropagation = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
    };

    if (lastLocation?.pathname !== undefined && lastLocation?.pathname.includes("/modal") === false) {
      sessionStorage.setItem("modal_previous_path", lastLocation?.pathname);
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("dragEnd", removeDefulatAndPropagation);
    return () => {
      sessionStorage.removeItem("modal_previous_path");
      document.body.style.overflow = "";
      window.removeEventListener("dragEnd", removeDefulatAndPropagation);

      // if (lastLocation?.pathname !== undefined && lastLocation?.pathname.includes("/modal") === false) {
      //   history.replace(lastLocation.pathname);
      // }
    };
  }, []);

  return (
    <div
      id="modal"
      onClick={() => {
        if (dragging.move === true) {
          setDragging({
            move: false,
            down: false,
          });
        } else {
          const previousPath = sessionStorage.getItem("modal_previous_path");
          if (previousPath !== null) {
            history.replace(previousPath);
          }
        }
      }}
      onMouseDown={() => {
        setDragging({
          ...dragging,
          down: true,
        });
      }}
      onMouseMove={() => {
        if (dragging.down === true) {
          setDragging({
            ...dragging,
            move: true,
          });
        }
      }}
      onMouseUp={() => {
        setDragging({
          ...dragging,
          down: false,
        });
      }}
    >
      <div className="content-wrap">{typeRender(type)}</div>
    </div>
  );
}
