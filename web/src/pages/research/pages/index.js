import React, {useState, useCallback, useEffect, useRef} from 'react'
//context
import API from 'context/api'
// global component
import Header from 'components/ui/header/Header.js'
import CntTitle from "../../../components/ui/cntTitle/CntTitle"
import InputItems from '../../../components/ui/inputItems/InputItems'
// component
import SwiperList from '../components/SwiperList'
// contents
import SearchHistory from '../components/SearchHistory'
import SearchResult from '../components/SearchResult'
// scss
import '../style.scss'
import DjList from "pages/research/components/DjList";
import HotLiveList from "pages/research/components/HotLiveList";
import {broadcastList, getClipList} from "common/api";

const SearchPage = (props) => {
  const inputRef = useRef(); // 검색 input 관리용 ref

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
  })

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

  // 검색한 데이터 가져오기
  const getSeachData =  useCallback(async () => {
    // DJ 정보 가져오기
    const searchDjInfo = await API.member_search({params: {search: searchVal, page: 1, records: 20} });
    if (searchDjInfo.result === 'success') {
      setSearchDjInfo(searchDjInfo.data);
    }
    // 방송 정보 가져오기
    const searchLiveLinfo = await broadcastList({search: searchVal, page: 1, records: 20});
    if (searchLiveLinfo.result === 'success') {
      setSearchLiveInfo(searchLiveLinfo.data);
    }
    // 클립 정보 가져오기
    const searchClipInfo = await API.getClipList({search: searchVal, slctType: 0, dateType: 0, page: 1, records: 20});
    if (searchClipInfo.result === 'success') {
      setSearchClipInfo(searchClipInfo.data);
    }
  });
  
  // 검색창 state 관리
  const onChange = (e) => {
    setSearchVal(e.target.value);
  }

  // 검색창 out 처리
  /*const focusOut = () => {
    setSearchVal("");
  }*/

  // 검색창 초기화 처리
  const removeValue = () => {
    setSearchVal("");
  }

  const handleSubmit = (e) => {
    if (e.keyCode === 13) {
      console.log('들어오냐 슈슈슈수ㅠ슈슈ㅜ수숫 ')
      if (!searching) setSearching(true);
      setSearchParam(searchVal);
    }
  }

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
            <DjList data={djListInfo.list} />
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
        <SearchHistory/>)
      }


      {searching && <SearchResult searchVal={searchParam}/>}

    </div>
  )
}

export default SearchPage