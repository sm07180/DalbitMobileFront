import React, {useState, useEffect} from 'react'

import Api from 'context/api'
// global components
import CntTitle from '../../../components/ui/cntTitle/CntTitle';
// components
import Tabmenu from './Tabmenu'
import SearchDjList from "pages/research/components/SearchDjList";
import SearchLiveList from "pages/research/components/SearchLiveList";
import SearchClipList from "pages/research/components/SearchClipList";
import {useSelector} from "react-redux";
// css

const SearchResult = (props) => {
  const {searchVal} = props; // 검색할 값
  const tabmenu = ['전체','DJ','라이브', '클립']; // 메뉴 리스트
  const [searchData, setSearchData] = useState({search: searchVal, tabType: 0, page: 1, records: 5});
  const subjectType = useSelector((state)=> state.clip.subjectType); // 검색 조건

  const [searchDjInfo, setSearchDjInfo] = useState({list: [], paging: { next: 0, page: 0, prev: 0, records: 0, total: 0, totalPage: 0 }}); // 믿고 보는 DJ 정보
  const [searchLiveInfo, setSearchLiveInfo] = useState({list: [], paging: { next: 0, page: 0, prev: 0, records: 0, total: 0, totalPage: 0 }}); // 지금 핫한 라이브 정보
  const [searchClipInfo, setSearchClipInfo] = useState({list: [], paging: { next: 0, page: 0, prev: 0, records: 0, total: 0, totalPage: 0 }}); // 오늘 인기 있는 클립 정보

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
  }
  // DJ 정보 가져오기
  async function getSearchDjInfo() {
    const res = await Api.member_search({ params: { ...searchData } });
    if (res.result === 'success' && res.code === 'C001') {
      if (searchData.page !== 1) {
        let temp =  [];
        res.data.list.forEach(value => {
          if (searchDjInfo.list.findIndex(target => target.memNo === value.memNo) === -1) {
            temp.push(value);
          }
        });
        setSearchDjInfo({...res.data, list: searchDjInfo.list.concat(temp)});
      } else {
        setSearchDjInfo({...res.data });
      }
    } else {
      if (searchData.page === 1) {
        setSearchDjInfo({list: [], paging: { next: 0, page: 0, prev: 0, records: 0, total: 0, totalPage: 0 }});
      }
    }
  }

  // 방송 정보 가져오기
  async function getSearchLiveInfo() {
    const res = await Api.broad_list({ params: { ...searchData, } });
    if (res.result === 'success' && res.code === 'C001') {
      if (searchData.page !== 1) {
        let temp =  [];
        res.data.list.forEach(value => {
          if (searchLiveInfo.list.findIndex(target => target.memNo === value.memNo) === -1) {
            temp.push(value);
          }
        })
        setSearchLiveInfo({...res.data, list: searchLiveInfo.list.concat(temp)});
      } else {
        setSearchLiveInfo({...res.data});
      }
    } else {
      if (searchData.page === 1) {
        setSearchLiveInfo({list: [], paging: { next: 0, page: 0, prev: 0, records: 0, total: 0, totalPage: 0 }});
      }
    }
  }

  // 클립 정보 가져오기
  async function getSearchClipInfo() {
    const res = await Api.getClipList({ ...searchData, slctType: 0, dateType: 0, });
    if (res.result === 'success' && res.code === 'C001') {
      let tempList = res.data.list;
      tempList.map((value, index) => {
        tempList[index].subjectType = chagneSubject(value.subjectType);
      });

      if (searchData.page !== 1) {
        let temp =  [];
        tempList.forEach(value => {
          if (searchClipInfo.list.findIndex(target => target.memNo === value.memNo) === -1) {
            temp.push(value);
          }
        })
        setSearchClipInfo({...res.data, list: searchClipInfo.list.concat(temp)});
      } else {
        setSearchClipInfo({...res.data, list: tempList });
      }
    } else {
      if (searchData.page === 1) {
        setSearchClipInfo({list: [], paging: { next: 0, page: 0, prev: 0, records: 0, total: 0, totalPage: 0 }});
      }
    }
  }

  // 탭 변경 이벤트
  const handleTabmenu = (value) => {
    if (value !== undefined) {
      setSearchData({...searchData, tabType: parseInt(value), records: (value == 0 ? 5 : 7), page: 1});
    }
  };

  // 더보기 클릭 이벤트
  const handleButton = (e) => {
    const { tabType } = e.currentTarget.dataset;
    if (searchData.tabType != tabType) {
      setSearchData({...searchData, tabType: parseInt(tabType), records: 50, page: 1});
    }
  }

  // 여기서부터 비효율의 끝판 소스 시작
  const scrollDjList = () => {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;

    if (searchDjInfo.paging.total > searchData.page && windowBottom >= docHeight - 300) {
      setSearchData({...searchData, page: searchData.page + 1})
      window.removeEventListener('scroll', scrollDjList)
    } else if (searchDjInfo.paging.total === searchData.page) {
      window.removeEventListener('scroll', scrollDjList)
    }
  }

  const scrollLiveList = () => {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;

    if (searchLiveInfo.paging.total > searchData.page && windowBottom >= docHeight - 300) {
      setSearchData({...searchData, page: searchData.page + 1})
      window.removeEventListener('scroll', scrollLiveList)
    } else if (searchLiveInfo.paging.total === searchData.page) {
      window.removeEventListener('scroll', scrollLiveList)
    }
  }

  const scrollClipList = () => {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;

    if (searchClipInfo.paging.total > searchData.page && windowBottom >= docHeight - 300) {
      setSearchData({...searchData, page: searchData.page + 1})
      window.removeEventListener('scroll', scrollClipList)
    } else if (searchClipInfo.paging.total === searchData.page) {
      window.removeEventListener('scroll', scrollClipList)
    }
  }


  useEffect(() => {
    if (searchData.tabType === 0 || searchData.tabType === 1) {
      getSearchDjInfo();
    }
    if (searchData.tabType === 0 || searchData.tabType === 2) {
      getSearchLiveInfo();
    }
    if (searchData.tabType === 0 || searchData.tabType === 3) {
      getSearchClipInfo();
    }
  }, [searchData])

  useEffect(() => {
    if (searchData.tabType === 1) {
      window.addEventListener('scroll', scrollDjList);
    } else {
      window.removeEventListener('scroll', scrollDjList);
    }
    return () => {
      window.removeEventListener('scroll', scrollDjList);
    }
  }, [searchDjInfo]);

  useEffect(() => {
    if (searchData.tabType === 2) {
      window.addEventListener('scroll', scrollLiveList);
    } else {
      window.removeEventListener('scroll', scrollLiveList);
    }
    return () => {
      window.removeEventListener('scroll', scrollLiveList);
    }
  }, [searchLiveInfo]);

  useEffect(() => {
    if (searchData.tabType === 3) {
      window.addEventListener('scroll', scrollClipList);
    } else {
      window.removeEventListener('scroll', scrollClipList);
    }
    return () => {
      window.removeEventListener('scroll', scrollClipList);
    }
  }, [searchClipInfo]);
  // 여기까지가 비효율의 끝판 소스

  useEffect(() => {
    setSearchData({search: searchVal, tabType: 0, page: 1, records: 5});
  }, [searchVal]);
  return (
    <>
      <Tabmenu tabList={tabmenu} targetIndex={searchData.tabType} changeAction={handleTabmenu}/>
      {(searchData.tabType === 0 || searchData.tabType === 1) &&
      <section className={`djResult`}>
        <CntTitle title={'DJ'}>
          {(searchDjInfo.list.length > 0 && searchDjInfo.list.length < searchDjInfo.paging.total && searchData.tabType !== 1) && <button data-tab-type="1" onClick={handleButton}>더보기</button>}
        </CntTitle>
        <SearchDjList data={searchDjInfo.list} />
      </section>
      }
      {(searchData.tabType === 0 || searchData.tabType === 2) &&
      <section className={`liveResult`}>
        <CntTitle title={'라이브'}>
          {(searchLiveInfo.list.length > 0 && searchLiveInfo.list.length < searchLiveInfo.paging.total && searchData.tabType !== 2) && <button data-tab-type="2" onClick={handleButton}>더보기</button>}
        </CntTitle>
        <SearchLiveList data={searchLiveInfo.list} />
      </section>
      }
      {(searchData.tabType === 0 || searchData.tabType === 3) &&
      <section className={`clipResult`}>
        <CntTitle title={'클립'}>
          {(searchClipInfo.list.length > 0 && searchClipInfo.list.length < searchClipInfo.paging.total && searchData.tabType !== 3) && <button data-tab-type="3" onClick={handleButton}>더보기</button>}
        </CntTitle>
        <SearchClipList data={searchClipInfo.list} />
      </section>
      }
    </>
  );
};

SearchResult.defaultProps = {
  searchVal: ''
};

export default SearchResult;