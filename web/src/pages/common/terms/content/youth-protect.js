/**
 * @file terms/content/youth-protext.js
 * @brief 청소년 보호정책 약관
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

////---------------------------------------------------------------------
export default (props) => {
  //context
  const context = useContext(Context)

  //---------------------------------------------------------------------
  return (
    <div className="termsWrap">
      <h2>청소년 보호정책</h2>
      <p>
        (주)인포렉스(이하 “회사”라 함)는 청소년이 안전한 인격체로 성장할 수 있도록 하기 위하여 정보통신망이용촉진 및 정보보호에
        관한법률 및 청소년보호법에 근거하여 청소년보호정책을 수립, 시행하고 있습니다. <br />
        <br />
        회사는 방송통신심의위원회 심의규정 및 청소년 유해매체물 심의규정 기준 등에 따라 만 19세 미만의 청소년들이 유해정보에
        접근할 수 없도록 방지하고 있으며, 본 청소년보호정책을 통하여 회사가 청소년보호를 위하여 어떠한 조치를 취하고 있는지
        알려드립니다.
      </p>
      <h3>청소년보호정책</h3>
      <h3>01. 유해성 정보에 대한 청소년 접근제한 및 관리조치</h3>
      <p>
        회사는 청소년이 아무런 제한 없이 불법 · 유해정보에 노출되어 피해를 입지 않도록 청소년 유해매체물에 대하여 별도의
        성인인증장치를 적용하며, 청소년 유해정보가 노출되지 않도록 사전예방 차원의 조치를 취합니다.
      </p>
      <h3 style={{letterSpacing: '-0.3px'}}>02. 유해성 정보로부터의 청소년보호를 위한 업무 관련자 교육</h3>
      <p>
        회사는 청소년보호와 관련한 업무 담당자를 대상으로 정보통신망이용촉진 및 정보보호에 관한법률 및 청소년보호법 등 청소년보호
        관련 법령과 유해정보 발견 시 처리 방법, 위반사항 처리에 대한 보고절차 등을 교육하고 있습니다.
      </p>
      <h3>03. 유해성 정보로 인한 피해상담 및 고충처리</h3>
      <p>
        회사는 청소년 유해정보로 인한 피해 상담 및 고충처리를 위하여 담당 인력을 배치하여 그 처리에 만전을 기하고 있으며, 피해의
        확산을 방지하고자 최선의 노력을 다하고 있습니다. 청소년 유해매체물의 신고 및 피해상담, 고충처리 등 청소년보호와 관련한
        문제는 청소년보호센터에 관련 내용을 접수하시거나 아래의 청소년보호 책임자 및 담당자에게 연락하여 주시면 신속하고 공정하게
        처리하도록 하겠습니다.
      </p>
      <br />
      <p>
        청소년보호책임자
        <br />
        이름 : 양대기 <br />
        소속 : 콘텐츠사업부 <br />
        전자우편 : help@dalbitlive.com <br />
        전화번호 : 02-2052-5900
      </p>
    </div>
  )
}

//---------------------------------------------------------------------
//styled
const Content = styled.div``
