import React from "react";
import { MediaStream } from "../index-types";

export default React.createContext<MediaStream | null>(null as any);
