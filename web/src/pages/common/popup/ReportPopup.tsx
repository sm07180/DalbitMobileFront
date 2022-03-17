import LayerPopup from "../../../components/ui/layerPopup/LayerPopup";
import React, {useContext, useState} from "react";
import {Context, GlobalContext} from 'context'
import AdminMessage from "./adminMessage";
import { useForm } from 'react-hook-form';
import moment from 'moment';
import API from "../../../context/api";

function SanctionList({ value, type,text, name, register, children }) {
    let inputText = text === 'input';
    let [ inputDisabled, setInputDisabled ] = useState(true);
    let register1 = register(name);
    return <>
        <div className="sanctionlist">
            <label className={`${type === "check" ? 'checkBox' : "radio" }Label`}>
                <input type={`${type === "check" ? 'checkbox' : "radio" }`} { ...register1}
                    onChange={(e)=>{
                        setInputDisabled(!inputDisabled)
                        register1.onChange(e);
                    }} className="blind" value={value}/>
                <span className={`${type}Icon`}/>
                <p>{children}</p>
            </label>
        </div>
        {inputText && <input type="text" {...register(name+value)} className="_txt_declaration_message"  disabled={inputDisabled} maxLength={100} style={{width:"100%"}} />}
    </>;
}

const reportDateList =[
    {text:"경고" , key: 2},
    {text:"1일정지" , key: 3},
    {text:"3일정지" , key: 4},
    {text:"7일정지" , key: 5},
    {text:"영구정지" , key: 6},
    {text:"강제탈퇴" , key: 7},
    {text:"임시정지" , key: 8}
]

const reportDetailList =[
    {text:"음란, 미풍양속 위배 행위" , key: 1, type: 'normal'},
    {text:"지나치게 과도한 욕설과 부적절한 언어를 사용하는 행위" , key: 2, type: 'normal'},
    {text:"지나치게 과도한 폭력, 위협, 혐오, 잔혹한 행위 또는 묘사" , key: 3, type: 'normal'},
    {text:"불법성 행위 또는 조장" , key: 4, type: 'normal'},
    {text:"청소년 유해 활동" , key: 5, type: 'normal'},
    {text:"동일한 내용을 반복적으로 등록 (도배)" , key: 6, type: 'normal'},
    {text:"상업적 또는 홍보/광고, 악의적인 목적으로 서비스 가입/활동" , key: 7, type: 'normal'},
    {text:"차별/갈등 조장 활동 (성별,종교,장애,연령,인종,지역,직업 등)" , key: 8, type: 'normal'},
    {text:"서비스 명칭 또는 운영진을 사칭하여 타인을 속이거나 피해와 혼란을 주는 행위" , key: 9, type: 'normal'},
    {text:"타인의 개인정보 및 계정, 기기를 도용/탈취하여 서비스를 이용 하는 행위" , key: 10, type: 'normal'},
    {text:"타인의 권리침해 및 명예훼손" , key: 11, type: 'normal'},
    {text:"다수의 계정을 이용한 어뷰징 활동" , key: 12, type: 'normal'},
    {text:"서비스 내 현금 거래" , key: 13, type: 'normal'},
    {text:"고의적인 서비스 운영 방해" , key: 14, type: 'normal'},
    {text:"연령제한으로 인한 한시적 제재조치" , key: 15, type: 'normal'},
    {text:"서비스 자체 기준 위반" , key: 16 , type: 'input'},
]

