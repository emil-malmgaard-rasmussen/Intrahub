import {useState} from "react";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
    Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import {Contacts, FeaturedPlayList, Home, ListAlt, MiscellaneousServices} from "@mui/icons-material";
import CustomButton from '../../../components/CustomButton';
import logo from '../assets/logo.svg';
import {useLocation, useNavigate} from 'react-router-dom';
import {getAuth} from 'firebase/auth';

const NavbarContainer = styled(Box)(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(5),
    position: "sticky",
    height: 10,
    top: 0,
    backgroundColor: "#fff",
    zIndex: 1000,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
}));

const NavbarLogo = styled("img")(({theme}) => ({
    cursor: "pointer",
    width: '200px',
    height: 'auto',
    [theme.breakpoints.down("md")]: {
        display: "none",
    },
}));

const NavbarLinkBox = styled(Box)(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 25,
    [theme.breakpoints.down("md")]: {
        display: "none",
    },
}));

const NavbarLink = styled(Typography)(({theme}) => ({
    color: "#4F5361",
    fontWeight: "bold",
    cursor: "pointer",
    "&:hover": {
        color: "#9da2c1",
    },
}));

const MenuBox = styled(Box)(({theme}) => ({
    cursor: "pointer",
    [theme.breakpoints.up("md")]: {
        display: "none",
    },
}));

// * Functions
const ListComponent = () => (
    <List
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "space-between",
            justifyContent: "center",
            width: 200,
        }}
    >
        {["Home", "Features", "Services", "Products", "About"].map(
            (text, index) => (
                <ListItem key={text} disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            {index === 0 && <Home/>}
                            {index === 1 && <FeaturedPlayList/>}
                            {index === 2 && <MiscellaneousServices/>}
                            {index === 3 && <ListAlt/>}
                            {index === 4 && <Contacts/>}
                        </ListItemIcon>
                        <ListItemText primary={text}/>
                    </ListItemButton>
                </ListItem>
            )
        )}
    </List>
);

export default function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const authUser = getAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleScroll = (sectionId: string) => {
        if(location.pathname === '/privacy') {
            navigate('/');
            return;
        }
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({behavior: "smooth"});
        }
    };

    return (
        <NavbarContainer>
            <Box>
                <MenuBox onClick={() => setShowMenu(true)}>
                    <MenuIcon/>
                </MenuBox>
                <Drawer
                    anchor="left"
                    open={showMenu}
                    onClose={() => setShowMenu(false)}
                >
                    <ListComponent/>
                </Drawer>
                <NavbarLogo src={logo} alt="logo"/>
            </Box>

            <NavbarLinkBox>
                <NavbarLink onClick={() => handleScroll("home")}>Hjem</NavbarLink>
                <NavbarLink onClick={() => handleScroll("guide")}>Funktioner</NavbarLink>
                <NavbarLink onClick={() => handleScroll("about")}>Om</NavbarLink>
                {/*<NavbarLink onClick={() => handleScroll("about")}>Kontakt</NavbarLink>*/}
            </NavbarLinkBox>

            <Box sx={{display: "flex", alignItems: "center", columnGap: 2}}>
                <NavbarLink onClick={() => authUser.currentUser ? navigate('/dashboard') : navigate('/login')}>Login</NavbarLink>
                <CustomButton
                    href={authUser.currentUser ? '/dashboard' : '/register'}
                    backgroundColor="#0F1B4C"
                    color="#fff"
                    buttonText="Registrer"/>
            </Box>
        </NavbarContainer>
    );
}
