import { Participant, ZoomClient } from "@/index-types";
import { useEffect, useCallback, useState } from "react";

export function useParticipantsChange(zmClient: ZoomClient) {
  const [participants, setParticipants] = useState<Participant[]>(
    zmClient.getAllUser()
  );

  const callback = useCallback(() => {
    setParticipants(zmClient.getAllUser());
  }, [zmClient]);

  useEffect(() => {
    zmClient.on("user-added", callback);
    zmClient.on("user-removed", callback);
    zmClient.on("user-updated", callback);
    return () => {
      zmClient.off("user-added", callback);
      zmClient.off("user-removed", callback);
      zmClient.off("user-updated", callback);
    };
  }, [zmClient, callback]);

  return participants;
}
