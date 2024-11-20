import React, {useCallback, useState} from 'react';
import {useAuth} from './AuthProvider';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import {useNavigate} from 'react-router-dom';
import {Iconify} from '../../components/Iconify';
import {AuthLayout} from './layout/AuthLayout';
import { RouterLink } from './components/RouterLink';

const Register = () => {
    const {login} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = useCallback(() => {
        navigate('/');
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            alert("Login successful!");
        } catch (error) {
            alert("Error logging in");
        }
    };

    // return (
    //     <form onSubmit={handleLogin}>
    //         <Typography variant="h4">Login</Typography>
    //         <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    //         <TextField type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    //         <Button type="submit" variant="contained">Login</Button>
    //     </form>
    // );

    const renderForm = (
        <Box display="flex" flexDirection="column" alignItems="flex-end">
            <TextField
                fullWidth
                name="name"
                label="Navn"
                slotProps={{
                    inputLabel: {
                        shrink: true
                    },
                }}
                sx={{mb: 3}}
            />
            <TextField
                fullWidth
                name="email"
                label="Email address"
                slotProps={{
                    inputLabel: {
                        shrink: true
                    },
                }}
                sx={{mb: 3}}
            />
            <TextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                slotProps={{
                    inputLabel: {
                        shrink: true
                    },
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}/>
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{mb: 3}}
            />
            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                color="inherit"
                variant="contained"
                onClick={handleSignIn}
            >
                Registrér
            </LoadingButton>
        </Box>
    );

    return (
        <>
            <AuthLayout>
                <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{mb: 5}}>
                    <Typography variant="h5">Opret en GRATIS bruger</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Har du allerede en bruger?
                        <Link component={RouterLink} href="/login" variant="subtitle2" sx={{ ml: 0.5 }}>
                            Login
                        </Link>
                    </Typography>
                </Box>
                {renderForm}
            </AuthLayout>
        </>
    );
};

export default Register;
