const MeetingDetailsPresentors = ({ presentors }) => {
    return (
        <Box p={3}>
            {presentors.map((presentor) => (
                <Accordion key={presentor.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={`${presentor.name}-content`}
                        id={`${presentor.name}-header`}
                    >
                        <Typography>{`${presentor.team.name} - ${presentor.name}`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ mb: 2 }}>{ presentor.description }</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}

export default MeetingDetailsPresentors;