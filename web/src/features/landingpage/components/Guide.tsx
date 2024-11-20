import { Box, Typography, styled } from "@mui/material";
import CustomButton from "../../../components/CustomButton";
import { ArrowRightAlt } from "@mui/icons-material";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DomainAddOutlinedIcon from '@mui/icons-material/DomainAddOutlined';
import QueueOutlinedIcon from '@mui/icons-material/QueueOutlined';

const CustomBox = styled(Box)(({ theme }) => ({
    width: "40%",
    [theme.breakpoints.down("md")]: {
        width: "85%",
    },
}));

const GuidesBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-around",
    width: "70%",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down("md")]: {
        width: "100%",
    },
    [theme.breakpoints.down("sm")]: {
        marginBottom: "0",
        flexDirection: "column",
    },
}));

const GuideBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(5),
    [theme.breakpoints.down("sm")]: {
        margin: theme.spacing(2, 0, 2, 0),
    },
}));

export default function Guide() {
    return (
        <Box
            id='guide'
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
            }}
        >
            <div
                style={{
                    width: "5%",
                    height: "5px",
                    margin: "0 auto",
                }}
            ></div>
            <Typography
                variant="h3"
                sx={{ fontSize: "35px", fontWeight: "bold", my: 3 }}
            >
                Hvordan virker det?
            </Typography>
            <CustomBox>
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "#5A6473",
                        textAlign: "center",
                    }}
                >
                    Simpel og nem måde at kommunikere med Jeres medarbejdere, samt dokumentere arbejdsforhold - Alt i én løsning
                </Typography>
            </CustomBox>
            <GuidesBox>
                <GuideBox>
                    <DomainAddOutlinedIcon sx={{ fontSize: 60, color: '#3f6079' }} />
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: "500",
                            fontSize: "20px",
                            color: "#3B3c45",
                            my: 1,
                        }}
                    >
                        Opret Virksomhed / gruppe
                    </Typography>
                    <Box
                        sx={{
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", fontSize: "14px", color: "#0689FF" }}
                        >
                            Hvordan opretter jeg virksomhed
                        </Typography>
                        <ArrowRightAlt style={{ color: "#0689FF" }} />
                    </Box>
                </GuideBox>
                <GuideBox>
                    <QueueOutlinedIcon sx={{ fontSize: 60, color: '#3f6079' }} />
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: "500",
                            fontSize: "20px",
                            color: "#3B3c45",
                            my: 1,
                        }}
                    >
                        Opret opslag, aktiviteter & projekter
                    </Typography>
                    <Box
                        sx={{
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", fontSize: "14px", color: "#0689FF" }}
                        >
                            Hvordan opretter jeg resourcer
                        </Typography>
                        <ArrowRightAlt style={{ color: "#0689FF" }} />
                    </Box>
                </GuideBox>
                <GuideBox>
                    <CloudUploadOutlinedIcon sx={{ fontSize: 60, color: '#3f6079' }} />
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: "500",
                            fontSize: "20px",
                            color: "#3B3c45",
                            my: 1,
                        }}
                    >
                        Upload datablade & APV'er
                    </Typography>
                    <Box
                        sx={{
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", fontSize: "14px", color: "#0689FF" }}
                        >
                            Hvordan uploader jeg
                        </Typography>
                        <ArrowRightAlt style={{ color: "#0689FF" }} />
                    </Box>
                </GuideBox>
            </GuidesBox>

            <CustomButton
                backgroundColor="#0F1B4C"
                color="#fff"
                buttonText="Se flere guides"
                guideBtn={true}
            />
        </Box>
    );
}
