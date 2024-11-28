import {Box, Container, styled, Typography} from "@mui/material";

const CustomContainer = styled(Container)(({theme}) => ({
    display: "flex",
    justifyContent: "space-around",
    gap: theme.spacing(5),
    [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        textAlign: "center",
    },
}));
//
// const IconBox = styled(Box)(({theme}) => ({
//     display: "flex",
//     alignItems: "center",
//     gap: "1rem",
//     [theme.breakpoints.down("sm")]: {
//         justifyContent: "center",
//     },
// }));

const FooterLink = styled("a")(({ theme }) => ({
    fontSize: "16px",
    color: "#FFFFFF",
    fontWeight: "300",
    cursor: "pointer",
    textDecoration: "none",
    "&:hover": {
        color: "#FFF",
        textDecoration: "underline",
    },
}));

export default function Footer() {
    return (
        <Box sx={{py: 10}} bgcolor={'#3f6079'}>
            <CustomContainer>
                <CustomContainer>
                    {/*<Box>*/}
                    {/*    <Typography*/}
                    {/*        sx={{*/}
                    {/*            fontSize: "20px",*/}
                    {/*            color: "#FFFFFF",*/}
                    {/*            fontWeight: "700",*/}
                    {/*            mb: 2,*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        HV Systemer*/}
                    {/*    </Typography>*/}

                    {/*    <FooterLink href={'https://assetlink.dk'} target="_blank" rel="noopener noreferrer">AssetLink</FooterLink>*/}
                    {/*    /!*<br/>*!/*/}
                    {/*    /!*<FooterLink>Properties</FooterLink>*!/*/}
                    {/*    /!*<br/>*!/*/}
                    {/*    /!*<FooterLink>Agents</FooterLink>*!/*/}
                    {/*    /!*<br/>*!/*/}
                    {/*    /!*<FooterLink>Blog</FooterLink>*!/*/}
                    {/*</Box>*/}

                    {/*<Box>*/}
                    {/*    /!*<Typography*!/*/}
                    {/*    /!*    sx={{*!/*/}
                    {/*    /!*        fontSize: "20px",*!/*/}
                    {/*    /!*        color: "#FFFFFF",*!/*/}
                    {/*    /!*        fontWeight: "700",*!/*/}
                    {/*    /!*        mb: 2,*!/*/}
                    {/*    /!*    }}*!/*/}
                    {/*    /!*>*!/*/}
                    {/*    /!*    Resourcer*!/*/}
                    {/*    /!*</Typography>*!/*/}

                    {/*    /!*<FooterLink>Opret gruppe</FooterLink>*!/*/}
                    {/*    /!*<br/>*!/*/}
                    {/*    /!*<FooterLink>Kommunikation</FooterLink>*!/*/}
                    {/*    /!*<br/>*!/*/}
                    {/*    /!*<FooterLink>Dokumenter</FooterLink>*!/*/}
                    {/*</Box>*/}

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
                        <FooterLink href={'/privacy-policy'}>Privatlivspolitik</FooterLink>
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
                            Kontakt os
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "16px",
                                color: "#FFFFFF",
                                fontWeight: "500",
                            }}
                        >
                            E-mail: kontakt@hvsystemer.dk
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "16px",
                                color: "#FFFFFF",
                                fontWeight: "500",
                            }}
                        >
                            Tlf.: <a style={{textDecoration: 'none', color: '#FFFFFF'}} href="tel:+4560727108">+45 60 72 71 08</a>
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
                        {/*<IconBox>*/}
                        {/*    <img src={require('../assets/fbicon.png')} alt="fbIcon" style={{ cursor: "pointer" }} />*/}
                        {/*    <img*/}
                        {/*        src={require('../assets/linkedinicon.png')}*/}
                        {/*        alt="linkedinIcon"*/}
                        {/*        style={{ cursor: "pointer" }}*/}
                        {/*    />*/}
                        {/*</IconBox>*/}
                    </Box>
                </CustomContainer>
            </CustomContainer>
        </Box>
    );
}
