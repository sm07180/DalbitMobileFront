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
            //타임뱃지만 출력
            const timeBadge = list.liveBadgeList.filter((data)=> data?.text.indexOf('타임')>-1 );

            return (
              <div className="listRow" key={index} onClick={() => {
                RoomValidateFromClip(list.roomNo, context, locationStateHistory, list.bjNickNm);
              }}>
                <div className="photo">
                  <img src={list.bjProfImg.thumb292x292} alt="" />
                  { list.gstMemNo && <img src={list.gstProfImg.thumb292x292} className="guest" alt="" /> }
                  { list.mediaType === 'v' && <div className="video" /> }
                </div>
                <div className='listContent'>
                  <div className="listItem">
                    <BadgeItems data={list} type={'isBadge'} />
                    {/* <BadgeItems data={timeBadge} type={'liveBadgeList'} /> */}
                    {
                      //타임뱃지만 출력
                      timeBadge.length > 0 &&
                      <em
                        className={`badgeItem`}
                        style={{
                          background: `linear-gradient(to right, ${timeBadge[0].startColor}, ${timeBadge[0].endColor}`
                        }}>
                        {timeBadge[0].icon !== '' && <img src={timeBadge[0].icon} alt="뱃지아이콘" />}
                        <span>{timeBadge[0].text}</span>
                      </em>
                    }
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
