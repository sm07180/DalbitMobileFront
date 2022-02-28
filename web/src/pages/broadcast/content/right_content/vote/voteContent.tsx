import React, {useState} from 'react';

const VoteContent = () => {
  const [more, setMore] = useState(false);

  return (
    <>
      <h3 className="tabTitle">
        투표
        <button className="back"/>
      </h3>
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
        <div className="moreBtn" onClick={()=>setMore(!more)}>
          {more &&
            <div className="isMore">
              <button>마감하기</button>
              <button>삭제하기</button>
            </div>
          }
        </div>
      </section>
      <section className='optionWrap'>
        <div className="optionBox">
          <div className='number'>01</div>
          <span>일이삼사오육칠팔구십일이삼사오</span>
          <div className="counterBox">
            <span className="person"/>
            2
          </div>
        </div>
        <div className="optionBox active">
          <div className="number">01</div>
          <span>일이삼사오육칠팔구십일이삼사오</span>
          <div className="counterBox active">
            <span className="person"/>
            20
          </div>
        </div>
      </section>
    </>
  );
};

export default VoteContent;