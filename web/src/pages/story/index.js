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

  const [currentPage, setCurrentPage] = useState(0);
  const [storyList, setStoryList] = useState(0);

  let totalPage = 1
  let pagePerCnt = 20
  // 깐부 랭킹 리스트
  const getList = useCallback(async () => {
    const param = {
      pageNo: currentPage,
      pagePerCnt: pagePerCnt
    }
    const {data, result} = await Api.getStoryBoxList(param)
    if (result  === 'SUCCESS') {
      totalPage = Math.ceil(data.list.length / pagePerCnt)
      if (currentPage > 1) {
        setStoryList(storyList.concat(data.list))
      } else {
        setStoryList(data.list)
      }
    } else {
      console.log(result)
    }
  }, [currentPage])

  const scrollEvtHdr = () => {
    if (totalPage > currentPage && Utility.isHitBottom()) {
      setCurrentPage(currentPage + 1)
    }
  }
  useLayoutEffect(() => {
    if (currentPage === 0) setCurrentPage(1)
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [currentPage])

  useEffect(() => {
    if (currentPage > 0) getList()
  }, [currentPage])

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
                  storyList.map((data, index) => {
                    return (
                      <div className='storyList' key={index}>
                        <div className='thumbnail' onClick={() => {goLink(`${data.memNo}`)}}>
                          <img src={data.profImg} alt=""/>
                        </div>
                        <div className='listContent'>
                          <div className='dataInfo'>
                            <div className='infoWrap'>
                              <div className='userNick' onClick={() => {goLink(`${data.memNo}`)}}>{data.nickNm}</div>
                              <div className='writeTime'>{moment(data.writeDt).format('YYYY.MM.DD hh:mm')}</div>
                            </div>
                            <div className='delBtnWrap'>
                              <span className='delBtn'>삭제</span>
                            </div>
                          </div>
                          <div className='messageWrap'>
                            {data.contents}
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
