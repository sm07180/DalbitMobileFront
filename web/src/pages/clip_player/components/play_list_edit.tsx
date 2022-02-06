import React, { useState, useEffect, useRef } from "react";
import { List, arrayMove } from "react-movable";
import styled from "styled-components";
import { DalbitScroll } from "common/ui/dalbit_scroll";

export default (props) => {
  const scrollWrapper = useRef<any>(null);
  const scrollBox = useRef<any>(null);
  const [items, setItems] = useState(props.list);
  const [scrollState, setScrollState] = useState(false);

  const { clipType } = props;

  const [scrollHeight, setScrollHeight] = useState(0);

  const handleResize = () => {
    console.log(scrollWrapper.current!.clientHeight);
    setScrollHeight(scrollWrapper.current!.clientHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    setScrollHeight(scrollWrapper.current!.clientHeight);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("items", items);
  }, [items]);

  let timer : any  = 0;
  const HandleScroll = (e) => {
    setScrollState(true);
    if (timer !== null) {
      clearTimeout(timer!);
    }
    timer = setTimeout(function() {
      setScrollState(false);
    }, 3000);
  };

  return (
    <div className="playListWrap">
      <Wrap ref={scrollWrapper}>
        <List
          values={items}
          onChange={({ oldIndex, newIndex }) => setItems(arrayMove(items, oldIndex, newIndex))}
          renderList={({ children, props }) => (
            <ul
              {...props}
              style={{
                padding: 0,
                height: scrollHeight,
                overflowY: "scroll",
                overflowX: "hidden",
              }}
              className={`playListBox ${scrollState ? "on" : "off"}`}
              onScroll={HandleScroll}
              ref={scrollBox}
            >
              {children}
            </ul>
          )}
          renderItem={({ value, props }) => (
            <li {...props} className="playListItem">
              <div className="playListItem__thumb">
                <img src={value["bgImg"]["thumb80x80"]} alt="thumb" />
                <span className="playListItem__thumb--playTime">{value["filePlayTime"]}</span>
              </div>
              <div className="textBox">
                <div className="textBox__iconBox">
                  <span className="textBox__iconBox--type">
                    {clipType.map((v: any, index) => {
                      if (v.value === value["subjectType"]) {
                        return <React.Fragment key={value["clipNo"] + "typeList"}>{v.cdNm}</React.Fragment>;
                      }
                    })}
                  </span>
                  <span
                    className={`textBox__iconBox--gender ${
                      value["gender"] === "f" ? "female" : value["gender"] === "m" ? "male" : ""
                    }`}
                  ></span>
                </div>
                <p className="textBox__subject">{value["title"]}</p>
                <p className="textBox__nickName">{value["nickName"]}</p>
              </div>
            </li>
          )}
        />
      </Wrap>
    </div>
  );
};

const Wrap = styled.div`
  width: 362px;
  height: 100%;

  /* width */
  ul::-webkit-scrollbar {
    width: 8px;
  }

  /* Track */
  ul::-webkit-scrollbar-track {
    background: none;
  }

  /* Handle */
  ul::-webkit-scrollbar-thumb {
    border-radius: 3px;
    transition: background 1s ease-in-out;
    background: none;
  }
  ul.on::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
  }
  ul.off::-webkit-scrollbar-thumb {
    background: none;
  }

  /* Handle on hover */
  ul::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;
