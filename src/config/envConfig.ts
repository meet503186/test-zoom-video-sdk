const env = import.meta.env;

export const envConfig = {
  sdkKey: env.VITE_ZOOM_SDK_KEY,
  sdkSecret: env.VITE_ZOOM_SDK_SECRET,
  webEndpoint: "zoom.us",
  topic: "online gurukul",
  name: `React`,
  password: "12345",
  signature: "",
  sessionKey: "",
  userIdentity: "",
  // The user role. 1 to specify host or co-host. 0 to specify participant, Participants can join before the host. The session is started when the first user joins. Be sure to use a number type.
  role: 1,
};
