import React, {useState} from 'react'
import styled, {keyframes} from 'styled-components'

import '../draw.scss'

export default (props) => {
    return (
        <BoardWrap>
            <div className="boardRow">
                <div className="boardList active">
                    <img src="https://image.dalbitlive.com/event/draw/drawBoard_1.png"/>
                </div>
                <div className="boardList">
                    <img src="https://image.dalbitlive.com/event/draw/drawBoard_1_header.png" />
                </div>
                <div className="boardList">
                    <img src="https://image.dalbitlive.com/event/draw/drawBoard_1.png" />
                </div>
                <div className="boardList">
                    <img src="https://image.dalbitlive.com/event/draw/drawBoard_1.png" />
                </div>
                <div className="boardList">
                    <img src="https://image.dalbitlive.com/event/draw/drawBoard_1.png" />
                </div>
                <div className="boardList">
                    <img src="https://image.dalbitlive.com/event/draw/drawBoard_1.png" />
                </div>
            </div>
            <div className="boardRow">
                <div className="boardList active">
                    <img src="https://image.dalbitlive.com/event/draw/drawBoard_2.png"/>
                </div>
                <div className="boardList">
                    <img src="https://image.dalbitlive.com/event/draw/drawBoard_2_header.png" />
                </div>
                <div className="boardList">
                    <img src="https://image.dalbitlive.com/event/draw/drawBoard_2.png" />
                </div>
                <div className="boardList">
                    <img src="https://image.dalbitlive.com/event/draw/drawBoard_2.png" />
                </div>
                <div className="boardList">
                    <img src="https://image.dalbitlive.com/event/draw/drawBoard_2.png" />
                </div>
                <div className="boardList">
                    <img className="squareHeader" src="https://image.dalbitlive.com/event/draw/drawBoard_2_header.png" />
                    <img className="square animate-out" src="https://image.dalbitlive.com/event/draw/drawBoard_2.png" />
                </div>
            </div>
        </BoardWrap>
    )
}

const BoardWrap = styled.div`
    display: grid;
    width: 100%;
    min-height: 545px;
    grid-template-columns : repeat(1, 1fr);
    grid-template-rows : repeat(10, 1fr);
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