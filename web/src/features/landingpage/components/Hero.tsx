import CustomButton from "../../../components/CustomButton";
import {Box, Container, styled, Typography} from "@mui/material";

const CustomHeroBox = styled(Box)(({theme}) => ({
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(5),
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
    },
}));

const Title = styled(Typography)(({theme}) => ({
    fontSize: "64px",
    color: "#000336",
    fontWeight: "bold",
    margin: theme.spacing(4, 0, 4, 0),
    [theme.breakpoints.down("sm")]: {
        fontSize: "40px",
    },
}));

export default function Hero() {
    return (
        <Box
            id='home'
            sx={{
                backgroundColor: "#E6F0FF",
                minHeight: "80vh",
                paddingBottom: 2,
                marginBottom: 6,
            }}
        >
            <Container>
                <CustomHeroBox>
                    <Box sx={{flex: 1.1}}>
                        <Title variant="h1">
                            Effektiv kommunikation & dokumentation
                        </Title>
                        <Typography
                            variant="body2"
                            sx={{fontSize: "18px", color: "#5A6473", my: 4}}
                        >
                            Deltag gratis i et fællesskab, hvor du får adgang til værdifulde dokumenter og kommunikation, der gør dit arbejde lettere.
                            Oplev hvordan Intrahub kan transformere din arbejdsdag!
                        </Typography>
                        <CustomButton
                            backgroundColor="#0F1B4C"
                            color="#fff"
                            buttonText="Opret dig"
                            heroBtn={true}
                        />
                    </Box>

                    <Box sx={{flex: 1.25}}>
                        <img
                            src={require('../assets/hero_illustration.png')}
                            alt="hero illustration"
                            style={{maxWidth: "100%"}}
                        />
                    </Box>
                </CustomHeroBox>
            </Container>
        </Box>
    );
}
