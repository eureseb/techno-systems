import GLOBALS from "../../../app_globals";
import { useClassMembers } from "../../../hooks"

const MeetingDetailsMembers = ({ classId }) => {
    const { isRetrieving, classMembers } = useClassMembers(classId);

    return (
        <Paper sx={{ height: "calc(100vh - 64px - 48px)", minHeight: "720px" }}>
            {!isRetrieving && (
                <List>
                    <ListSubheader sx={{ backgroundColor: "inherit" }}>
                        Teachers
                    </ListSubheader>
                    {classMembers
                        .filter((member) => member.role === GLOBALS.CLASSMEMBER_ROLE.TEACHER)
                        .map((member) => (
                            <ListItem key={member.id} disablePadding>
                                <ListItemButton>
                                    <ListItemText primary={member.full_name}/>
                                </ListItemButton>
                            </ListItem>
                    ))}
                    <ListSubheader sx={{ backgroundColor: "inherit" }}>
                        Students
                    </ListSubheader>
                    {classMembers
                        .filter((member) => member.role === GLOBALS.CLASSMEMBER_ROLE.STUDENT)
                        .map((member) => (
                            <ListItem key={member.id} disablePadding>
                                <ListItemButton>
                                    <ListItemText primary={member.full_name}/>
                                </ListItemButton>
                            </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
}

export default MeetingDetailsMembers;