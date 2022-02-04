import React, {useState, useEffect} from 'react'

import Api from 'context/api'

// global components
import Header from 'components/ui/header/Header'

import '../../../style.scss'

const Message = () => {
  const [messageList, setMessageList] = useState([]);

  async function fetchMessage() {
    const res = await Api.member_broadcast_shortcut({
      method: 'GET'
    })
    if (res.result === 'success') {
      setMessageList(res.data.list);
      console.log(res.data.list);
    }
  }

  useEffect(() => {
    fetchMessage()
    console.log(messageList);
  }, [])
  
  // 페이지 시작
  return (
    <>
      <Header position={'sticky'} title={'퀵 메시지'} type={'back'}/>
      <div className='subContent'>
          <p className='topText'>명령어는 2자, 내용은 최대 200자까지 입력 가능</p>
          <div className='listWrap'>
            {messageList.length > 0 &&
              messageList.map((item, index) => {
                return (
                  <div className='list' key={index}>
                    <div className='listHead'>
                      <div className='titleWrap'>
                        <span className='listIndex'>{item.orderNo}</span>
                        <span className='listTitle'>퀵 메시지</span>
                      </div>
                      <button className='saveBtn'>저장</button>
                    </div>
                    <div className='listContent'>
                      <div className='listRow'>
                        <div className='category'>명령어</div>
                        <input type="text" className='inputText' defaultValue={item.order}/>
                      </div>
                      <div className='listRow'>
                        <div className='category'>내용</div>
                        <input type="text" className='inputText' defaultValue={item.text}/>
                      </div>
                    </div>
                  </div>
                )
              })            
            }            
          </div>
      </div>
    </>
  )
}

export default Message
