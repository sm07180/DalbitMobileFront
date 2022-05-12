import React, {useState, useEffect} from 'react'

// components
import CntTitle from '../../../components/ui/cntTitle/CntTitle';
import Tabmenu from './Tabmenu'
import SearchDjList from "pages/research/components/SearchDjList";
import SearchLiveList from "pages/research/components/SearchLiveList";
import SearchClipList from "pages/research/components/SearchClipList";
// redux
import {
  callSearchResultClipList,
  callSearchResultDjList, callSearchResultLiveList,
  setSearchResultInfo,
} from "redux/actions/search";
import {useDispatch} from "react-redux";
// css

const SearchResult = (props) => {
  const {searchParam, searchResultTabMenuList, searchResultInfo, searchResultDjInfo, searchResultLiveInfo, searchResultClipInfo} = props.searchData; // 검색할 값
  const dispatch = useDispatch();
  const [componentDidMount, setComponentDidMount] = useState(true);

  // DJ 정보 가져오기
  async function getSearchDjInfo() {
    const params = { search: searchParam, ...searchResultInfo };
    dispatch(callSearchResultDjList(params));
  }

  // 방송 정보 가져오기
  async function getSearchLiveInfo() {
    const params = { search: searchParam, ...searchResultInfo };
    dispatch(callSearchResultLiveList(params));
  }

  // 클립 정보 가져오기
  async function getSearchClipInfo() {
    const params = { search: searchParam, ...searchResultInfo, slctType: 0, dateType: 0 };
    dispatch(callSearchResultClipList(params));
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