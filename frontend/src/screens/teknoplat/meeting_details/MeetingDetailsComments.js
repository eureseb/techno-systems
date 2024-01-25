import { useState } from "react";
import { MeetingsService } from "../../../services";

const MeetingDetailsComments = ({ user, classMember, comments }) => {
    const { meetingId } = useParams();
    const scrollableBoxRef = useRef(null);

    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState(comments);

    useEffect(() => {
        scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight;
    }, [commentLists]);

    const handleCommentChange = (e) => {
        const { value } = e.target;
        setComment(value);
    }

    const handleCommentClick = async (e) => {
        setCommentList((previous) => ([
            ...previous,
            { comment: comment, classmember_id: classMember.id, full_name: user.first_name + " " + user.last_name }
        ]));
        await MeetingsService.addMeetingComment(meetingId, { comment: comment, classmember_id: classMember.id });
        setComment("");
    }

    return (
        <Box pt={3} pl={3} pr={3}>
            <Paper sx={{ height: "calc(100vh - 64px - 48px - 124.5px - 24px - 48px - 24px - 1px)", p: 1, position: "relative", minHeight: "500px" }}>
                <Box
                    ref={scrollableBoxRef}
                    sx={{ 
                        maxHeight: "calc(100vh - 64px - 48px - 124.5px - 24px - 48px - 24px - 72px - 16px - 1px)", 
                        minHeight: "calc(500px - 72px)",
                        px: 1,
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
                    <Stack spacing={2}>
                        {commentList.map((comment) => (
                            <Paper 
                                key={comment.id} 
                                sx={{ 
                                    backgroundColor: "black", 
                                    width: "fit-content",
                                    maxWidth: "80%", 
                                    p: 1, 
                                    marginLeft: classMember.id === comment.classmember_id ? "auto !important" : "",
                                }}
                            >
                                <Stack direction="row" spacing={1}>
                                    <img 
                                        src="/sample/default_avatar.png"
                                        alt="AccountProfile"
                                        style={{ width: "20px", height: "20px", marginRight: "5px", borderRadius: "5px" }}
                                    />
                                    <Stack spacing={0}>
                                        <Typography variant="body1" fontSize={14} color="grey">{comment.full_name}</Typography>
                                        <Typography variant="body1" fontSize={14}>{comment.comment}</Typography>
                                    </Stack>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                </Box>
                <Paper sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", p: 2}}>
                    <Stack direction="row" spacing={1}>
                        <TextField value={comment} name="comment" onChange={handleCommentChange} fullWidth size="small" label="Write a comment..." />
                        <Button size="small" variant="contained" onClick={handleCommentClick}><Send /></Button>
                    </Stack>
                </Paper>
            </Paper>
        </Box>
    );
}

export default MeetingDetailsComments;