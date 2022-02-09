import React, {useContext} from 'react'

// global components
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
import GenderItems from 'components/ui/genderItems/GenderItems'
import NoResult from 'components/ui/new_noResult'
import DataCnt from 'components/ui/dataCnt/DataCnt'
import {RoomValidateFromClip} from "common/audio/clip_func";
import {Context} from "context";
import {useHistory} from "react-router-dom";

const LiveView = (props) => {
  const {data} = props
  const history = useHistory();
  const context = useContext(Context);

  return (
    <div className="liveListWrap">
      {data && data.length > 0 ?
        <>
          {data.map((list,index) => {
            return (
              <div className="listRow" key={index} onClick={() => {
                RoomValidateFromClip(list.roomNo, context, history, list.bjNickNm);
              }}>
                <div className="photo">
                  <img src={list.bjProfImg.thumb100x100} alt="" />
                </div>
                <div className='listContent'>
                  <div className="listItem">
                    <BadgeItems data={list.liveBadgeList} />
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
                      <DataCnt type={"totalCnt"} value={list.totalCnt ? list.totalCnt : "123"}/>
                      <DataCnt type={"entryCnt"} value={list.entryCnt ? list.entryCnt : "123"}/>
                      {list.boostCnt > 0 ?
                        <DataCnt type={"boostCnt"} value={list.boostCnt ? list.boostCnt : "123"}/>
                        :
                        <DataCnt type={"likeCnt"} value={list.likeCnt ? list.likeCnt : "123"}/>
                      }
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
