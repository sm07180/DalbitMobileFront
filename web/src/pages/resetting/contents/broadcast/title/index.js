import React, {useState, useEffect} from 'react'

// global components
import Header from 'components/ui/header/Header'
import TextArea from '../../../components/textArea'
import RadioList from '../../../components/radioList'

import './title.scss'

const BroadcastTitle = () => {
  const [titleList, setTitleList] = useState([])
  const [titleSelect, setTitleSelect] = useState({
    state: false,
    val: "",
    index: -1,
  })

  const selectTitle = (e) => {
    let selectVal = e.currentTarget.innerText;
    const {targetIndex} = e.currentTarget.dataset;
    console.log(selectVal,titleList);
    setTitleSelect({
      state: true,
      val: selectVal,
      index: targetIndex,
    });
  }
  
  useEffect(() => {
    console.log(titleList);
  }, [titleSelect])

  // 페이지 시작
  return (
    <div id="title">
      <Header position='sticky' title='방송 제목' type='back'/>
      <section className='titleInpuBox'>
        <p className='topText'>최대 3개까지 저장 가능</p>
        <TextArea list={titleList} setList={setTitleList} select={titleSelect} setSelect={setTitleSelect}/>
      </section>
      {titleList.length > 0 &&
        <section className='titleListBox'>
          <div className='sectionTitle'>등록된 제목<span className='point'>{titleList.length}</span></div>
          <div className='radioWrap'>
            {titleList.map((item, index) => {
              return (
                <RadioList  key={index} title={item} listIndex={index} clickEvent={selectTitle}/>
              )
            })}
          </div>
        </section>
      }
    </div>
  )
}

export default BroadcastTitle
