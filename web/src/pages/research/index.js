import React, {useState, useCallback, useEffect} from 'react'
//context
import API from 'context/api'
// global component
import Header from 'components/ui/header/Header.js'
import CntTitle from 'components/ui/cntTitle/CntTitle'
import InputItems from 'components/ui/inputItems/InputItems'
// component
import SwiperList from './components/swiperList'
import SearchHistory from './components/searchHistory'
import SearchResult from './components/searchResult'
// contents
// scss
import './style.scss'

const SearchPage = (props) => {
  const [searchVal, setSearchVal] = useState('') // 검색 value 값
  const [searching, setSearching] = useState('noValue');
  const [cancelBtn, setCancelBtn] = useState(false);

  const [djSearch, setDjSearch] = useState([]) 
  const [liveSearch, setLiveSearch] = useState([]) 
  const [clipSearch, setClipSearch] = useState([]) 

  const selectedAgeArr = [1, 2, 3, 4]
  const selectedGenderArr = ['m', 'f']
  const joinChar = (state) => state.join('|')

  const fetchRecommendedDJList = useCallback(async () => {
    const ageList = joinChar(selectedAgeArr)
    const gender = joinChar(selectedGenderArr)

    const {result, data} = await API.getRecommendedDJ({ageList:1, gender:'m'})
    if (result === 'success') {
      setDjSearch(data.list);
    }
  })

  const fetchInitialList = async () => {
      const resLive = await API.getSearchRecomend({
        page: 1,
        records: 20
      })
      if (resLive.result === 'success') {
        setLiveSearch(resLive.data.list)
      }

      const resClip = await API.getPopularList({
        page: 1,
        records: 20
      })
      if (resClip.result === 'success') {
        setClipSearch(resClip.data.list)
      }
  }

  const onChange = (e) => {
    setSearchVal(e.target.value);
    if(e.target.value){
      setSearching("ing");
    } else {
      setSearching("noValue");
    }
  }

  const focusIn = () => {
    setCancelBtn(true);
  }

  const focusOut = () => {
    setCancelBtn(false);
    document.getElementById('searchInput').value = "";
    setSearching("noValue");
    setSearchVal("");
  }

  const removeValue = () => {
   document.getElementById('searchInput').value = "";
   setSearching("noValue");
   setSearchVal("");
  }

  const handleSubmit = (e) => {
    let inputVal = e.currentTarget.childNodes[0].value;
    e.preventDefault();  
    document.getElementById('searchInput').blur();
    setSearching("enter");
    setSearchVal(inputVal);
  }

  useEffect(() => {
    fetchRecommendedDJList();
    fetchInitialList();
  }, [])

  useEffect(() => {
    // fetchSearchMember();
  }, [searchVal])

  return (
    <div id="searchPage">
      <Header title="검색">
        <form className='searchForm' onSubmit={handleSubmit}>
          <InputItems>
            <input
              type="text"
              id='searchInput'
              placeholder='닉네임, 방송, 클립을 입력해주세요.'
              onChange={onChange}
              onFocus={focusIn}
              onBlur={focusOut}
            />
            {searching && <button className='inputDel' onClick={removeValue}></button>}
          </InputItems>
          {cancelBtn && <button className='searchCancel' onClick={removeValue}>취소</button>}
        </form>
      </Header>
      {searching === "noValue" ?
        <>
          <section className='djSection'>
            <CntTitle title="믿고 보는 DJ" />
            <SwiperList data={liveSearch} type="dj" />
          </section>
          <section className='liveSection'>
            <CntTitle title="🔥 지금 핫한 라이브" />
            <SwiperList data={liveSearch} type="live" />
          </section>
          <section className='clipSection'>
            <CntTitle title="오늘 인기 있는 클립" />
            <SwiperList data={clipSearch} type="clip" />
          </section>
        </>            
        : 
        searching === "ing" ?
          <SearchHistory/>
        :
        <SearchResult searchResult={searchVal}/>
      }
    </div>
  )
}

export default SearchPage