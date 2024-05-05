import { useContext, useEffect, useState } from 'react'
import './login_style.css'
import image from '../../assets/images/placeholder.jpeg'
import SparesLogoFull from '../../components/svgcomponents/spares_logo_full'
import '../basic-formcss.css'
import useIsLoading from '../../hooks/ui/is_loading'
import Cookies from 'js-cookie'
import useOK from '../../hooks/auth/useOK'
import useIdentify from '../../hooks/routing/useIdentify'
import { Grid, TextField, Button, Container } from '@mui/material'
import { motion } from 'framer-motion'
import AuthUser from '../../context/AuthUserContext'

/**! ERRORS
 * 1. Logging in if the value is empty will cause an infinite loading button (Check the isLoading boolean)
 * 2. The error message is not being displayed properly
 * 3. Validator doesn't seem to work properly
 * 4. Layouting Issues
 */
const LoginPage = () => {
    //* Validator Hooks
    useEffect(() => {
        document.title = 'Login'
    }, [])

    const [values, setValues] = useState({
        email: '',
        password: '',
    })

    const { isLoading, startLoading, stopLoading } = useIsLoading()
    const { OK, greenFlag, redFlag } = useOK()
    const [errors, setErrors] = useState({} as { [key: string]: string })
    const [errorFetching, setErrorsFetching] = useState<string>()
    const { identify } = useIdentify()
    const { loginUser } = useContext(AuthUser)

    const handleChange = (e: any) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const validate = (values: any) => {
        let errors = {} as { [key: string]: string }
        // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //TODO: Fix Regex and validation for all
        if (!values.email) {
            errors.email = 'Valid email is required'
        }
        if (!values.password) {
            errors.password = 'Password is required'
        } else if (values.password.length < 6) {
            errors.password = 'Password must be more than 6 characters'
        }
        return errors
    }

    //* Handling Submission (API Fetcher)
    const handleSubmit = (event: any) => {
        event.preventDefault()
        startLoading()
        let previousErrors = validate(values)
        setErrors(previousErrors)

        if (Object.keys(previousErrors).length === 0) {
            fetch('http://localhost:4000/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw response
                })
                .then((data) => {
                    let token = data.accessToken
                    let refreshToken = data.refreshToken
                    Cookies.set('accessToken', token, { expires: 4 * 60 })
                    Cookies.set('refreshToken', refreshToken, {
                        expires: 5 * 24 * 60,
                    })

                    greenFlag()
                    loginUser(data.user, data.role.toString())
                    identify(data.role.toString()) //? This thing navigates the user to the correct page
                })
                .catch((error) => {
                    // TODO: Make an attempt counter and lock the user out after 3 attempts
                    redFlag()
                    if (
                        error.status === 401 ||
                        error.status === 403 ||
                        error.status === 404
                    ) {
                        setErrorsFetching('Invalid email or password!')
                    } else if (error.status === 500) {
                        setErrorsFetching(
                            'Server Error, please try again later. (ERR CODE: 500)'
                        )
                    } else if (error.status === 400) {
                        setErrorsFetching(
                            'Bad Request to the server, please try again later. (ERR CODE: 400)'
                        )
                    }
                })
            setValues({ email: '', password: '' })
            stopLoading()
        }
    }

    useEffect(() => {
        if (Object.keys(errors).length === 0) {
        }
    }, [errors])

    return (
        <Container>
            <motion.div
                initial={{ translateY: 10, opacity: 0 }}
                animate={{
                    translateY: 0,
                    opacity: 1,
                    transition: { ease: 'easeOut' },
                }}
                exit={{ opacity: 0 }}
                className="login"
            >
                <div className="item">
                    <img
                        style={{
                            aspectRatio: '3/4',
                            width: '80%',
                            maxHeight: '800px',
                            borderRadius: '10px',
                        }}
                        src={image}
                        alt="Test-Image"
                    />
                </div>
                <div className="item">
                    <Grid container spacing={2}>
                        <Grid item md={4} xs={12}>
                            <SparesLogoFull />
                        </Grid>
                        <Grid item md={6} xs={12}></Grid>
                    </Grid>
                    <h1
                        style={{
                            width: '100%',
                            fontSize: '35pt',
                            fontWeight: '600',
                        }}
                    >
                        Welcome Back!
                    </h1>
                    <p style={{ textAlign: 'left', width: '100%' }}>
                        Don't have an account?
                        <a href="/register">&nbsp;Click here to get started.</a>
                    </p>
                    <form style={{ padding: '35px 0' }} onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    id="email"
                                    name="email"
                                    fullWidth
                                    onChange={handleChange}
                                    value={values.email}
                                />
                                <p>{errors.email}</p>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={handleChange}
                                    value={values.password}
                                    label="Password"
                                    name="password"
                                    type="password"
                                    id="password"
                                    fullWidth
                                />
                                <p>{errors.password}</p>
                            </Grid>
                            <Grid item xs={12}>
                                {isLoading ? (
                                    <Button
                                        variant="text"
                                        fullWidth
                                        type="submit"
                                        color="secondary"
                                    >
                                        Logging in . . .
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        type="submit"
                                        color="primary"
                                    >
                                        Log in
                                    </Button>
                                )}
                                {OK ? (
                                    <></>
                                ) : (
                                    <p className="text-center text-red-600">
                                        {errorFetching}
                                    </p>
                                )}
                            </Grid>
                        </Grid>
                    </form>
                    <p>Forgot your password?</p>
                    <a href="/forgotPassword">
                        Click here to reset your password
                    </a>
                </div>
            </motion.div>
        </Container>
    )
}

export default LoginPage
