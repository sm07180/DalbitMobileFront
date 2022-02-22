import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'

// global components
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
import GenderItems from 'components/ui/genderItems/GenderItems'
import NoResult from 'components/ui/noResult/NoResult'
import DataCnt from 'components/ui/dataCnt/DataCnt'
import {RoomValidateFromClip} from "common/audio/clip_func";
import {Context} from "context";

const LiveView = (props) => {
  const {data} = props
  let locationStateHistory = useHistory();
  const context = useContext(Context);

  return (
    <div className="liveListWrap">
      {data && data.length > 0 ?
        <>
          {data.map((list,index) => {
            let timeRank = []
            
            for(let i = 0; i < list.liveBadgeList; i++) {
              console.log(list.liveBadgeList[i].text);
              if(list.liveBadgeList[i].text.includes('타임 2위')) {
                timeRank.concat(list.liveBadgeList[i])
              }
            }

            console.log(timeRank);

            return (
              <div className="listRow" key={index} onClick={() => {
                RoomValidateFromClip(list.roomNo, context, locationStateHistory, list.bjNickNm);
              }}>
                <div className="photo">
                  <img src={list.bjProfImg.thumb120x120} alt="" />
                  { list.gstMemNo && <img src={list.gstProfImg.thumb120x120} className="guest" alt="" /> }
                  { list.mediaType === 'v' && <div className="video" /> }
                </div>
                <div className='listContent'>
                  <div className="listItem">
                    <BadgeItems data={list} type={'isBadge'} />
                    <BadgeItems data={list} type={'liveBadgeList'} />
                  </div>
                  <div className="listItem">
                    <span className='title'>{list.title}</span>
                  </div>
                  <div className="listItem">
                    <GenderItems data={list.bjGender} />
                    <span className="nickNm">{list.bjNickNm}</span>
                  </div>
                  <div className="listItem">
                    <span className="state">
                      <DataCnt type={"totalCnt"} value={list?.totalCnt} />
                      <DataCnt type={"entryCnt"} value={list?.entryCnt} />
                      <DataCnt type={`${list.boostCnt > 0 ? "boostCnt" : "likeCnt"}`} value={list.likeCnt} />
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </>
        :
        <NoResult text={'리스트가 없습니다.'} />
      }
    </div>
  )
}

export default LiveView
