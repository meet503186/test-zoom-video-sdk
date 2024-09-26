import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Dropdown, { IOption } from "@/components/ui/Dropdown";
import { mountDevices } from "@/shared/utils";
import ZoomVideo from "@zoom/videosdk";
import { useEffect, useRef, useState } from "react";

let localVideo = ZoomVideo.createLocalVideoTrack();
let localAudio = ZoomVideo.createLocalAudioTrack();

const Preview = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isMirrored, setIsMirrored] = useState(true);

  const [cameraList, setCameraList] = useState<IOption[]>([]);
  const [micList, setMicList] = useState<IOption[]>([]);
  const [speakerList, setSpeakerList] = useState<IOption[]>([]);

  const [activeCamera, setActiveCamera] = useState<string>("");
  const [activeMic, setActiveMic] = useState<IOption | null>(null);
  const [activeSpeaker, setActiveSpeaker] = useState<IOption | null>(null);

  const toggleVideo = async () => {
    if (videoRef.current) {
      isVideoStarted
        ? await localVideo.stop()
        : await localVideo.start(videoRef.current);

      setIsVideoStarted(!isVideoStarted);
    }
  };

  const toggleAudio = async () => {
    if (!isAudioStarted) {
      await localAudio.start();
      setIsAudioStarted(true);
    } else {
      isMuted ? await localAudio.unmute() : await localAudio.mute();
      setIsMuted(!isMuted);
    }
  };

  const onChangeCamera = async (deviceId: string) => {
    if (localVideo && activeCamera !== deviceId) {
      await localVideo.switchCamera(deviceId);
      setActiveCamera(deviceId);
    }
  };

  const testSpeaker = async () => {
    localAudio.testSpeaker();
  };

  const mirrorVideo = () => {
    setIsMirrored(!isMirrored);
  };

  useEffect(() => {
    mountDevices()
      .then((devices) => {
        setCameraList(devices.cameras);
        devices.cameras.length && setActiveCamera(devices.cameras[0].value);
        setMicList(devices.mics);
        devices.mics.length &&
          setActiveMic({
            label: devices.mics[0].label,
            value: devices.mics[0].value,
          });
        setSpeakerList(devices.speakers);
        devices.speakers.length &&
          setActiveSpeaker({
            label: devices.speakers[0].label,
            value: devices.speakers[0].value,
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="flex flex-col gap-4 py-4">
      <video
        className={`w-full aspect-square object-cover bg-black`}
        style={{ transform: isMirrored ? "scaleX(1)" : "scaleX(-1)" }}
        ref={videoRef}
      />

      <div className="flex items-center space-x-2">
        <Checkbox id="mirror" onCheckedChange={mirrorVideo} />
        <label
          htmlFor="mirror"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Mirror video
        </label>
      </div>

      <div className="flex gap-4">
        <Button variant={"outline"} onClick={toggleAudio}>
          {isAudioStarted
            ? isMuted
              ? "Unmute audio"
              : "Mute audio"
            : "Start audio"}
        </Button>
        <Button onClick={toggleVideo}>
          {isVideoStarted ? "Stop video" : "Start video"}
        </Button>
      </div>

      <div className="flex gap-4">
        <Dropdown
          label="Camera"
          options={cameraList}
          SelectProps={{
            value: activeCamera,
            onValueChange: onChangeCamera,
          }}
        />
        <Dropdown
          label="Microphone"
          options={micList}
          SelectProps={{
            value: activeMic?.value,
          }}
        />
        <Dropdown
          label="Speaker"
          options={speakerList}
          SelectProps={{
            value: activeSpeaker?.value,
          }}
        />
      </div>

      <div className="flex gap-4">
        <Button variant={"outline"} onClick={testSpeaker}>
          Test Speaker
        </Button>
        <Button onClick={toggleVideo}>
          {isVideoStarted ? "Stop video" : "Start video"}
        </Button>
      </div>
    </div>
  );
};

export default Preview;
