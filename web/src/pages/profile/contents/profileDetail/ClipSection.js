import React, {useContext} from 'react'

// global components
import ListColumn from 'components/ui/listColumn/ListColumn'
import DataCnt from 'components/ui/dataCnt/DataCnt'
import NoResult from 'components/ui/noResult/NoResult'
import {NewClipPlayerJoin} from "common/audio/clip_func";
import {Context} from "context";
import {useHistory} from "react-router-dom";

const ClipSection = (props) => {
  const { profileData, clipData, isMyProfile, webview } = props;
  const context = useContext(Context);
  const history = useHistory();

  const listenClip = (clipNo,) => {
    const clipParam = {
      clipNo: clipNo,
      gtx: context,
      history,
      webview,
    }
    NewClipPlayerJoin(clipParam)
  }

  return (
    <div className="clipSection">
      <div className="subArea">
        <div className="title">
          {isMyProfile ? '내클립' : `${profileData.nickNm}님 클립`}
        </div>
      </div>
      {clipData.list.length > 0 ?
        <div className="clipContent">
          {clipData.list.map((item, index) => {
            return (
              <ListColumn photo={item.bgImg.thumb500x500} key={index}
                          onClick={() => listenClip(item.clipNo)}
                          style={{cursor: 'pointer'}}
              >
                <div className="title">{item.title}</div>
                <div className="info">
                  <DataCnt type={`goodCnt`} value={item.goodCnt}/>
                  <DataCnt type={"replyCnt"} value={item.replyCnt}/>
                </div>
              </ListColumn>
            )
          })}
        </div>
      : clipData.list.length === 0 &&
        <NoResult />
      }
    </div>
  )
}

export default ClipSection
