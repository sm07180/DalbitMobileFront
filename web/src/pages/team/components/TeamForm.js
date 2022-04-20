import React from 'react';
// global components
import InputItems from 'components/ui/inputItems/InputItems';

const TeamForm = (props) => {
  const {rows,teamConts,editCnts,editName,teamName,cols,editChk} = props;

  // 페이지 시작
  return (
    <section className={`teamForm ${'active'}`}>
      <InputItems title="팀 이름">
        <input type="text" maxLength={10} placeholder="필수입력(최대 10자)"
               onChange={(e)=>editName(e)}
               value={teamName}
               disabled={editChk}
        />
      </InputItems>
      <InputItems title="팀 소개" type="textarea">
        <textarea rows={rows} cols={cols} maxLength={150} placeholder="팀을 소개해 주세요. (최대 150자)"
                  onChange={(e)=>editCnts(e)}
        value={teamConts}
        />
        <p className="count">{teamConts.length}/150</p>
      </InputItems>
    </section>
  )
}

export default TeamForm;
