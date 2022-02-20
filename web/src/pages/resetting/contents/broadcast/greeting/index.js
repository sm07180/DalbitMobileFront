import React, {useState, useEffect} from 'react'

// global components
import Header from 'components/ui/header/Header'
import TextArea from 'pages/resetting/components/textArea'
import RadioList from 'pages/resetting/components/radioList'

import './greeting.scss'
import API from "context/api";
import Toast from "components/ui/toast/Toast";

const Greeting = () => {
  const [titleList, setTitleList] = useState([])
  const [titleSelect, setTitleSelect] = useState({state: false, val: "", index: -1})
  const [toast, setToast] = useState({state : false, msg : ""});

  //토스트 메시지 출력
  const toastMessage = (text) => {
    setToast({state: true, msg : text})
    setTimeout(() => {
      setToast({state: false})
    }, 3000)
  }

  //등록된 인사말 버튼 클릭시 정보 조회
  const selectGreeting = (e) => {
    let selectVal = e.currentTarget.childNodes[0].childNodes[0].innerText;
    const {targetIndex} = e.currentTarget.dataset;
    setTitleSelect({
      state: true,
      val: selectVal,
      index: targetIndex
    });
  }

  //인사말 등록
  const fetchAddData = async () => {
    const res = await API.insertBroadcastOption({
      optionType: 2,
      contents: titleSelect.val
    })
    if(titleSelect.val === "") {
      toastMessage("입력 된 인사말이 없습니다. \n인사말을 입력하세요.")
    } else {
      if(res.result === "success") {
        toastMessage("DJ 인사말이 등록 되었습니다.");
        setTitleList(res.data.list);
        setTitleSelect({...titleSelect, val: "", index: -1});
      }
    }
  }

  //인사말 삭제
  const fetchDeleteData = async () => {
    const res = await API.deleteBroadcastOption({
      optionType: 2,
      idx: titleSelect.index
    })
    if(res.result === "success") {
      toastMessage("DJ 인사말이 삭제 되었습니다.");
      setTitleList(res.data.list);
      setTitleSelect({...titleSelect, val: "", index: -1});
    }
  }

  //인사말 데이터 정보 조회
  const fetchData = async () => {
    const res = await API.getBroadcastOption({optionType: 2});
    if(res.result === "success") {setTitleList(res.data.list);}
  }

  useEffect(() => {
    fetchData();
  }, [])

  // 페이지 시작
  return (
    <div id="greeting">
      <Header position={'sticky'} title={'DJ 인사말'} type={'back'}/>
      <div className='subContent'>
        <div className='section'>
          <p className='topText'>최대 3개까지 저장 가능</p>
          <TextArea max={20} list={titleList} setList={setTitleList} select={titleSelect} setSelect={setTitleSelect}
                    fetchAddData={fetchAddData} fetchDeleteData={fetchDeleteData}/>
        </div>
        {titleList.length > 0 &&
        <div className='section'>
          <div className='sectionTitle'>등록된 인사말<span className='point'>{titleList.length}</span></div>
          <div className='radioWrap'>
            {titleList.map((item, index) => {
              return (
                <RadioList key={index} title={item.contents} listIndex={item.idx} clickEvent={selectGreeting}/>
              )
            })}
          </div>
        </div>
        }
      </div>
      {toast.state && <Toast msg={toast.msg}/>}
    </div>
  )
}

export default Greeting;
