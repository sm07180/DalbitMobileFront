import React, {useEffect, useState} from 'react';

import Header from "components/ui/header/Header";
import ClipListenCore from "pages/clip/components/ClipListenCore";

import Api from "context/api";

import '../scss/clipDetail.scss';
import '../../../components/ui/listRow/listRow.scss';
import Utility from "components/lib/utility";
import {useDispatch, useSelector} from "react-redux";

const ClipListenPage = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const [searchInfo, setSearchInfo] = useState({type: 'ALL', page: 1, records: 50 });
  const [clipListenInfo, setClipListenInfo] = useState({list: [], paging: {}, cnt: 0}); // 좋아요 리스트 정보

  // 좋아요한 클립 리스트 가져오기
  const getListData = () => {
    if (globalState.token.memNo === undefined) return;

    Api.getHistoryList({ ...searchInfo, memNo: globalState.token.memNo, slctType: 0 }).then(res => {
      if (res.code === 'C001' && res.data.list.length > 0) {
        if (searchInfo.page !== 1) {
          let temp =  [];
          res.data.list.forEach(value => {
            if (clipListenInfo.list.findIndex(target => target.clipNo === value.clipNo) === -1) {
              temp.push(value);
            }
          })
          setClipListenInfo({...res.data, list: clipListenInfo.list.concat(temp)});
        } else {
          setClipListenInfo({...res.data, cnt: res.data.paging.total});
        }
      }
    })
  };

  const scrollEvent = () => {
    if (clipListenInfo.cnt > searchInfo.page && Utility.isHitBottom()) {
      setSearchInfo({...searchInfo, page: searchInfo.page + 1});
      window.removeEventListener('scroll', scrollEvent);
    } else if (clipListenInfo.cnt === searchInfo.page) {
      window.removeEventListener('scroll', scrollEvent);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollEvent);
    return () => {
      window.removeEventListener('scroll', scrollEvent);
    }
  }, [clipListenInfo]);

  useEffect(() => {
    getListData();
  }, [searchInfo]);

  return (
    <div id="clipDetail">
      <Header title={`최근 들은 클립`} type={'back'} />
      <section className="detailList">
        {clipListenInfo.list.map((row, index) => {
          return (
            <ClipListenCore item={row} key={index}/>
          );
        })}
      </section>
    </div>
  );
};

export default ClipListenPage;
