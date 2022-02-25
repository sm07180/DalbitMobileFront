import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Api from 'context/api'

// global components
import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'

// components
import Tabmenu from '../../components/tabmenu'
import FilterBtn from '../../components/FilterBtn'
import SettingList from '../../components/SettingList'

import '../../style.scss'
import './blackList.scss'
import useChange from "components/hooks/useChange";
import {Context} from "context";
import _ from "lodash";

const Settingblack = () => {
  const tabmenu = ['관리', '등록']
  const filter = ['전체','닉네임','ID']
  const [tabType, setTabType] = useState(tabmenu[0])
  const [blackList, setBlackList] = useState([])
  const {changes, setChanges, onChange} = useChange({onChange: -1})
  const [userList, setUserList] = useState([]);
  const context = useContext(Context);
  let userTypeSetting = 0;

  //차단 회원 리스트 조회
  const getblackList = async () => {
    const res = await Api.mypage_black_list({
      params: {page: 1, records: 999}
    })
    if(res.result === "success") {
      setBlackList(res.data.list);
    }
  }

  //차단회원 등록
  const fetchAddData = async (memNo) => {
    let params = {
      memNo: memNo
    }
    const res = await Api.mypage_black_add({params})
    if(res.result === "success") {
      getblackList();
      fetchListData();
      context.action.alert({msg: res.message});
    }
  }

  //차단회원 해제
  const fetchDeleteData = async (memNo) => {
    let params = {
      memNo: memNo
    }
    const res = await Api.mypage_black_delete({params})
    if(res.result === "success") {
      getblackList();
      context.action.alert({msg: res.message});
    }
  }

  //검색 데이터 출력
  const fetchListData = async (type) => {
    if (!_.hasIn(changes, 'search') || changes.search.length === 0)
      return context.action.alert({
        msg: `검색어를 입력해주세요.`
      })
    userTypeSetting = type === "search" ? Number(_.hasIn(changes, "searchType") ? changes.searchType : 0) : userTypeSetting
    const params = {
      userType: userTypeSetting,
      search: changes.search,
      searchType: "blackList",
      page: 1,
      records: 999
    }
    const res = await Api.mypage_user_search({params})
    if(res.result === "success") {
      setUserList(res.data.list);
    }
  }

  //엔터로 검색
  const onKeyUp = (e) => {
    if(e.keyCode=== 13) {
      fetchListData("search");
    }
  }

  useEffect(() => {
    getblackList()
  }, [])

  return (
    <div id="black">
      <Header position={'sticky'} title={'차단회원 관리'} type={'back'}/>
      <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} />
      {tabType === tabmenu[0] ? (
        <>
          <section className="counterWrap">
            <div>차단 회원<span>{blackList.length}</span></div>
          </section>
          <section className="listWrap">
            {blackList.length > 0 ? (
              <>
                {blackList.map((item, index)=>{
                  return(
                    <SettingList data={item} key={index}>
                      <button className="delete" onClick={() => fetchDeleteData(item.memNo)}>해제</button>
                    </SettingList>
                  )
                })}
              </>
            ) : (
              <>
                <div className="noResult">등록한 차단회원이 없습니다.</div>
              </>
            )}
          </section>
        </>
      ): (
        <>
          <section className="inputWrap">
            <div className="inputBox">
              <FilterBtn data={filter} />
              <input type="text" placeholder='검색어를 입력해 보세요' name="search" onChange={onChange} onKeyUp={onKeyUp}/>
              <span className="icon" onClick={() => fetchListData("search")}/>
            </div>
          </section>
          <section className="counterWrap">
            <div>검색 결과<span>{userList.length}</span></div>
          </section>
          <section className="listWrap">
            {userList.length > 0 ? (
              <>
                {userList.map((list, index)=>{
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
  )
}

export default Settingblack;
