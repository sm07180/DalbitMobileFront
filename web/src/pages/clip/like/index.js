import React, {useEffect, useState, useContext} from 'react';

import Header from "components/ui/header/Header";
import ClipLikeCore from "pages/clip/components/ClipLikeCore";

import '../scss/clipDetail.scss';
import '../../../components/ui/listRow/listRow.scss';

import Api from "context/api";
import {Context} from "context";
import Utility from "components/lib/utility";

const ClipLikePage = (props) => {
  const context = useContext(Context);

  const [searchInfo, setSearchInfo] = useState({type: 'ALL', page: 1, records: 50 });
  const [clipLikeInfo, setClipLikeInfo] = useState({list: [], paging: {}, cnt: 0 }); // 좋아요 리스트 정보
  
  // 좋아요한 클립 리스트 가져오기
  const getListData = () => {
    if (context.token.memNo === undefined) return;

    Api.getHistoryList({  memNo: context.token.memNo, slctType: 1, page: searchInfo.page, records: searchInfo.records, }).then(res => {
      if (res.code === 'C001' && res.data.list.length > 0) {
        if (searchInfo.page !== 1) {
          let temp =  [];
          res.data.list.forEach(value => {
            if (clipLikeInfo.list.findIndex(target => target.clipNo === value.clipNo) === -1) {
              temp.push(value);
            }
          })
          setClipLikeInfo({...res.data, list: clipLikeInfo.list.concat(temp)});
        } else {
          setClipLikeInfo({...res.data, cnt: res.data.paging.total});
        }
      }
    })
  };

  const scrollEvent = () => {
    if (clipLikeInfo.cnt > searchInfo.page && Utility.isHitBottom()) {
      setSearchInfo({...searchInfo, page: searchInfo.page + 1});
      window.removeEventListener('scroll', scrollEvent);
    } else if (clipLikeInfo.cnt === searchInfo.page) {
      window.removeEventListener('scroll', scrollEvent);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollEvent);
    return () => {
      window.removeEventListener('scroll', scrollEvent);
    }
  }, [clipLikeInfo]);

  useEffect(() => {
    getListData();
  }, [searchInfo]);
  
  return (
    <div id="clipDetail">
      <Header title={`좋아요한 클립`} type={'back'} />
      <section className="detailList">
        {clipLikeInfo.list.map((row, index) => {
          return (
            <ClipLikeCore item={row} key={index}/>
          );
        })}
      </section>
    </div>
  );
};

export default ClipLikePage;