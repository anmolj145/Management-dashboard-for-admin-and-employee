import React, { Component } from 'react';

import Title from './Title';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';


import getAxiosData, { postAxiosData } from '../../services/service'
import { DEPARTMENT_URL } from '../../services/url'

class Department extends Component {

    constructor(props) {
        super(props);
        this.state = {
            department_data: [],
            loader: true,
            add_department: false,
            add_department_wrong_input_error: false
        }
    }

    componentDidMount() {
        const initialdata = (response) => { this.setState({ department_data: response.data, loader: false }) }
        getAxiosData(DEPARTMENT_URL, initialdata)
    }

    addDepartmentInputCheck = () => {
        let name = document.getElementById('department_name').value;
        if (name.match(/^[a-zA-Z ]*$/) && name.length > 0)
            return true;
        else
            return false;
    }

    async addDepartment() {
        this.setState({ loader: true })
        let name = document.getElementById('department_name').value

        const initialdata = (response) => {
            this.state.department_data.push(response.data)
            this.setState({ add_department: false, loader: false })
        }

        await
            postAxiosData(DEPARTMENT_URL, { "department_name": name, "count": 0 }, initialdata)
    }

    handleInvalidCloseError = () => { this.setState({ add_department_wrong_input_error: false }) }

    addDepartmentDialog = () => { this.setState({ add_department: !this.state.add_department }) }

    handleDepartmentSubmit = () => (this.addDepartmentInputCheck() ? this.addDepartment() : this.setState({ add_department_wrong_input_error: true }))

    render() {
        return (
            this.state.loader === true ? <div className="loader">Loading . . .</div> :
                <React.Fragment>
                    <Title >Department</Title>
                    <Button className="button-align" onClick={this.addDepartmentDialog} variant="contained" color="primary">Add Department</Button>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Id</b></TableCell>
                                <TableCell><b>Name</b></TableCell>
                                <TableCell><b>Employee Count</b></TableCell>
                            </TableRow>
                        </TableHead>
                        {this.state.department_data.map(data => (
                            <TableHead key={data.id}>
                                <TableRow >
                                    <TableCell>{data.id}</TableCell>
                                    <TableCell>{data.department_name}</TableCell>
                                    <TableCell>{data.count}</TableCell>
                                </TableRow>
                            </TableHead>
                        ))}
                    </Table>

                    {/* Add department dialog*/}
                    <Dialog open={this.state.add_department} onClose={this.addDepartmentDialog} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Add Department Details</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="department_name"
                                label="Department Name"
                                type="text"
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.addDepartmentDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.handleDepartmentSubmit} color="primary">
                                Add
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={this.state.add_department_wrong_input_error} onClose={this.handleInvalidCloseError} aria-labelledby="form-dialog-title">
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Department Name can contain alphabets only .
                            </DialogContentText>
                            <DialogContentText id="alert-dialog-description">
                                And / Or
                            </DialogContentText>
                            <DialogContentText id="alert-dialog-description">
                                Department Name cannot be empty .
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleInvalidCloseError} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment >
        )
    }
}

export default Department;