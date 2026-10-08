import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useRef } from "react";

export const ParticipantVideo = ({ participantId, name }) => {
  const { webcamStream, webcamOn } = useParticipant(participantId);
  const videoRef = useRef(null);
  const hasVideo = webcamOn && webcamStream;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hasVideo) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      video.srcObject = mediaStream;
      video.play().catch((err) => {
        console.log(err, "participant video error");
      });
    } else {
      video.srcObject = null;
    }
  }, [hasVideo, webcamStream]);

  return (
    <>
      <video
        ref={videoRef}
        className="participant-video"
        style={{ display: hasVideo ? "block" : "none" }}
        autoPlay
        playsInline // very very imp prop
        muted
      />
      {!hasVideo && <Avatar name={name} />}
    </>
  );
};

export const Avatar = ({ name }) => (
  <div className="avatar">
    <span>{String(name || "?").charAt(0).toUpperCase()}</span>
  </div>
);
