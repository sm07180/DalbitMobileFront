import React from 'react'

import {IMG_SERVER} from 'context/config'
import {useHistory, withRouter} from "react-router-dom";
import DataCnt from "components/ui/dataCnt/DataCnt";
import '../../scss/TeamRankList.scss';
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {setCache} from "redux/actions/rank";

const TeamRankList = (props) => {

  const {data} = props;
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();
  const dispatch = useDispatch();

  const goTeamDetailPage = (e) => {
    const { teamNo } = e.currentTarget.dataset;
    if (!globalState.token.isLogin) {
      history.push('/login');
    } else if (teamNo !== undefined) {
      dispatch(setCache(true));
      history.push(`/team/detail/${teamNo}`);
    }
  }

  return (
    <div className="teamRankList listWrap">
      {data && data.map((list, index) => {
        return (
          <div className="listRow" data-team-no={list.team_no} onClick={goTeamDetailPage} key={index}>
            <div className="teamSymbol">
              <img src={`${IMG_SERVER}/team/parts/B/${list.team_bg_code}.png`} alt="" />
              <img src={`${IMG_SERVER}/team/parts/E/${list.team_edge_code}.png`} alt="" />
              <img src={`${IMG_SERVER}/team/parts/M/${list.team_medal_code}.png`} alt="" />
            </div>
            <div className="rank">{index + 4}</div>
            <div className="listContent">
              <div className="listItem">
                <span className="nick">{list.team_name}</span>
              </div>
              <div className='listItem'>
                <DataCnt type={"point"} value={list.rank_pt}/>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
};

export default withRouter(TeamRankList);
