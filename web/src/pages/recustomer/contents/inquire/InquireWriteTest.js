import React, {useState, useEffect, useContext} from 'react'

// global components
// components
import API from "context/api";
import {Context} from "context";
import {useHistory} from "react-router-dom";
import Swiper from "react-id-swiper";
import {postImage} from "common/api";
import { GlobalContext } from "context";
import './inquireWrite.scss'
import InputItems from "components/ui/inputItems/inputItems";
import ImageUpload from "pages/recustomer/components/ImageUpload";
import CheckList from "pages/recustomer/components/CheckList";
import LayerPopup from "components/ui/layerPopup/LayerPopup";
import SubmitBtn from "components/ui/submitBtn/SubmitBtn";

const Write = () => {
  const context = useContext(Context);
  const { globalAction } = useContext(GlobalContext);
  const [inputData, setInputData] = useState({
    title: "",
    faqType: 0,
    contents: "아래 내용을 함께 보내주시면 더욱 빠른 처리가 가능합니다. \n\nOS (ex-Window 버전10) : \n브라우저 : \n문제발생 일시 : \n문의내용 : "
  })
  const [focus, setFocus] = useState(false);
  const [option, setOption] = useState(false);
  const [optionValue, setOptionValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [agree, setAgree] = useState(false);
  const history = useHistory();

  const [imageFile, setImageFile] = useState([]);
  const swiperParams = {
    slidesPerView: "auto",
    spaceBetween: 8
  };
  const [writeInfo, setWriteInfo] = useState([
    {path: 1, name: "회원정보"}, {path: 2, name: "방송"}, {path: 3, name: "청취"}, {path: 4, name: "결제"},
    {path: 5, name: "건의"}, {path: 6, name: "장애/버그"}, {path: 7, name: "선물/아이템"}, {path: 99, name: "기타"}
  ])
  const [selectedInfo, setSelectedInfo] = useState("문의 유형을 선택해주세요");
  const [popup, setPopup] = useState(false);

  const fetchData = () => {
    let params = {
      qnaIdx: 0,
      qnaType: inputData.faqType,
      title: inputData.title,
      contents: inputData.contents,
      questionFile1: imageFile[0] !== false ? imageFile[0].path : "",
      questionFile2: imageFile[1] !== false ? imageFile[1].path : "",
      questionFileName1: imageFile[0] !== false ? imageFile[0].fileName : "",
      questionFileName2: imageFile[1] !== false ? imageFile[1].fileName : "",
      phone: "",
      email: "",
      nickName: context.profile.nickName
    }
    API.center_qna_add({params}).then((res) => {
      if(res.result === "success") {
        context.action.alert({msg: "1:1문의가 등록되었습니다."})
        // history.push(`/customer/inquire`)
      } else {
        context.action.alert({msg: res.message});
      }
    }).catch((e) => console.log(e));
  };

  const onChange = (e) => {
    e.preventDefault();
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value
    });
  };

  const changeOption = () => {
    setOption(!option);
  }

  const changeValue = (e) => {
    const {value, name} = e.currentTarget.dataset;
    setInputData({...inputData, faqType: parseInt(value)});
    setSelectedInfo(name)
  }

  useEffect(() => {
    console.log(option);
  })

  const onTextFocus = () => {
    setTextValue(inputData.contents);
  }

  const popupOpen = () => {
    setPopup(true);
  }

  const onClick = (e) => {
    if(e.target.checked) {setAgree(true)}
    else {setAgree(false);}
  }

  const uploadSingleFile = (e) => {
    const target = e.currentTarget;
    if (target.files.length === 0) return;
    let reader = new FileReader();
    const file = target.files[0];

    const fileName = file.name;

    const fileSplited = fileName.split(".");
    const fileExtension = fileSplited.pop().toLowerCase();
    //
    const extValidator = (ext) => {
      const list = ["jpg", "jpeg", "png", "PNG"];
      return list.includes(ext);
    };
    if (!extValidator(fileExtension)) {
      context.action.alert({msg: "jpg, png 이미지만 사용 가능합니다."})
    }
    reader.readAsDataURL(target.files[0]);
    reader.onload = async () => {
      if (reader.result && imageFile.length < 3) {
        const res = await postImage({
          dataURL: reader.result,
          uploadType: "exchange",
        });
        if (res.result === "success") {
          setImageFile(imageFile.concat(reader.result));
        }
      }
    };
  };

  const removeImage = (e) => {
    const idx = parseInt(e.currentTarget.dataset.idx)
    const tempImage = imageFile.concat([]);
    tempImage.splice(idx, 1);
    setImageFile(tempImage)
  }

  const validator = () => {
    if(inputData.faqType !== 0 && inputData.contents !== "" && agree === true) {
      fetchData();
    } else {
      context.action.alert({msg: "필수 항목을 모두 입력해주세요"})
    }
  }

  return (
    <div id='inquireWrite'>
      <InputItems title="문의 제목">
        <input type="text" placeholder="문의 제목을 입력해주세요." name="title" onChange={onChange}/>
      </InputItems>
      <InputItems title="문의 유형">
        <button onClick={changeOption}>{selectedInfo}</button>
        {option &&
          <div className="selectWrap">
            {writeInfo.map((v, idx) => {
              return(
                <div key={idx} className="option" onClick={changeValue} data-value={v.path} data-name={v.name}>{v.name}</div>
              )
            })}
          </div>
        }
      </InputItems>
      <InputItems title="문의 내용" type="textarea">
        <textarea rows="10" placeholder={inputData.contents} maxLength="2000" onFocus={onTextFocus} defaultValue={textValue} name="contents" onChange={onChange}/>
      </InputItems>
      <div className="imageUpload">
        <div className="titleWrap">
          <span className="title">사진 첨부</span>
          <span className="subTitle">(최대 10MB, 최대 3매)</span>
        </div>
        <div className="uploadWrap">
          <label className="uploadlabel">
            <input className="blind" type="file" onChange={uploadSingleFile} />
          </label>
          {imageFile.length > 0 &&
          <div className="uploadListWrap">
            <Swiper {...swiperParams}>
              {imageFile.map((v, idx) => {
                return(
                  <div className="uploadList" key={idx}>
                    <img src={v} alt="업로드이미지" />
                    <button type="button" className="removeFile" data-idx={idx} onClick={removeImage}/>
                  </div>
                )
              })}
            </Swiper>
          </div>
          }
        </div>
      </div>
      <label className="inputLabel">
        <input type="checkbox" className="blind" name="checkList" onClick={onClick}/>
        <span className="checkIcon"/>
        <p className="checkInfo">개인정보 수집 동의</p>
        <button className='policyBtn' onClick={popupOpen}>자세히</button>
      </label>
      <button type="button" className="submitBtn" onClick={validator}>등록하기</button>
      {popup &&
        <LayerPopup setPopup={setPopup}>
          <div className='popTitle'>개인정보 수집 및 이용에 동의</div>
          <div className='popContent'>
            <ul className='dashList'>
              <li>수집 및 이용 항목 : 닉네임, 이메일, 휴대전화번호</li>
              <li>수집 및 이용 목적 : 문의에 대한 답변 관련 업무</li>
              <li>보유 및 이용 기간 : 6개월</li>
              <li>회사는 문의에 대한 답변을 위한 목적으로 관계 법령에 따라 정보 수집 및 이용에 동의를 얻어 수집 합니다.</li>
            </ul>
          </div>
        </LayerPopup>
      }
    </div>
  )
}

export default Write;