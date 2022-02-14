import React, {useEffect, useState, useContext} from 'react';
import ClipDetail from "pages/clip/components/ClipDetail";
import Header from "components/ui/header/Header";
import Swiper from "react-id-swiper";
import TabBtn from "components/ui/tabBtn/TabBtn";
import FilterBtn from "pages/clip/components/FilterBtn";

import '../scss/clipDetail.scss';
import Api from "context/api";
import {Context} from "context";
import ClipLikeCore from "pages/clip/components/ClipLikeCore";
import ClipListenCore from "pages/clip/components/ClipListenCore";

const ClipDetailPage = (props) => {
  const context = useContext(Context);

  const clipTabmenu = ['ALL','커버/노래','작사/작곡','힐링','수다/대화','ASMR','고민/사연','성우','더빙'];
  const filterAlignList = ['인기순','최신순','좋아요 많은 순','재생 많은 순','받은 선물 순',];
  const filterDateList = ['전체기간','최근 7일','오늘'];
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

export default ClipDetailPage;