import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { DalbitScroll } from "common/ui/dalbit_scroll";
// api
import { getFanRankListNew, postAddFan, deleteFan } from "common/api";
// scss
import "./mypage_modal.scss";
import {useSelector} from "react-redux";

export default (props) => {
  // ctx && commons
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const modalState = useSelector(({modal}) => modal);
  const history = useHistory();
  // state
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

  //make View
  const makeContents = () => {
    return (
      <ul className="rankList">
        {list.map((fanItem, idx) => {
          const { nickNm, isFan, memNo, profImg } = fanItem;
          return (
            <li className="rankitem" key={idx + "rankItem"}>
              <div className="thumbBox" onClick={() => history.push(`/mypage/${memNo}`)}>
                <img src={profImg[`thumb62x62`]} className="thumbBox__thumb" alt="thumb" />
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

  // api Call
  async function ToggleFan(obj: any) {
    const { isFan, memNo } = obj;
    let fetchType = isFan ? deleteFan : postAddFan;
    const { result, data } = await fetchType({
      memNo,
      records: 1000,
    });
    if (result === "success") {
      GetList();
    }
  }
  async function GetList() {
    const memNo = modalState.mypageYourMem;
    // flag
    const { result, data } = await getFanRankListNew({
      memNo,
      sortType: 2,
    });
    if (result === "success") {
      setList(data.list);
    }
  }

  // --------------------------------------------------
  useEffect(() => {
    GetList();
  }, []);
  // --------------------------------------------------
  return (
    <div className="fanlist-modal" onClick={(e) => e.stopPropagation()}>
      <button className="closeBtn" onClick={() => history.goBack()}></button>
      {list && (
        <DalbitScroll width={360} height={470} displayClassName="fanListWrapper fanRank">
          <div className="myModalWrap  myModalWrap--wihte">
            <div className="myModalWrap__listWrap" style={{ padding: "0px" }}>
              <h4 className="myModalWrap__title">팬</h4>
              {/* 컨텐츠 영역 */}
              <div className="fanlistContainer">{makeContents()}</div>
            </div>
          </div>
        </DalbitScroll>
      )}
    </div>
  );
};
