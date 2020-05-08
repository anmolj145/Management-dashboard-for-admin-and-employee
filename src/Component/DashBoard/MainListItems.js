import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { setAuth, setVal } from '../../action/actionDispatch';

import PubNubReact from 'pubnub-react';

import ListItem from '@material-ui/core/ListItem';
import BarChartIcon from '@material-ui/icons/BarChart';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { patchAxiosData } from '../../services/service'
import { EMPLOYEE_URL } from '../../services/url'

class MainListItems extends Component {

    constructor(props) {
        super(props)
        this.logout = this.logout.bind(this)
        this.pubnub = new PubNubReact({
            publishKey: '<Pubnub Publish Key>',
            subscribeKey: '<Pubnub Subscribe Key>'
        });
        this.pubnub.init(this);
    }

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    logout = () => {
        const { cookies } = this.props;
        var logout_id = this.props.state.app.profile.id || cookies.get('profile')
        this.pubnub.publish({ message: { "id": logout_id, "isLoggedIn": "false" }, channel: 'channel1' });
        var d = new Date();
        var n = d.toString();
        this.props.setAuth(false)
        cookies.remove('auth')
        cookies.remove('isAdmin')
        cookies.remove('profile')
        const printResult = (response) => { console.log(response) }
        patchAxiosData(EMPLOYEE_URL + logout_id, { "isLoggedin": false, "last_login": n.slice(4, 24) }, printResult)
    }

    render() {
        const { cookies } = this.props;
        return (
            < div >
                <ListItem button onClick={() => this.props.setVal('Profile')} >
                    <ListItemIcon data-toggle="tooltip" data-placement="right" title="Profile" >
                        <AccountCircleIcon id='profile' />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItem>
                {this.props.state.app.profile.isAdmin === true || cookies.get('isAdmin') === 'true' ?
                    <div>
                        <ListItem button onClick={() => this.props.setVal('Employee')} >
                            <ListItemIcon data-toggle="tooltip" data-placement="right" title="Employee" >
                                <EmojiPeopleIcon id='employee' />
                            </ListItemIcon>
                            <ListItemText primary="Employee" />
                        </ListItem>

                        <ListItem button onClick={() => this.props.setVal('Department')} >
                            <ListItemIcon data-toggle="tooltip" data-placement="right" title="Department" >
                                <BarChartIcon id='department' />
                            </ListItemIcon>
                            <ListItemText primary="Department" />
                        </ListItem>
                    </div>
                    : null}
                <Link to="/logout" >
                    <ListItem button onClick={() => this.logout()}>
                        <ListItemIcon data-toggle="tooltip" data-placement="right" title="Logout" >
                            <ExitToAppIcon id='logout' />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </Link >
            </div >
        )
    }
}

const mapStateToProps = state => ({
    state: state
});

export default withCookies(connect(mapStateToProps, { setAuth, setVal })(MainListItems));