import React from "react";

import {DalbitScroll} from "../../../../../common/ui/dalbit_scroll";
import NoResult from "../../../../../common/ui/no_result";

export default function RouletteTabWin({ renderingData, totalCnt, winListScrollPaging }) {

  return (
    <>
      <div className="notice_wrap">
        <p>* 당첨 내역은 방송이 종료 될 때까지만 저장됩니다.</p>
        <p>* 최근 당첨된 순으로 정렬됩니다.</p>
      </div>
      <div className="winLog">
        {renderingData.length > 0 ?
          <>
            <div className="winLog_title">
              당첨 내역 <span className="winLog_count">({totalCnt}개)</span>
            </div>
            <div className="winLog_wrap">
              <DalbitScroll scrollBottomCallback={winListScrollPaging}>
                <>
                  {renderingData.map((item) => {
                    return (
                      <div className="winLog_list" key={item.lastUpdDate}>
                        <div className="winLog_photo">
                          <div className="winLog_thumb"
                               style={{backgroundImage: `url(${item.imageProfile.url})`}}
                          />
                        </div>
                        <div className="winLog_content">
                          <div className="winLog_row">
                            <div className="winLog_nick">{item.memNick}</div>
                          </div>
                          <div className="winLog_row">
                            <div className="winLog_subTitle">이용 결과</div>
                            <div className="winLog_winTitle">{item.opt}</div>
                          </div>
                          <div className="winLog_row">
                            <div className="winLog_subTitle">룰렛 금액</div>
                            <div className="winLog_roulettePrice">
                              {item.payAmt !== 0 ?
                                <><span>{item.payAmt}</span>달</>
                                : <span>무료</span>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </>
              </DalbitScroll>
            </div>
          </>
          :
          <NoResult text="아직 룰렛이 이용된 내역이 없습니다." height={600} />
        }
      </div>
    </>
  )
}