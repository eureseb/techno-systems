const MeetingDetailsCriterias = ({ criterias }) => {
    return (
        <Box p={3}>
            {criterias.map((criteria) => (
                <Accordion key={criteria.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={`${criteria.criteria.name}-content`}
                        id={`${criteria.criteria.name}-header`}
                    >
                        <Typography>{`${criteria.criteria.name} - ${criteria.weight * 100}%`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ mb: 2 }}>{ criteria.description }</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}

export default MeetingDetailsCriterias;