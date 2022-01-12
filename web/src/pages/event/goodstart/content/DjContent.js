import React, {useEffect, useState} from 'react';
import Utility, {isHitBottom, addComma} from 'components/lib/utility'

import Api from 'context/api'

import NoResult from "components/ui/noResult";
import TabmenuBtn from '../../components/tabmenu/TabmenuBtn'
import EventRankList from '../../components/rankList/RankList'
import styled, {css} from "styled-components";

import '../style.scss'

const tabmenu3 = 'all'
const tabmenu4 = 'new'

const DjContent = () => {
  const [rankMyList, setRankMyList] = useState([])
  const [rankList, setRankList] = useState([])
  const [ranktabCnt, setRankTabCnt] = useState({name: ''}) // all, new
  const [currentPage, setCurrentPage] = useState(0);
  
  let totalPage = 1;
  let pagePerCnt = 50;
  // 조회 API
  const fetchGoodStartDjRank = () => {
    const param = {
      pageNo: currentPage,
      pagePerCnt: pagePerCnt
    }
    Api.getGoodStartDjRank(param).then((res) => {
      if (res.code === '00000') {
        totalPage = Math.ceil(res.data.rankDjListCnt / pagePerCnt);
        if (currentPage > 1) {
          setRankList(rankList.concat(res.data.rankDjList))
        } else {
          setRankMyList(res.data.rankDjMyInfo)
          setRankList(res.data.rankDjList)
        }
      } else {
        console.log(res.message);
      }
    })
  }
  const fetchGoodStartNewDjRank = () => {
    const param = {
      pageNo: currentPage,
      pagePerCnt: pagePerCnt
    }
    Api.getGoodStartNewDjRank(param).then((res) => {
      if (res.code === '00000') {
        totalPage = Math.ceil(res.data.rankNewDjListCnt / pagePerCnt);
        if (currentPage > 1) {
          setRankList(rankList.concat(res.data.rankNewDjList))
        } else {
          setRankMyList(res.data.rankNewDjMyInfo)
          setRankList(res.data.rankNewDjList)
        }
      } else {
        console.log(res.message);
      }
    })
  }

  // 랜덤으로 랭킹 보이기
  const randomRankShow = () => {
    const num = Math.floor(Math.random()*10);
    if (num > 5) {
      setRankTabCnt({...ranktabCnt, name: tabmenu3})
    } else {
      setRankTabCnt({...ranktabCnt, name: tabmenu4})
    }
  }
    
  useEffect(() => {
    setCurrentPage(0)
  }, [ranktabCnt.name])

  const scrollEvtHdr = () => {
    if (totalPage > currentPage && Utility.isHitBottom()) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (currentPage === 0) setCurrentPage(1);
    window.addEventListener("scroll", scrollEvtHdr);
    return () => {
      window.removeEventListener("scroll", scrollEvtHdr);
    };
  }, [currentPage]);

  useEffect(() => {
    if (ranktabCnt.name === tabmenu3 && currentPage > 0) {
      fetchGoodStartDjRank();
    }
    
    if (ranktabCnt.name === tabmenu4 && currentPage > 0) {
      fetchGoodStartNewDjRank();
    }
  }, [currentPage]);

  // 페이지 셋팅
  useEffect(() => {
    randomRankShow()
  }, [])
  
  // 추가 컴포넌트
  /* 랭킹 리스트 */
  const ListContent = (props) => {
    const {type, data} = props
    return (
      <>
        {type === 'my' ? (
          <>
            <div className="listBox">
              <div className="listItem">
                <span className="userNick">{data && data.mem_nick}</span>
              </div>
              <div className="listItem">
                <div className="value">
                  <i className="icon"></i>
                  <span className='count'>{Utility.addComma(data && data.mem_dal_score)}</span>
                </div>
                <div className="value">
                  <i className="icon"></i>
                  <span className='count'>{Utility.addComma(data && data.mem_tot_like_score)}</span>
                </div>
                <div className="value">
                  <i className="icon"></i>
                  <span className='count'>{Utility.addComma(data && data.mem_booster_score)}</span>
                </div>
              </div>
            </div>
            <div className="listBack">
              <p>{Utility.addComma(data && data.tot_mem_score)}</p>
            </div>
          </>
        ) : (
          <>
            <div className="listBox">
              <div className="listItem">
                <LevelBox levelColor={data && data.levelColor}>Lv{data && data.mem_level}</LevelBox>
                <em className={`icon_wrap ${data && data.mem_sex === 'm' ? 'icon_male' : 'icon_female'}`}>
                  <span className="blind">성별</span>
                </em>
              </div>
              <div className="listItem">
                <span className="userNick">{data && data.mem_nick}</span>
              </div>
            </div>
          </>
        )}
      </>
    )
  }

  // 페이지 시작
  return (
    <section className="rankContainer dj">
      <div className="rankTabmenu">
        <TabmenuBtn tabBtn1={tabmenu3} tabBtn2={tabmenu4}  tab={ranktabCnt.name}  setTab={setRankTabCnt} onOff={true} event={'goodstart'} imgNam={'rankTabBtn'} />
      </div>
      <div className="rankUl">
      <p></p>
      <EventRankList type={'my'} rankList={rankMyList} photoSize={60}>
        <ListContent type={'my'} data={rankMyList} />
      </EventRankList>
      {rankList && rankList.length > 0 ? 
        <>
          {rankList.map((data, index) => {
            return (
              <EventRankList rankList={data} photoSize={60} listNum={index} key={index}>
                <ListContent data={data} />
              </EventRankList>
            )
          })}
        </>
        :
        <NoResult type={'default'} text={'랭킹이 없습니다.'} />
      }
      </div>
    </section>
  )
}

export default DjContent

const LevelBox = styled.div`
  ${(props) => {
    if (props.levelColor.length === 3) {
      return css`
        background-image: linear-gradient(to right, ${props.levelColor[0]}, ${props.levelColor[1]} 51%, ${props.levelColor[2]});
      `
    } else {
      return css`
        background-color: ${props.levelColor[0]};
      `
    }
  }};
  width: 44px;
  height: 16px;
  line-height: 16px;
  border-radius: 14px;
  font-weight: bold;
  font-size: 12px;
  color: #fff;
  text-align: center;
  letter-spacing: -0.3px;
`