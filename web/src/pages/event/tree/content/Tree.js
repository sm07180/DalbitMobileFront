import React, {useEffect, useState, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Utility, {isHitBottom, addComma} from 'components/lib/utility'
import Api from 'context/api'
import {IMG_SERVER} from 'context/config'

// Component
import EventComment from '../../components/comment'
import {Context} from 'context'

// 좋아요 트리만들기 Content Component
const Tree = (props) => {
  const constext = useContext(Context)
  const history = useHistory()
  const [makePopInfo, setMakePopInfo] = useState({open: false}) // 트리 만드는 법 & 트리 완성 보상 팝업 정보
  const [presentPopInfo, setPresentPopInfo] = useState({open: false}) // 선물 팝업 정보
  const [letterPopInfo, setLetterPopInfo] = useState({open: false, seqNo: 0}) // 편지 팝업 정보
  const [mainListInfo, setMainListInfo] = useState({totScoreCnt: 0, list: [], limitScore: 150000, mainPerCnt: 0}) // 메인 리스트 정보
  const [storyListInfo, setStoryListInfo] = useState({cnt: 0, list: []}) // 사연리스트 정보
  const [storyPageInfo, setStoryPageInfo] = useState({pageNo: 1, pagePerCnt: 30}) // 사연 검색 정보

  // 메인 리스트 가져오기
  const getMainListInfo = () => {
    Api.getLikeTreeMainList()
      .then((res) => {
        if (res.code === '00000') {
          setMainListInfo({...mainListInfo, ...res.data, mainPercent: Math.floor(res.data.totScoreCnt / mainListInfo.limitScore)})
        } else {
          console.log(res)
        }
      })
      .catch((e) => console.log(e))
  }

  // 사연 리스트 가져오기
  const getStoryListInfo = () => {
    Api.getLikeTreeStoryList(storyPageInfo).then((res) => {
      if (res.code === '00000') {
        const {cnt, list} = res.data
        let temp = []
        list.forEach((value) => {
          temp.push({})
        })
        setStoryListInfo(res.data)
      } else {
        console.log(res)
      }
    })
  }

  useEffect(() => {
    getStoryListInfo()
  }, [storyPageInfo])

  useEffect(() => {
    getMainListInfo()
  }, [])

  return (
    <>
      <section className="term">
        <img src={`${IMG_SERVER}/event/tree/treeBg-2.png`} className="bgImg" />
        <button>
          <img src={`${IMG_SERVER}/event/tree/treeBtn-1.png`} />
        </button>
      </section>
      <section className="treeContents">
        <img src={`${IMG_SERVER}/event/tree/treeContents-1.webp`} className="treeImg" />
        <div className="treeEventBox">
          <div className="countBox">
            {Utility.addComma(mainListInfo.totScoreCnt)}
            <span> /{Utility.addComma(mainListInfo.limitScore)}</span>
          </div>
          <div className="gaugeBox">
            <div className="gaugeBar" style={{width: `${mainListInfo.mainPercent}%`}}>
              <div className="gaugePointer">
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <img src={`${IMG_SERVER}/event/tree/treeBg-3.png`} className="bgImg" />
      </section>
      <section className="commentContainer">
        <EventComment />
      </section>
    </>
  )
}

export default Tree
