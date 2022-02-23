import React from 'react';

const VoteContent = () => {
  return (
    <>
      <section className="voteTitleWrap">
        <h2>일이삼사오육칠팔구십일이삼사오육칠팔구십</h2>
        <div className="countBox">
          <div className="num">
            <span className="icon"></span>
            <p><span>4</span>명 참여</p>
          </div>
          <div className="due">
            <span>20:04</span> 마감예정
          </div>
        </div>
        <button>
          <i className="iconMore"></i>
        </button>
      </section>
      <section className='optionWrap'>
        <div className="optionBox">
          <div>01</div>
          <span>일이삼사오육칠팔구십일이삼사오</span>
        </div>
        <div className="optionBox active">
          <div>01</div>
          <span>일이삼사오육칠팔구십일이삼사오</span>
        </div>
      </section>
    </>
  );
};

export default VoteContent;