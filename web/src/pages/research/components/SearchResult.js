import React, {useState, useEffect} from 'react'

import Api from 'context/api'
// global components
import CntTitle from '../../../components/ui/cntTitle/CntTitle';
// components
import Tabmenu from './Tabmenu'
import SearchDjList from "pages/research/components/SearchDjList";
import SearchLiveList from "pages/research/components/SearchLiveList";
import SearchClipList from "pages/research/components/SearchClipList";
// redux
import {
  setSearchResultClipList,
  setSearchResultDjList,
  setSearchResultInfo,
  setSearchResultLiveList
} from "redux/actions/search";
import {useDispatch} from "react-redux";
// css

const SearchResult = (props) => {
  const {searchParam, searchResultTabMenuList, searchResultInfo, searchResultDjInfo, searchResultLiveInfo, searchResultClipInfo} = props.searchData; // 검색할 값
  const dispatch = useDispatch();
  const [componentDidMount, setComponentDidMount] = useState(true);

  const changeSubject = (value) => {
    switch (value) {
      case '01': return '커버';
      case '02': return '작사/작곡';
      case '03': return '더빙';
      case '04': return '수다/대화';
      case '05': return '고민/사연';
      case '06': return '힐링';
      case '07': return '성우';
      case '08': return 'ASMR';
      default: break;
    }
  };

  // DJ 정보 가져오기
  async function getSearchDjInfo() {
    const res = await Api.member_search({ params: { search: searchParam, ...searchResultInfo } });
    if (res.result === 'success' && res.code === 'C001') {
      if (searchResultInfo.page !== 1) {
        let temp =  [];
        res.data.list.forEach(value => {
          if (searchResultDjInfo.list.findIndex(target => target.memNo === value.memNo) === -1) {
            temp.push(value);
          }
        });
        setSearchDjInfoFunc({...res.data, list: searchResultDjInfo.list.concat(temp)});
      } else {
        setSearchDjInfoFunc({...res.data });
      }
    } else {
      if (searchResultInfo.page === 1) {
        setSearchDjInfoFunc({list: [], paging: { next: 0, page: 0, prev: 0, records: 0, total: 0, totalPage: 0 }});
      }
    }
  }

  // 방송 정보 가져오기
  async function getSearchLiveInfo() {
    const res = await Api.broad_list({ params: { search: searchParam, ...searchResultInfo, } });
    if (res.result === 'success' && res.code === 'C001') {
      if (searchResultInfo.page !== 1) {
        let temp =  [];
        res.data.list.forEach(value => {
          if (searchResultLiveInfo.list.findIndex(target => target.memNo === value.memNo) === -1) {
            temp.push(value);
          }
        })
        setSearchLiveInfoFunc({...res.data, list: searchResultLiveInfo.list.concat(temp)});
      } else {
        setSearchLiveInfoFunc({...res.data});
      }
    } else {
      if (searchResultInfo.page === 1) {
        setSearchLiveInfoFunc({list: [], paging: { next: 0, page: 0, prev: 0, records: 0, total: 0, totalPage: 0 }});
      }
    }
  }

  // 클립 정보 가져오기
  async function getSearchClipInfo() {
    const res = await Api.getClipList({ search: searchParam, ...searchResultInfo, slctType: 0, dateType: 0, });
    if (res.result === 'success' && res.code === 'C001') {
      let tempList = res.data.list;
      tempList.map((value, index) => {
        tempList[index].subjectType = changeSubject(value.subjectType);
      });

      if (searchResultInfo.page !== 1) {
        let temp =  [];
        tempList.forEach(value => {
          if (searchResultClipInfo.list.findIndex(target => target.memNo === value.memNo) === -1) {
            temp.push(value);
          }
        })
        setSearchClipInfoFunc({...res.data, list: searchResultClipInfo.list.concat(temp)});
      } else {
        setSearchClipInfoFunc({...res.data, list: tempList });
      }
    } else {
      if (searchResultInfo.page === 1) {
        setSearchClipInfoFunc({list: [], paging: { next: 0, page: 0, prev: 0, records: 0, total: 0, totalPage: 0 }});
      }
    }
  }

  // 탭 변경 이벤트
  const handleTabmenu = (value) => {
    if (value !== undefined) {
      if(searchResultInfo.tabType === 1) {
        window.removeEventListener('scroll', scrollDjList);
      }else if(searchResultInfo.tabType === 2) {
        window.removeEventListener('scroll', scrollLiveList);
      }else if(searchResultInfo.tabType === 3) {
        window.removeEventListener('scroll', scrollClipList);
      }
      setSearchDataFunc({ ...searchResultInfo, tabType: parseInt(value), records: (value == 0 ? 5 : 50), page: 1});
    }
  };

  // 더보기 클릭 이벤트
  const handleButton = (e) => {
    const { tabType } = e.currentTarget.dataset;
    if (searchResultInfo.tabType != tabType) {
      setSearchDataFunc({...searchResultInfo, tabType: parseInt(tabType), records: 50, page: 1});
    }
  }

  // 여기서부터 비효율의 끝판 소스 시작
  const scrollDjList = () => {
    console.log('scrollDjList')
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;

    if (searchResultDjInfo.paging.total > searchResultInfo.page && windowBottom >= docHeight - 300) {
      setSearchDataFunc({...searchResultInfo, page: searchResultInfo.page + 1})
      window.removeEventListener('scroll', scrollDjList)
    } else if (searchResultDjInfo.paging.total === searchResultInfo.page) {
      window.removeEventListener('scroll', scrollDjList)
    }
  }

  const scrollLiveList = () => {
    console.log('scrollLiveList')
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;

    if (searchResultLiveInfo.paging.total > searchResultInfo.page && windowBottom >= docHeight - 300) {
      setSearchDataFunc({ ...searchResultInfo, page: searchResultInfo.page + 1})
      window.removeEventListener('scroll', scrollLiveList)
    } else if (searchResultLiveInfo.paging.total === searchResultInfo.page) {
      window.removeEventListener('scroll', scrollLiveList)
    }
  }

  const scrollClipList = () => {
    console.log('scrollClipList')
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;

    if (searchResultClipInfo.paging.total > searchResultInfo.page && windowBottom >= docHeight - 300) {
      setSearchDataFunc({ ...searchResultInfo, page: searchResultInfo.page + 1})
      window.removeEventListener('scroll', scrollClipList)
    } else if (searchResultClipInfo.paging.total === searchResultInfo.page) {
      window.removeEventListener('scroll', scrollClipList)
    }
  }

  // 검색 결과 데이터
  const setSearchDataFunc = (data) => {
    dispatch(setSearchResultInfo({...data}));
  }

  // DJ 리스트
  const setSearchDjInfoFunc = (data) => {
    dispatch(setSearchResultDjList({ ...data }));
  }

  // 라이브 리스트
  const setSearchLiveInfoFunc = (data) => {
    dispatch(setSearchResultLiveList({ ...data }));
  }

  // 클립 리스트
  const setSearchClipInfoFunc = (data) => {
    dispatch(setSearchResultClipList({ ...data }));
  }

  useEffect(() => {
    if (searchResultInfo.tabType === 0 || searchResultInfo.tabType === 1) {
      getSearchDjInfo();
    }
    if (searchResultInfo.tabType === 0 || searchResultInfo.tabType === 2) {
      getSearchLiveInfo();
    }
    if (searchResultInfo.tabType === 0 || searchResultInfo.tabType === 3) {
      getSearchClipInfo();
    }
  }, [searchResultInfo])

  useEffect(() => {
    if (searchResultInfo.tabType === 1) {
      window.addEventListener('scroll', scrollDjList);
    } else {
      window.removeEventListener('scroll', scrollDjList);
    }
    return () => {
      window.removeEventListener('scroll', scrollDjList);
    }
  }, [searchResultDjInfo]);

  useEffect(() => {
    if (searchResultInfo.tabType === 2) {
      window.addEventListener('scroll', scrollLiveList);
    } else {
      window.removeEventListener('scroll', scrollLiveList);
    }
    return () => {
      window.removeEventListener('scroll', scrollLiveList);
    }
  }, [searchResultLiveInfo]);

  useEffect(() => {
    if (searchResultInfo.tabType === 3) {
      window.addEventListener('scroll', scrollClipList);
    } else {
      window.removeEventListener('scroll', scrollClipList);
    }
    return () => {
      window.removeEventListener('scroll', scrollClipList);
    }
  }, [searchResultClipInfo]);
  // 여기까지가 비효율의 끝판 소스

  useEffect(() => {
    if(componentDidMount) {
      setComponentDidMount(false);
    }else {
      let callRecords = searchResultInfo.tabType === 0 ? 5 : 50;
      setSearchDataFunc({ tabType: searchResultInfo.tabType, page: 1, records: callRecords});
    }
  }, [searchParam]);
  return (
    <>
      <Tabmenu tabList={searchResultTabMenuList} targetIndex={searchResultInfo.tabType} changeAction={handleTabmenu}/>
      {(searchResultInfo.tabType === 0 || searchResultInfo.tabType === 1) &&
      <section className={`djResult`}>
        <CntTitle title={'DJ'}>
          {(searchResultDjInfo.list.length > 0 && searchResultDjInfo.list.length < searchResultDjInfo.paging.total && searchResultInfo.tabType !== 1) && <button data-tab-type="1" onClick={handleButton}>더보기</button>}
        </CntTitle>
        <SearchDjList data={searchResultDjInfo.list} />
      </section>
      }
      {(searchResultInfo.tabType === 0 || searchResultInfo.tabType === 2) &&
      <section className={`liveResult`}>
        <CntTitle title={'라이브'}>
          {(searchResultLiveInfo.list.length > 0 && searchResultLiveInfo.list.length < searchResultLiveInfo.paging.total && searchResultInfo.tabType !== 2) && <button data-tab-type="2" onClick={handleButton}>더보기</button>}
        </CntTitle>
        <SearchLiveList data={searchResultLiveInfo.list} />
      </section>
      }
      {(searchResultInfo.tabType === 0 || searchResultInfo.tabType === 3) &&
      <section className={`clipResult`}>
        <CntTitle title={'클립'}>
          {(searchResultClipInfo.list.length > 0 && searchResultClipInfo.list.length < searchResultClipInfo.paging.total && searchResultInfo.tabType !== 3) && <button data-tab-type="3" onClick={handleButton}>더보기</button>}
        </CntTitle>
        <SearchClipList data={searchResultClipInfo.list} />
      </section>
      }
    </>
  );
};

SearchResult.defaultProps = {
  searchParam: ''
};

export default SearchResult;