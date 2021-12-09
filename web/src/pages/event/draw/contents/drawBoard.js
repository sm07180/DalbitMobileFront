import React, {useCallback, useContext} from 'react'
import styled from 'styled-components'

import '../draw.scss'
import {Context} from "context";

export default (props) => {

  const {listInfo, drawList, pageNo} = props;
  const context = useContext(Context);

  const fakeClick = useCallback(() => {
    context.action.toast({msg: `이미 추첨된 뽑기입니다.`});
  }, []);

  return (
    <BoardWrap>
      {new Array(10).fill(0).map((row, index) => {
        const startNum = (index * 6) + (pageNo - 1) * 60;
        const evenYn = index % 2 === 1;
        return (
          <div className="boardRow" key={index}>
            {listInfo.slice(startNum, startNum + 6).map((value, vIndex) => {
              const activeYn = drawList.select.findIndex(row => row == value.bbopgi_gift_pos_no) !== -1;
              const aniYn = drawList.aniList.findIndex(row => row == value.bbopgi_gift_pos_no) !== -1;
              return (
                <div className={`boardList ${activeYn ? 'active' : ''}`} key={vIndex} data-pos-no={value.bbopgi_gift_pos_no} onClick={value.ins_date === null ? props.onSelectItem : fakeClick}>
                  <img src={`https://image.dalbitlive.com/event/draw/drawBoard_${evenYn ? 2 : 1}${(value.ins_date !== null || aniYn) ? '_header' : ''}.png`}/>
                  {aniYn && <img className="square splitOut" src={`https://image.dalbitlive.com/event/draw/drawBoard_${evenYn ? 2 : 1}_split.png`}/>}
                </div>
              )
            })}
          </div>
        )
      })}
    </BoardWrap>
  )
}

const BoardWrap = styled.div`
    display: grid;
    width: 100%;
    min-height: 545px;
    grid-template-columns : repeat(1, 1fr);
    /*grid-template-rows : repeat(10, 1fr);*/
    row-gap: 5px;
    padding: 0 17px;
    box-sizing: border-box;
    .board{
        &Row{
            display: grid;
            width:100%;
            height:100%;
            grid-template-columns : repeat(6, 1fr);
            grid-template-rows : repeat(1, 1fr);
            column-gap: 5px;
        }
        &List {
            position:relative;
            perspective:1000px;
            img {width:100%;}
            cursor:pointer;
            &.active{
                &:after{
                    content:"";
                    position:absolute;
                    top:50%;
                    left:50%;
                    transform:translate(-50%, -50%);
                    width:105%;
                    height:105%;
                    background: url("https://image.dalbitlive.com/event/draw/drawBoardActive.png") no-repeat center / contain;
                }
            }
            .square{
                position:absolute;
                left:0;
                top:0;
                transform-origin : top right;
            }
        }
    }
`