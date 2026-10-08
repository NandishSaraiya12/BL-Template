import React, { useMemo } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { MeetingContainer } from "./components/MeetingContainer";
import { BeatlandLayout } from "./components/BeatlandLayout";
import { Stage } from "./components/Stage";
import { templateConfig } from "./config";

const demoSlots = {
  battlers: [
    { id: "den", name: "DEN", country: "ca" },
    { id: "heartzel", name: "HEARTZEL", country: "my" },
  ],
  host: { id: "scott", name: "SCOTT JACKSON", country: "ca" },
  judges: [
    { id: "pash", name: "PASH", country: "ru" },
    { id: "petr", name: "PETR SARANCHA", country: "ru" },
    { id: "river", name: "RIVER", country: "fr" },
    { id: "zhang", name: "ZHANG ZE", country: "cn" },
    { id: "dharni", name: "DHARNI", country: "sg" },
  ],
};

export default function App() {
  const { meetingId, token, participantId } = useMemo(() => {
    const location = window.location;

    const urlParams = new URLSearchParams(location.search);

    const paramKeys = {
      meetingId: "meetingId",
      token: "token",
      participantId: "participantId",
    };

    Object.keys(paramKeys).forEach((key) => {
      paramKeys[key] = urlParams.get(key)
        ? decodeURIComponent(urlParams.get(key))
        : null;
    });

    return paramKeys;
  }, []);

  if (templateConfig.demo) {
    return (
      <Stage orientation={templateConfig.orientation} rotate={templateConfig.rotate}>
        <BeatlandLayout
          slots={demoSlots}
          text={templateConfig}
          orientation={templateConfig.orientation}
          live={false}
        />
      </Stage>
    );
  }

  return meetingId && token && participantId ? (
    <div>
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: false,
          webcamEnabled: false,
          name: "recorder",
          participantId,
        }}
        token={token}
        joinWithoutUserInteraction
      >
        <MeetingContainer />
      </MeetingProvider>
    </div>
  ) : null;
}
