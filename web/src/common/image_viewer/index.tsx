import React from "react";
import styled from "styled-components";

export default function ImageViewer(props: { path: string; setImgViewerPath?: (data: string) => void }) {
  const { path, setImgViewerPath } = props;
  return (
    <ViewerWrap
      onClick={() => {
        if (setImgViewerPath) {
          setImgViewerPath("");
        }
      }}
    >
      <img src={path} />
    </ViewerWrap>
  );
}

const ViewerWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 10;

  img {
    display: block;
    width: 60%;
  }
`;
