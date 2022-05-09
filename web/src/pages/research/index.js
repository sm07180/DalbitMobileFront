import React, { useCallback, useEffect, } from 'react'
import {broadcastList, deleteFan, postAddFan} from "common/api";
import {useDispatch, useSelector} from "react-redux";
import {setIsRefresh} from "redux/actions/common";

//context
import API from 'context/api';

// global component
import Header from 'components/ui/header/Header.js';
import CntTitle from 'components/ui/cntTitle/CntTitle';
import InputItems from 'components/ui/inputItems/InputItems';

// component
import ClipList from "./components/ClipList";
import DjList from "pages/research/components/DjList";
import HotLiveList from "pages/research/components/HotLiveList";

// contents
import SearchHistory from './components/SearchHistory';
import SearchResult from './components/SearchResult';

// scss
import './style.scss';
import {setGlobalCtxMessage} from "redux/actions/globalCtx";
import {
  setSearchData,
  setSearchDjList,
  setSearchHotClipList,
  setSearchLiveList,
  setSearchNewDjList
} from "redux/actions/search";
import UseInput from "common/useInput/useInput";

const LIVE_SECTION = 'liveSection';
const NEW_LIVE_SECTION = 'newLiveSection'
const CLIP_SECTION = 'clipSection';
const DJ_SECTION = 'djSection';

/* search redux 검색값 초기화 */
export const searchDataReset = ({searchData, dispatch}) => {
  dispatch(setSearchData({
    ...searchData,
    searching: false,
    searchVal: ''
  }))
}

