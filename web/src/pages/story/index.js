import React, {useState, useContext, useEffect, useCallback, useLayoutEffect, useRef} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import Utility, {isHitBottom, addComma} from 'components/lib/utility'
import {setGlobalCtxMessage} from "redux/actions/globalCtx";
import {setInit, setData}  from "redux/actions/story";
import {useDispatch, useSelector} from "react-redux";
import {PHOTO_SERVER} from 'context/config.js'

import Api from "context/api";
import moment from "moment";

import Header from 'components/ui/header/Header'

import './style.scss'
import {initialState} from "redux/reducers/story";
let totalPage = 1;
let fetching = false;

export default () => {
  const history = useHistory()
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const story = useSelector(({story}) => story);
  const reduxClearFlagRef = useRef(false);

  const nowDay = moment();

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

  function delList(roomNo, storyIdx) {
    Api.getStoryBoxDel({roomNo, storyIdx}).then((res) => {
      const {result, message} = res
      if (result === 'success') {
        dispatch(setGlobalCtxMessage({type:"alert",
          msg: "사연을 삭제했습니다.",
          callback: () => {
            // getList();
            dispatch(setData({list: story.list.concat([]).filter((v)=> v.idx !== storyIdx) }));
          }
        }))
      } else {
        
        dispatch(setGlobalCtxMessage({type:"alert",
          title: 'Error',
          msg: message
        }))
      }
    })
  }

  const delAction = (roomNo, storyIdx) => {
    const TypeChangeRoomNo = String(roomNo);
    const TypeChangeStoryIdx = parseInt(storyIdx);
    delList(TypeChangeRoomNo, TypeChangeStoryIdx);
  }

  const scrollEvtHdr = () => {
    if (!fetching && totalPage > story.pageInfo.pageNo && Utility.isHitBottom()) {
      getList(story.pageInfo.pageNo + 1);
    }
  }

  // 프로필 이동
  const goLink = (memNo) => {
    reduxClearFlagRef.current = true;
    dispatch(setData({backFlag : true}));
    history.push(`/profile/${memNo}`)
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
      <div className='content'>
        {
          // storyList.length > 0 ?
          story.list.length > 0 ?
            <>
              <p className='reference'>※ 최근 3개월 내역만 볼 수 있습니다.</p>
              <div className='storyWrap'>
                {
                  story.list.map((story, index) => {
                    const {writer_mem_id, writer_mem_profile, writer_mem_nick, write_date, room_no, writer_no, contents, idx} = story;
                    const ago3Months =  moment(nowDay).subtract(3, 'months');
                    const writeDate =  moment(write_date);
                    if(moment(writeDate).isAfter(ago3Months)) {
                      return (
                        <div className='storyList' key={index}>
                          <div className='thumbnail' onClick={() => {goLink(`${writer_no}`)}}>
                            <img src={`${PHOTO_SERVER}${writer_mem_profile}`} alt=""/>
                          </div>
                          <div className='listContent'>
                            <div className='dataInfo'>
                              <div className='infoWrap'>
                                <div className='userNick' onClick={() => {goLink(`${writer_no}`)}}>{writer_mem_nick}</div>
                                <div className='writeTime'>{moment(write_date).format('YYYY.MM.DD HH:mm')}</div>
                              </div>
                              <div className='delBtnWrap'>
                                <span className='delBtn' onClick={() => {delAction(room_no, idx)}}>삭제</span>
                              </div>
                            </div>
                            <div className='messageWrap'>
                              {contents}
                            </div>
                          </div>
                        </div>
                      )
                    }
                  })
                }
              </div>
            </>
           :
            <div className='listNone'>
              <p className='mainText'>받은 사연이 없어요</p>
              <p className='subText'>최근 3개월 내역만 볼 수 있어요</p>
            </div>
        }
      </div>
    </div>
  )
}
