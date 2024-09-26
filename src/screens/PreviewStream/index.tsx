import FullScreenLoader from "@/components/FullScreenLoader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Dropdown, { IOption } from "@/components/ui/Dropdown";
import Modal from "@/components/ui/Modal";
import mediaContext from "@/context/media-context";
import zoomContext from "@/context/zoom-context";
// import { useParticipantsChange } from "@/hooks/useParticipantsChange";
// import { usePrevious } from "@/hooks/usePrevious";
import { ILoading } from "@/interfaces/common.interface";
import { checkPermissions, mountDevices } from "@/shared/utils";
import {
  ConnectionChangePayload,
  ConnectionState,
  VideoPlayer,
  VideoPlayerContainer,
  // VideoQuality,
} from "@zoom/videosdk";
import {
  DetailedHTMLProps,
  DOMAttributes,
  HTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["video-player"]: DetailedHTMLProps<
        HTMLAttributes<VideoPlayer>,
        VideoPlayer
      > & { class?: string };
      ["video-player-container"]: CustomElement<VideoPlayerContainer> & {
        class?: string;
      };
      // ['zoom-video']: DetailedHTMLProps<HTMLAttributes<VideoPlayer>, VideoPlayer> & { class?: string };
      // ['zoom-video-container']: CustomElement<VideoPlayerContainer> & { class?: string };
    }
  }
}

