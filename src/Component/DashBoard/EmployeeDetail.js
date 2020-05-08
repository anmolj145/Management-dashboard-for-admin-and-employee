import React, { Component } from 'react';
import { connect } from 'react-redux';

import Title from './Title';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';

class EmployeeDetail extends Component {
    render() {
        return (
            <React.Fragment>
                <Title>Employee</Title>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee Id</TableCell>
                            <TableCell>{this.props.state.app.employee_profile.id}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Department</TableCell>
                            <TableCell>{this.props.state.app.employee_profile.department_name}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Department Id</TableCell>
                            <TableCell>{this.props.state.app.employee_profile.department_id}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Joining Date</TableCell>
                            <TableCell>{this.props.state.app.employee_profile.joining_date}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>{this.props.state.app.employee_profile.firstName}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Last Name</TableCell>
                            <TableCell>{this.props.state.app.employee_profile.lastName}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Gender</TableCell>
                            <TableCell>{this.props.state.app.employee_profile.gender}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>D.O.B.</TableCell>
                            <TableCell>{this.props.state.app.employee_profile.date_of_birth}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>City</TableCell>
                            <TableCell>{this.props.state.app.employee_profile.city}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Mobile</TableCell>
                            <TableCell>{this.props.state.app.employee_profile.mobile}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>{this.props.state.app.employee_profile.email}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell><b><i>Hobby</i></b></TableCell>
                            <TableCell></TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Sport</TableCell>
                            <TableCell>
                                {this.props.state.app.employee_profile.hobby.sport.map(h => (
                                    <p key={h}>{h}</p>
                                ))}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Mental Activity</TableCell>
                            <TableCell>
                                {this.props.state.app.employee_profile.hobby.mental_activity.map(h => (
                                    <p key={h}>{h}</p>))}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Cultural</TableCell>
                            <TableCell>
                                {this.props.state.app.employee_profile.hobby.cultural.map(h => (
                                    <p key={h}>{h}</p>
                                ))}
                            </TableCell>
                        </TableRow>

                    </TableHead>
                </Table>
            </React.Fragment >
        )
    }
}

const mapStateToProps = state => ({
    state: state
});

export default connect(mapStateToProps)(EmployeeDetail);