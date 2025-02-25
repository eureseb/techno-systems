import { Box, Typography } from "@mui/material";
import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";

const ParticipantView = ({ participantId }) => {
    const micRef = useRef(null);
    const videoRef = useRef(null);

    const { webcamStream, micStream, webcamOn, micOn, displayName } = useParticipant(participantId);
    const [maskHeight, setMaskHeight] = useState("100%");

    const videoStream = useMemo(() => {
        if (webcamOn && webcamStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            return mediaStream;
        }
    }, [webcamStream, webcamOn]);

    useEffect(() => {
        if(videoRef.current?.clientHeight) {
            setMaskHeight(videoRef.current.clientHeight);
        }
    }, [])

    useEffect(() => {
        if (micRef.current) {
            if (micOn && micStream) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(micStream.track);

                micRef.current.srcObject = mediaStream;
                micRef.current
                    .play()
                    .catch((error) =>
                        console.error("videoElem.current.play() failed", error)
                    );
            } else {
                micRef.current.srcObject = null;
            }
        }
    }, [micStream, micOn]);

    return (
        <Box>
            <audio ref={micRef} autoPlay playsInline muted={micOn} />
            <Box sx={{ position: "relative", display: webcamOn ? "block" : "none" , backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center" }}>
                <ReactPlayer
                    ref={videoRef}
                    playsinline 
                    pip={false}
                    light={false}
                    controls={false}
                    muted={true}
                    playing={true}
                    url={videoStream}
                    height={"calc(100vh - 72px - 48px - 24px)"}
                    width={"-webkit-fill-available"}
                    onError={(err) => {
                        console.log(err, "participant video error");
                    }}
                />
                <Box sx={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0, width: "100%", height: maskHeight, backgroundAttachment: "fixed" }}>
                  <Box sx={{ backgroundColor: "#000000a8", position: "absolute", bottom: 0, p: 1 }}>
                    <Typography variant="button" fontSize={12}>{displayName}</Typography>
                  </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default ParticipantView;