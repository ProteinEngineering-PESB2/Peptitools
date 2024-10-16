import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  CardActionArea
} from "@mui/material";
import config from "../../config.json";

export default function Services(){
    return (
    <Box>
        <Container
        sx={{ textAlign: "center", paddingBottom: 7 }}
        maxWidth="lg"
        >
        <Typography fontSize={30} fontWeight="600">
            {config.home.services.title}
        </Typography>

        <Grid container spacing={2} marginTop={2}>
            {config.home.services.data.map((service) => (
            <Grid item xs={12} sm={6} md={4} xl={3} key={service.title}>
                <Card
                sx={{ width: "100%", boxShadow: 5 }}
                variant="elevation">
                    <CardActionArea href = {service.link}>       
                        <CardContent
                            sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                            minHeight: "11rem",
                            }}
                        >
                            <>
                            <img
                                src={service.icon}
                                alt={service.title}
                                width={35}
                                height={35}
                            />

                            <Typography variant="h6" fontWeight="600">
                                {service.title}
                            </Typography>

                            <Typography variant="subtitle2" fontStyle="italic">
                                {service.description}
                            </Typography>
                            </>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            ))}
        </Grid>
        </Container>
    </Box>
    )
}
