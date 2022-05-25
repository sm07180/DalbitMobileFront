import React, {useEffect, useRef} from 'react'
import {useHistory} from 'react-router-dom'

// global components
import BadgeItems from 'components/ui/badgeItems/BadgeItems';
import GenderItems from 'components/ui/genderItems/GenderItems';
import TeamSymbol from 'components/ui/teamSymbol/TeamSymbol';
import NoResult from 'components/ui/noResult/NoResult';
import DataCnt from 'components/ui/dataCnt/DataCnt';
import {RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {useDispatch, useSelector} from "react-redux";

const LiveContents = (props) => {
  const {data, children} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const timeRankRef = useRef([]);
  let locationStateHistory = useHistory();

  const timeRankFnc = (value) => {
    const timeRankTop = value?.getBoundingClientRect().top;
    if(timeRankTop < 700 && timeRankTop > 200) {
      value.classList.add('show');
      value.classList.remove('hide');
    } else {
      value.classList.add('hide');
    }
  }

  const scrollEvent = () => {
    const timeRank1 = timeRankRef.current[0];
    const timeRank2 = timeRankRef.current[1];
    const timeRank3 = timeRankRef.current[2];
    
    if (timeRank1) timeRankFnc(timeRank1);
    if (timeRank2) timeRankFnc(timeRank2);
    if (timeRank3) timeRankFnc(timeRank3);
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollEvent)
    return () => window.removeEventListener('scroll', scrollEvent)
  }, [])

  return (
    <section className="liveContents">
      {children}
      {data && data.length > 0 ?
        <div className="liveListWrap">
          {data.map((list,index) => {
            //타임배지만 출력
            const timeBadge = list.liveBadgeList.filter((data)=> data?.text.indexOf('타임')>-1 );
            const cupidData = list.goodMem;
            const timeRank = timeBadge[0]?.text;
            let timeRankClass = "";
            switch (timeRank) {
              case "타임 1위" :
                timeRankClass = "timeRank-1";
                break;
              case "타임 2위" :
                timeRankClass = "timeRank-2";
                break;
              case "타임 3위" :
                timeRankClass = "timeRank-3";
                break;
              default : 
                timeRankClass = "";
                break;
            }
            return (
              <div className={`listRow ${timeRankClass}`}
                key={index}
                ref={e => (timeRankRef.current[index] = e)}
                onClick={() => {
                  RoomValidateFromClipMemNo(list.roomNo, list.bjMemNo, dispatch, globalState, locationStateHistory, list.bjNickNm);
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
                    <BadgeItems data={list} type={'isBadgeMultiple'} />
                    {cupidData.map((cupid, index) => {
                      return (
                        <span className={`cupidRanker cupidRanker-${cupid}`} key={index}></span>
                      )
                    })}
                  </div>
                  <div className="listItem">
                    <span className='title'>{list.title}</span>
                  </div>
                  <div className="listItem">
                    <TeamSymbol bgCode={'b002'} edgeCode={'e008'} medalCode={'m011'}/>
                    <GenderItems data={list.bjGender} />
                    <span className="nickNm">{list.bjNickNm}</span>
                  </div>
                  <div className="listItem">
                    <span className="state">
                      <DataCnt type={"totalCnt"} value={list?.totalCnt} />
                      {/* <DataCnt type={"entryCnt"} value={list?.entryCnt} /> */}
                      <DataCnt type={`${list.boostCnt > 0 ? "boostCnt" : "likeCnt"}`} value={list.likeCnt} />
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        :
        <NoResult text="리스트가 없습니다." />
      }
    </section>
  )
}

export default LiveContents;
