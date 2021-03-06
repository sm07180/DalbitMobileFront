import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Api from 'context/api'

// global components
import Header from 'components/ui/header/Header'

// components
import Tabmenu from '../../components/tabmenu'
import FilterBtn from '../../components/FilterBtn'
import SettingList from '../../components/SettingList'

import '../../style.scss'
import './manager.scss'
import useChange from "components/hooks/useChange";
import _ from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const SettingManager = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const tabmenu = ['관리', '등록']
  const filter = ['전체','닉네임','ID']
  const [tabType, setTabType] = useState(tabmenu[0])
  const [managerList, setManagerList] = useState([])
  const {changes, setChanges, onChange} = useChange({onChange: -1})
  const [filterTextType, setFilterTextType] = useState(filter[0]);
  const [searchPageInfo, setSearchPageInfo] = useState({list: [], paging: {next: 2, page: 1, prev: 0, records: 40, total: 0, totalPage: 0}});
  const [searchPaging, setSearchPaging] = useState({page: 1, records: 40});
  const [isTab, setIsTab] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  //매니저 리스트 조회
  const getManagerList = async () => {
    const res = await Api.mypage_manager_list({
      params: {page: 1, records: 20}
    })
    if(res.result === "success") {
      setManagerList(res.data.list);
    }
  }

  //매니저 등록
  const fetchAddData = async (memNo) => {
    let params = {memNo: memNo}
    const res = await Api.mypage_manager_add({params})
    if(res.result === "success") {
      getManagerList();
      dispatch(setGlobalCtxMessage({type: "alert", msg: res.message}));
    }
  }

  //매니저 해제
  const fetchDeleteData = async (memNo) => {
    let params = {memNo: memNo}
    const res = await Api.mypage_manager_delete({params})
    if(res.result === "success") {
      getManagerList();
      dispatch(setGlobalCtxMessage({type: "alert",msg: res.message}));
    }
  }

  //검색시 회원 리스트 조회
  const fetchListData = async () => {
    if (!_.hasIn(changes, 'search') || changes.search.length === 0)
      return dispatch(setGlobalCtxMessage({type: "alert",msg: `검색어를 입력해주세요.`}))
    const params = {
      userType: filterTextType === "전체" ? 0 : filterTextType === "닉네임" ? 1 : 2,
      search: changes.search,
      searchType: "maneger",
      page: searchPaging.page,
      records: searchPaging.records
    }
    const res = await Api.mypage_user_search({params})
    if(res.result === "success") {
      setIsSearch(true);
      if(searchPaging.page !== 1) {
        let temp = [];
        res.data.list.forEach((value) => {
          if(searchPageInfo.list.findIndex((target) => target.memNo === value.memNo) === -1) {
            temp.push(value);
          }
        });
        setSearchPageInfo({...res.data, list: searchPageInfo.list.concat(temp)});
      } else {
        setSearchPageInfo({list: res.data.list, paging: res.data.paging});
      }
    }
  }

  const scrollEvt = () => {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset;

    if(searchPageInfo.paging?.totalPage > searchPaging.page && windowBottom >= docHeight - 300) {//totalPage가 현재 page보다 클경우
      setSearchPaging({...searchPaging, page: searchPaging.page + 1});
      window.removeEventListener("scroll", scrollEvt);
    } else if(searchPageInfo.paging?.totalPage === searchPaging.page) {
      window.removeEventListener("scroll", scrollEvt);
    }
  }

  //엔터 시 검색
  const onKeyUp = (e) => {
    if(e.keyCode=== 13) {
      fetchListData("search");
    }
  }

  useEffect(() => {
    if(!isTab) {getManagerList()}
  }, []);

  useEffect(() => {
    if(isTab && isSearch && changes.search.length > 1 && searchPaging.page >= 1) {
      fetchListData();
    }
  }, [searchPaging]);

  useEffect(() => {
    if(isTab) {
      window.addEventListener("scroll", scrollEvt);
      return () => {
        window.removeEventListener("scroll", scrollEvt);
      }
    }
  }, [searchPageInfo, isTab]);

  useEffect(() => {
    setSearchPaging({page: 1, records: 40});
  }, [changes.search])

  return (
    <div id="manager">
      <Header position={'sticky'} title={'매니저 관리'} type={'back'}/>
      <div className='subContent'>
        <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} isTab={isTab} setIsTab={setIsTab} searchPaging={searchPaging} setSearchPaging={setSearchPaging}/>
        {tabType === tabmenu[0] ? (
          <>
            <section className="counterWrap">
              <div>등록 된 매니저<span>{managerList.length}</span></div>
            </section>
            <section className="listWrap">
              {managerList.length > 0 ? (
                <>
                  {managerList.map((item, index)=>{
                    return(
                      <SettingList data={item} key={index}>
                        <button className="delete" onClick={() => fetchDeleteData(item.memNo)}>해제</button>
                      </SettingList>
                    )
                  })}
                </>
              ) : (
                <>
                  <div className="noResult">등록된 고정 매니저가 없습니다.</div>
                </>
              )}
            </section>
          </>
        ): (
          <>
            <section className="inputWrap">
              <div className="inputBox">
                <FilterBtn filterTextType={filterTextType} setFilterTextType={setFilterTextType} setSearchPaging={setSearchPaging} searchPaging={searchPaging} data={filter} />
                <input type="text" placeholder='검색어를 입력해 보세요' name="search" onChange={onChange} onKeyUp={onKeyUp} />
                <span className="icon" onClick={() => fetchListData("search")}/>
              </div>
            </section>
            <section className="counterWrap">
              <div>검색 결과<span>{searchPageInfo.list.length}</span></div>
            </section>
            <section className="listWrap">
              {searchPageInfo.list.length > 0 ? (
                <>
                  {searchPageInfo.list.map((list, index)=>{
                    return(
                      <SettingList data={list} key={index}>
                        <button className="add" onClick={() => fetchAddData(list.memNo)}>등록</button>
                      </SettingList>
                    )
                  })}
                </>
              ) : (
                <>
                  <div className="noResult">검색된 결과가 없습니다.</div>
                </>
              )}
            </section>
          </>
        )}

      </div>
    </div>
  )
}

export default SettingManager;
