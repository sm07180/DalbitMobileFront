import React, {useContext} from 'react'

// global components
import ListColumn from 'components/ui/listColumn/ListColumn'
import DataCnt from 'components/ui/dataCnt/DataCnt'
import NoResult from 'components/ui/noResult/NoResult'
import {Context} from "context";
import {useHistory} from "react-router-dom";
import {playClip} from "pages/clip/components/clip_play_fn";
import Api from "context/api";

const ClipSection = (props) => {
  const { profileData, clipData, isMyProfile, webview } = props;
  const context = useContext(Context);
  const history = useHistory();

  const listenClip = (clipNo,) => {
    const clipParams = {
      memNo: profileData.memNo,
      page: 1,
      records: 100
    }
    Api.getUploadList(clipParams).then(res => {
      if (res.result === 'success') {
        const data= res.data;

        const playListInfoData = {
          myClipType: 1,
          page: 1,
          records: 100,
          memNo: profileData.memNo,
          type: 'setting'
        }

        const clipParam = {
          clipNo,
          playList: data.list,
          context,
          history,
          webview,
          playListInfoData
        }
        playClip(clipParam);
      } else {
        context.action.alert({ msg: res.message })
      }
    })
  }

  return (
    <div className="clipSection">
      {/*
        <div className="subArea">
        <div className="title">
        {isMyProfile ? '내클립' : `${profileData.nickNm}님 클립`}
        </div>
        </div>
      */}
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
