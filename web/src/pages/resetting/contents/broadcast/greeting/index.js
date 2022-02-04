import React, {useState, useEffect} from 'react'

// global components
import Header from 'components/ui/header/Header'
import TextArea from '../../../components/textArea'
import RadioList from '../../../components/radioList'

import '../../../style.scss'

const Greeting = () => {
  const [greetingLength, setGreetingLength] = useState(2)
  const [greetingList, setGreetingList] = useState([])
  const [greetingSelect, setGreetingSelect] = useState({
    state: false,
    val: "",
  })

  const selectGreeting = (e) => {
    let selectVal = e.currentTarget.childNodes[0].childNodes[0].innerText;
    setGreetingSelect({
      state: true,
      val: selectVal,
    });
  }
  
  useEffect(() => {
    setGreetingLength(greetingList.length);    
  }, [greetingList])

  // 페이지 시작
  return (
    <>
      <Header position={'sticky'} title={'DJ 인사말'} type={'back'}/>
      <div className='subContent'>
        <div className='section'>
          <p className='topText'>최대 3개까지 저장 가능</p>
          <TextArea max={20} list={greetingList} setList={setGreetingList} select={greetingSelect} setSelect={setGreetingSelect}/>
        </div>
        {greetingLength > 0 &&
          <div className='section'>
            <div className='sectionTitle'>등록된 인사말<span className='point'>{greetingLength}</span></div>
            <div className='radioWrap'>
              {
                greetingList.length > 0 &&
                  greetingList.map((item, index) => {
                    return (
                      <RadioList  key={index} title={item} clickEvent={selectGreeting}/>
                    )
                  })
                }
            </div>
          </div>
        }        
      </div>
    </>
  )
}

export default Greeting
