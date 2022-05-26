import React from 'react';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setCache, setPaging, setRankList, setRankTopList, setRankTopSwiperNum} from "redux/actions/rank";

const SlctTab = (props) => {
  const {tab, setTab} = props;
  const history = useHistory();
  const dispatch = useDispatch();

  //DJ, FAN, CUPID, TEAM 클릭
  const changeSclt = (e) => {
    const {slctTab} = e.currentTarget.dataset;
    if(slctTab === "team"){
      history.replace(`/rank/list/team`)
    }else {
      history.replace(`/rank/list/${slctTab}/today`)
    }
    setTab({slct: slctTab, type: "today"})
    dispatch(setRankTopSwiperNum(1));
    dispatch(setPaging({pageNo: 1, pagePerCnt: 20, lastPage: 1}))
    dispatch(setCache(false))
    dispatch(setRankTopList([]));
    dispatch(setRankList([]));
  }

  return (
    <div id="rankCategory">
      <div className="rankCategoryWrapbox">
        <div className={`rankCategoryList ${tab.slct === "dj" ? "active" : ""}`} data-slct-tab="dj" onClick={changeSclt}>DJ</div>
        <div className={`rankCategoryList ${tab.slct === "fan" ? "active" : ""}`} data-slct-tab="fan" onClick={changeSclt}>FAN</div>
        <div className={`rankCategoryList ${tab.slct === "cupid" ? "active" : ""}`} data-slct-tab="cupid" onClick={changeSclt}>CUPID</div>
        <div className={`rankCategoryList ${tab.slct === "team" ? "active" : ""}`} data-slct-tab="team" onClick={changeSclt}>TEAM</div>
        <div className="wrapboxBg"/>
        <div className="underline"/>
      </div>
    </div>
  );
};

export default SlctTab;