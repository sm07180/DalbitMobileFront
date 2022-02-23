import React from 'react';

import InputItems from 'components/ui/inputItems/InputItems';
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';

const MakeVote = () => {
  return (
    <>
      <InputItems>
        <div className="number">
          01
        </div>
        <input type="text" maxLength={15} placeholder='내용을 입력해주세요'></input>
        <button className="delete"/>
      </InputItems>
      <InputItems>
        <div className="number">
          02
        </div>
        <input type="text" maxLength={15} placeholder='내용을 입력해주세요'></input>
        <button className="delete"/>
      </InputItems>
      <SubmitBtn text='+ 항목추가' />
    </>
  );
};

export default MakeVote;