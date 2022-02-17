import React, {useEffect, useState, useContext} from 'react';

import Header from "components/ui/header/Header";
import ClipListenCore from "pages/clip/components/ClipListenCore";

import Api from "context/api";
import {Context} from "context";

import '../scss/clipDetail.scss';
import '../../../components/ui/listRow/listRow.scss';

const ClipListenPage = (props) => {
  const context = useContext(Context);

  const [searchInfo, setSearchInfo] = useState({type: 'ALL', page: 1, records: 50 });
  const [clipListenInfo, setClipListenInfo] = useState({list: [], paging: {}}); // 좋아요 리스트 정보

  // 좋아요한 클립 리스트 가져오기
  const getListData = () => {
    if (context.token.memNo === undefined) return;

    Api.getHistoryList({  memNo: context.token.memNo, slctType: 0, page: searchInfo.page, records: searchInfo.records, }).then(res => {
      if (res.code === 'C001') {
        setClipListenInfo(res.data);
      }
    })
  };

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