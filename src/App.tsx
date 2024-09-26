import { useContext, useEffect, useState } from "react";
import "./App.css";
import zoomContext from "./context/zoom-context";
import ZoomVideo from "@zoom/videosdk";
import MediaContext from "./context/media-context";
import { MediaStream } from "./index-types";
import Router from "./Router";

function App() {
  const zmClient = useContext(zoomContext);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const initZoom = async () => {
    await zmClient.init("en-US", "Global", {
      enforceVirtualBackground: true,
    });
    const stream = zmClient.getMediaStream();
    setMediaStream(stream);
  };

  useEffect(() => {
    initZoom();

    return () => {
      ZoomVideo.destroyClient();
    };
  }, []);

  return (
    <MediaContext.Provider value={mediaStream}>
      <Router />
    </MediaContext.Provider>
  );
}

export default App;