const SearchPage = () => {
  const dispatch = useDispatch();
  const common = useSelector(state => state.common)
  const search = useSelector(state => state.search);
  const { searching, searchVal, searchParam, djListInfo, liveListInfo, hotClipListInfo, newDjListInfo } = search;

  // 믿고 보는 DJ 정보 리스트 가져오기
  const getDjListInfo = useCallback(async () => {
    const ageList = [1, 2, 3, 4].join('|');
    const gender = ['m', 'f'].join('|');

    const {result, data} = await API.getRecommendedDJ({ageList, gender})
    if (result === 'success') {
      dispatch(setSearchDjList({...data}))
    }
  }, []);

  // 지금 핫한 라이브 정보 리스트 가져오기
  const getLiveListInfo = useCallback(async() => {
    const {result, data} = await API.getSearchRecomend({ page: 1, listCnt: 10 });
    if (result === 'success') {
      dispatch(setSearchLiveList({...data}))
    }
  }, []);

  // 오늘 인기 있는 클립 정보 리스트 가져오기
  const getHopClipListInfo = useCallback(async() => {
    const {result, data} = await API.getPopularList({ page: 1, listCnt: 10 });
    if (result === 'success') {
      dispatch(setSearchHotClipList({...data}))
    }
  }, []);

  // 방금 뭐시기 리스트 가져오기
  const getNewBjList = () => {
    const param = {
      page: 1,
      mediaType: '',
      records: 10,
      roomType: '',
      searchType: 1,
      djType: 3,
      gender: ''
    }
    broadcastList(param).then(res => {
      if (res.code === 'C001') {
        dispatch(setSearchNewDjList({...res.data, totalCnt: res.data.paging.total }));
      }
    });
  }

  // 검색창 state 관리
  const setSearchVal = (value) => {
    dispatch(setSearchData({
      ...search,
      searchVal: value,
    }))
  }

  // 취소 버튼 이벤트
  const removeValue = () => {
    dispatch(setSearchData({
      ...search,
      searching: false,
      searchVal: ''
    }))
  }

  // 히스토리 클릭 이벤트
  const handleSearch = (value) => {
    dispatch(setSearchData({
      ...search,
      searchVal: value !== searchVal ? value.trim() : searchVal,
      searching: true,
      searchParam: value.trim(),
    }))
  }

  // 검색 히스토리 관리
  const handleHistory = (value) => {
    // 로컬 스토리지 데이터 가져오기
    let temp = localStorage.getItem('searchList') ? localStorage.getItem('searchList').split('|') : [];

    // 중복 데이터 삭제
    const findIdx = temp.findIndex(item => item === value);
    if (findIdx > -1) temp.splice(findIdx, 1);

    // 최근 5개만 가져오도록 데이터 가공
    if (temp.length > 4) temp = temp.slice(1);
    temp.push(value);

    // 로컬 스토리지 데이터 SET
    localStorage.setItem('searchList', temp.join('|'));
  }

  // 검색창 enter 눌렀을 때,
  const handleSubmit = (e) => {

    if (e.keyCode === 13) {
      if (searchVal.trim().length < 2) {
        dispatch(setGlobalCtxMessage({type: "alert", msg: '검색어를 최소 두 글자 이상 입력해주세요.'}));
        return;
      }

      handleHistory(searchVal);

      handleSearch(searchVal);

      e.currentTarget.blur();
    }
  }

  // 팬 등록
  const registFan = async (e) => {
    const { memNo } = e.currentTarget.dataset;

    if (memNo === undefined) return;

    const { result , code } = await postAddFan({ memNo: memNo });

    if ( result === "success" ) {
      let temp = djListInfo.list;
      const targetInd = temp.findIndex(value => value.memNo === memNo);
      temp[targetInd].isFan = true;

      dispatch(setSearchDjList({...djListInfo, list: temp}))
      dispatch(setGlobalCtxMessage({type: "alert", msg: '팬 등록되었습니다.'}));
    }
  };

  // 팬 해제
  const cancelFan = async (e) => {
    const { memNo } = e.currentTarget.dataset;

    if (memNo === undefined) return;

    const { result , code } = await deleteFan({ memNo: memNo });

    if ( result === "success" ) {
      let temp = djListInfo.list;
      const targetInd = temp.findIndex(value => value.memNo === memNo);
      temp[targetInd].isFan = false;

      dispatch(setSearchDjList({...djListInfo, list: temp}))
      dispatch(setGlobalCtxMessage({type: "alert", msg: '팬 해제되었습니다.'}));
    }
  };

  const refreshActions = () => {
    getDjListInfo().then(r => {});
    getLiveListInfo().then(r => {});
    getHopClipListInfo().then(r => {});
    searchDataReset({searchData: search, dispatch})
    getNewBjList();
    window.scrollTo(0, 0);
    dispatch(setIsRefresh(false));
  };

  // 검색 글자수 제한
  const searchInputValidator = (value) => {
    return value.length <= 50;
  }

  const swiperRefresh = (value) => {
    const swiper = document.querySelector(`#${value} .swiper-container`)?.swiper;
    swiper?.update();
    swiper?.slideTo(0);
  }

  useEffect(() => {
    if(!searching) {
      getDjListInfo().then(r => {});
      getLiveListInfo().then(r => {});
      getHopClipListInfo().then(r => {});
      getNewBjList();
    }
  }, []);

  useEffect(() => {
    if(common.isRefresh) {
      refreshActions();
    }
  }, [common.isRefresh]);

  return (
    <div id="searchPage">
      <Header title="검색">
        <div className='searchForm'>
          <InputItems>
            <UseInput placeholder="닉네임, 방송, 클립을 입력해주세요."
                      value={searchVal}
                      setValue={setSearchVal}
                      validator={searchInputValidator}
                      onKeyDown={handleSubmit}
            />
          </InputItems>
          {(searchVal.length > 0 || searching) && <button className='searchCancel' onClick={removeValue}>취소</button>}
        </div>
      </Header>
      <div className='subContent'>
        {!searching && (searchVal.length === 0 ?
          <>
            {liveListInfo.list.length > 0 &&
            <section id={LIVE_SECTION} className={LIVE_SECTION}>
              <CntTitle title="🔥 지금 핫한 라이브"/>
              <HotLiveList data={liveListInfo.list} nickNmKey={"nickNm"} swiperRefresh={swiperRefresh} section={LIVE_SECTION} />
            </section>
            }
            {newDjListInfo.list.length > 0 &&
            <section id={NEW_LIVE_SECTION} className={LIVE_SECTION}>
              <CntTitle title={'방금 착륙한 NEW 달린이'} />
              <HotLiveList data={newDjListInfo.list} nickNmKey={"bjNickNm"} swiperRefresh={swiperRefresh} section={NEW_LIVE_SECTION} />
            </section>
            }
            {hotClipListInfo.list.length > 0 &&
            <section id={CLIP_SECTION} className={CLIP_SECTION}>
              <CntTitle title="오늘 인기 있는 클립"/>
              <ClipList data={hotClipListInfo.list} swiperRefresh={swiperRefresh} section={CLIP_SECTION} />
            </section>
            }
            {djListInfo.list.length > 0 &&
            <section id={DJ_SECTION} className={DJ_SECTION}>
              <CntTitle title="믿고 보는 DJ" />
              <DjList data={djListInfo.list} addAction={registFan} delAction={cancelFan} swiperRefresh={swiperRefresh} section={DJ_SECTION} />
            </section>
            }
          </>
          :
          <SearchHistory onInputClick={handleSearch} handleHistory={handleHistory}/>)
        }
      </div>


      {searching && <SearchResult searchData={search} />}
    </div>
  );
};

export default SearchPage;
