import React from 'react';

import Api from "context/api";
// global components
import ListColumn from '../../../components/ui/listColumn/ListColumn';
import DataCnt from '../../../components/ui/dataCnt/DataCnt';
import NoResult from '../../../components/ui/noResult/NoResult';

import {useHistory} from "react-router-dom";
import {playClip} from "pages/clip/components/clip_play_fn";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const ClipSection = (props) => {
  const {clipData, isMyProfile, webview} = props;
  const history = useHistory();

  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const profileData = useSelector(state => state.profile);

  const listenClip = (clipNo,) => {
    const clipParams = {
      memNo: profileData.memNo,
      page: 1,
      records: 100
    }
    Api.getUploadList(clipParams).then(res => {
      if (res.result === 'success') {
        const data = res.data;

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
          globalState, dispatch,
          history,
          webview,
          playListInfoData
        }
        playClip(clipParam);
      } else {
        dispatch(setGlobalCtxMessage({type:'alert', msg: res.message }))
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
                        onClick={() => listenClip(item.clipNo)}>
              <div className="title">{item.title}</div>
              <div className="info">
                <DataCnt type="goodCnt" value={item.goodCnt}/>
                <DataCnt type="replyCnt" value={item.replyCnt}/>
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

export default ClipSection;
