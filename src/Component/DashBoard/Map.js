import React, { Component } from 'react';
import { connect } from 'react-redux';

import online_icon from '../util/online.png';
import PubNubReact from 'pubnub-react';

import getAxiosData from '../../services/service'
import { EMPLOYEE_URL } from '../../services/url'

class Map extends Component {

    constructor(props) {
        super(props)
        this.state = {
            initiated: false,
            emp_data: []
        }
        this.pubnub = new PubNubReact({
            publishKey: '<Pubnub Publish Key>',
            subscribeKey: '<Pubnub Subscribe Key>'
        });
        this.pubnub.init(this);
    }

    componentDidMount() {
        this.pubnub.subscribe({ channels: ['channel1'], withPresence: true });
        this.updateMap();

        const initialdata = (response) => { this.setState({ emp_data: response.data }, (() => { this.initMap() })) }
        getAxiosData(EMPLOYEE_URL, initialdata)
    }

    static getDerivedStateFromProps(props, state) {
        var initial_default_center = { lat: props.state.app.profile.lat, lng: props.state.app.profile.lng };

        if (props.state.app.toShow === "Employee") {
            var i
            var map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 6,
                center: initial_default_center
            });
            for (i = 0; i < state.emp_data.length; i++) {
                if (state.emp_data[i].isLoggedin === true) {
                    var marker = new window.google.maps.Marker({
                        icon: online_icon,
                        position: new window.google.maps.LatLng(state.emp_data[i].lat, state.emp_data[i].lng),
                        map: map
                    });
                }
                else {
                    marker = new window.google.maps.Marker({
                        position: new window.google.maps.LatLng(state.emp_data[i].lat, state.emp_data[i].lng),
                        map: map
                    });
                }
                marker.setMap(map);
            }
        }

        if (props.state.app.toShow === "EmployeeDetail") {
            map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 6,
                center: { lat: props.state.app.employee_profile.lat, lng: props.state.app.employee_profile.lng }
            });
            marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng({ lat: props.state.app.employee_profile.lat, lng: props.state.app.employee_profile.lng }),
                map: map
            });
            marker.setMap(map);
        }

        if (props.state.app.toShow === "SortedDepartment") {
            map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 6,
                center: initial_default_center
            });
            for (i = 0; i < props.state.app.emp.length; i++) {
                if (props.state.app.chart_department_id === props.state.app.emp[i].department_id) {
                    marker = new window.google.maps.Marker({
                        position: new window.google.maps.LatLng({ lat: props.state.app.emp[i].lat, lng: props.state.app.emp[i].lng }),
                        map: map
                    });
                    marker.setMap(map);
                }
            }
        }

        if (props.state.app.toShow === "Profile" && state.initiated === true) {
            map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 6,
                center: { lat: props.state.app.profile.lat, lng: props.state.app.profile.lng }
            });
            marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng({ lat: props.state.app.profile.lat, lng: props.state.app.profile.lng }),
                map: map
            });
            marker.setMap(map);
        }

        return null;
    }

    initMap = () => {
        var initial_default_center = { lat: this.props.state.app.profile.lat, lng: this.props.state.app.profile.lng };
        var initial_markers = { lat: this.props.state.app.profile.lat, lng: this.props.state.app.profile.lng };
        var map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 6,
            center: initial_default_center
        });
        var marker = new window.google.maps.Marker({
            position: initial_markers,
            map: map,
        });
        this.setState({ initiated: true })
        marker.setMap(map);
    }

    updateMap = () => {
        this.pubnub.getMessage('channel1', (msg) => {
            if (msg.message.isLoggedIn === 'true') {
                console.log(msg)
                let emp_data_copy = JSON.parse(JSON.stringify(this.state.emp_data))
                emp_data_copy[msg.message.id - 1].isLoggedin = true
                this.setState({ emp_data: emp_data_copy })
            }
            else {
                console.log(msg)
                let emp_data_copy = JSON.parse(JSON.stringify(this.state.emp_data))
                emp_data_copy[msg.message.id - 1].isLoggedin = false
                this.setState({ emp_data: emp_data_copy })
            }
        }
        );
    }

    componentWillUnmount() {
        this.pubnub.unsubscribe({ channels: ['channel1'] });
    }

    render() {
        return (
            <div id="map" style={{ width: "100%", height: "500px" }} />
        );
    }
};

const mapStateToProps = state => ({
    state: state
});

export default connect(mapStateToProps)(Map);