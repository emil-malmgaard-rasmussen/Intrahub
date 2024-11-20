// * MUI Components
import { Box, Container, Typography, styled } from "@mui/material";

// * Styled Components
const CustomContainer = styled(Container)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-around",
    gap: theme.spacing(5),
    [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        textAlign: "center",
    },
}));

const IconBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    [theme.breakpoints.down("sm")]: {
        justifyContent: "center",
    },
}));

const FooterLink = styled("span")(({ theme }) => ({
    fontSize: "16px",
    color: "#FFFFFF",
    fontWeight: "300",
    cursor: "pointer",
    "&:hover": {
        color: "#FFF",
    },
}));

export default function Footer() {
    return (
        <Box sx={{ py: 10 }} bgcolor={'#3f6079'}>
            <CustomContainer>
                <CustomContainer>
                    <Box>
                        <Typography
                            sx={{
                                fontSize: "20px",
                                color: "#FFFFFF",
                                fontWeight: "700",
                                mb: 2,
                            }}
                        >
                            Products
                        </Typography>

                        <FooterLink>Listing</FooterLink>
                        <br />
                        <FooterLink>Properties</FooterLink>
                        <br />
                        <FooterLink>Agents</FooterLink>
                        <br />
                        <FooterLink>Blog</FooterLink>
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: "20px",
                                color: "#FFFFFF",
                                fontWeight: "700",
                                mb: 2,
                            }}
                        >
                            Resources
                        </Typography>

                        <FooterLink>Our Homes</FooterLink>
                        <br />
                        <FooterLink>Stories</FooterLink>
                        <br />
                        <FooterLink>Video</FooterLink>
                        <br />
                        <FooterLink>Free Trial</FooterLink>
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: "20px",
                                color: "#FFFFFF",
                                fontWeight: "700",
                                mb: 2,
                            }}
                        >
                            Virksomhed
                        </Typography>
                        <FooterLink>Terms of use</FooterLink>
                        <br />
                        <FooterLink>Privacy</FooterLink>
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: "20px",
                                color: "#FFFFFF",
                                fontWeight: "700",
                                mb: 2,
                            }}
                        >
                            Get in touch
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "16px",
                                color: "#FFFFFF",
                                fontWeight: "500",
                            }}
                        >
                            E-mail: kontakt@intrahub.dk
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "16px",
                                color: "#FFFFFF",
                                fontWeight: "500",
                                mb: 2,
                            }}
                        >
                            Vi hjælper Jer gerne med at komme igang
                        </Typography>
                        <IconBox>
                            <img src={require('../assets/fbicon.png')} alt="fbIcon" style={{ cursor: "pointer" }} />
                            <img
                                src={require('../assets/linkedinicon.png')}
                                alt="linkedinIcon"
                                style={{ cursor: "pointer" }}
                            />
                        </IconBox>
                    </Box>
                </CustomContainer>
            </CustomContainer>
        </Box>
    );
}
