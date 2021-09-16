import React, {useEffect, useState, useContext} from 'react'
import {IMG_SERVER} from 'context/config'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import Api from 'context/api'

import Header from 'components/ui/new_header.js'

import './bestdj.scss'

export default function bestdj() {
  const history = useHistory()
  const globalCtx = useContext(Context)

  const [ bestDjMemNumber, setBestDjMemNumber ] = useState([]);
  const [ fanRank, setFanRank ] = useState([]);

  const fetchBestdjInfo = async () => {
    const res = await Api.bestdj_info([]);

    if (res.result === 'success') {
      let fanRankList = [];
      let bestDjMemNumberList = [];

      for(var i = 0; i < res.data.length; i++) {
        const fanRanking = res.data[i].fanRankList;
        const bestDjMemNo = res.data[i].bestDjMemNo;

        fanRankList.push(fanRanking);
        bestDjMemNumberList.push(bestDjMemNo);
      }

      setFanRank(fanRankList);
      setBestDjMemNumber(bestDjMemNumberList);
    } else {
      globalCtx.action.alert({
        msg: message
      })
    }
  }

  useEffect(() => {
    fetchBestdjInfo();
  }, [])

  return (
    <div id="bestDj">
      <Header>
        <h2 className="header-title">베스트DJ</h2>
      </Header>
      <div className="subContent">
          <img
          src={`${IMG_SERVER}/event/bestDj/2109/bestDj_2109-top.png`}
          alt="달빛라이브를 대표하는 9월의 베스트DJ"
          className="img__full"
          />
          <div className="listWrap">
            {bestDjMemNumber.length > 0 &&
              bestDjMemNumber.map((item, index) => {
                return (
                  <div className="list" key={index}>
                    <div className="clickArea" id={`${item}`} 
                         onClick={() => {history.push(`/mypage/${item}`)}}/>
                    <div className="fanRank">
                      <ul className="fanRankListWrap">
                      {fanRank[index].length > 0 ?
                        fanRank[index].map((item, idx) => {
                          return (                            
                            <li className="fanRankList"
                                id={`${item.memNo}`}
                                onClick={() => {history.push(`/mypage/${item.memNo}`)}}
                                key={idx}
                              >
                              <div className={`fanRankThumb ${item.rank === 1 ? 'gold' : item.rank === 2 ? 'silver' : 'bronze'}`}
                              style={{backgroundImage: `url(${item.profImg.url})`}}></div>
                              <div className="fanRankNick">{item.nickNm}</div>
                            </li>
                          )
                        })
                        :
                        <li className="fanRankNone">
                          <p>등록된 팬 정보가 없습니다.</p>
                        </li>
                      }
                      </ul>
                    </div>
                  </div>
                )
              })
            }            
          </div>
          <div className="footer">
            <div className="footerInfo">
              <strong>베스트DJ</strong>는<br/>
              <strong>스페셜DJ를 누적 6회 이상</strong> 달성한 DJ입니다.
            </div>
            <a href="/event/bestdj_intro" className="footerBtn">베스트DJ자세히보기</a>
          </div>
        </div>
    </div>
  )
}
