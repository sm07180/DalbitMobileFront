import React, {useEffect, useState} from 'react'
import {IMG_SERVER} from 'context/config'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'

import Header from 'components/ui/new_header.js'

import './bestdj.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxBestDjData} from "redux/actions/globalCtx";

export default function bestdj() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory()

  const [bestDjMemNumber, setBestDjMemNumber] = useState([]);
  const [fanRank, setFanRank] = useState([]);

  const fetchBestdjInfo = async () => {
    const res = await Api.bestdj_info([]);

    dispatch(setGlobalCtxBestDjData(res.data));

    // if (res.result === 'success') {
    //   let fanRankList = [];
    //   let bestDjMemNumberList = [];

    //   for(var i = 0; i < res.data.length; i++) {
    //     const fanRanking = res.data[i].fanRankList;
    //     const bestDjMemNo = res.data[i].bestDjMemNo;

    //     fanRankList.push(fanRanking);
    //     bestDjMemNumberList.push(bestDjMemNo);
    //   }

    //   setFanRank(fanRankList);
    //   setBestDjMemNumber(bestDjMemNumberList);
    // } else {
    //   globalCtx.action.alert({
    //     msg: message
    //   })
    // }
  }

  useEffect(() => {
    fetchBestdjInfo();
  }, [])

  return (
    <div id="bestDj">
      <Header title="베스트DJ" />
      <div className="subContent">
          <img
          src={`${IMG_SERVER}/event/bestDj/2202/bestDj_2202-top.png`}
          alt="달빛라이브를 대표하는 2월의 베스트DJ"
          className="img__full"
          />
          <div className="listWrap">
            {globalState.bestDjData.map((item, index) => {
              return (
                <div className="list" key={index}>
                  <img
                    src={`${IMG_SERVER}/event/bestDj/2202/bestDj_2202-user-${index + 1}.png`}
                    alt="베스트DJ"
                    className="img__full"
                  />
                  <div className="clickArea" id={`${item.bestDjMemNo}`}
                       onClick={() => {
                         history.push(`/mypage/${item.bestDjMemNo}`)
                       }}/>
                  <div className="fanRank">
                    <ul className="fanRankListWrap">
                      {item.fanRankList.length > 0 ?
                        item.fanRankList.map((rankData, idx) => {
                          return (
                            <li className="fanRankList"
                                id={`${rankData.memNo}`}
                                onClick={() => {
                                  history.push(`/mypage/${rankData.memNo}`)
                                }}
                                key={idx}
                            >
                              <div
                                className={`fanRankThumb ${rankData.rank === 1 ? 'gold' : rankData.rank === 2 ? 'silver' : 'bronze'}`}
                                style={{backgroundImage: `url(${rankData.profImg.url})`}}></div>
                              <div className="fanRankNick">{rankData.nickNm}</div>
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
            <img
            src={`${IMG_SERVER}/event/bestDj/2202/bestDj_2202-bottom.png`}
            alt="스페셜DJ를 누적 6회 이상 달성한 DJ입니다."
            className="img__full"
            />
            <a onClick={() => history.push('/event/bestdj_intro')} className="footerBtn">베스트DJ자세히보기</a>
          </div>
        </div>
    </div>
  )
}
