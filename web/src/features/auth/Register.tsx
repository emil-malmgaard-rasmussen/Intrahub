import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Iconify } from '../../components/Iconify';
import { AuthLayout } from './layout/AuthLayout';
import { RouterLink } from './components/RouterLink';
import { useAuth } from './AuthProvider';

interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
}

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>();

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            await registerUser(data.email, data.password, data.name);
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Registration error:', err);
            alert(err.message || 'An error occurred during registration');
        }
    };

    return (
        <AuthLayout>
            <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
                <Typography variant="h5">Opret en GRATIS bruger</Typography>
                <Typography variant="body2" color="text.secondary">
                    Har du allerede en bruger?
                    <Link component={RouterLink} href="/login" variant="subtitle2" sx={{ ml: 0.5 }}>
                        Login
                    </Link>
                </Typography>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <TextField
                        fullWidth
                        label="Navn"
                        {...register('name', { required: 'Navn er påkrævet' })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        fullWidth
                        label="Email address"
                        {...register('email', {
                            required: 'Email er påkrævet',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Email er ikke gyldig',
                            },
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                            required: 'Adgangskode er påkrævet',
                            minLength: { value: 6, message: 'Adgangskoden skal være mindst 6 tegn' },
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 3 }}
                    />
                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        color="inherit"
                        variant="contained"
                        loading={isSubmitting}
                    >
                        Registrér
                    </LoadingButton>
                </Box>
            </form>
        </AuthLayout>
    );
};

export default Register;
