import React from 'react'

// global components
import ListColumn from 'components/ui/listColumn/ListColumn'
import DataCnt from 'components/ui/dataCnt/DataCnt'

const ClipSection = (props) => {
  const { profileData, clipData, isMyProfile } = props;

  return (
    <div className="clipSection">
      <div className="subArea">
        <div className="title">
          {isMyProfile ? '내클립' : `${profileData.nickNm}님 클립`}
        </div>
      </div>
      <div className="clipContent">
        {clipData.list.map((item, index) => {
          return (
            <ListColumn photo={item.bgImg.thumb336x336} key={index}>
              <div className="title">{item.title}</div>
              <div className="info">
                <DataCnt type={`goodCnt`} value={item.goodCnt}/>
                <DataCnt type={"replyCnt"} value={item.replyCnt}/>
              </div>
            </ListColumn>
          )
        })}
        {clipData.list.length === 0 &&
          <>클립 등록하기 해야됨</>
        }
      </div>
    </div>
  )
}

export default ClipSection
