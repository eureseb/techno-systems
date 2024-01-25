import { MeetingsService, RatingsService, RemarksService } from "../../../services";

const RateDialog = ({ open, handleClose, criterias, selectedPresentor, classMember }) => {
    const { meetingId } = useParams();
    let initialRateData = {};
    criterias.forEach((criteria) => initialRateData[criteria.criteria.name] = 0);

    const [pitch, setPitch] = useState({});
    const [ratingsData, setRatingsData] = useState(initialRateData);
    const [ratingsId, setRatingsId] = useState(null);
    const [remark, setRemark] = useState("");
    const [remarkId, setRemarkId] = useState(null);
    const [isComplete, setIsComplete] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const fillData = async (pitchId) => {
        const ratingsResponse = await RatingsService.getAccountRatingsForPresentor(meetingId, pitchId);
        if (ratingsResponse.data.length !== 0) {
            const ratings = ratingsResponse.data;
            let updatedRateData = {};
            let ids = {};
            criterias.forEach((criteria) => {
                updatedRateData[criteria.name] = Number(ratings.find((rating) => rating.criteria === criteria.criteria).rating);
                ids[criteria.name] = ratings.find((rating) => rating.criteria === criteria.criteria).id;
            });
            setRatingsData(updatedRateData);
            setRatingsId(ids);
            setIsUpdate(true);
        }
        const remarkResponse = await RemarksService.getAccountRemarksForPresentor(meetingId, pitchId);
        if (remarkResponse.data.length !== 0) {
            setRemark(remarkResponse.data[0].remark);
            setRemarkId(remarkResponse.data[0].id);
        }
    }

    useEffect(() => {
        if (open) {
            setPitch(selectedPresentor);
            fillData(selectedPresentor.pitch_id);
        } else {
            setRatingsData(initialRateData);
            setRemark("");
        }
        // eslint-disable-next-line
    }, [open]);

    useEffect(() => {
        let isNotZero = true;

        criterias.forEach((criteria) => {
            if (!isNotZero) return;
            isNotZero = ratingsData[criteria.criteria.name] !== 0;
        });
        setIsComplete(isNotZero && remark !== "");
        // eslint-disable-next-line 
    }, [ratingsData, remark]);

    const handleRatingChange = (e, newValue) => {
        const  {name} = e.target;

        setRatingsData((previousData) => ({
            ...previousData,
            [name]: newValue
        }))
    }

    const handleRemarkChange = (e) => {
        setRemark(e.target.value);
    }

    const handleSaveClick = async () => {
        setIsComplete(false);
        const ratingsPayload = criterias.map((criteria) => ({
            rating: ratingsData[criteria.criteria.name],
            classmember_id: classMember.id,
            pitch_id: selectedPresentor.pitch_id,
            meeting_criteria_id: criteria.id,
        }));

        const remarkPayload = {
            remark: remark,
            classmember_id: classMember.id,
            pitch_id: selectedPresentor.pitch_id,
        }

        ratingsPayload.map(async (payload) => {
            try {
                if (isUpdate) {
                    const id = ratingsId[criterias.find((criteria) => payload.criteria === criteria.criteria).name];
                    payload['id'] = id;
                    await MeetingsService.updateRatingToPresentor(meetingId, payload);
                } else {
                    await MeetingsService.addRatingToPresentor(meetingId, payload);
                }
            } catch (error) {

            }
        });

        try {
            if (isUpdate) {
                remarkPayload['id'] = remarkId;
                await MeetingsService.updateRemarkToPresentor(meetingId, remarkPayload);
            } else {
                await MeetingsService.addRemarkToPresentor(meetingId, remarkPayload);
            }
        } catch (error) {

        }
        handleClose();
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', height: "70%" } }}
            maxWidth="sm"
            open={open}
        >
            <DialogTitle>{pitch?.name}</DialogTitle>
            <DialogContent dividers>
                <Typography variant="h6">Rating</Typography>
                <Stack spacing={2} py={2}>
                    {criterias.map((criteria) => (
                        <Stack key={criteria.id} direction="row" justifyContent="space-between">
                            <Typography>{criteria.criteria.name}</Typography>
                            <Stack direction="row" spacing={1}>
                                <Rating
                                    name={criteria.criteria.name}
                                    precision={0.2}
                                    value={ratingsData[criteria.criteria.name]}
                                    onChange={handleRatingChange}
                                    size="large"
                                />
                                <Typography>{ratingsData[criteria.criteria.name] % 1 === 0 ? `${ratingsData[criteria.criteria.name]}.0` : ratingsData[criteria.criteria.name]}</Typography>
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>Remarks</Typography>
                <TextField 
                    value={remark} 
                    onChange={handleRemarkChange} 
                    fullWidth 
                    multiline 
                    rows={5} 
                    label="Write your remark/feedback" 
                />
                
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <Button onClick={handleSaveClick} disabled={!isComplete}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default RateDialog;
