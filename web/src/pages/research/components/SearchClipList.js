import React, {useContext} from 'react'

// global components
import GenderItems from 'components/ui/genderItems/GenderItems'
import DataCnt from 'components/ui/dataCnt/DataCnt'
// components
// css
import '../scss/resultCnt.scss'
import errorImg from "pages/broadcast/static/img_originalbox.svg";
import {NewClipPlayerJoin} from "common/audio/clip_func";
import {Context} from "context";
import {useHistory} from "react-router-dom";

const SearchClipList = (props) => {
  const {data, type} = props
  const context = useContext(Context); //context
  const history = useHistory();

  const hanldeImgError = (e) => {
    e.currentTarget.src = errorImg;
  }

  // 클립 듣기
  const playClip = (e) => {
    const { clipNo } = e.currentTarget.dataset;

    if (clipNo !== undefined) {
      const clipParam = { clipNo: clipNo, gtx: context, history };

      NewClipPlayerJoin(clipParam);
    }
  };


  return (
    <>
      <div className='searchResultWrap'>
        {data && data.length > 0 ?
          <>
            {data.map((list,index) => {
              return (
                <div className="listRow" key={index} data-clip-no={list.clipNo} onClick={playClip}>
                  <div className="photo">
                    <img src={list.bgImg.thumb292x292} onError={hanldeImgError} />
                  </div>
                  <div className='listContent'>
                    <div className="listItem">
                      <span className='subject'>{list.subjectType}</span>
                      <span className='title'>{list.title}</span>
                    </div>
                    <div className="listItem">
                      <GenderItems data={list.gender} />
                      <span className="nickNm">{list.nickName}</span>
                    </div>
                    <div className="listItem dataCtn">
                      <DataCnt type={"replyCnt"} value={list.replyCnt}/>
                      <DataCnt type={"goodCnt"} value={list.goodCnt}/>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
          :
          <div className='searchNoResult'>
            <p>검색된 클립이 없습니다.</p>
          </div>
        }
      </div>
    </>
  );
};

export default SearchClipList;
