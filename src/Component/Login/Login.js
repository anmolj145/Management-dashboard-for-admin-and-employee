import { connect } from 'react-redux';
import PubNubReact from 'pubnub-react';
import React, { Component } from 'react';

import './Login.css'

import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import DialogContentText from '@material-ui/core/DialogContentText';

import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { setAuth, setProfile, setChartData } from '../../action/actionDispatch';

import getAxiosData, { patchAxiosData } from '../../services/service'
import { LOGIN_QUERY_URL, EMPLOYEE_URL, DEPARTMENT_URL } from '../../services/url'

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            open: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.pubnub = new PubNubReact({
            publishKey: '<Pubnub Publish Key>',
            subscribeKey: '<Pubnub Subscribe Key>'
        });
        this.pubnub.init(this);
    }

    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    myEmailHandler = (event) => { this.setState({ email: event.target.value }); }

    myPasswordHandler = (event) => { this.setState({ password: event.target.value }); }

    handleClose = () => { this.setState({ open: false }) };

    handleSubmit = () => (
        this.validateInputRequirement() ? this.checkAuthentication() : this.setState({ open: true })
    )

    validateInputRequirement = () => (
        (
            this.state.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/)
            &&
            this.state.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)
        ) ? true : false
    )

    setLoggedIn = (id) => {
        const printResult = (response) => { console.log(response) }
        patchAxiosData(EMPLOYEE_URL + id, { "isLoggedin": true }, printResult)
    }

    checkAuthentication = () => {
        var URL = LOGIN_QUERY_URL + this.state.email
        const { cookies } = this.props;

        const initialdata = (response) => {
            if (response.data[0] === undefined) alert('User Not Found , Kindly Contact Admin !!')
            else if (response.data[0].password === this.state.password) {
                if (response.data[0].isLoggedin === true) {
                    alert('You already have an active , kindly close it and then login')
                }
                else {
                    this.props.setAuth(true)
                    cookies.set('auth', true);
                    this.setLoggedIn(response.data[0].id)
                    this.props.setProfile(response.data[0])
                    this.setChart()
                    cookies.set('profile', response.data[0].id);
                    cookies.set('isAdmin', response.data[0].isAdmin);
                    this.pubnub.publish({ message: { "id": response.data[0].id, "isLoggedIn": "true" }, channel: 'channel1' });
                    this.props.history.push('/dashboard')
                }
            }
            else
                alert('Invalid Credential !!')

        }
        getAxiosData(URL, initialdata)
    }

    setChart = () => {
        const initialdata = (response) => {
            this.props.setChartData(response.data)
            this.props.history.push('/dashboard')
        }
        getAxiosData(DEPARTMENT_URL, initialdata)

    }

    render() {
        return (
            <div>
                <div className="img">
                    <p></p>
                </div>
                <div className="paper">
                    <Avatar>
                        <LockOutlinedIcon color="primary" />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                     </Typography>
                    <div>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            type="email"
                            label="Email Address"
                            name="email"
                            onChange={this.myEmailHandler}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            onChange={this.myPasswordHandler}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => this.handleSubmit()}
                        >
                            Sign In
                             </Button>
                    </div>
                    <Box mt={8}>
                        <Typography variant="body2" color="textSecondary" align="center">
                            {'Copyright © All rights reserved .'}
                        </Typography>
                    </Box>

                    < Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Email and Password do not meet requirement .
                         </DialogContentText>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Close
                         </Button>
                        </DialogActions>
                    </Dialog >
                </div >
            </div>
        )
    }
}

const mapStateToProps = state => ({
    state: state
});

export default withCookies(connect(mapStateToProps, { setAuth, setProfile, setChartData })(Login));