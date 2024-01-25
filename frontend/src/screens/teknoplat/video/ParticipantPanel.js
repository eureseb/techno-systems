import { useLoaderData } from "react-router-dom";
import VideoPageVideoViewParticipantPanelParticipant from "./VideoPage.VideoView.ParticipantPanel.Participant";
import { useMeeting } from "@videosdk.live/react-sdk";
import { List, ListItem, ListItemButton, ListItemText, ListSubheader, Paper } from "@mui/material";
import { useClassMembers } from "../../../hooks";
import { useEffect, useState } from "react";
import GLOBALS from "../../../app_globals";

const ParticipantPanel = ({meeting}) => {
    const { participants } = useMeeting();
    const { user, classId, classRoom, classMember } = useOutletContext();
    const { isRetrieving, classMembers } = useClassMembers(classId);


    const [inMeeting, setInMeeting] = useState([]);
    const [notInMeeting, setNotInMeeting] = useState([]);

    useEffect(() => {
        if (!isRetrieving) {
            const inMeetingList = [...participants.keys()].map((participant) => classMembers.find((member) => member.id === participant));
            const notInMeetingList = classMembers.filter((member) => !inMeeting.find((meetingMember) => member.id === meetingMember.id));
            setInMeeting(inMeetingList);
            setNotInMeeting(notInMeetingList);
        }
    }, [isRetrieving])

    return (
        <Paper sx={{ height: "calc(100vh - 72px - 48px - 24px)", width: "360px" }}>
            <List 
                sx={{ 
                    py: 0,
                    height: "100%",
                    overflowY: "hidden",
                    ":hover": {
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        "&::-webkit-scrollbar": {
                            width: "6px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: (theme) => theme.palette.primary.main,
                            borderRadius: "2.5px",
                        },
                        "&::-webkit-scrollbar-track": {
                            backgroundColor: (theme) => theme.palette.background.paper,
                        },
                    },
                }}
            >
                <ListSubheader sx={{ backgroundColor: "inherit", position: "relative" }}>
                    Teachers
                </ListSubheader>
                {inMeeting.filter((member) => member.role === GLOBALS.CLASSMEMBER_ROLE.TEACHER).map((teacher) => {
                    if (meeting.owner === teacher.id) {
                        return <Participant
                                    key={teacher.id} 
                                    participant={teacher} 
                                    isNotHost={false} 
                                    isOwner={classMember.id === meeting.owner_id}
                                />
                    } else {
                        return <Participant 
                                    key={teacher.id} 
                                    participant={teacher} 
                                    isNotHost={true} 
                                    isOwner={classMember.id === meeting.owner_id}
                                />
                    }
                })}
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Students
                </ListSubheader>
                {inMeeting.filter((member) => member.role === "Student").map((student) => (
                    <Participant 
                        key={student.id} 
                        participant={student} 
                        isNotHost={true} 
                        isOwner={classMember.id === meeting.owner_id}
                    />
                ))}
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Not In Meeting
                </ListSubheader>
                {notInMeeting.map((member) => (
                    <ListItem 
                        key={member.id}
                        disablePadding
                    >
                        <ListItemButton 
                            disabled 
                            sx={{ 
                                opacity: "1 !important", 
                                userSelect: "text", 
                                cursor: "text !important", 
                                pointerEvents: "auto" 
                            }}
                        >
                            <ListItemText primary={member.full_name}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

const Participant = ({ participant, isNotHost, isOwner }) => {
    const { enableWebcam: remoteEnableWebcam, disableWebcam: remoteDisableWebcam, enableMic, disableMic: remoteDisableMic, webcamOn, micOn } = useParticipant(participant.id);
    const { enableWebcam: localEnableWebcam, disableWebcam: localDisableWebcam, unmuteMic, muteMic } = useMeeting({
        onWebcamRequested: ({ accept, reject, participantId }) => {
            // callback function to accept the request
            // how to get the webcam option and let user choose
            accept();
        },
        onMicRequested: ({ accept, reject, participantId }) => {
            // callback function to accept the request
            accept();
        },
    });

    function handleToggleParticipantWebCam() {
        if (webcamOn) {
            remoteDisableWebcam();
            setTimeout(() => {
                localEnableWebcam();
            }, 500);
        } else {
            localDisableWebcam();
            setTimeout(() => {
                remoteEnableWebcam();
            }, 500);
        }
    }

    // const handleToggleParticipantMic = () => {
    //     if (micOn) {
    //         remoteDisableMic();
    //         setTimeout(() => {
    //             unmuteMic();
    //         }, 500);
    //     } else {
    //         muteMic();
    //         setTimeout(() => {
    //             enableMic();
    //         }, 500);
    //     }
    // }

    return (
        <ListItem 
            disablePadding
            secondaryAction= {isNotHost && isOwner && (
                <Stack direction="row" spacing={1}>
                    <IconButton aria-label="toggleMic">
                        {micOn ? <Mic /> : <MicOff />}
                    </IconButton>
                    <IconButton aria-label="toggleVideo" onClick={handleToggleParticipantWebCam}>
                        {webcamOn ? <Videocam /> : <VideocamOff />}
                    </IconButton>
                </Stack>
            )}
        >
            <ListItemButton 
                disabled 
                sx={{ 
                    opacity: "1 !important", 
                    userSelect: "text", 
                    cursor: "text !important", 
                    pointerEvents: "auto" 
                }}
            >
                <ListItemText primary={participant.full_name}/>
            </ListItemButton>
        </ListItem>
    );
}

export default ParticipantPanel;