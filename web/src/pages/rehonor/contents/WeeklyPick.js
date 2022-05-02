import React, {useEffect, useState} from 'react'

// global components
import ListRow from 'components/ui/listRow/ListRow'
import Api from "context/api";
import {withRouter} from "react-router-dom";
// components

const WeeklyPick = (props) => {

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

  const goWeekly = (idx) => {
    props.history.push(`/rank/pick?idx=${idx}`)
  }

  return (
    <>
      <div className='weeklyPickTop'>
        <span>위클리 픽!</span>
        <p>이번 주,<br/>달라의 마음을<br/>취.향.저.격.한 DJ를 소개합니다.</p>
      </div>
      <section className="weeklyPickWrap">
      {listData.list.length > 0 &&
        <div className={`listWrap`}>
          <>
          {listData.list.map((data, index) => {
            return (
              <React.Fragment key={`weeklyPick-${index}`}>
                {data.memberList && data.memberList.map((data2, idx) => {
                  return (
                    <ListRow key={idx} photo={data2.imageInfo.thumb150x150}
                             onClick={() => {
                               goWeekly(data.idx);
                             }}
                             photoClick={() => {
                               goWeekly(data.idx);
                             }}>
                      <div className='listContent'>
                        <div className={`round ${index === 0 ? "thisweekPick" : ""}`}>Pick #{data.round}</div>
                        <div className='memNick'>{data2.memNick ? data2.memNick : "-"}</div>
                      </div>
                      <div className='back'>
                        <span className='rightArrow'></span>
                      </div>
                      {
                        index === 0 &&
                        <span className='newTag'>new</span>
                      }
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
