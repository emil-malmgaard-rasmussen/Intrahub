import React, {useState} from 'react';
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
import {RouterLink} from './components/RouterLink';
import {useForm} from 'react-hook-form';

const Login = () => {
    const {login} = useAuth();
    const {handleSubmit, register} = useForm<{ email: string, password: string }>();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (data: { email: string, password: string }) => {
        try {
            await login(data.email, data.password);
            navigate('/dashboard')
        } catch (error) {
            console.log(error)
            alert(`${error}`);
        }
    }

    const renderForm = (
            <form onSubmit={handleSubmit(handleLogin)}>
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <TextField
                        fullWidth
                        defaultValue={'Emil@Rasmussen-Solutions.dk'}
                        {...register("email", {required: true})}
                        label="Email address"
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            },
                        }}
                        sx={{mb: 3}}
                    />

                    <Link variant="body2" color="inherit" sx={{mb: 1.5}}>
                        Glemt password?
                    </Link>

                    <TextField
                        fullWidth
                        defaultValue={'Pass1234!'}
                        label="Password"
                        {...register("password", {required: true})}
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
                    >
                        Login
                    </LoadingButton>
                </Box>
            </form>
        )
    ;

    return (
        <>
            <AuthLayout>
                <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{mb: 5}}>
                    <Typography variant="h5">Login</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Har du ikke en bruger?
                        <Link component={RouterLink} href="/register" variant="subtitle2" sx={{ml: 0.5}}>
                            Kom i gang
                        </Link>
                    </Typography>
                </Box>
                {renderForm}
                {/*<Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>*/}
                {/*    <Typography*/}
                {/*        variant="overline"*/}
                {/*        sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}*/}
                {/*    >*/}
                {/*        eller*/}
                {/*    </Typography>*/}
                {/*</Divider>*/}
                {/*<Box gap={1} display="flex" justifyContent="center">*/}
                {/*    <IconButton color="inherit">*/}
                {/*        <Iconify icon="logos:google-icon" />*/}
                {/*    </IconButton>*/}
                {/*    <IconButton color="inherit">*/}
                {/*        <Iconify icon="eva:github-fill" />*/}
                {/*    </IconButton>*/}
                {/*    <IconButton color="inherit">*/}
                {/*        <Iconify icon="ri:twitter-x-fill" />*/}
                {/*    </IconButton>*/}
                {/*</Box>*/}
            </AuthLayout>
        </>
    );
};

export default Login;
