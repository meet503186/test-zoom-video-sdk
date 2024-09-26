import { IOption } from "@/components/ui/Dropdown";
import ZoomVideo from "@zoom/videosdk";
import { KJUR } from "jsrsasign";

export function generateVideoToken(
  sdkKey: string,
  sdkSecret: string,
  topic: string,
  sessionKey = "",
  userIdentity = "",
  roleType = 1,
  cloud_recording_option = "",
  cloud_recording_election = "",
  telemetry_tracking_id = ""
) {
  let signature = "";
  try {
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;

    // Header
    const oHeader = { alg: "HS256", typ: "JWT" };
    // Payload
    const oPayload = {
      app_key: sdkKey,
      iat,
      exp,
      tpc: topic,
      role_type: roleType,
    };
    if (cloud_recording_election === "" && cloud_recording_option === "1") {
      Object.assign(oPayload, {
        cloud_recording_option: 1,
      });
    } else {
      Object.assign(oPayload, {
        cloud_recording_option: parseInt(cloud_recording_option, 10),
        cloud_recording_election: parseInt(cloud_recording_election, 10),
      });
    }
    if (sessionKey) {
      Object.assign(oPayload, { session_key: sessionKey });
    }
    if (userIdentity) {
      Object.assign(oPayload, { user_identity: userIdentity });
    }

    if (telemetry_tracking_id) {
      Object.assign(oPayload, { telemetry_tracking_id });
    }
    // Sign JWT
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    signature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);
  } catch (e) {
    console.error(e);
  }
  return signature;
}

export const mountDevices: () => Promise<{
  mics: IOption[];
  speakers: IOption[];
  cameras: IOption[];
}> = async () => {
  let allDevices = await ZoomVideo.getDevices();

  const cameraDevices: Array<MediaDeviceInfo> = allDevices.filter((device) => {
    return device.kind === "videoinput";
  });
  const micDevices: Array<MediaDeviceInfo> = allDevices.filter((device) => {
    return device.kind === "audioinput";
  });
  const speakerDevices: Array<MediaDeviceInfo> = allDevices.filter((device) => {
    return device.kind === "audiooutput";
  });
  return {
    mics: micDevices.map((item) => {
      return { label: item.label, value: item.deviceId };
    }),
    speakers: speakerDevices.map((item) => {
      return { label: item.label, value: item.deviceId };
    }),
    cameras: cameraDevices.map((item) => {
      return { label: item.label, value: item.deviceId };
    }),
  };
};

export const checkPermissions = () => {
  return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
};
