import { useState } from "react";
import GLOBALS from "../../../app_globals";
import { useTeam } from "../../../hooks";
import RateDialog from "./RateDialog";
import { MeetingsService } from "../../../services";

const RatePanel = ({ presentors, criterias }) => {
    // const { enqueueSnackbar } = useSnackbar();
    const { user, classId, classRoom, classMember } = useOutletContext();

    const [socket, setSocket] = useState(null);
    const [openRateDialog, setOpenRateDialog] = useState(false);
    const [selectedPresentor, setSelectedPresentor] = useState(null);

    const handleRateDialogOpen = () => {
        setOpenRateDialog(true);
    }

    const handleRateDialogClose = () => {
        setOpenRateDialog(false);
    }

    const handleChangeSelectedPresentor = (presentor) => {
        setSelectedPresentor(presentor);
    }

    return (
        <Paper sx={{ p: 2, height: "calc(100vh - 72px - 48px - 24px)", width: "360px" }}>
            <Stack spacing={1}>
                {presentors.map((presentor) => (
                    <PresentorPaper 
                        key={presentor.id} 
                        presentor={presentor} 
                        isStudent={classMember.role === GLOBALS.CLASSMEMBER_ROLE.STUDENT} 
                        handleOpen={handleRateDialogOpen} 
                        selectPresentor={handleChangeSelectedPresentor}
                    />
                ))}
            </Stack>
            <RateDialog key={selectedPresentor} open={openRateDialog} handleClose={handleRateDialogClose} criterias={criterias} selectedPresentor={selectedPresentor} />
        </Paper>
    );
}

const PresentorPaper = ({ presentor, isStudent, handleOpen, selectPresentor }) => {
    const { user, classId, classRoom, classMember } = useOutletContext();
    const { isRetrieving, teamMembers } = useTeam(classId, presentor.pitch.team_id);
    const {meetingId} = useParams();

    const [isOpen, setIsOpen] = useState(presentor.is_rate_open);
    
    const handleOpenRateClick = async () => {
        try {
            await MeetingsService.updateOpenPresentorRating(meetingId, {presentor: presentor.id});
            setIsOpen(true);
        } catch (error) {

        }
    }

    const handleRateClick = () => {
        selectPresentor(presentor);
        handleOpen();
    }

    if (isRetrieving) {
        return (
            <Paper elevaltion={4} sx={{ p: 1, pl: 2 }}>
                <Typography>{presentor.pitch.name}</Typography>
            </Paper>
        )
    }

    const isMember = teamMembers.find((member) => member.class_member_id === classMember.id);

    return (
        <Paper elevation={4} sx={{ p: 1, pl: 2 }} >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography>{presentor.pitch.name}</Typography>
                { isMember && <Button disabled>Rate</Button> }
                { (isStudent && !isOpen && !isMember) && <Button disabled>Rate</Button> }
                { (isStudent && isOpen && !isMember) && <Button onClick={handleRateClick}>Rate</Button> }
                { (!isStudent && isOpen && !isMember) && <Button onClick={handleRateClick}>Rate</Button> }
                { (!isStudent && !isOpen && !isMember) && <Button onClick={handleOpenRateClick}>Open</Button> }
            </Stack>
        </Paper>
    );
}

export default RatePanel;