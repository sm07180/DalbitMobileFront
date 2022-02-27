import React, {useState, useCallback, useEffect, useRef, useContext} from 'react'
import {broadcastList, deleteFan, postAddFan} from "common/api";
import {Context} from "context";
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

const SearchPage = (props) => {
  const context = useContext(Context); //context
  const dispatch = useDispatch();
  const common = useSelector(state => state.common)
  const mainState = useSelector((state) => state.main);

  const [searchVal, setSearchVal] = useState(''); // 검색 value 값
  const [searchParam, setSearchParam] = useState(''); // child로 넘길 검색 값

  const [searching, setSearching] = useState(false); // 검색 결과창 접근 여부
  const [ focusYn, setFocusYn ] = useState(false); // 인풋박스 포커스 여부
  const [djListInfo, setDjListInfo] = useState({list: []}); // 믿고 보는 DJ 정보
  const [liveListInfo, setLiveListInfo] = useState({list: [], paging: {}, totalCnt: 0}); // 지금 핫한 라이브 정보
  const [hotClipListInfo, setHotClipListInfo] = useState({ checkDate: '', list: [], totalCnt: 0, type: 0}); // 오늘 인기 있는 클립 정보
  const [newBjListInfo, setNewBjListInfo] = useState({list: [], paging: {}, totalCnt: 0}); // 방금 뭐시기 리스트

  // 믿고 보는 DJ 정보 리스트 가져오기
  const getDjListInfo = useCallback(async () => {
    const ageList = [1, 2, 3, 4].join('|');
    const gender = ['m', 'f'].join('|');

    const {result, data} = await API.getRecommendedDJ({ageList, gender})
    if (result === 'success') {
      setDjListInfo({...data});
    }
  }, []);

  // 지금 핫한 라이브 정보 리스트 가져오기
  const getLiveListInfo = useCallback(async() => {
    const {result, data} = await API.getSearchRecomend({ page: 1, listCnt: 10 });
    if (result === 'success') {
      setLiveListInfo({...data});
    }
  }, []);

  // 오늘 인기 있는 클립 정보 리스트 가져오기
  const getHopClipListInfo = useCallback(async() => {
    const {result, data} = await API.getPopularList({ page: 1, listCnt: 10 });
    if (result === 'success') {
      setHotClipListInfo({...data});
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
        setNewBjListInfo({...res.data, totalCnt: res.data.paging.total });
      }
    });
  }

  // 검색창 state 관리
  const onChange = (e) => {
    setSearchVal(e.target.value);
  };

  // 취소 버튼 이벤트
  const removeValue = () => {
    if (setSearching) {
      setSearching(false);
      setSearchVal('');
      setFocusYn(false);
    }
  }

  // 히스토리 클릭 이벤트
  const handleSearch = (value) => {
    // 최초 검색시에만 state 변경
    if (!searching) setSearching(true);

    if (value !== searchVal) setSearchVal(value.trim());

    // 검색 파라미터 SET
    setSearchParam(value.trim());
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
        context.action.alert({ msg: '검색어를 최소 두 글자 이상 입력해주세요.'});
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

  const handleFocus = () => {
    setFocusYn(true);
  };

  const handleBlur = () => {
    if (searchVal.trim().length === 0) {
      setFocusYn(false);
    }
  };

  const refreshActions = () => {
    getDjListInfo().then(r => {});
    getLiveListInfo().then(r => {});
    getHopClipListInfo().then(r => {});
    setSearchVal('');
    setSearching(false);
    getNewBjList();
    window.scrollTo(0, 0);
    dispatch(setIsRefresh(false));
  };

  useEffect(() => {
    getDjListInfo().then(r => {});
    getLiveListInfo().then(r => {});
    getHopClipListInfo().then(r => {});
    getNewBjList();
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
            <input type="text" placeholder="닉네임, 방송, 클립을 입력해주세요." value={searchVal} onChange={onChange} onKeyDown={handleSubmit}/>
          </InputItems>
          {(searchVal.length > 0 || searching) && <button className='searchCancel' onClick={removeValue}>취소</button>}
        </div>
      </Header>
      <div className='subContent'>
        {!searching && (searchVal.length === 0 ?
          <>
            {liveListInfo.list.length > 0 &&
            <section className='liveSection'>
              <CntTitle title="🔥 지금 핫한 라이브"/>
              <HotLiveList data={liveListInfo.list} nickNmKey={"nickNm"}/>
            </section>
            }
            {newBjListInfo.list.length > 0 &&
            <section className='liveSection'>
              <CntTitle title={'방금 착륙한 NEW 달린이'} />
              <HotLiveList data={newBjListInfo.list} nickNmKey={"bjNickNm"}/>
            </section>
            }
            {hotClipListInfo.list.length > 0 &&
            <section className='clipSection'>
              <CntTitle title="오늘 인기 있는 클립"/>
              <ClipList data={hotClipListInfo.list}/>
            </section>
            }
            {djListInfo.list.length > 0 &&
            <section className='djSection'>
              <CntTitle title="믿고 보는 DJ" />
              <DjList data={djListInfo.list} addAction={registFan} delAction={cancelFan}/>
            </section>
            }
          </>
          :
          <SearchHistory onInputClick={handleSearch} handleHistory={handleHistory}/>)
        }
      </div>
      

      {searching && <SearchResult searchVal={searchParam}/>}
    </div>
  );
};

export default SearchPage;