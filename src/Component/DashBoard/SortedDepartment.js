import React, { Component } from 'react';
import { connect } from 'react-redux';
import Title from './Title';
import { setVal, setEmp, setEmployeeProfileData } from '../../action/actionDispatch';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';

import getAxiosData from '../../services/service'
import { EMPLOYEE_URL } from '../../services/url'


class SortedDepartment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: true,
        }
    }

    componentDidMount() {
        const initialdata = (response) => { this.setState({ loader: false }, this.props.setEmp(response.data)) }
        getAxiosData(EMPLOYEE_URL, initialdata)

    }

    sendEmployeedata = (data) => {
        this.props.setVal('EmployeeDetail')
        this.props.setEmployeeProfileData(data)
    }

    render() {
        return (
            this.state.loader === true ? <div className="loader">Loading . . .</div> :
                <React.Fragment>
                    <Title>{this.props.state.app.chart_department_name}</Title>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>ID </b></TableCell>
                                <TableCell><b>Name</b></TableCell>
                                <TableCell><b>Department</b></TableCell>
                                <TableCell><b>Joining Date </b></TableCell>
                                <TableCell><b>E-mail</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.state.app.emp.map(data => (
                                this.props.state.app.chart_department_id === data.department_id ?
                                    (<TableRow key={data.id}>
                                        <TableCell>{data.id}</TableCell>
                                        <TableCell style={{ color: "blue" }} onClick={() => this.sendEmployeedata(data)}>{data.firstName + ' ' + data.lastName}</TableCell>
                                        <TableCell>{data.department_name}</TableCell>
                                        <TableCell>{data.joining_date}</TableCell>
                                        <TableCell>{data.email}</TableCell>
                                    </TableRow>) : null
                            ))}
                        </TableBody>
                    </Table>
                </React.Fragment >
        );
    }
}

const mapStateToProps = state => ({
    state: state
});

export default connect(mapStateToProps, { setVal, setEmp, setEmployeeProfileData })(SortedDepartment);