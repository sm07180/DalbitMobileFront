import React, {useState, useCallback, useEffect, useRef, useContext} from 'react'
//context
import API from 'context/api'
// global component
import Header from 'components/ui/header/Header.js'
import CntTitle from 'components/ui/cntTItle/CntTitle'
import InputItems from 'components/ui/inputItems/InputItems'
// component
import SwiperList from './components/SwiperList'
// contents
import SearchHistory from './components/SearchHistory'
import SearchResult from './components/SearchResult'
// scss
import './style.scss'
import DjList from "pages/research/components/DjList";
import HotLiveList from "pages/research/components/HotLiveList";
import {broadcastList, deleteFan, getClipList, postAddFan} from "common/api";
import {Context} from "context";

const SearchPage = (props) => {
  const inputRef = useRef(); // 검색 input 관리용 ref
  const context = useContext(Context); //context
  const [searchVal, setSearchVal] = useState(''); // 검색 value 값
  const [searchParam, setSearchParam] = useState(''); // child로 넘길 검색 값

  const [searching, setSearching] = useState(false);
  
  const [djListInfo, setDjListInfo] = useState({list: []}); // 믿고 보는 DJ 정보
  const [liveListInfo, setLiveListInfo] = useState({list: [], paging: {}, totalCnt: 0}); // 지금 핫한 라이브 정보
  const [hotClipListInfo, setHotClipListInfo] = useState({ checkDate: '', list: [], totalCnt: 0, type: 0}); // 오늘 인기 있는 클립 정보

  // 믿고 보는 DJ 정보 리스트 가져오기
  const getDjListInfo = useCallback(async () => {
    const ageList = [1, 2, 3, 4].join('|');
    const gender = ['m', 'f'].join('|');

    const {result, data} = await API.getRecommendedDJ({ageList, gender})
    if (result === 'success') {
      setDjListInfo({...data});
    }
  });

  // 지금 핫한 라이브 정보 리스트 가져오기
  const getLiveListInfo = useCallback(async() => {
    const {result, data} = await API.getSearchRecomend({ page: 1, records: 20 });
    if (result === 'success') {
      setLiveListInfo({...data});
    }
  });

  // 오늘 인기 있는 클립 정보 리스트 가져오기
  const getHopClipListInfo = useCallback(async() => {
    const {result, data} = await API.getPopularList({ page: 1, records: 20 });
    if (result === 'success') {
      setHotClipListInfo({...data});
    }
  });

  // 검색창 state 관리
  const onChange = (e) => {
    setSearchVal(e.target.value);
  }

  // 검색창 초기화 처리
  const removeValue = () => {
    setSearchVal("");
  }

  // 히스토리 클릭 이벤트
  const handleSearch = (value) => {
    // 최초 검색시에만 state 변경
    if (!searching) setSearching(true);

    if (value !== searchVal) setSearchVal(value);

    // 검색 파라미터 SET
    setSearchParam(value);
  }

  // 검색창 enter 눌렀을 때,
  const handleSubmit = (e) => {
    if (e.keyCode === 13) {
      // 로컬 스토리지 데이터 가져오기
      let temp = localStorage.getItem('searchList') ? localStorage.getItem('searchList').split('|') : [];

      // 최근 5개만 가져오도록 데이터 가공
      if (temp.length > 4) {
        temp = temp.slice(1);
      }
      temp.push(searchVal);

      // 로컬 스토리지 데이터 SET
      localStorage.setItem('searchList', temp.join('|'));

      handleSearch(searchVal);
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

      setDjListInfo({...djListInfo, list: temp});
      context.action.alert({ msg: '팬 등록되었습니다.'});
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

      setDjListInfo({...djListInfo, list: temp});
      context.action.alert({ msg: '팬 해제되었습니다.'});
    }
  };

  useEffect(() => {
    getDjListInfo().then(r => {});
    getLiveListInfo().then(r => {});
    getHopClipListInfo().then(r => {});
  }, [])

  return (
    <div id="searchPage">
      <Header title="검색">
        <div className='searchForm'>
          <InputItems>
            <input type="text" placeholder="닉네임, 방송, 클립을 입력해주세요." value={searchVal} onChange={onChange} onKeyDown={handleSubmit}/>
            {searchVal.length > 0 && <button className='inputDel' onClick={removeValue}/>}
          </InputItems>
          {searchVal.length > 0 && <button className='searchCancel' onClick={removeValue}>취소</button>}
        </div>
      </Header>
      {!searching && ( searchVal.length === 0 ?
        <>
          <section className='djSection'>
            <CntTitle title="믿고 보는 DJ" />
            <DjList data={djListInfo.list} addAction={registFan} delAction={cancelFan}/>
          </section>
          <section className='liveSection'>
            <CntTitle title="🔥 지금 핫한 라이브" />
            <HotLiveList data={liveListInfo.list} />
          </section>
          <section className='clipSection'>
            <CntTitle title="오늘 인기 있는 클립" />
            <SwiperList data={hotClipListInfo.list} type="clip" />
          </section>
        </>            
        :
        <SearchHistory onInputClick={handleSearch}/>)
      }


      {searching && <SearchResult searchVal={searchParam}/>}

    </div>
  )
}

export default SearchPage