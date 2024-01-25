import { useMeetings } from "../../../hooks";
import { useNavigate } from "react-router-dom";

const MeetingsPageTable = ({ classroomId, status, search }) => {
    const navigate = useNavigate();
    const { isLoading, meetings } = useMeetings(classroomId, status);

    const handleMeetingClick = (meeting) => {
        localStorage.setItem("meeting", meeting.id);
        localStorage.setItem("meeting_link_name", meeting.name);
        localStorage.setItem("videoId", meeting.video);
        // navigate(`/courses/${courseId}/meetings/${meeting.id}`);
    }

    return (
        <Box p={5}>
            <Paper>
                <TableContainer 
                    sx={{ 
                        height: "calc(100vh - 64px - 48px - 49px - 80px - 52px - 1px)",
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
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: "calc(100% * 0.09)", opacity: 0.9 }}></TableCell>
                                <TableCell sx={{ opacity: 0.9 }}>Title</TableCell>
                                <TableCell sx={{ width: "calc(100% * 0.2)", opacity: 0.9 }}>Teacher Score Weight</TableCell>
                                <TableCell sx={{ width: "calc(100% * 0.2)", opacity: 0.9 }}>Student Score Weight</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell>
                                        <Skeleton variant="rounded" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="rounded" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="rounded" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="rounded" />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                meetings.filter((meeting) => meeting.name.includes(search)).map((meeting) => (
                                    <TableRow key={meeting.id}>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleMeetingClick(meeting)}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                        <TableCell>{ meeting.name }</TableCell>
                                        <TableCell>{ `${meeting.teacher_weight_score * 100}%` }</TableCell>
                                        <TableCell>{ `${meeting.student_weight_score * 100}%` }</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}

export default MeetingsPageTable;