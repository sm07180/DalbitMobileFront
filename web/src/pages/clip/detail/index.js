import React, {useEffect, useState, useMemo} from 'react';
import Header from "components/ui/header/Header";
import API from "context/api";
import Swiper from "react-id-swiper";
import FilterBtn from "pages/clip/components/FilterBtn";
import {useSelector} from "react-redux";
import ClipDetailCore from "pages/clip/components/ClipDetailCore";
import {useParams} from "react-router-dom";

import '../scss/clipDetail.scss';
import '../../../components/ui/listRow/listRow.scss';
import Utility from "components/lib/utility";

const ClipDetailPage = (props) => {
  const { type } = useParams();
  const categoryType = useSelector((state)=> state.clip.categoryType); //
  const termType = useSelector((state)=> state.clip.termType); //
  const subjectType = useSelector((state)=> state.clip.subjectType); //
  const firstSubjectType = useMemo(() => (subjectType.find(row => row.value === type) || subjectType[0]), []);
  const [ clipLastInfo, setClipLastInfo ] = useState({ list: [], paging: {}, cnt: 0 });
  // slctType - 정렬순서(0: 전체, 1: 최신순, 2: 인기순, 3: 선물순 4: 재생순, 5:오래된순->스페셜DJ, 6:랜덤
  // dateType - 기간 타입(0: 전체, 1: 24시간, 2: 7일)
  // subjectType - 클립 주제(null or '' - 전체,
  const [ searchInfo, setSearchInfo ] = useState({search: '', slctType: categoryType[0], dateType: termType[0], page: 1, records: 30, subjectType: firstSubjectType, });

  const chagneSubject = (value) => {
    switch (value) {
      case '01':
        return '커버';
      case '02':
        return '작사/작곡';
      case '03':
        return '더빙';
      case '04':
        return '수다/대화';
      case '05':
        return '고민/사연';
      case '06':
        return '힐링';
      case '07':
        return '성우';
      case '08':
        return 'ASMR';
      default:
        break;
    }
  };

  // 방금 떠오른 클립 리스트 가져오기
  const getClipLastList = () => {
    API.getClipList({ gender: '', djType: 0, slctType: searchInfo.slctType.index, dateType: searchInfo.dateType.index, page: searchInfo.page, records: searchInfo.records, subjectType: (searchInfo.subjectType.value || '') }).then(res => {
      if (res.code === 'C001' && res.data.list.length > 0) {
        let tempList = res.data.list;
        tempList.map((value, index) => {
          tempList[index].subjectType = chagneSubject(value.subjectType);
        });

        if (searchInfo.page !== 1) {
          let temp =  [];
          tempList.forEach(value => {
            if (clipLastInfo.list.findIndex(target => target.clipNo === value.clipNo) === -1) {
              temp.push(value);
            }
          })
          setClipLastInfo({...res.data, list: clipLastInfo.list.concat(temp), cnt: res.data.paging.total });
        } else {
          setClipLastInfo({ ...res.data, list: tempList, cnt: res.data.paging.total });
        }
      }
    });
  };

  const handleTermSelect = (value) => {
    const targetData = termType.find(row => row.index == value);
    setSearchInfo({...searchInfo, dateType: targetData, page: 1});
  };

  const handleCategorySelect = (value) => {
    const targetData = categoryType.find(row => row.index == value);
    setSearchInfo({...searchInfo, slctType: targetData, page: 1});
  };

  const handleSubjectSelect = (e) => {
    const { targetValue } = e.currentTarget.dataset;
    const targetData = subjectType.find(row => row.value === targetValue);

    if (targetData !== undefined) {
      setSearchInfo({...searchInfo, subjectType: targetData, page: 1});
    }
  };

  const scrollEvent = () => {
    if (clipLastInfo.cnt > searchInfo.page && Utility.isHitBottom()) {
      setSearchInfo({...searchInfo, page: searchInfo.page + 1});
      window.removeEventListener('scroll', scrollEvent);
    } else if (clipLastInfo.cnt === searchInfo.page) {
      window.removeEventListener('scroll', scrollEvent);
    }
  }

  // 스와이퍼 params
  const swiperParams = {
    slidesPerView: 'auto',
  };

  useEffect(() => {
    window.addEventListener('scroll', scrollEvent);
    return () => {
      window.removeEventListener('scroll', scrollEvent);
    }
  }, [clipLastInfo]);

  useEffect(() => {
    getClipLastList();
  }, [searchInfo]);

  return (
    <div id="clipDetail">
      <Header title={`${searchInfo.subjectType.cdNm}`} type={'back'} />
      <section className="filterWrap">
        <div className="tabmenu">
          {subjectType.length > 0 &&
            <Swiper slidesPerView="auto" initialSlide={searchInfo.subjectType.sortNo}>
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