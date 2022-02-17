import React, {useEffect, useState} from 'react';

import Header from "components/ui/header/Header";
import ClipLikeCore from "pages/clip/components/ClipLikeCore";

import '../scss/clipDetail.scss';
import '../../../components/ui/listRow/listRow.scss';

import Api from "context/api";
import {useDispatch, useSelector} from "react-redux";

const ClipLikePage = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const [searchInfo, setSearchInfo] = useState({type: 'ALL', page: 1, records: 50});
  const [clipLikeInfo, setClipLikeInfo] = useState({list: [], paging: {}}); // 좋아요 리스트 정보

  // 좋아요한 클립 리스트 가져오기
  const getListData = () => {
    if (globalState.token.memNo === undefined) return;

    Api.getHistoryList({
      memNo: globalState.token.memNo,
      slctType: 1,
      page: searchInfo.page,
      records: searchInfo.records,
    }).then(res => {
      if (res.code === 'C001') {
        setClipLikeInfo(res.data);
      }
    })
  };


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
