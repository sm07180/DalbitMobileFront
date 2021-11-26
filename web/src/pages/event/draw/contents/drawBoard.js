import React from 'react'
import styled from 'styled-components'

export default () => {
    const BoardRow = () => {
        return (
        <div className="boardRow">
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
            <div className="boardList">
                <img src="https://image.dalbitlive.com/event/draw/drawBoard_1.png" />
            </div>
            <div className="boardList">
                <img src="https://image.dalbitlive.com/event/draw/drawBoard_1.png" />
            </div>
        </div>
        )
    }

    return (
        <BoardWrap>
            <BoardRow />
        </BoardWrap>
    )
}

const BoardWrap = styled.div`
    display: grid;
    width: 100%;
    height: 545px;
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
            img {width:100%;}
        }
    }
`