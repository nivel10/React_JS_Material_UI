import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    FormControlLabel,
    Checkbox,
    Link
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../auth/UserAuth';

interface LoginFormState {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface ErrorInput {
    success: boolean;
    message: string;
}

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: Location })?.from?.pathname || '/task';

    const [errorEmail, setErrorEmail] = useState<ErrorInput>({ success: true, message: '' });
    const [errorPassword, setErrorPassword] = useState<ErrorInput>({ success: true, message: '' });

    const [formData, setFormData] = useState<LoginFormState>({
        email: '',
        password: '',
        rememberMe: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.name === 'rememberMe' ? e.target.checked : e.target.value,
        });
    };

    const formDataCheck = () => {
        let valid = true;

        if (formData.email.trim() === '') {
            setErrorEmail({ success: false, message: 'Email is required.' });
            valid = false;
        }

        if (formData.password.trim() === '') {
            setErrorPassword({ success: false, message: 'Password is required.' });
            valid = false;
        }

        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setErrorEmail({ success: true, message: '' });
        setErrorPassword({ success: true, message: '' });

        if (!formDataCheck()) return;

        try {
            await login(formData.email, formData.password, formData.rememberMe);
            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: 8,
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        error={!errorEmail.success}
                        helperText={!errorEmail.success ? errorEmail.message : ''}
                        id="email"
                        label="Email Address"
                        name="email"
                        autoFocus
                        onFocus={() => setErrorEmail({ success: true, message: '' })}
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        error={!errorPassword.success}
                        helperText={!errorPassword.success ? errorPassword.message : ''}
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onFocus={() => setErrorPassword({ success: true, message: '' })}
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 1,
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    color="primary"
                                    onChange={handleChange}
                                    sx={{
                                        padding: 0.5,
                                        '& .MuiSvgIcon-root': { fontSize: 20 },
                                    }}
                                />
                            }
                            label="Remember me"
                        />

                        <Link component={RouterLink} to="/forgot" variant="body2" color="primary">
                            Forgot password?
                        </Link>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Link component={RouterLink} to="/register" variant="body2" color="primary">
                            Don’t have an account? Register
                        </Link>
                    </Box>

                    <Button
                        startIcon={<LoginIcon />}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;