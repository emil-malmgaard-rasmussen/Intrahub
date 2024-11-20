// * Components
import House from "./House";

// * MUI Components
import {Box, Container, styled, Typography} from "@mui/material";
import properties from '../data';

// * Styled Components
const PropertiesBox = styled(Box)(({theme}) => ({
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
    },
}));

const PropertiesTextBox = styled(Box)(({theme}) => ({
    [theme.breakpoints.down("md")]: {
        textAlign: "center",
    },
}));

export default function Properties() {
    return (
        <Box id='about' sx={{mt: 5, backgroundColor: "#F5FAFE", py: 10}}>
            <Container>
                <PropertiesTextBox>
                    <Typography
                        sx={{color: "#000339", fontSize: "35px", fontWeight: "bold"}}
                    >
                        Eksempler på grupper
                    </Typography>
                    <Typography sx={{color: "#5A6473", fontSize: "16px", my: 3}}>
                        Everything you need to know when looking for a new home!
                    </Typography>
                </PropertiesTextBox>

                <PropertiesBox>
                    {properties.map((property) => (
                        <House
                            key={property.id}
                            img={property.img}
                            price={property.price}
                            address={property.address}
                            bedrooms={property.bedrooms}
                            bathrooms={property.bathrooms}
                            space={property.space}
                        />
                    ))}
                </PropertiesBox>
            </Container>
        </Box>
    );
}
