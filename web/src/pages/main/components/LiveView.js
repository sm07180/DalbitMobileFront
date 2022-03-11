import React, {useContext, useEffect} from 'react'
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

  const scrollEvent = () => {
    const timeRank1 = document.getElementById('timeRankwer1st');
    const timeRank2 = document.getElementById('timeRankwer2nd');
    const timeRank3 = document.getElementById('timeRankwer3rd');
    
    if(timeRank1){
      const timeRank1Top = timeRank1?.getBoundingClientRect().top;
      if(timeRank1Top < 700) {
        timeRank1.classList.add('show');
        timeRank1.classList.remove('hide');
      } else {
        timeRank1.classList.add('hide');
      }
    }

    if(timeRank2){
      const timeRank2Top = timeRank2?.getBoundingClientRect().top;
      if(timeRank2Top < 700) {
        timeRank2.classList.add('show');
        timeRank2.classList.remove('hide');
      } else {
        timeRank2.classList.add('hide');
      }
    }

    if(timeRank3){
      const timeRank3Top = timeRank3?.getBoundingClientRect().top;
      if(timeRank3Top < 700) {
        timeRank3.classList.add('show');
        timeRank3.classList.remove('hide');
      } else {
        timeRank3.classList.add('hide');
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollEvent)
    return () => window.removeEventListener('scroll', scrollEvent)
  }, [])

  return (
    <div className="liveListWrap">
      {data && data.length > 0 ?
        <>
          {data.map((list,index) => {
            //타임뱃지만 출력
            const timeBadge = list.liveBadgeList.filter((data)=> data?.text.indexOf('타임')>-1 );
            const timeRank = timeBadge[0]?.text;
            const cupidData = list.goodMem;
            return (
              <div className={`listRow`}
                id={`${timeRank === "타임 1위" ? "timeRankwer1st" : timeRank === "타임 2위" ? "timeRankwer2nd" : timeRank === "타임 3위" ? "timeRankwer3rd" : ""}`}
                key={index}
                onClick={() => {
                  RoomValidateFromClip(list.roomNo, context, locationStateHistory, list.bjNickNm);
                }}
              >
                <div className="photo">
                  <img src={list.bjProfImg.thumb292x292} alt="" />
                  { list.gstMemNo && <img src={list.gstProfImg.thumb292x292} className="guest" alt="" /> }
                  { list.mediaType === 'v' && <div className="video" /> }
                </div>
                <div className='listContent'>
                  <div className="listItem">
                    <BadgeItems data={list} type={'isNew'} />
                    <BadgeItems data={list} type={'isBadge'} />
                    {
                      cupidData.map((cupid, index) => {
                        return (
                          <span className={`cupidRanker cupidRanker-${cupid}`} key={index}></span>
                        )
                      })
                    }
                    {/* <BadgeItems data={timeBadge} type={'liveBadgeList'} /> */}
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
