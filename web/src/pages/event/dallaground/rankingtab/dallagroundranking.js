import React, {useState} from 'react';
import {useHistory} from 'react-router-dom'
import {useSelector} from "react-redux";
import {IMG_SERVER} from 'context/config'

// components
import TeamSymbol from 'components/ui/teamSymbol/TeamSymbol';
import NoResult from 'components/ui/noResult/NoResult';
import RankList from '../../components/rankList/RankList'
import '../scss/dallagroundranking.scss'
import Utility from "components/lib/utility";

const DallaGroundRanking = (props) => {
  const { rankingListInfo, myTeamInfo, goTeamDetailPage } = props;

const DallaGroundRanking = () => {
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();

  const [team, setTeam] = useState(false);

  return (
    <div id="dallaGroundRanking">
      {globalState.token.isLogin ?
        (team === true ?
          <div className="myRankWrap">
            <div className='myRankBox'>
              <p>내 팀 순위</p>
              <div>{Utility.addComma(myTeamInfo.my_rank_no)}</div>
            </div>
            <div className="myRankBox">
              <p>배틀 포인트</p>
              <div>{Utility.addComma(myTeamInfo.rank_pt)}</div>
            </div>
          </div>
          :
          <div className="myRankWrap noTeam">
            <p>팀을 만들어 달라그라운드에 참여해보세요!</p>
          </div>
        )
        :
        <div className="myRankWrap noLogin">
          <p>로그인하고 달라그라운드에 참여해보세요!</p>
          <button onClick={() => history.push('/login')}>로그인 하기</button>
        </div>
      }

      <div className="rankingWrap">
        <div className="titleBox">
          <div className="rankNum">
            랭킹
          </div>
          <div className="symbol">
            팀 심볼
          </div>
          <div className="teamName">
            팀 명
          </div>
        </div>
        <div className="rankingBox">
          {rankingListInfo.cnt > 0 ?
            rankingListInfo.list.map((row, index) => {
              return (
                <RankList photoSize={0} key={row.team_no} listNum={index} teamClickAction={goTeamDetailPage} teamNo={row.team_no}>
                  <div className="symbol">
                     <TeamSymbol bgCode={row.team_bg_code} edgeCode={row.team_edge_code} medalCode={row.team_medal_code} />
                  </div>
                  <div className="teamName">{row.team_name}</div>
                </RankList>
              );
            })
          :
          <NoResult img={'common/listNone/listNone-profile.png'} ment={'참가자들이 dalla를 만들고 있어요!'} />
          }
        </div>
      </div>
    </div>
  );
};

export default DallaGroundRanking;