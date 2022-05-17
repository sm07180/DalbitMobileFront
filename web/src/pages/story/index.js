import React, {useState, useEffect, useLayoutEffect} from 'react'
import {useHistory} from 'react-router-dom'
import Utility, {isHitBottom} from 'components/lib/utility'
import {setInit, setData}  from "redux/actions/story";
import {useDispatch, useSelector} from "react-redux";

import Api from "context/api";

import Header from 'components/ui/header/Header'
import Tabmenu from "./component/Tabmenu";
import Story from "./component/Story";

import './style.scss'
import {initialState} from "redux/reducers/story";
let totalPage = 1;
let fetching = false;

export default () => {
  const history = useHistory()
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const story = useSelector(({story}) => story);
  
  const storyTabMenu = ['받은 사연', '사연 플러스'];  
  const [tabType, setTabType] = useState(storyTabMenu[0])
  const [storyList, setStoryList] = useState([])
  const [plusList, setPlusList] = useState([])


  const getList = async (pageNo) => {
    if(story.backFlag){
      dispatch(setData({backFlag: false}));
      return;
    }
    if(fetching){
      return;
    }

    const param = {
      pageNo: pageNo,
      pagePerCnt: story.pageInfo.pagePerCnt
    }
    fetching = true;

    const {data, result} = await Api.getStoryBoxList(param)
    if (result === 'success') {
      totalPage = Math.ceil(data.paing.total / story.pageInfo.pagePerCnt)
      if (pageNo > 1) {
        dispatch(setData({
          list: story.list.concat(data.list),
          pageInfo:{
            pageNo,
            pagePerCnt: story.pageInfo.pagePerCnt
          }
        }));
      } else {
        dispatch(setData({
          list: data.list,
          pageInfo:{
            pageNo,
            pagePerCnt: story.pageInfo.pagePerCnt
          }
        }));
      }
    } else {
      fetching = false;
    }
  };

  const scrollEvtHdr = () => {
    if (!fetching && totalPage > story.pageInfo.pageNo && Utility.isHitBottom()) {
      getList(story.pageInfo.pageNo + 1);
    }
  }

  useLayoutEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [story])

  useEffect(() => {
    if(fetching){
      fetching = false;
    }
    let receiveStoryList =  [];
    let plusStoryList =  [];

    for(let i = 0; i < story.list.length; i++) {
      if(story.list[i].plus_yn === "y"){
        plusStoryList.push(story.list[i]);
      } else {
        receiveStoryList.push(story.list[i]);
      }
    }
    setPlusList(plusStoryList);
    setStoryList(receiveStoryList);
  },[story.list])


  useEffect(() => {
    if (!globalState.token.isLogin) {
      history.push('/login');
    } else {
      getList(1);
    }
    return () => {
      if(!reduxClearFlagRef.current){
        // 리덕스 데이터를 초기화 하는 경우 (프로필 이동만 초기화 제외)
        dispatch(setInit());
      }
    };
  }, [])

  return (
    <div id="storyPage">
      <Header position={'sticky'} title="사연 보관함" type={'back'}/>
      <Tabmenu data={storyTabMenu} tab={tabType} setTab={setTabType} />
      {tabType === storyTabMenu[0] ?
        <Story data={storyList}/>
      :
        <Story data={plusList}/>
      }      
    </div>
  )
}
