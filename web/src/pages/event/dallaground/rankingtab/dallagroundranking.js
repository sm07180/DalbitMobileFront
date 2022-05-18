import React from 'react';
import {IMG_SERVER} from 'context/config'

// components
import TeamSymbol from 'components/ui/teamSymbol/TeamSymbol';
import NoResult from 'components/ui/noResult/NoResult';
import RankList from '../../components/rankList/RankList'

import '../scss/dallagroundranking.scss'

const data = [1,2,3,4,5,6,7,8,9,10,11]

const DallaGroundRanking = () => {
  return (
    <div id="dallaGroundRanking">
      <div className="myRankWrap">
        <div className='myRankBox'>
          <p>내 팀 순위</p>
          <div>24</div>
        </div>
        <div className="myRankBox">
          <p>배틀 포인트</p>
          <div>99,999</div>
        </div>
      </div>
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
          {data.length > 0 ? data.map((row, index) => {
            return (
              <RankList photoSize={0} key={index}>
                <div className="symbol">
                  {/* <TeamSymbol /> */}
                  <div className="teamSymbol">
                    <img src={`${IMG_SERVER}/team/parts/B/b003.png`} />
                    <img src={`${IMG_SERVER}/team/parts/E/e007.png`} />
                    <img src={`${IMG_SERVER}/team/parts/M/m010.png`} />
                  </div>          
                </div>
                <div className="teamName">일이삼사오육칠팔구십일일이삼사오육칠팔구십일</div>
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