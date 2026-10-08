import { Constants, useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { useMemo } from "react";
import { templateConfig } from "../config";
import { LAYOUT_TOPIC, mergeLayoutMessages, resolveSlots } from "../layout";
import { BeatlandLayout } from "./BeatlandLayout";
import { Notification } from "./Notification";
import { ParticipantsAudioPlayer } from "./ParticipantsAudioPlayer";
import { Stage } from "./Stage";

export const MeetingContainer = () => {
  const { isMeetingJoined, participants } = useMeeting();
  const { messages } = usePubSub(LAYOUT_TOPIC);

  const layout = useMemo(() => mergeLayoutMessages(messages), [messages]);

  const remoteSpeakers = [...participants.values()].filter((participant) => {
    return participant.mode === Constants.modes.SEND_AND_RECV && !participant.local;
  });

  const slots = resolveSlots(remoteSpeakers, layout);

  const text = {
    category: layout.category ?? templateConfig.category,
    centerText: layout.centerText ?? templateConfig.centerText,
    live: layout.live ?? templateConfig.live,
    footer: layout.footer ?? templateConfig.footer,
  };

  // The layout renders straight away (with empty tiles) so the recording never
  // starts on a blank screen while the template is still joining.
  return (
    <Stage orientation={templateConfig.orientation} rotate={templateConfig.rotate}>
      {isMeetingJoined && <ParticipantsAudioPlayer />}
      <BeatlandLayout
        slots={slots}
        text={text}
        orientation={templateConfig.orientation}
      />
      <Notification />
    </Stage>
  );
};
