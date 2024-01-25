import { useEffect } from "react";
import { useMeeting } from "../../../hooks";
import VideoView from "./VideoView";

const VideoPage = () => {
    const { user, classId, classRoom, classMember } = useOutletContext();
    const { meetingId } = useParams();
    const navigate = useNavigate();
    const { isLoading, meeting } = useMeeting(meetingId);

    useEffect(() => {
         if (!meeting.video) navigate(`/classes/${classId}/teknoplat/meetings/${meetingId}`)
    }, [isLoading]);

    if (isLoading) {
        return(
            <Box></Box>
        );
    }

    return (
        <Box height="100vh">
            <MeetingProvider
                config={{
                    meetingId: meeting.video,
                    micEnabled: meeting.owner_id === classMember.id,
                    webcamEnabled: meeting.owner_id === classMember.id,
                    name: user.full_name,
                    participantId: classMember.id,
                }}
                token={videoAccessToken}
            >
                <VideoView meeting={meeting} />
            </MeetingProvider>
        </Box>
    );
}

export default VideoPage;