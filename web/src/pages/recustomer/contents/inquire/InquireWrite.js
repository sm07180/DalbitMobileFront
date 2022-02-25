import React, {useState, useEffect, useContext} from 'react'

// global components
// components
import API from "context/api";
import {Context} from "context";
import {useHistory} from "react-router-dom";
import Swiper from "react-id-swiper";
import './inquireWrite.scss'
import InputItems from "components/ui/inputItems/InputItems";
import LayerPopup from "components/ui/layerPopup/LayerPopup";
import ImageUpload from "pages/recustomer/components/ImageUpload";
import CheckList from "pages/recustomer/components/CheckList";
import SubmitBtn from "components/ui/submitBtn/SubmitBtn";

const Write = (props) => {
  const {setInquire} = props
  const context = useContext(Context);
  const [inputData, setInputData] = useState({
    title: "",
    faqType: 0,
    contents: "아래 내용을 함께 보내주시면 더욱 빠른 처리가 가능합니다. \n\nOS (ex-Window 버전10) : \n브라우저 : \n문제발생 일시 : \n문의내용 : "
  })
  const [option, setOption] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [agree, setAgree] = useState(false);
  const history = useHistory();

  const [imageFile, setImageFile] = useState([]);
  const [imgFile, setImgFile] = useState([]);
  const [imageFileName, setImageFileName] = useState([]);
  const swiperParams = {
    slidesPerView: "auto",
    spaceBetween: 8
  };
  const [writeInfo, setWriteInfo] = useState([
    {path: 1, name: "회원정보"}, {path: 2, name: "방송"}, {path: 3, name: "청취"}, {path: 4, name: "결제"}, {path: 5, name: "장애/버그"}
  ])
  const [selectedInfo, setSelectedInfo] = useState("");
  const [popup, setPopup] = useState(false);
  let isDisabled = true;

  //문의하기 등록
  const fetchData = () => {
    let params = {
      qnaIdx: 0,
      qnaType: inputData.faqType,
      title: inputData.title,
      contents: inputData.contents,
      questionFile1: imageFile[0],
      questionFile2: imageFile[1],
      questionFile3: imageFile[2],
      questionFileName1: imageFileName[0],
      questionFileName2: imageFileName[1],
      questionFileName3: imageFileName[2],
      phone: "",
      email: "",
      nickName: context.profile.nickName
    }
    API.center_qna_add({params}).then((res) => {
      if(res.result === "success") {
        context.action.alert({msg: "1:1문의가 등록되었습니다."})
        setInquire("나의 문의내역");
      } else {
        context.action.alert({msg: res.message});
      }
    }).catch((e) => console.log(e));
  };

  //작성한 내용으로 inputData변경
  const onChange = (e) => {
    e.preventDefault();
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value
    });
  };

  //문의 유형 클릭시 세부내용 출력
  const changeOption = () => {
    setOption(!option);
  }

  //문의 유형 path값 가져오기
  const changeValue = (e) => {
    const {value, name} = e.currentTarget.dataset;
    setInputData({...inputData, faqType: parseInt(value)});
    setSelectedInfo(name)
  }

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

  //이미지 업로드
  const uploadSingleFile = (e) => {
    const target = e.currentTarget;
    if (target.files.length === 0) return;
    let reader = new FileReader();
    const file = target.files[0];
    const fileName = file.name;
    const fileSplited = fileName.split(".");
    const fileExtension = fileSplited.pop().toLowerCase();

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
        const res = await API.image_upload({
          data: {
            dataURL: reader.result,
            uploadType: "qna"
          }})
        if (res.result === "success") {
          setImageFile(imageFile.concat(res.data.path));
          setImgFile(imgFile.concat(res.data.url));
          setImageFileName(imageFileName.concat(fileName));
        } else {
          context.action.alert({msg: res.message});
        }
      }}
  };

  //이미지 삭제
  const removeImage = (e) => {
    const idx = parseInt(e.currentTarget.dataset.idx)
    const tempImage = imageFile.concat([]);
    const tempImg = imgFile.concat([]);
    tempImage.splice(idx, 1);
    tempImg.splice(idx, 1);
    setImageFile(tempImage);
    setImgFile(tempImg);
  }

  //등록시 예외 조건 확인
  const validator = () => {
    if(inputData.faqType !== 0 && inputData.contents !== "" && agree === true) {
      if(isDisabled) {fetchData();} else {isDisabled = false;}
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
        <button className={`${selectedInfo ? "active" : ""}`} onClick={changeOption}>{selectedInfo ? selectedInfo : "문의 유형을 선택해주세요."}</button>
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
        <textarea rows="10" placeholder={inputData.contents} onFocus={onTextFocus} defaultValue={textValue} name="contents" onChange={onChange}/>
      </InputItems>
      <ImageUpload title="사진 첨부" subTitle="(최대 10MB, 최대 3매)" onChange={uploadSingleFile} onClick={removeImage} imgFile={imgFile} />
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