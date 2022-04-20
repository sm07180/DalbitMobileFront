import React, {useContext} from 'react'

import Lottie from 'react-lottie'

// global components
import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'
import {getDeviceOSTypeChk} from "common/DeviceCommon";
import {IMG_SERVER} from 'context/config'
import {RoomJoin} from "context/room";
import {Context, GlobalContext} from "context";
import {RoomValidateFromClip, RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {useHistory, withRouter} from "react-router-dom";
import DataCnt from "components/ui/dataCnt/DataCnt";

// components

// css
import '../scss/TeamRankList.scss';

const TeamRankList = (props) => {
  const {data} = props;

  const context = useContext(Context);

  const gtx = useContext(GlobalContext);

  const history = useHistory();

  const goTeamDetailPage = (e) => {

    console.log('가자 팀 페이지');
  }

  return (
    <div className="teamRankList listWrap">
      {data.map((list, index) => {
        return (
          <div className="listRow" onClick={goTeamDetailPage} key={index}>
            <div className="teamSymbol">
              <img src={`${IMG_SERVER}/team/parts/E/${list.team_bg_code}.png`} alt="" />
              <img src={`${IMG_SERVER}/team/parts/B/${list.team_edge_code}.png`} alt="" />
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