export function ReportPopup({ popup}) {

    const context = useContext(Context);
    const { globalState, globalAction } = useContext(GlobalContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    let onClick = (data , notificationYn)=>{
        if(!data.declaration_slctType){
            globalAction.setAlertStatus({
                status: true,
                type: "alert",
                content: "제재조치를 선택하세요.",
            });
            return false;
        }else if(!data.declaration_message){
            globalAction.setAlertStatus({
                status: true,
                type: "alert",
                content: "제재사유를 한 가지 이상 선택하세요.",
            });
            return false;
        }
        let opCode = data.declaration_slctType[0];
        let uuid_block = data.blockType && data.blockType?.includes('deviceuuid')  ? 1 : 0;
        let ip_block = data.blockType && data.blockType?.includes('ip') ? 1 : 0;
        let memNo_block = data.blockType && data.blockType?.includes('nameNo') ? 1 : 0;
        let phone_block = data.blockType && data.blockType?.includes('phone') ? 1 : 0;
        let block_day;
        if(opCode == 3) {
            block_day = 1;
        } else if(opCode == 4) {
            block_day = 3;
        } else if(opCode == 5) {
            block_day = 7;
        } else if(opCode == 6 || opCode == 8) {
            block_day = 99;
        }

        let reportMessage = data.declaration_message.map((key, index)=>{
            try {
                let filter = reportDetailList.filter((data) => {
                    return data.key === Number(key)
                });
                let selectData = filter[0];
                let text = selectData.text;
                if (selectData.type === "input") {
                    text += " : " + data['declaration_message' + selectData.key]
                }
                text += "\n";
                return text
            } catch (e) {
                return ""
            }
        })

        let messageTitle;
        let message;
        let memNick = globalState.broadcastAdminLayer.nickNm;
        if(opCode == 2) {
            messageTitle = AdminMessage.warningTitle;
            message = AdminMessage.warning
        } else if(opCode == 3 || opCode == 4 || opCode == 5) {
            messageTitle = AdminMessage.stopTitle;
            message = AdminMessage.stop
        } else if(opCode == 6 || opCode == 7) {
            messageTitle = AdminMessage.outTitle;
            message = AdminMessage.out
        }else if(opCode == 8){
            messageTitle = AdminMessage.pauseTitle;
            message = AdminMessage.pause
        }
       message = message.replace('{{message}}', reportMessage)
                        .replace('{{timestamp}}', moment().format('YYYY.MM.DD'))
                        .replace('{{name}}', '달빛지기')
                        .replace('{{nickName}}', memNick);
        // roomNo
        let message1 = {
            msg: `신고처리 하시겠습니까?`,
            callback: async () => {
                const form = new FormData()
                form.append("reportIdx" , "0");
                form.append("reported_mem_no" , globalState.broadcastAdminLayer.memNo);
                form.append("mem_nick" , memNick);
                form.append("opCode" , opCode);
                form.append("sendNoti" , "0");
                form.append("notificationYn" , notificationYn);
                form.append("adminMemo" , message);
                form.append("uuid_block" , String(uuid_block));
                form.append("ip_block" , String(ip_block));
                form.append("memNo_block" , String(memNo_block));
                form.append("phone_block" , String(phone_block));
                if(block_day){
                    form.append("block_day" , block_day);
                }
                if(notificationYn === 'Y'){
                    form.append("etc" , data['declaration_message16'] ? data['declaration_message16'] : '');
                    form.append("notiContents" , messageTitle );
                    form.append("notiMemo" , message );
                }
                await API.adminDeclarationOperate(form);
                popup(false);
                globalAction.setBroadcastAdminLayer!((prevState) => ({
                    ...prevState,
                    status: false,
                    roomNo: "",
                    memNo: "",
                    nickNm: "",
                }));
            }
        };
        context.action.confirm(message1)
    };
    return <LayerPopup title="신고조치" setPopup={popup}>
        <form>
            <div className="sanctionContent">
                <section className="sanctionWrap">
                    <div className="sanctionTitle">차단 유형</div>
                    <div className="sanctionListWrap">
                        <div className="sanctionlist">
                            <label className="checkBoxLabel">
                                <input type="checkbox" {...register('blockType')} className="blind" value="nameNo"/>
                                <span className="checkIcon"/>
                                <p>회원번호</p>
                            </label>
                        </div>
                        <div className="sanctionlist">
                            <label className="checkBoxLabel">
                                <input type="checkbox" {...register('blockType')} className="blind" value="deviceuuid"/>
                                <span className="checkIcon"/>
                                <p>deviceUuid</p>
                            </label>
                        </div>
                        <div className="sanctionlist">
                            <label className="checkBoxLabel">
                                <input type="checkbox" {...register('blockType')} className="blind" value="ip"/>
                                <span className="checkIcon"/>
                                <p>접속아이피</p>
                            </label>
                        </div>
                        <div className="sanctionlist">
                            <label className="checkBoxLabel">
                                <input type="checkbox" {...register('blockType')} className="blind" value="phone"/>
                                <span className="checkIcon"/>
                                <p>휴대폰번호</p>
                            </label>
                        </div>
                    </div>
                </section>
                <section className="sanctionWrap">
                    <div className="sanctionTitle">제재 조치</div>
                    <div className="sanctionListWrap">
                        { reportDateList.map((data ,index)=>{
                            return <SanctionList key={index} type={"radio"} register={register} text={""} name={'declaration_slctType'} value={data.key}>{data.text}</SanctionList>
                        })}
                    </div>
                </section>
                <section className="sanctionWrap">
                    <div className="sanctionTitle">제재 사유 선택</div>
                    <div className="sanctionListWrap">
                        {reportDetailList.map((data ,index)=>{
                            return <SanctionList key={index} type={"check"} register={register} text={data.type} name={'declaration_message'} value={data.key}>{data.text}</SanctionList>
                        })}
                    </div>
                </section>
            </div>
            <div className="btnWrap">
                <button className="confirmBtn" onClick={handleSubmit((data)=>{ onClick(data , 'N') })}>확인</button>
                <button className="messageBtn" onClick={handleSubmit((data)=>{ onClick(data , 'Y') })}>확인 및 메시지 발송</button>
            </div>
        </form>
    </LayerPopup>;
}