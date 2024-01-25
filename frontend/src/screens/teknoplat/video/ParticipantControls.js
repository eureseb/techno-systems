import GLOBALS from "../../../app_globals";
import { MeetingsService } from "../../../services";

const ParticipantControls = ({ controlTab, changeTab, classMember, meeting }) => {
    const handleTabChange = (index) => {
        if (index === controlTab) {
            changeTab(-1);
        } else {
            changeTab(index);
        }
    }

    return (
        <Paper sx={{ py: 2, px: 4 }} >
            <Box display="flex" justifyContent="space-between">
                <Box width="152px"/>
                { (classMember.role === GLOBALS.CLASSMEMBER_ROLE.TEACHER) ? (
                    <TeacherControls owner={meeting.owner_id} meeting={meeting} />
                ) : (
                    <StudentControls />
                )}
                <Stack direction="row" spacing={2}>
                    <Tooltip title="Rate" enterDelay={300}>
                        <IconButton 
                            onClick={(e) => handleTabChange(0)} 
                            aria-label="toggleRate" 
                            color={controlTab === 0 ? "primary" : "default"}
                        >
                            <EditNote />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Participant" enterDelay={300}>
                        <IconButton 
                            onClick={(e) => handleTabChange(1)} 
                            aria-label="toggleParticipants"
                            color={controlTab === 1 ? "primary" : "default"}
                        >
                            <PeopleAlt />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Chat" enterDelay={300}>
                        <IconButton 
                            onClick={(e) => handleTabChange(2)} 
                            aria-label="toggleVideoChat"
                            color={controlTab === 2 ? "primary" : "default"}
                        >
                            <VideoChat />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
        </Paper>
    );
}

const TeacherControls = ({ owner, meeting }) => {
    const navigate = useNavigate();

    const onParticipantLeft = (participantId) => {
        if (owner === participantId) {
            navigate("/classes");
        }
    }

    const onMeetingLeft = () => {
        navigate("/classes");
    }

    const { toggleMic, toggleWebcam, localMicOn, localWebcamOn, leave, end } = useMeeting({
        onParticipantLeft,
        onMeetingLeft,
    });
    
    const [open, setOpen] = useState(false);
    const [isEnding, setIsEnding] = useState("not leaving");

    useEffect(() => {
        if (isEnding === "ending") {
            end();
        }
        // eslint-disable-next-line
    }, [isEnding]);

    const handleToggleMic = () => {
        toggleMic();
    }

    const handleToggleVideoCam = () => {
        toggleWebcam();
    }

    const handleCallEnd = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleEnd = async () => {
        setIsEnding("saving");
        await meeting.presentors.forEach( async (pitch) => {
            await MeetingsService.addSummaryOfRemarksToPresentor(meeting.id)
        });

        await MeetingsService.end(meeting.id);
        
        if (localMicOn) {
            toggleMic();
        }
        if (localWebcamOn) {
            toggleWebcam();
        }
        setTimeout(() => {
            setOpen(false);
            setIsEnding("ending");
        }, 8000);
    }

    const handleLeave = () => {
        setOpen(false);
        if (localMicOn) {
            toggleMic();
        }
        if (localWebcamOn) {
            toggleWebcam();
        }
        leave();
    }

    return (
        <Box>
            <Stack direction="row" spacing={2}>
                <Tooltip title="Mic">
                    <IconButton 
                        aria-label="toggleMic" 
                        onClick={handleToggleMic}
                        sx={localMicOn ? {
                            backgroundColor: "#3c4043", 
                            color: "white", 
                            ":hover": {
                                backgroundColor: "#3c4043"
                            }
                        } : { 
                            backgroundColor: "#ff4313", 
                            color: "white", 
                            ":hover": {
                                backgroundColor: "#ff430080"
                            }
                        }}
                    >
                        {localMicOn ? <Mic /> : <MicOff />}
                    </IconButton>
                </Tooltip>
                <Tooltip title="Video">
                    <IconButton 
                        aria-label="toggleWebcam" 
                        onClick={handleToggleVideoCam}
                        sx={localWebcamOn ? {
                            backgroundColor: "#3c4043", 
                            color: "white", 
                            ":hover": {
                                backgroundColor: "#3c4043"
                            }
                        } : { 
                            backgroundColor: "#ff4313", 
                            color: "white", 
                            ":hover": {
                                backgroundColor: "#ff430080"
                            }
                        }}
                    >
                        {localWebcamOn ? <Videocam /> : <VideocamOff />}
                    </IconButton>
                </Tooltip>
                <Tooltip title="End Call">
                    <IconButton 
                        onClick={handleCallEnd} 
                        aria-label="endCall" 
                        sx={{ 
                            backgroundColor: "#ff4313", 
                            color: "white", 
                            ":hover": {
                                backgroundColor: "#ff430080"
                            }
                        }}
                    >
                        <CallEnd />
                    </IconButton>
                </Tooltip>
            </Stack>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Leaving or Ending call?</DialogTitle>
                <DialogContent>
                    <Stack direction="row" spacing={3}>
                        <Button variant="outlined" color="error" onClick={handleLeave} disabled={isEnding === "saving"}>Leave Call</Button> 
                        <Button variant="contained" color="error" onClick={handleEnd} disabled={isEnding === "saving"}>{isEnding === "saving" ? "Saving Data" : "End Call"}</Button> 
                    </Stack>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

const StudentControls = () => {
    const navigate = useNavigate();

    const onMeetingLeft = () => {
        navigate("leave");
    }

    const { leave } = useMeeting({
        onMeetingLeft,
    });

    const handleLeave = () => {
        leave();
    }

    return (
        <Box>
            <Tooltip title="Leave Call">
                <IconButton 
                    onClick={handleLeave} 
                    aria-label="leaveCall" 
                    sx={{ 
                        backgroundColor: "#ff4313", 
                        color: "white", 
                        ":hover": {
                            backgroundColor: "#ff430080"
                        }
                    }}
                >
                    <CallEnd />
                </IconButton>
            </Tooltip>
        </Box>
    );
}

export default ParticipantControls;