import React from "react";

import { ClipProvider } from "context/clip_ctx";
import ClipContent from "./content";

export default function Clip() {
  return (
    <ClipProvider>
      <ClipContent />
    </ClipProvider>
  );
}
