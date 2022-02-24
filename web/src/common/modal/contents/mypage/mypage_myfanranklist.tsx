import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { DalbitScroll } from "common/ui/dalbit_scroll";
// api
import { getFanRankList, postAddFan, deleteFan, getLikeRank } from "common/api";
// scss
import "./mypage_modal.scss";
import {useSelector} from "react-redux";

let tabFlag;

export default (props) => {
  let location = useLocation();
  let checkSearch = location.search.split("?")[1];
  // ctx && commons
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const modalState = useSelector(({modalCtx}) => modalCtx);
  const history = useHistory();
  // state
  const [controlTab, setConTrolTab] = useState({
    tabType: checkSearch === "myFanRank" ? "FANTAB" : "ALLTAB",
    subTabType: tabFlag === "ALLTAB" ? "secondTab" : "firstTab",
  });
  const [list, setList] = useState([
    {
      nickNm: "",
      memNo: "",
      profImg: {
        thumb62x62: "",
      },
      good: 0,
      giftDal: 0,
      isFan: false,
    },
  ]);
  // icons Url
  const goldMedalIcon = "https://image.dalbitlive.com/svg/ico_medal_gold_m@2x.png";
  const silverMedalIcon = "https://image.dalbitlive.com/svg/ico_medal_silver_m@2x.png";
  const bronzeMedalIcon = "https://image.dalbitlive.com/svg/ico_medal_bronze_m@2x.png";
  const moonIcon = "https://image.dalbitlive.com/svg/ico_moon_s.svg";
  const heartIcon = "https://image.dalbitlive.com/svg/ico_like_red_m.svg";
  //make View
  const makeContents = () => {
    return (
      <ul className="rankList">
        {list.map((contentsItem, idx) => {
          const { nickNm, profImg, isFan, memNo, good, giftDal } = contentsItem;
          return (
            <li className="rankitem" key={idx + "rankItem"}>
              <div className="thumbBox">
                <img src={profImg[`thumb62x62`]} className="thumbBox__thumb" alt="thumb" />
                {idx < 3 ? (
                  <img
                    className="thumbBox__medalIcon"
                    src={idx === 0 ? goldMedalIcon : idx === 1 ? silverMedalIcon : bronzeMedalIcon}
                  />
                ) : (
                  <span className={`thumbBox__rank thumbBox__rank--${idx + 1}`}>{idx + 1}</span>
                )}
              </div>
              <div className="textBox">
                <p className="textBox__nick">{nickNm}</p>
                {good && (
                  <span className="textBox__itemTxt">
                    <img src={heartIcon} alt="하트아이콘" />
                    {good}
                  </span>
                )}
                {giftDal && (
                  <span className="textBox__itemTxt">
                    <img src={moonIcon} alt="하트아이콘" />
                    {giftDal}
                  </span>
                )}
              </div>
              {memNo !== globalState.baseData.memNo ? (
                <button className={!isFan ? `plusFan` : ""} onClick={() => ToggleFan({ isFan, memNo })}>
                  {isFan ? "팬" : " +팬등록"}
                </button>
              ) : (
                <React.Fragment></React.Fragment>
              )}
            </li>
          );
        })}
      </ul>
    );
  };
  const makeTab = () => {
    let ArrayTab = TabAllButtons;
    if (controlTab.tabType === "FANTAB") {
      ArrayTab = TabFanButtons;
    }
    return (
      <div className="innerTabWrap">
        <button className="innerTabWrap__guide">
          <img />
        </button>
        {ArrayTab.map((TabItem, idx) => {
          const { id, title, returnTitle } = TabItem;
          return (
            <button
              className={`innerTabWrap__tab ${title === controlTab.subTabType ? "active" : ""}`}
              onClick={() =>
                setConTrolTab((prevState) => ({
                  ...prevState,
                  subTabType: title,
                }))
              }
              key={id + title}
            >
              {returnTitle}
            </button>
          );
        })}
      </div>
    );
  };
  const changeTabs = (title: string) => {
    setConTrolTab((prevState) => ({
      ...prevState,
      tabType: title,
    }));
  };
  const makeTitleTab = () => {
    return (
      <div className="titleTabWrap">
        {TabTittles.map((TabItem, idx) => {
          const { id, title, returnTitle } = TabItem;
          return (
            <button
              className={`titleTabWrap__tab ${title === controlTab.tabType ? "active" : ""}`}
              onClick={() => changeTabs(title)}
              key={id + title}
            >
              {returnTitle}
            </button>
          );
        })}
      </div>
    );
  };
  // api Call
  async function ToggleFan(obj: any) {
    const { isFan, memNo } = obj;
    let fetchType = isFan ? deleteFan : postAddFan;
    const { result, data } = await fetchType({
      memNo,
    });
    if (result === "success") {
      GetList();
    }
  }
  async function GetList() {
    const memNo = modalState.mypageYourMem;
    // flag
    let rankType;
    let page = 1;
    let records = 100;
    if (controlTab.tabType === "FANTAB" && controlTab.subTabType === "firstTab") {
      rankType = 0;
    } else if (controlTab.tabType === "FANTAB" && controlTab.subTabType === "secondTab") {
      rankType = 1;
    }
    //fetch
    if (controlTab.tabType === "FANTAB" && rankType !== undefined) {
      const { result, data } = await getFanRankList({
        memNo,
        rankType,
        page,
        records,
      });
      if (result === "success") {
        setList(data.list);
      }
    } else if (controlTab.tabType === "ALLTAB" && controlTab.subTabType === "firstTab") {
      const { result, data } = await getFanRankList({
        memNo,
        rankType: 1,
        page,
        records,
        rankSlct: 2,
      });
      if (result === "success") {
        setList(data.list);
      }
    } else {
      const { result, data } = await getLikeRank({
        memNo,
        page,
        records,
      });
      if (result === "success") {
        setList(data.list);
      }
    }
  }

  // --------------------------------------------------
  useEffect(() => {
    GetList();
  }, [controlTab]);
  // --------------------------------------------------
  useEffect(() => {
    if (controlTab.tabType === "ALLTAB") {
      tabFlag === "secondTab";
    } else {
      tabFlag === "firstTab";
    }
  }, [controlTab.tabType]);
  // --------------------------------------------------
  return (
    <div className="fanlist-modal" onClick={(e) => e.stopPropagation()}>
      <button className="closeBtn" onClick={() => history.goBack()}></button>
      {list && (
        <DalbitScroll width={360} height={470} displayClassName="fanListWrapper fanRank">
          <div className="myModalWrap  myModalWrap--wihte">
            <div className="myModalWrap__listWrap" style={{ padding: "0px" }}>
              {/* 컨텐츠 영역 */}
              {makeTitleTab()}
              {makeTab()}
              {makeContents()}
            </div>
          </div>
        </DalbitScroll>
      )}
    </div>
  );
};

const TabAllButtons = [
  { id: 0, title: "firstTab", returnTitle: "선물" },
  { id: 1, title: "secondTab", returnTitle: "좋아요" },
];
const TabFanButtons = [
  { id: 0, title: "firstTab", returnTitle: "최근" },
  { id: 1, title: "secondTab", returnTitle: "누적" },
];
const TabTittles = [
  { id: 0, title: "FANTAB", returnTitle: "팬 랭킹" },
  { id: 1, title: "ALLTAB", returnTitle: "전체 랭킹" },
];
