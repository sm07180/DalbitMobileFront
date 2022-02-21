import React, {useContext, useEffect, useState} from 'react'
import {Context} from 'context'

// global components
import ListRow from 'components/ui/listRow/ListRow'
import Api from "context/api";
import {withRouter} from "react-router-dom";
// components

const WeeklyPick = (props) => {
  const context = useContext(Context);

  const {token, profile} = context;

  const [listData, setListData] = useState({lastPageNo: 0, list: []});

  const [pageNo, setPageNo] = useState(1);

  const [loading, setLoading] = useState(false);

  let pagePerCnt = 50;

  useEffect(() => {
    getWeeklyList(pageNo);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined"){
      document.addEventListener("scroll", scrollEvent);
    }

    return () => {
      document.removeEventListener("scroll", scrollEvent);
    }

  }, [pageNo, listData, loading]);

  const getWeeklyList = (pageNo) => {
      Api.getWeeklyList({
        pageNo: pageNo,
        pageCnt: pagePerCnt
      }).then((res) => {
        if (res.result === 'success') {
          setListData({lastPageNo: Math.ceil(res.data.paging.total / pagePerCnt), list: listData.list.concat(res.data.list)});
          setLoading(false);
        }
      })
  }

  const scrollEvent = () => {
    if (!loading){
      let scrollHeight = document.documentElement.scrollHeight;
      let scrollTop = document.documentElement.scrollTop;
      let height = document.documentElement.offsetHeight;

      if (scrollHeight - 10 <= scrollTop + height && pageNo < listData.lastPageNo){
        setLoading(true);
        let nexPageNo = pageNo + 1;
        setPageNo(nexPageNo);
        getWeeklyList(nexPageNo);
      }
    }
  }

  return (
    <>
      <p className='infomation'>이번 주 달둥이들의 마음을 취향저격한 DJ를 소개합니다.</p>
      <section className="listSection">
      {listData.list.length > 0 &&
        <div className={`listWrap weeklyPick`}>
          <>
          {listData.list.map((data, index) => {
            return (
              <React.Fragment key={`weeklyPick-${index}`}>
                {data.memberList && data.memberList.map((data2, idx) => {
                  return (
                    <ListRow key={idx} photo={data2.imageInfo.thumb150x150} onClick={() => props.history.push(`/rank/pick?idx=${data.idx}`)}>
                      <div className='listContent'>
                        <div className={`round ${data.memberList && data.memberList.length > 1 ? "jointAward" : ""}`}>{data.round}회차</div>
                        <div className='memNick'>{data2.memNick ? data2.memNick : "-"}</div>
                      </div>
                      <div className='back'>
                        <span className='rightArrow'></span>
                      </div>
                    </ListRow>
                  )
                })}
              </React.Fragment>
            )
          })}
          </>
        </div>
      }
      </section>
    </>
  )
}

export default withRouter(WeeklyPick)
