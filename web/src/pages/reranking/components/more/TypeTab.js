import React from 'react';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setCache, setPaging, setRankList, setRankTopList} from "redux/actions/rank";

const TypeTab = (props) => {
  const {tab, setTab} = props;
  const history = useHistory();
  const dispatch = useDispatch();

  //타임/일간/주간/월간/연간 클릭
  const changeType = (e) => {
    const {typeTab} = e.currentTarget.dataset;
    history.replace(`/rank/list/${tab.slct}/${typeTab}`)
    setTab({...tab, type: typeTab})
    dispatch(setPaging({pageNo: 1, pagePerCnt: 20, lastPage: 1}))
    dispatch(setCache(false))
    dispatch(setRankTopList([]));
    dispatch(setRankList([]));
  }

  return (
    <div className='tabWrap'>
      <ul className="tabmenu">

        {tab.slct === "dj" &&
        <li className={tab.type === "time" ? 'active' : ''} data-type-tab={"time"} onClick={changeType}>타임</li>
        }

        {(tab.slct === "dj" || tab.slct === "fan" || tab.slct === "cupid") &&
        <li className={tab.type === "today" ? 'active' : ''} data-type-tab={"today"} onClick={changeType}>일간</li>
        }

        {(tab.slct === "dj" || tab.slct === "fan" || tab.slct === "cupid") &&
        <li className={tab.type === "week" ? 'active' : ''} data-type-tab={"week"} onClick={changeType}>주간</li>
        }

        {(tab.slct === "dj" || tab.slct === "fan") &&
        <li className={tab.type === "month" ? 'active' : ''} data-type-tab={"month"} onClick={changeType}>월간</li>
        }

        {tab.slct === "dj" &&
        <li className={tab.type === "year" ? 'active' : ''} data-type-tab={"year"} onClick={changeType}>연간</li>
        }
      </ul>
    </div>

  );
};

export default TypeTab;