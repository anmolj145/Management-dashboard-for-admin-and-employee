import { connect } from 'react-redux';
import { instanceOf } from 'prop-types';
import React, { Component } from 'react';
import PrivateRoute from 'react-router-private';
import { withCookies, Cookies } from 'react-cookie';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './Component/Login/Login';
import Logout from './Component/Logout/Logout';
import DashBoard from './Component/DashBoard/DashBoard';

class Routes extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    render() {
        const { cookies } = this.props;

        return (
            <BrowserRouter>
                <Switch>
                    <PrivateRoute
                        exact
                        path="/"
                        component={Login}
                        authStatus={!(this.props.state.app.auth || cookies.get('auth') === 'true')}
                        redirectURL="/dashboard" />
                    <PrivateRoute
                        exact
                        path="/dashboard"
                        component={DashBoard}
                        authStatus={this.props.state.app.auth || cookies.get('auth') === 'true'}
                        redirectURL="/" />
                    <Route path="/logout" exact component={Logout} />
                </Switch>
            </BrowserRouter>
        )
    }
}
const mapStateToProps = state => ({
    state: state
});
export default withCookies(connect(mapStateToProps)(Routes));