import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useOutletContext } from "react-router-dom";
import * as XLSX from 'xlsx';
import { useMeetingHistory } from "../../../hooks";
import GLOBALS from "../../../app_globals";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const MeetingHistoryDialog = ({ title, presentors, open, handleClose }) => {
    const { user, classId, classRoom, classMember } = useOutletContext();
    const { meetingId } = useParams();
    const { isLoading, ratings, remarks, feedbacks } = useMeetingHistory(meetingId);

    let tabOptions = [
        { value: 0, name: "Overall", id: null },
    ];

    const tabPitchOptions = presentors.map((presentor, index) => { return {value: (index + 1), name: presentor.pitch.name, id: presentor.id }});
    tabOptions = tabOptions.concat(tabPitchOptions);

    const [dialogTabValue, setDialogTabValue] = useState(0);

    const handleTabChange = (event, value) => {
        setDialogTabValue(value);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: "calc(100vw * .5)", height: "calc(100vh * .7)" } }}
            maxWidth="sm"
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    {meeting.name}
                    {classMember.role === GLOBALS.CLASSMEMBER_ROLE.TEACHER && <Button variant="contained" onClick={handleExportClick}>Export</Button>}
                </Stack>
            </DialogTitle>
            <DialogContent dividers
                sx={{ 
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
                <Tabs value={dialogTabValue} onChange={handleTabChange} aria-label="action-tabs">
                    {tabOptions.map((option) => (
                        <Tab key={option.value} id={`option-${option.value}`} label={option.name} aria-controls={`tabpanel-${option.value}`} />
                    ))}
                </Tabs> 
                <Divider />
                {isLoading ? (
                    <Box/>
                ) : (
                    <Box>
                        {dialogTabValue === 0 && <OverallView ratings={ratings} />}
                        {dialogTabValue !== 0 && 
                            <PitchView 
                                rating={ratings.find((presentor) => presentor.id === tabOptions.find((tab) => tab.value === dialogTabValue).id)}
                                remark={remarks.find((presentor) => presentor.id === tabOptions.find((tab) => tab.value === dialogTabValue).id)}
                                feedback={feedbacks.find((presentor) => presentor.id === tabOptions.find((tab) => tab.value === dialogTabValue).id)}
                            />
                        }
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Done</Button>
            </DialogActions>
        </Dialog>
    );
}

const OverallView = ({ratings}) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Rating Summary',
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const labels = ratings.map((presentor) => presentor.pitch.name);

    const data = {
        labels,
        datasets: [
            {
                label: "Overall Score",
                data: labels.map((label) => ratings.find((presentor) => presentor.pitch.name === label).overall_score),
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }
        ]
    }

    return (
        <Box p={3}>
            <Bar options={options} data={data} />
        </Box>
    );
}

const PitchView = ({ rating, remark, feedback }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Rating Summary',
            },
        },
    };

    const labels = Object.keys(rating.score);
    const data = {
        labels,
        datasets: [
            {
                label: "Score",
                data: labels.map((label) => rating.score[label]),
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }
        ]
    }

    return (
        <Box p={3}>
            <Stack spacing={2}>
                <Bar options={options} data={data} />
                <Typography variant="h6">Remarks</Typography>
                {remark.remarks.map((rmk) => (
                    <Paper sx={{ p: 3 }}>
                        <Typography>{rmk.remark}</Typography>
                    </Paper>
                ))}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="body1" textAlign="justify">{feedback.feedback.feedback}</Typography>
                </Paper>
            </Stack>
        </Box>
    );
}

export default MeetingHistoryDialog;