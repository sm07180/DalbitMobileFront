import React, {useContext, useEffect, useState} from 'react'

import GenderItems from 'components/ui/genderItems/GenderItems'
import DataCnt from 'components/ui/dataCnt/DataCnt'
import {useHistory} from "react-router-dom";
import Api from "context/api";
import clip from "pages/clip/static/clip.svg";
import {playClip} from "pages/clip/components/clip_play_fn";
import {useDispatch, useSelector} from "react-redux";

const MyClipListen =()=>{
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const listenTab = ['최근','좋아요','선물'];
  const [ slctType, setSlctType ] = useState(0)
  const [ listInfo, setListInfo ] = useState({ list: [], paging: {} });

  // 클립 리스트 가져오기
  const getClipList = () => {
    if (globalState.token.memNo === undefined) return;

    Api.getHistoryList({ memNo: globalState.token.memNo, slctType: slctType, page: 1, records: 100, }).then(res => {
      if ( res.code === 'C001' && res.data.paging.total > 0 ) {
        setListInfo(res.data);
      } else {
        if (listInfo.list.length > 0) setListInfo({ list: [], paging: {} });
      }
    });
  };

  const handleTabClick = (e) => {
    const { tabTarget } = e.currentTarget.dataset;

    if (tabTarget != slctType) {
      setSlctType(parseInt(tabTarget));
    }
  }

  const handleImgError = (e) => {
    e.currentTarget.src = clip;
  };

  const clipPlayHandler = (e) => {
    const { clipNo } = e.currentTarget.dataset;
    const playListInfoData = {
      slctType,
      page: 1,
      records: 100,
      memNo: globalState.token.memNo,
      type:'setting'
    }
    const clipParam = { clipNo, playList: listInfo.list, globalState, dispatch, history, playListInfoData };

    playClip(clipParam)
  };

  const goClipPage = () => {
    history.push('/clip');
  };

  useEffect(() => {
    getClipList();
  }, [slctType]);

  return(
    <>
      <ul className="tabmenu listen">
        {listenTab.map((data, index)=>{
          return(
            <li key={index} className={index === slctType ? 'active' : ''} data-tab-target={index} onClick={handleTabClick}>{data}</li>
          )
        })}
      </ul>
      <section className="listWrap">
        {listInfo.list.length > 0 ?
          listInfo.list.map((row, index) => {
            return (
              <div className="listRow" key={index} data-clip-no={row.clipNo} onClick={clipPlayHandler}>
                <div className="photo">
                  <img src={row.bgImg.url} alt={`${row.nickName}`} onError={handleImgError}/>
                </div>
                <div className="listInfo">
                  <div className="listItem">
                    <span className="title">{row.title}</span>
                  </div>
                  <div className="listItem">
                    <GenderItems data={row.gender}/>
                    <span className="nickNm">{row.nickName}</span>
                  </div>
                  <div className="listItem">
                    <DataCnt type={"listenerCnt"} value={row.playCnt}/>
                    <DataCnt type={"presentCnt"} value={row.byeolCnt}/>
                    <DataCnt type={"replyCnt"} value={row.replyCnt}/>
                    <DataCnt type={"goodCnt"} value={row.goodCnt}/>
                  </div>
                </div>
              </div>
            );
          })
          :
          <div className="empty listen">
            <p>청취 내역이 없어요<br/>지금 바로 청취해보세요!</p>
            <button onClick={goClipPage}>청취하러 가기</button>
          </div>
        }
      </section>
    </>
  )
}

export default MyClipListen
