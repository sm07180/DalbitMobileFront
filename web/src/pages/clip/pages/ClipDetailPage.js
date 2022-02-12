import React, {useEffect, useState, useCallback, useMemo} from 'react';
import Header from "components/ui/header/Header";
import API from "context/api";
import Swiper from "react-id-swiper";
import FilterBtn from "pages/clip/components/FilterBtn";
import {useSelector} from "react-redux";
import ClipDetailCore from "pages/clip/components/ClipDetailCore";
import {useParams} from "react-router-dom";

import '../scss/clipDetail.scss';
import '../../../components/ui/listRow/listRow.scss';
import errorImg from '../../../../src/pages/broadcast/static/img_originalbox.svg';

const ClipDetailPage = (props) => {
  const { type } = useParams();
  const isDesktop = useSelector((state)=> state.common.isDesktop); //
  const categoryType = useSelector((state)=> state.clip.categoryType); //
  const termType = useSelector((state)=> state.clip.termType); //
  const subjectType = useSelector((state)=> state.clip.subjectType); //
  const firstSubjectType = useMemo(() => (subjectType.find(row => row.value === type) || subjectType[0]), []);
  const [ clipLastInfo, setClipLastInfo] = useState({ list: [], paging: {}});
  // slctType - 정렬순서(0: 전체, 1: 최신순, 2: 인기순, 3: 선물순 4: 재생순, 5:오래된순->스페셜DJ, 6:랜덤
  // dateType - 기간 타입(0: 전체, 1: 24시간, 2: 7일)
  // subjectType - 클립 주제(null or '' - 전체,
  const [ searchInfo, setSearchInfo ] = useState({search: '', slctType: categoryType[0], dateType: termType[0], page: 1, records: 30, subjectType: firstSubjectType, });

  // 방금 떠오른 클립 리스트 가져오기
  const getClipLastList = () => {
    API.getClipList({ gender: '', djType: 0, slctType: searchInfo.slctType.index, dateType: searchInfo.dateType.index, page: searchInfo.page, records: searchInfo.records, subjectType: (searchInfo.subjectType.value || '') }).then(res => {
      if (res.code === 'C001') {
        console.log('in');
        setClipLastInfo({ list: res.data.list, paging: {...res.data.paging}});
      }
    })
  };

  const handleTermSelect = (value) => {
    const targetData = termType.find(row => row.index == value);
    setSearchInfo({...searchInfo, termType: targetData});
  };

  const handleCategorySelect = (value) => {
    const targetData = categoryType.find(row => row.index == value);
    setSearchInfo({...searchInfo, slctType: targetData});
  };

  const handleSubjectSelect = (e) => {
    const { targetValue } = e.currentTarget.dataset;
    const targetData = subjectType.find(row => row.value === targetValue);

    if (targetData !== undefined) {
      setSearchInfo({...searchInfo, subjectType: targetData});
    }
  };

  // 스와이퍼 params
  const swiperParams = {
    slidesPerView: 'auto',
  };

  useEffect(() => {
    getClipLastList();
  }, [searchInfo]);

  return (
    <div id="clipDetail">
      <Header title={`${searchInfo.subjectType.cdNm}`} type={'back'} />
      <section className="filterWrap">
        <div className="tabmenu">
          {subjectType.length > 0 &&
            <Swiper {...swiperParams}>
              {subjectType.map((data, index)=>{
                return(
                  <ul key={index}>
                    <li className={searchInfo.subjectType.value === data.value ? 'active' : ''} data-target-value={data.value} onClick={handleSubjectSelect}>{data.cdNm}</li>
                  </ul>
                )
              })}
            </Swiper>
          }
        </div>
        <div className="filterGroup">
          <FilterBtn data={searchInfo.slctType} list={categoryType} handleSelect={handleCategorySelect}/>
          <FilterBtn data={searchInfo.dateType} list={termType} handleSelect={handleTermSelect}/>
        </div>
      </section>
      <section className="detailList">
        {clipLastInfo.list.map((row, index) => {
          return (
            <ClipDetailCore item={row} key={index}/>
          );
        })}
      </section>
    </div>
  );
};

export default ClipDetailPage;