import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ZoomVideo from "@zoom/videosdk";
import ZoomContext from "./context/zoom-context.ts";
import { BrowserRouter } from "react-router-dom";

const zmClient = ZoomVideo.createClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ZoomContext.Provider value={zmClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ZoomContext.Provider>
  </StrictMode>
);
