import React, {useEffect, useState} from 'react';
import {IMG_SERVER} from 'context/config'
import Utility, {isHitBottom, addComma} from 'components/lib/utility'

import Api from 'context/api'

import NoResult from "components/ui/noResult";
import EventRankList from '../../components/rankList/RankList'
import styled, {css} from "styled-components";

import '../style.scss'

const FanContent = () => {
  const [rankMyList, setRankMyList] = useState([])
  const [rankList, setRankList] = useState([])
  const [currentPage, setCurrentPage] = useState(0);
  
  let totalPage = 1;
  let pagePerCnt = 50;
  // 조회 API
  const fetchGoodStartFanInfo = () => {
    const param = {
      pageNo: currentPage,
      pagePerCnt: pagePerCnt
    }
    Api.getGoodStartFanInfo(param).then((res) => {
      if (res.code === '00000') {
        totalPage = Math.ceil(res.data.fanRank.rankFanListCnt / pagePerCnt);
        if (currentPage > 1) {
          setRankList(rankList.concat(res.data.fanRank.rankFanList))
        } else {
          setRankMyList(res.data.fanRank.rankFanMyInfo)
          setRankList(res.data.fanRank.rankFanList)
        }
      } else {
        console.log(res.message);
      }
    })
  }

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
    if (currentPage > 0) fetchGoodStartFanInfo();
  }, [currentPage]);
  
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
    <section className="rankContainer fan">
      <h1 className="rankTitle">
        <img src={`${IMG_SERVER}/event/goodstart/rankTitle.png`} />
      </h1>
      <div className="rankUl fan">
      <p className='fanSubTitle'>특별점수는 종료 후 반영되니 참고해주세요!</p>
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

export default FanContent

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