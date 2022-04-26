import React, {useState, useContext, useEffect, useCallback, useLayoutEffect} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import Utility, {isHitBottom, addComma} from 'components/lib/utility'
import {Context} from 'context'

import Api from "context/api";
import moment from "moment";

import Header from 'components/ui/header/Header'


import './style.scss'

export default () => {
  const history = useHistory()
  const globalCtx = useContext(Context)

  const [storyList, setStoryList] = useState([]);
  const [storyPageInfo, setStoryPageInfo] = useState({pageNo: 1, pagePerCnt: 20})

  let totalPage = 1
  // 깐부 랭킹 리스트
  const getList = useCallback(async () => {
    const param = {
      pageNo: storyPageInfo.pageNo,
      pagePerCnt: storyPageInfo.pagePerCnt
    }
    const {data, result} = await Api.getStoryBoxList(param)
    if (result  === 'success') {
      totalPage = Math.ceil(data.paing.total / storyPageInfo.pagePerCnt)
      if (storyPageInfo.pageNo > 1) {
        setStoryList(storyList.concat(data.list))
      } else {
        setStoryList(data.list)
      }
    } else {
    }
  }, [storyPageInfo.pageNo])

  function delList(roomNo, storyIdx) {
    Api.getStoryBoxDel({roomNo, storyIdx}).then((res) => {
      const {result, message} = res
      if (result === 'success') {
        const filtered = storyList.filter((story) => story.storyIdx !== storyIdx)
        setStoryList(filtered)
      } else {
        globalCtx.action.alert({title: 'Error', msg: message})
      }
    })
  }

  const delAction = (roomNo, storyIdx) => {
    delList(roomNo, storyIdx);
  }

  const scrollEvtHdr = () => {
    if (totalPage > storyPageInfo.pageNo && Utility.isHitBottom()) {
      setStoryPageInfo({...storyPageInfo, pageNo: storyPageInfo.pageNo + 1} )
    }
  }

  useLayoutEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [storyPageInfo.pageNo])

  useEffect(() => {
    if (storyPageInfo.pageNo > 1) getList()
  }, [storyPageInfo.pageNo])

  const goLink = (memNo) => {    
    history.push(`/profile/${memNo}`)
  }

  useEffect(() => {
    if (!globalCtx.token.isLogin) {
      history.push('/login');
    } else {
      getList();
    }
  }, [])

  return (
    <div id="storyPage">
      <Header position={'sticky'} title="사연 보관함" type={'back'}/>
      <div className='content'>
        {
          storyList.length > 0 ?
            <>
              <p className='reference'>※ 최근 3개월 내역만 볼 수 있습니다.</p>
              <div className='storyWrap'>
                {
                  storyList.map((story, index) => {
                    const {writer_mem_id, writer_mem_profile, writer_mem_nick, write_date, room_no, writer_no, contents} = story
                    return (
                      <div className='storyList' key={index}>
                        <div className='thumbnail' onClick={() => {goLink(`${writer_mem_id}`)}}>
                          <img src={writer_mem_profile} alt=""/>
                        </div>
                        <div className='listContent'>
                          <div className='dataInfo'>
                            <div className='infoWrap'>
                              <div className='userNick' onClick={() => {goLink(`${writer_mem_id}`)}}>{writer_mem_nick}</div>
                              <div className='writeTime'>{moment(write_date).format('YYYY.MM.DD hh:mm')}</div>
                            </div>
                            <div className='delBtnWrap'>
                              <span className='delBtn' onClick={() => {delAction(room_no, writer_no)}}>삭제</span>
                            </div>
                          </div>
                          <div className='messageWrap'>
                            {contents}
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>              
            </>
           :
            <></>
        }
      </div>
    </div>
  )
}