const PreviewStream = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<ILoading>({ isLoading: false });

  const mediaStream = useContext(mediaContext);
  const zmClient = useContext(zoomContext);
  const videoPlayerListRef = useRef<Record<string, VideoPlayer>>({});

  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isMirrored, setIsMirrored] = useState(false);

  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const onCloseDialog = () => setShowPermissionsDialog(false);

  const [cameraList, setCameraList] = useState<IOption[]>([]);
  const [micList, setMicList] = useState<IOption[]>([]);
  const [speakerList, setSpeakerList] = useState<IOption[]>([]);

  const [activeCamera, setActiveCamera] = useState<string>("");
  const [activeMic, setActiveMic] = useState<string>("");
  const [activeSpeaker, setActiveSpeaker] = useState<string>("");

  const currentUser = zmClient.getCurrentUserInfo();

  const participants = zmClient.getAllUser();
  // const [subscribers, setSubscribers] = useState<number[]>([]);
  // const previousSubscribers = usePrevious(subscribers);

  const toggleVideo = async () => {
    if (videoPlayerListRef.current && currentUser?.userId) {
      if (isVideoStarted) {
        await mediaStream?.stopVideo();
        await mediaStream?.detachVideo(currentUser.userId);
      } else {
        await mediaStream?.startVideo({
          hd: true,
        });

        await mediaStream?.attachVideo(
          currentUser.userId,
          3,
          videoPlayerListRef.current[currentUser.userId]
        );
      }

      setIsVideoStarted(!isVideoStarted);
    }
  };

  const toggleAudio = async () => {
    if (!isAudioStarted) {
      await mediaStream?.startAudio();
      setIsAudioStarted(true);
    } else {
      isMuted
        ? await mediaStream?.unmuteAudio()
        : await mediaStream?.muteAudio();
      setIsMuted(!isMuted);
    }
  };

  const onChangeCamera = async (deviceId: string) => {
    if (activeCamera !== deviceId) {
      await mediaStream?.switchCamera(deviceId);
      setActiveCamera(deviceId);
    }
  };

  const onChangeMic = async (deviceId: string) => {
    if (activeMic !== deviceId) {
      await mediaStream?.switchMicrophone(deviceId);
      setActiveMic(deviceId);
    }
  };

  const onChangeSpeaker = async (deviceId: string) => {
    if (activeSpeaker !== deviceId) {
      await mediaStream?.switchSpeaker(deviceId);
      setActiveSpeaker(deviceId);
    }
  };

  const mirrorVideo = async () => {
    await mediaStream?.mirrorVideo(!isMirrored);
    setIsMirrored(!isMirrored);
  };

  const checkDevicePermissions = async () => {
    try {
      const isGranted = await checkPermissions();
      setShowPermissionsDialog(!isGranted);
    } catch (error) {
      setShowPermissionsDialog(true);
    }
  };

  const endSession = async () => {
    setLoading({ message: "Ending...", isLoading: true });
    await zmClient.leave(true);
    setLoading({ isLoading: false });
    navigate("/");
  };

  const leaveSession = async () => {
    setLoading({ message: "Leaving...", isLoading: true });
    await zmClient.leave();
    setLoading({ isLoading: false });
    navigate("/");
  };

  const onConnectionChange = (payload: ConnectionChangePayload) => {
    switch (payload.state) {
      case ConnectionState.Closed:
        currentUser.isHost ? endSession() : leaveSession();
        break;

      default:
        break;
    }
  };

  console.log(currentUser, videoPlayerListRef.current);

  useEffect(() => {
    checkDevicePermissions();
    zmClient.on("connection-change", onConnectionChange);
    mountDevices()
      .then((devices) => {
        setCameraList(devices.cameras);
        devices.cameras.length && setActiveCamera(devices.cameras[0].value);
        setMicList(devices.mics);
        devices.mics.length && setActiveMic(devices.mics[0].value);
        setSpeakerList(
          devices.speakers.length
            ? devices.speakers
            : [{ label: "Same as system", value: "system" }]
        );

        setActiveSpeaker(
          devices.speakers.length ? devices.speakers[0].value : "system"
        );
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      zmClient.off("connection-change", onConnectionChange);
    };
  }, []);

  // useEffect(() => {
  //   const addedUsers = subscribers.filter(
  //     (user) => !(previousSubscribers || []).includes(user)
  //   );
  //   const removedUsers = (previousSubscribers || []).filter(
  //     (user) => !subscribers.includes(user)
  //   );

  //   if (removedUsers.length > 0) {
  //     removedUsers.forEach((userId) => {
  //       mediaStream?.detachVideo(userId);
  //     });
  //   }
  //   if (addedUsers.length > 0) {
  //     addedUsers.forEach((userId) => {
  //       const attachment = videoPlayerListRef.current[`${userId}`];
  //       if (attachment) {
  //         mediaStream?.attachVideo(userId, VideoQuality.Video_720P, attachment);
  //       }
  //     });
  //   }
  // }, [subscribers, previousSubscribers, mediaStream]);

  // useEffect(() => {
  //   setSubscribers(
  //     participants
  //       .filter((participant) => participant.bVideoOn)
  //       .map((participant) => participant.userId)
  //   );
  // }, [participants]);

  return loading.isLoading ? (
    <FullScreenLoader message={loading.message} />
  ) : (
    <div className="flex flex-col gap-4 py-4">
      <video-player-container class="bg-zinc-900  p-2">
        {participants.map((participant) => {
          return (
            <>
              {!participant.bVideoOn ? (
                <div className="w-full h-[200px] md:h-[300px] bg-zinc-700 flex items-center justify-center text-white z-10">
                  <span>{participant.displayName}</span>
                </div>
              ) : (
                <video-player
                  class={`w-full h-[200px] md:h-[300px] aspect-square object-cover`}
                  ref={(element) => {
                    if (element) {
                      videoPlayerListRef.current[participant.userId] = element;
                    }
                  }}
                />
              )}
            </>
          );
        })}
      </video-player-container>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="mirror"
          checked={isMirrored}
          onCheckedChange={() => mirrorVideo()}
        />
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

        <Button onClick={currentUser?.isHost ? endSession : leaveSession}>
          {currentUser?.isHost ? "End" : "Leave"} Session
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
            value: activeMic,
            onValueChange: onChangeMic,
          }}
        />
        <Dropdown
          label="Speaker"
          options={speakerList}
          SelectProps={{
            value: activeSpeaker,
            onValueChange: onChangeSpeaker,
          }}
        />
      </div>

      <Modal
        isOpen={showPermissionsDialog}
        onClose={onCloseDialog}
        title="Permission Denied"
        description="Please give camera and mic permissions"
        buttons={[
          {
            title: "OK",
            action: onCloseDialog,
          },
        ]}
      />
    </div>
  );
};

export default PreviewStream;
