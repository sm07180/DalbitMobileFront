import React from 'react'

// global components
import GenderItems from 'components/ui/genderItems/GenderItems'
import DataCnt from 'components/ui/dataCnt/DataCnt'
// components
// css
import '../scss/resultCnt.scss'
import CntTitle from "components/ui/cntTitle/CntTitle";
import errorImg from "pages/broadcast/static/img_originalbox.svg";

const SearchClipList = (props) => {
  const {data, type} = props

  const hanldeImgError = (e) => {
    e.currentTarget.src = errorImg;
  }

  return (
    <>
      <div className='searchResultWrap'>
        {data && data.length > 0 ?
          <>
            {data.map((list,index) => {
              return (
                <div className="listRow" key={index}>
                  <div className="photo">
                    <img src={list.bgImg.thumb150x150} onError={hanldeImgError} />
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
            <p>검색된 클립이 없습니다.</p>
          </div>
        }
      </div>
    </>
  );
};

export default SearchClipList;
