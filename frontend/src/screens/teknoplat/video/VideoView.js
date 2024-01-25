import { Box, Collapse, Paper, Stack } from "@mui/material";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import ParticipantPanel from "./ParticipantPanel";
import ParticipantControls from "./ParticipantControls";
import RatePanel from "./RatePanel";
import CommentPanel from "./CommentPanel";
import ParticipantView from "./ParticipantView";

const VideoView = ({meeting, classMember}) => {
    const { join, participants } = useMeeting();
    const [load, setLoad] = useState(true);
    const [collapse, setCollapse] = useState(false);
    const [collapseHidden, setCollapseHidden] = useState(true);
    const [optionTabValue, setOptionTabValue] = useState(-1);

    useEffect(() => {
        if (load) {
            setLoad(false);
        } else {
            join();
        }
        // eslint-disable-next-line
    }, [load]);

    useEffect(() => {
        if (optionTabValue !== -1) {
            setCollapse(true);
            setCollapseHidden(false);
        } else {
            setCollapse(false);
            setCollapseHidden(true);
        }
    }, [optionTabValue]);

    const handleControlTabChange = (index) => {
        setOptionTabValue(index);
    }
    return (
        <Box height="100vh" p={3}>
            <Stack height="calc(100vh - 72px - 48px)" direction="row" spacing={2} justifyContent="space-between" sx={{ pb: 3 }}>
                <Box>
                    <Collapse in={collapseHidden} orientation="horizontal" >
                        <Box/>
                    </Collapse>
                </Box>
                <Box>
                    {[...participants.keys()].map((participantId) => (
                        <ParticipantView
                            participantId={participantId}
                            key={participantId}
                        />
                    ))}
                </Box>
                <Box>
                    <Collapse in={collapse} orientation="horizontal" >
                        {optionTabValue === -1 && <Paper sx={{ width: "360px", height: "calc(100vh - 48px - 72px - 24px)" }} />}
                        {optionTabValue === 0 && <RatePanel presentors={meeting.presentors} />}
                        {optionTabValue === 1 && <ParticipantPanel meeting={meeting} />}
                        {optionTabValue === 2 && <CommentPanel />}
                    </Collapse>
                </Box>
            </Stack>
            <ParticipantControls
                controlTab={optionTabValue}
                changeTab={handleControlTabChange}
                classMember={classMember}
                meeting={meeting}
            />
        </Box>
    );
}

export default VideoView;