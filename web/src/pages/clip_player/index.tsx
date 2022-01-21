import React, { useState, useRef, useEffect, useCallback, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";

import { ClipProvider } from "context/clip_ctx";
import ClipContent from "./content";

export default function Clip() {
  return (
    <ClipProvider>
      <ClipContent />
    </ClipProvider>
  );
}
