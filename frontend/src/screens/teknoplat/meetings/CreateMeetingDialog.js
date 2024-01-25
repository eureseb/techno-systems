import { useState } from "react";
import { useCriterias, usePitches } from "../../../hooks";
import { MeetingsService } from "../../../services";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CreateMeetingDialog = ({ open, handleClose, status }) => {
    const { user, classId, classRoom, classMember } = useOutletContext();

    const { isLoading: loadingPitches, pitches } = usePitches();
    const { isLoading: loadingCriterias, criterias } = useCriterias();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        teacher_weight_score: "80",
        student_weight_score: "20",
    });
    const [checkedTeams, setCheckedTeams] = useState(pitches.map(() => false));
    const [formCriterias, setFormCriterias] = useState(criterias.map(() => { return { criteria: false, weight: "0" }}));
    const [isWeightError, setIsWeightError] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    // const [emails, setEmails] = useState([{ email: "", emailAt: "@gmail.com" }]);

    const { name, description, teacher_weight_score, student_weight_score } = formData;

    const handleInputChange = (e) => {
        let { name, value } = e.target;

        if (name === 'teacher_weight_score') {
            if (value === "") value = "0";
            const numericValue = value.replace(/[^0-9]/g, '');
            if (numericValue > 100) return;
            const studentWeight = 100 - parseInt(numericValue, 10);
            setFormData(prev => ({ ...prev, teacher_weight_score: numericValue, student_weight_score: studentWeight }));
        } else if (name === 'student_weight_score') {
            if (value === "") value = "0";
            const numericValue = value.replace(/[^0-9]/g, '');
            if (numericValue > 100) return;
            const teacherWeight = 100 - parseInt(numericValue, 10);
            setFormData(prev => ({ ...prev, student_weight_score: numericValue, teacher_weight_score: teacherWeight }));
        } else {
            setFormData((previousFormData) => ({
                ...previousFormData,
                [name]: value
            }));
        }
    }

    const handleChangeCheckTeam = (e, position) => {
        const newcheckedTeams = checkedTeams.map((checked, index) => {
            if (index === position) {
                return !checked;
            } else {
                return checked;
            }
        });
        setCheckedTeams(newcheckedTeams);
    }

    const handleChangeCheckCriteria = (e, position) => {
        const newFormCriterias = formCriterias.map((form, index) => {
            if (index === position) {
                return { criteria: !form.criteria, weight: form.weight };
            } else {
                return form;
            }
        });
        setFormCriterias(newFormCriterias);
    }

    const handleWeightClick = (e, position) => {
        const newFormCriterias = formCriterias.map((form, index) => {
            if (index === position) {
                return { criteria: form.criteria, weight: "" };
            } else {
                return form;
            }
        });
        setFormCriterias(newFormCriterias);
    }

    const handleWeightChange = (e, position) => {
        let { value } = e.target;
        if (value === "") value = "0";
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue > 100) return;

        const newFormCriterias = formCriterias.map((form, index) => {
            if (index === position) {
                return { criteria: form.criteria, weight: numericValue };
            } else {
                return form;
            }
        });
        setFormCriterias(newFormCriterias);
    }

    const handleSave = async () => {
        setIsSaving(true);
        const meeting_data = {
            name: name,
            description: description,
            classroom_id: classId,
            owner_id: classMember.id,
            teacher_weight_score: Number(teacher_weight_score) / 100,
            student_weight_score: Number(student_weight_score) / 100,
        };
        const meeting_presentors_data = checkedTeams.filter((checked) => checked === true).map((checked, index) => {
            return { pitch_id: pitches[index].id };
        });
        const meeting_criterias_data = formCriterias.filter((form) => form.criteria === true).map((form, index) => {
            return { criteria_id: criterias[index].id, weight: Number(form.weight) / 100 };
        });

        const meetingResponse = await MeetingsService.create(meeting_data);
        const meeting = meetingResponse.data;
        
        meeting_presentors_data.forEach(async (presentor) => {
            await MeetingsService.addMeetingPresentor(meeting.id, presentor);
        });

        meeting_criterias_data.forEach(async (criteria) => {
            await MeetingsService.addMeetingCriteria(meeting.id, criteria);
        });
        
        setIsSaving(false);
    }

    return (
        <Dialog fullScreen open={dialogOpen} onClose={handleDialogClose} TransitionComponent={Transition}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        ref={closeButtonRef}
                        edge="start"
                        color="inherit"
                        onClick={handleDialogClose}
                        aria-label="close"
                    >
                        <Close />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Create Meeting
                    </Typography>
                    <Button color="inherit" onClick={handleImportData} sx={{ mr: 2 }}>
                        Import
                    </Button>
                    <Button disabled={isSaving} color="inherit" onClick={handleSave}>
                        { isSaving ? "Saving" : "Save" }
                    </Button>
                </Toolbar>
            </AppBar>
            <Grid 
                container 
                sx={{ 
                    p: 5,
                    maxHeight: "calc(100vh - 64px)",
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
                <Grid item sm={12} md={4} sx={{ p: 1 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6">Meeting General Information</Typography>
                        <TextField label="Title" name="name" value={name} onChange={handleInputChange} />
                        <TextField 
                            label="Description" 
                            name="description" 
                            value={description} 
                            onChange={handleInputChange} 
                            multiline 
                            rows={5}
                        />
                        <Grid container>
                            <Grid item xs={6} sx={{ pr: 1 }}>
                                <TextField 
                                    fullWidth 
                                    label="Teacher Score Weight" 
                                    name="teacher_weight_score" 
                                    value={teacher_weight_score} 
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                    onChange={handleInputChange} 
                                />
                            </Grid>
                            <Grid item xs={6} sx={{ pl: 1 }}>
                                <TextField 
                                    fullWidth 
                                    label="Student Score Weight"
                                    name="student_weight_score" 
                                    value={student_weight_score}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                    onChange={handleInputChange} 
                                />
                            </Grid>
                        </Grid>
                        {/* <Typography variant="h6">Invite Guest Mentors</Typography>
                        {emails.map((email, index) => (
                            <Stack key={index} direction="row">
                                <TextField fullWidth label="Email" name={`email${index}`} value={email.email} onChange={(e) => handleInvitedEmailChange(e, index)} />
                                <FormControl sx={{ width: 200 }}>
                                    <Select
                                        id="emailAt"
                                        value={email.emailAt}
                                        onChange={(e) => handleEmailAtChange(e, index)}
                                    >
                                        <MenuItem value="@cit.edu">@cit.edu</MenuItem>
                                        <MenuItem value="@gmail.com">@gmail.com</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField name={`fullEmail${index}`} value={`${email.email}${email.emailAt}`} sx={{ display: "none" }} />
                            </Stack>
                        ))} */}
                        <Button variant="contained" sx={{ width: "50px" }} onClick={handleAddEmailClick} >Add</Button>
                    </Stack>
                </Grid>
                <Grid item sm={12} md={8} sx={{ p: 1 }}>
                    <Grid container>
                        <Grid item md={5} xs={12} sx={{ px: 1 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Teams</Typography>
                            <FormGroup>
                                {pitches.map((pitch, index) => (
                                    <FormControlLabel 
                                        key={pitch.id} 
                                        control={
                                            <Checkbox checked={checkedTeams[index]} onChange={(e) => handleChangeCheckTeam(e, index)} />
                                        } 
                                        label={pitch.team_json.name} 
                                    />
                                ))}
                            </FormGroup>
                        </Grid>
                        <Grid item md={7} xs={12} sx={{ px: 1 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Criteria</Typography>
                            <FormGroup>
                                {criterias.map((criteria, index) => (
                                    <Stack key={criteria.id} direction="row" justifyContent="space-between" mb={1}>
                                        <FormControlLabel 
                                            control={
                                                <Checkbox checked={formCriterias[index].criteria} onChange={(e) => handleChangeCheckCriteria(e, index)} />
                                            } 
                                            label={criteria.name} 
                                        />
                                        <TextField 
                                            disabled={!formCriterias[index].criteria} 
                                            sx={{ width: "30%" }} 
                                            size="small" 
                                            label="Weight" 
                                            name="weight" 
                                            value={formCriterias[index].weight} 
                                            onChange={(e) => handleWeightChange(e, index)} 
                                            onClick={(e) => handleWeightClick(e, index)}
                                            error={formCriterias[index].criteria && isWeightError}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>
                                            }}
                                        />
                                    </Stack>
                                ))}
                            </FormGroup>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Dialog>
    );
}

export default CreateMeetingDialog;