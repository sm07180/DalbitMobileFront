import React, {useEffect, useState} from 'react';
import Api from "context/api";
import LayerPopup from "components/ui/layerPopup/LayerPopup";

const SpecialHistoryPop = (props) => {
  const {profileData, setPopHistory} = props;
  const [specialHistory, setSpecialHistory] = useState([]); // 해당유저의 스페셜DJ 데이터
  const [specialLog, setSpecialLog] = useState([]); // 해당유저의 스페셜DJ 획득 로그

  /* 스페셜DJ 약력 조회 */
  const fetchSpecialHistory = () => {
    Api.specialHistory({params: {memNo: profileData.memNo}}).then((res) => {
      if (res.result === 'success') {
        setSpecialHistory(res.data)
        setSpecialLog(res.data.list)
      } else {
        context.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    });
  }

  useEffect(() => {
    fetchSpecialHistory();
  },[])

  return (
    <LayerPopup setPopup={setPopHistory}>
      <section className="honorPopup">
        <div className='title'>
          <span><strong>{specialHistory.nickNm}</strong>님은</span>
          <span>현재 스페셜DJ입니다.</span>
        </div>
        <div className='table'>
          <div className='summary'>
            <span>스페셜 DJ 약력</span>
            <span>총 {specialHistory.specialDjCnt}회</span>
          </div>
          <div className='tableInfo'>
            <div className='thead'>
              <span>선정 일자</span>
              <span>선정 기수</span>
            </div>
            <div className='tbody'>
              {specialLog.map((list,index) => {
                return (
                  <div className='tbodyList' key={index}>
                    <span>{list.selectionDate}</span>
                    <span>{list.roundNo}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </LayerPopup>
  )
}

export default SpecialHistoryPop;