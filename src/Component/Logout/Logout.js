import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Logout.css'

class Logout extends Component {
    render() {
        return (
            <div className="logout">
                <h3 className="logout-text">You have successfully logged out .</h3>
                <p className="logout-text">Click here to <Link to="/">Login</Link> .</p>
            </div>
        )
    }
}
export default Logout;