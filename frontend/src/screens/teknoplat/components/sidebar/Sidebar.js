import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Logo from "../logo/Logo";
import { Suspense } from "react";
import { Await, Navigate, useNavigate, useOutletContext } from "react-router-dom";
import GLOBALS from "../../../../app_globals";

const Sidebar = () => {
    const { classMember } = useOutletContext();
    const navigate = useNavigate();

    const handleMeetingsClick = () => {
        navigate("meetings");
    }

    const handlePitchesClick = () => {
        navigate("pitches");
    }

    const handleChatbotClick = () => {
        navigate("chatbot");
    }

    return (
        <Box
            component="nav"
            sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
            aria-label="teknoplat links"
        >
            <Drawer
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' }
                }}
                variant="permanent"
                anchor="right"
            >
                <Logo />
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleMeetingsClick}>
                            <ListItemText primary="Meetings" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handlePitchesClick}>
                            <ListItemText primary={classMember.role === GLOBALS.CLASSMEMBER_ROLE.TEACHER ? 'Pitches' : 'My Pitch'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleChatbotClick}>
                            <ListItemText primary="Chatbot" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    );
}

export default Sidebar;