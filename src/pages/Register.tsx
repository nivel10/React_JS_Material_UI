import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    InputAdornment,
    FormControl,
    OutlinedInput,
    InputLabel,
    IconButton,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/UserAuth';
import type { IResult } from '../interfaces/ICommons';
import { useNotification } from '../components/useNotification';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import { useLoading } from '../components/useLoading';

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
    const {openLoading, closeLoading} = useLoading();

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

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleClickShowConfirm = () => setShowConfirm((prev) => !prev);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

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
        let response: IResult<unknown>;
        try {
            setShowPassword(false);
            setShowConfirm(false);
            setErrorFirstName({ success: true, message: '' });
            setErrorLastName({ success: true, message: '' });
            setErrorEmail({ success: true, message: '' });
            setErrorPassword({ success: true, message: '' });
            setErrorConfirm({ success: true, message: '' });

            if (!formDataCheck()) return;

            openLoading();

            response = await register({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password
            });

            if (!response.success) {
                closeLoading();
                notify(response?.message, "error", 4000);
                return;
            }

            navigate('/task', { replace: true });
            closeLoading();
        } catch (ex) {
            closeLoading();
            let msgText = '';
            if (ex instanceof Error) {
                msgText = ex?.message;
            } else {
                msgText = String(ex);
            }

            notify(msgText, 'error', 4000);
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
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <AccountCircle color="action" />
                                </InputAdornment>
                            ),
                        }}
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
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <AccountCircle color="action" />
                                </InputAdornment>
                            ),
                        }}
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
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <EmailIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControl
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        error={!errorPassword.success}
                    >
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={() => setErrorPassword({ success: true, message: '' })}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? 'hide password' : 'show password'}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                        {!errorPassword.success && (
                            <Typography variant="caption" color="error">
                                {errorPassword.message}
                            </Typography>
                        )}
                    </FormControl>
                    <FormControl
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        error={!errorConfirm.success}
                    >
                        <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                        <OutlinedInput
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirm ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onFocus={() => setErrorConfirm({ success: true, message: '' })}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showConfirm ? 'hide password' : 'show password'}
                                        onClick={handleClickShowConfirm}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Confirm Password"
                        />
                        {!errorConfirm.success && (
                            <Typography variant="caption" color="error">
                                {errorConfirm.message}
                            </Typography>
                        )}
                    </FormControl>
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