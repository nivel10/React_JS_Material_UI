import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/UserAuth';
import type { Result } from '../interfaces/ICommons';
import { useNotification } from '../components/notificationCtx';

interface RegisterFormState {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ErrorInput {
    success: boolean;
    message: string;
}

const Register: React.FC = () => {
    const { notify } = useNotification();
    const { register } = useAuth();
    const navigate = useNavigate();

    const [errorFirstName, setErrorFirstName] = useState<ErrorInput>({ success: true, message: '' });
    const [errorLastName, setErrorLastName] = useState<ErrorInput>({ success: true, message: '' });
    const [errorEmail, setErrorEmail] = useState<ErrorInput>({ success: true, message: '' });
    const [errorPassword, setErrorPassword] = useState<ErrorInput>({ success: true, message: '' });
    const [errorConfirm, setErrorConfirm] = useState<ErrorInput>({ success: true, message: '' });

    const [formData, setFormData] = useState<RegisterFormState>({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const formDataCheck = () => {
        let valid = true;

        if (formData.first_name.trim() === '') {
            setErrorFirstName({ success: false, message: 'First name is required.' });
            valid = false;
        }

        if (formData.last_name.trim() === '') {
            setErrorLastName({ success: false, message: 'Last name is required.' });
            valid = false;
        }

        if (formData.email.trim() === '') {
            setErrorEmail({ success: false, message: 'Email is required.' });
            valid = false;
        }

        if (formData.password.trim() === '') {
            setErrorPassword({ success: false, message: 'Password is required.' });
            valid = false;
        }

        if (formData.confirmPassword.trim() === '') {
            setErrorConfirm({ success: false, message: 'Please confirm your password.' });
            valid = false;
        } else if (formData.password !== formData.confirmPassword) {
            setErrorConfirm({ success: false, message: 'Passwords do not match.' });
            valid = false;
        }

        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setErrorFirstName({ success: true, message: '' });
        setErrorLastName({ success: true, message: '' });
        setErrorEmail({ success: true, message: '' });
        setErrorPassword({ success: true, message: '' });
        setErrorConfirm({ success: true, message: '' });

        if (!formDataCheck()) return;

        let response: Result<unknown>;
        try {
            response = await register({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password
            });

            if (!response.success) {
                notify(response?.message, "error", 6000);
                return;
            }

            navigate('/task', { replace: true });
        } catch (ex) {
            let msgText = '';
            if (ex instanceof Error) {
                msgText = ex?.message;
            } else {
                msgText = String(ex);
            }

            notify(msgText, 'error', 6000);
            console.error(ex);
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
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        error={!errorFirstName.success}
                        helperText={!errorFirstName.success ? errorFirstName.message : ''}
                        id="first_name"
                        label="First Name"
                        name="first_name"
                        autoFocus
                        onFocus={() => setErrorFirstName({ success: true, message: '' })}
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        error={!errorLastName.success}
                        helperText={!errorLastName.success ? errorLastName.message : ''}
                        id="last_name"
                        label="Last Name"
                        name="last_name"
                        onFocus={() => setErrorLastName({ success: true, message: '' })}
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        error={!errorEmail.success}
                        helperText={!errorEmail.success ? errorEmail.message : ''}
                        id="email"
                        label="Email Address"
                        name="email"
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
                    <TextField
                        margin="normal"
                        fullWidth
                        error={!errorConfirm.success}
                        helperText={!errorConfirm.success ? errorConfirm.message : ''}
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        onFocus={() => setErrorConfirm({ success: true, message: '' })}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Typography variant="body2" color="primary">
                                Already have an account? Sign In
                            </Typography>
                        </Link>
                    </Box>

                    <Button
                        startIcon={<PersonAddIcon />}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Create Account
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;