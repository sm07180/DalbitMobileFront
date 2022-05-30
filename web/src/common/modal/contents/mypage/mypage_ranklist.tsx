import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { DalbitScroll } from "common/ui/dalbit_scroll";
// api
import { getFanRankList, postAddFan, deleteFan, getLikeRank } from "common/api";
// scss
import "./mypage_modal.scss";
import {useSelector} from "react-redux";

export default (props) => {
  let location = useLocation();
  let checkSearch = location.search.split("?")[1];
  // ctx && commons
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const modalState = useSelector(({modalCtx}) => modalCtx);
  const history = useHistory();
  // state
  const [tabType, setTabType] = useState<string>(
    checkSearch === "recentFan" ? "RECENTFAN" : checkSearch === "collectFan" ? "COLLECTIONFAN" : "LIKE"
  );
  const [list, setList] = useState([
    {
      nickNm: "",
      memNo: "",
      profImg: {
        thumb62x62: "",
      },
      isFan: false,
    },
  ]);
  // icons Url
  const goldMedalIcon = "https://image.dallalive.com/svg/ico_medal_gold_m@2x.png";
  const silverMedalIcon = "https://image.dallalive.com/svg/ico_medal_silver_m@2x.png";
  const bronzeMedalIcon = "https://image.dallalive.com/svg/ico_medal_bronze_m@2x.png";
  //make View
  const makeContents = () => {
    return (
      <ul className="rankList">
        {list.map((contentsItem, idx) => {
          const { nickNm, profImg, isFan, memNo } = contentsItem;
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
    return (
      <div className="innerTabWrap">
        <button className="innerTabWrap__guide">
          <img />
        </button>
        {TabButtons.map((TabItem, idx) => {
          const { id, title, returnTitle } = TabItem;
          return (
            <button
              className={`innerTabWrap__tab ${title === tabType ? "active" : ""}`}
              onClick={() => setTabType(title)}
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
    if (tabType === "RECENTFAN") {
      rankType = 0;
    } else if (tabType === "COLLECTIONFAN") {
      rankType = 1;
    }
    //fetch
    if ((tabType === "RECENTFAN" || "COLLECTIONFAN") && rankType !== undefined) {
      const { result, data } = await getFanRankList({
        memNo,
        rankType,
        page,
        records,
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
  }, [tabType]);
  // --------------------------------------------------
  return (
    <div className="fanlist-modal" onClick={(e) => e.stopPropagation()}>
      <button className="closeBtn" onClick={() => history.goBack()}></button>
      {list && (
        <DalbitScroll width={360} height={470} displayClassName="fanListWrapper fanRank">
          <div className="myModalWrap  myModalWrap--wihte">
            <div className="myModalWrap__listWrap" style={{ padding: "0px" }}>
              <h4 className="myModalWrap__title">랭킹</h4>
              {/* 컨텐츠 영역 */}
              {makeTab()}
              {makeContents()}
            </div>
          </div>
        </DalbitScroll>
      )}
    </div>
  );
};

const TabButtons = [
  { id: 0, title: "RECENTFAN", returnTitle: "최근 팬" },
  { id: 1, title: "COLLECTIONFAN", returnTitle: "누적 팬" },
  { id: 2, title: "LIKE", returnTitle: "좋아요" },
];
