import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Api from 'context/api';

import NoResult from 'components/ui/noResult';

export default function QnaList() {
  const history = useHistory();
  
  const [qnalist, setQnaList] = useState([]);
  const [noResultShow, setNoResultShow] = useState(false);
  const timestamp = String(new Date().getTime()).substr(0, 10)
  const IntTime = parseInt(timestamp);
  
  const fetchData = async () => {
    const res = await Api.center_qna_list({
      params: {
        page: 1,
        records: 1000
      }
    });

    const { result, data } = res;
    console.log(data);
    if(result === 'success') {
      if(data.list === false) {
        setNoResultShow(true)
      } else {
        setQnaList(data.list); 
      }
    }
  }

  const timeFormat = (strFormatFromServer) => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    // let time = strFormatFromServer.slice(8)
    // time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date}`
  }

  const routeHistory = (item) => {
    const { qnaIdx } = item;
    history.push({
      pathname: `/customer/qnaList/${qnaIdx}`,
      state: {
        qna: item
      }
    })
  }

  useEffect(() => {
    fetchData();
  }, [])
  
  return(
    <div className="personalListWrap">
      {noResultShow === true && <NoResult />}
        {
          qnalist.length > 0 &&
          qnalist.map( item => {
            const { qnaIdx, qnaType, title, state, writeDt } = item
            if (qnalist === null) return
            return (
              <div key={qnaIdx} className="personalListWrap__eachWrap" onClick={e => {routeHistory(item)}}>
                <div className="personalListWrap__label">
                  {/* {(IntTime - opTs) / 3600 < 3 && state === 1 && <span className="newIcon"></span>} */}
                  {state === 0 && <span className="state">답변대기</span>}
                  {state === 1 && <span className="stateComplete">답변완료</span>}
                </div>
                <div className="personalListWrap__title">
                  {qnaType === 1 && <span className="type">[회원정보]</span>}
                  {qnaType === 2 && <span className="type">[방송]</span>}
                  {qnaType === 3 && <span className="type">[청취]</span>}
                  {qnaType === 4 && <span className="type">[결제]</span>}
                  {qnaType === 5 && <span className="type">[건의]</span>}
                  {qnaType === 6 && <span className="type">[장애/버그]</span>}
                  {qnaType === 7 && <span className="type">[선물/아이템]</span>}
                  {qnaType === 99 && <span className="type">[기타]</span>}
                  <p className="personalListWrap__titleName">{title}</p>
                </div>
                <div className="personalListWrap__time">{timeFormat(writeDt)}</div>
              </div>
            )
          })
        }
    </div>
  )
}