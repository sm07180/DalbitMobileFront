import React, {useContext} from 'react'

// global components
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
import GenderItems from 'components/ui/genderItems/GenderItems'
import DataCnt from 'components/ui/dataCnt/DataCnt'
// components
// css
import '../scss/resultCnt.scss'
import {RoomValidateFromClip, RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

const SearchLiveList = (props) => {
  const {data, pagingInfo} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();


  const RoomEnter = (e) => {
    e.preventDefault();
    const { roomNo, bjNickNm , bjMemNo } = e.currentTarget.dataset;

    if (roomNo !== undefined && bjNickNm !== undefined) {
      RoomValidateFromClipMemNo(roomNo, bjMemNo, dispatch, globalState, history, bjNickNm)
    }
  };

  return (
    <>
      <div className='searchResultWrap'>
        {data && data.length > 0 ?
          <>
            {data.map((list,index) => {
              return (
                <div className="listRow" key={index} data-room-no={list.roomNo} data-bj-mem-no={list.bjMemNo}  data-bj-nick-nm={list.bjNickNm} onClick={RoomEnter}>
                  <div className="photo">
                    <img src={list.bgImg.thumb292x292} />
                    {list.roomType === '03' && <div className="badgeVideo"/>}
                  </div>
                  <div className='listContent'>
                    <div className="listItem">
                      <BadgeItems data={list.commonBadgeList} />
                    </div>
                    <div className="listItem">
                      <span className='title'>{list.title}</span>
                    </div>
                    <div className="listItem">
                      <GenderItems data={list.gender} />
                      <span className="nickNm">{list.bjNickNm}</span>
                    </div>
                    <div className="listItem dataCtn">
                      <DataCnt type={"totalCnt"} value={list.totalCnt}/>
                      <DataCnt type={"newFanCnt"} value={list.newFanCnt}/>
                      <DataCnt type={"likeCnt"} value={list.likeCnt}/>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
          :
          <div className='searchNoResult'>
            <p>검색된 라이브가 없습니다.</p>
          </div>
        }
      </div>
    </>
  );
};

export default SearchLiveList;
