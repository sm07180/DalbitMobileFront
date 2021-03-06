import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {isScrolledToBtm, debounce} from '../util/function'
import {convertDateFormat} from 'components/lib/dalbit_moment'
import NoResult from 'components/ui/new_noResult'
import MailIcon from '../static/ic_mail_w.svg'

let totalPage = 1
export default () => {
  const history = useHistory()
  const [currentPage, setCurrentPage] = useState(1)
  const [storyList, setStoryList] = useState([])
  const [empty, setEmpty] = useState(false)

  function fetchStoryList() {
    Api.getStoryList({page: currentPage, records: 20}).then((res) => {
      const {result, data, message} = res
      if (result === 'success') {
        if(data.data.length > 0) {
          setEmpty(false)
          if (currentPage > 1) {
            setStoryList(storyList.concat(data.data))
          } else {
            setStoryList(data.data)
          }
          if (data.paging) {
            totalPage = data.paging.totalPage
          }
        } else {
          setEmpty(true)
        }
      } else {
        globalCtx.action.alert({title: 'Error', msg: message})
      }
    })
  }

  const scrollEvtHdr = debounce(() => {
    if (totalPage > currentPage && isScrolledToBtm()) {
      setCurrentPage(currentPage + 1)
    }
  }, 50)

  useEffect(() => {
    fetchStoryList()
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [currentPage])

  return (
    <div className="contentWrap">
      {storyList && storyList.length > 0 ? (
        storyList.map((data, idx) => {
          const {roomNo, bgImg, title, storyCnt, startDt} = data
          return (
            <div
              key={`story-${idx}`}
              className="storyWrap"
              onClick={() => history.push({pathname: `/story/${roomNo}`})}
              style={{
                backgroundImage: `url(${bgImg['thumb336x336']})`
              }}>
              <div className="iconWrap">
                <img src={MailIcon} />
                <span className="text">{new Intl.NumberFormat().format(storyCnt)}</span>
              </div>
              <div className="subtextWrap">
                <div className="subtextWrap__title">{title}</div>
                <div className="subtextWrap__date">{convertDateFormat(startDt, 'YY.MM.DD HH:mm')}</div>
              </div>
            </div>
          )
        })
      ) : empty && (
        <NoResult
          type="default"
          text="?????? ??? ?????? ????????? ????????????.
          [???????????? > ????????? ??????]??????
          ??????????????? ????????? ?????????
          ?????? ????????? ??? ??? ????????????."
        />
      )}
    </div>
  )
}
