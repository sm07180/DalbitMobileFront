import React, {useState, useEffect} from 'react'

// global components
import Header from 'components/ui/header/Header'
import TextArea from '../../../components/textArea'
import RadioList from '../../../components/radioList'

import './title.scss'

const BroadcastTitle = () => {
  const [titleLength, setTitleLength] = useState(2)
  const [titleList, setTitleList] = useState([])
  const [titleSelect, setTitleSelect] = useState({
    state: false,
    val: "",
  })

  const selectTitle = (e) => {
    let selectVal = e.currentTarget.childNodes[0].childNodes[0].innerText;
    setTitleSelect({
      state: true,
      val: selectVal,
    });
  }
  
  useEffect(() => {
    setTitleLength(titleList.length);    
  }, [titleList])

  // 페이지 시작
  return (
    <div id="title">
      <Header position={'sticky'} title={'방송 제목'} type={'back'}/>
      <div className='subContent'>
        <div className='section'>
          <p className='topText'>최대 3개까지 저장 가능</p>
          <TextArea max={20} list={titleList} setList={setTitleList} select={titleSelect} setSelect={setTitleSelect}/>
        </div>
        {titleLength > 0 &&
          <div className='section'>
            <div className='sectionTitle'>등록된 제목<span className='point'>{titleLength}</span></div>
            <div className='radioWrap'>
              {
                titleList.length > 0 &&
                  titleList.map((item, index) => {
                    return (
                      <RadioList  key={index} title={item} clickEvent={selectTitle}/>
                    )
                  })
                }
            </div>
          </div>
        }        
      </div>
    </div>
  )
}

export default BroadcastTitle
