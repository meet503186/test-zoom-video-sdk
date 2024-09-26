import { VideoQuality } from "@zoom/videosdk";

export const optionsOfVideoResolution = [
  { label: "720P", value: VideoQuality.Video_720P.toString() },
  { label: "360P", value: VideoQuality.Video_360P.toString() },
  { label: "180P", value: VideoQuality.Video_180P.toString() },
  { label: "90P", value: VideoQuality.Video_90P.toString() },
];
