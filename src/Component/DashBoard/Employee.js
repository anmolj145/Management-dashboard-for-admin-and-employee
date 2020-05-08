import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setVal, setEmp, setEmployeeProfileData, setChartData } from '../../action/actionDispatch';
import sort_logo from '../util/sort.png'
import delete_icon from '../util/delete.png'

import Title from './Title';

import 'date-fns';

import Radio from '@material-ui/core/Radio';
import Table from '@material-ui/core/Table';
import DateFnsUtils from '@date-io/date-fns';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

import { EMPLOYEE_URL, SORT_BY_JOINING_DATE, SORT_BY_ID, DEPARTMENT_URL, HOBBY_URL } from '../../services/url'
import getAxiosData, { patchAxiosData, deleteAxiosData, postAxiosData } from '../../services/service'

class Employee extends Component {

    constructor(props) {
        super(props);
        this.state = {
            employee_data: [],
            ascending: true,
            id_ascending: true,
            loader: true,
            open: false,
            department_data: [],
            date_of_joining: new Date(),
            date_of_birth: new Date(),
            isAdmin: false,
            gender: 'Male',
            edit_open: false,
            edit_data: {},
            hobby: {},
            sport: [],
            mental_activity: [],
            cultural: [],
        }
        this.sendEmployeedata = this.sendEmployeedata.bind(this)
        this.sortByJoiningDate = this.sortByJoiningDate.bind(this)
        this.saveChange = this.saveChange.bind(this)
    }

    async componentDidMount() {

        const getchartData = (response) => {
            this.setState({ employee_data: response.data })
            this.props.setEmp([response.data])
        }
        await getAxiosData(EMPLOYEE_URL, getchartData)

        const hobbydata = (response) => { this.setState({ hobby: response.data, loader: false }) }
        await getAxiosData(HOBBY_URL, hobbydata)

    }

    sortByJoiningDate = () => {
        var type = ''
        this.setState({ loader: true })
        this.state.ascending === true ? type = 'asc' : type = 'desc'

        const responseData = (response) => { this.setState({ employee_data: response.data, ascending: !this.state.ascending, loader: false }) }
        getAxiosData(SORT_BY_JOINING_DATE + type, responseData)

    }

    sortById = () => {
        var type = ''
        this.setState({ loader: true })
        this.state.id_ascending === true ? type = 'asc' : type = 'desc'
        const responseData = (response) => { this.setState({ employee_data: response.data, id_ascending: !this.state.id_ascending, loader: false }) }
        getAxiosData(SORT_BY_ID + type, responseData)

    }

    addEmployeeDialog = () => {
        this.setState({ open: true })
        const responseData = (response) => { this.setState({ department_data: response.data, loader: false, }) }
        getAxiosData(DEPARTMENT_URL, responseData)

    }

    handleSubmit = () => {
        this.checkAllValidation() ? this.addEmployee() : this.showError()
    }

    checkAllValidation = () => {
        var fn = document.getElementById('firstName').value
        var ln = document.getElementById('lastName').value
        var m = document.getElementById('mobile').value
        var e = document.getElementById('email').value
        var p = document.getElementById('password').value
        var cp = document.getElementById('confirm_password').value
        if (
            fn.match(/^[a-zA-Z]+$/) &&
            ln.match(/^[a-zA-Z]+$/) &&
            m.match(/^[6789][0-9]{9}$/) &&
            e.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/) &&
            p.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/) &&
            cp.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/) &&
            (p === cp)
        )
            return true;
        else
            return false;
    }

    showError = () => { alert('Enter correct details .') }

    async addEmployee() {
        var dn
        for (var i = 0; i < this.state.department_data.length; i++) {
            if ((document.getElementById('department1').value).toString() === this.state.department_data[i].id.toString())
                dn = this.state.department_data[i].department_name
        }
      
        //Adding Employee

        const cb = (response) => { console.log(response) }
        await postAxiosData(EMPLOYEE_URL,
            {
                "id": this.props.state.app.emp.length + Math.trunc(100 * Math.random())
                ,
                "firstName": document.getElementById('firstName').value,
                "lastName": document.getElementById('lastName').value,
                "gender": this.state.gender,
                "date_of_birth": document.getElementById('date_of_birth').value,
                "department_name": dn,
                "department_id": Number(document.getElementById('department1').value),
                "city": "Jabalpur",
                "mobile": document.getElementById('mobile').value,
                "email": document.getElementById('email').value,
                "password": document.getElementById('password').value,
                "joining_date": document.getElementById('date_of_joining').value,
                "lat": (50 * Math.random()),
                "lng": (50 * Math.random()),
                "isLoggedin": false,
                "isAdmin": this.state.isAdmin,
                "last_login": "Its your First Login",
                "hobby": {
                    "sport": this.state.sport,
                    "mental_activity": this.state.mental_activity,
                    "cultural": this.state.cultural
                }
            }, cb)

        const responseData = (response) => { this.props.setEmp(response.data) }
        await getAxiosData(EMPLOYEE_URL, responseData)

        //To update the count of the department in which the employee is added
        const result = (response) => { this.setChart() }
        const dta = (res) => {
            patchAxiosData(DEPARTMENT_URL + res.data.id, { "count": res.data.count + 1 }, result)
        }
        await getAxiosData(DEPARTMENT_URL + document.getElementById('department1').value, dta)
        this.setState({ open: false, loader: true }, (() => this.updateEmployeeList()))
    }

    //To update Chart
    setChart = () => {
        const responseData = (response) => { this.props.setChartData(response.data) }
        getAxiosData(DEPARTMENT_URL, responseData)

    }

    updateEmployeeList() {
        const initialdata = (response) => { this.setState({ employee_data: response.data, loader: false }) }
        getAxiosData(EMPLOYEE_URL, initialdata)
    }

    handleDOBChange = (d) => { this.setState({ date_of_birth: d }) }

    handleJOINChange = (d) => { this.setState({ date_of_joining: d }) }

    handleClose = () => { this.setState({ open: false }) }

    handleEditClose = () => { this.setState({ edit_open: false }) }

    handleOpen = () => { this.setState({ open: true }) }

    sendEmployeedata = (data) => {
        this.props.setVal('EmployeeDetail')
        this.props.setEmployeeProfileData(data)
    }

    async deleteEmployee(id, department_id) {

        await deleteAxiosData(EMPLOYEE_URL + id)

        //updation of map on deletion of employee

        const delete_update_response = (response) => { this.props.setEmp(response.data) }
        getAxiosData(EMPLOYEE_URL, delete_update_response)

        //To update the count of the department in which the employee is deleted

        const result = (response) => {
            this.setChart()
            this.setState({ open: false, loader: true }, (() => this.updateEmployeeList()))
        }
        const department_update_count = (response) => { patchAxiosData(DEPARTMENT_URL + department_id, { "count": response.data.count - 1 }, result) }
        await getAxiosData(DEPARTMENT_URL + department_id, department_update_count)

    }

    handleGenderChange = (e) => { this.setState({ gender: e.target.value }) }

    handleAdminChange = (e) => {
        if (e.target.value === "true")
            this.setState({ isAdmin: true })
        else
            this.setState({ isAdmin: false })
    }

    editEmployeedata = (data) => { this.setState({ edit_open: true, edit_data: data }) }

    handleEditSubmit = () => {
        var firstName = document.getElementById('firstName').value
        var lastName = document.getElementById('lastName').value
        var mobile = document.getElementById('mobile').value
        var email = document.getElementById('email').value

        const edit_result = (response) => {
            this.setState({ edit_open: false }, (() => this.updateEmployeeList()))
        }
        patchAxiosData(EMPLOYEE_URL + this.state.edit_data.id, {
            "firstName": firstName,
            "lastName": lastName,
            "gender": this.state.gender,
            "mobile": mobile,
            "email": email,
            "isAdmin": this.state.isAdmin
        }, edit_result)
        
    }

    // to add selected hobbies to state
    saveChange = (id) => {
        if (id === "Cricket" || id === "Football" || id === "Hockey")
            if (this.state.sport.includes(id)) this.removeItem(id, this.state.sport)
            else this.state.sport.push(id)

        else if (id === "Chess" || id === "Puzzle" || id === "Quiz")
            if (this.state.mental_activity.includes(id)) this.removeItem(id, this.state.mental_activity)
            else this.state.mental_activity.push(id)
        else
            if (this.state.cultural.includes(id)) this.removeItem(id, this.state.cultural)
            else this.state.cultural.push(id)
    }

    // remove hobby from state on uncheck 
    removeItem = (id, arr) => {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === id) { arr.splice(i, 1); }
        }
    }

    render() {
        return (
            this.state.loader === true ? <div className="loader">Loading . . .</div> :
                <React.Fragment>
                    <Title>Employee</Title>
                    <Button className="button-align" onClick={this.addEmployeeDialog} variant="contained" color="primary">Add Employee</Button>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>ID</b><img src={sort_logo} onClick={() => this.sortById()} height="20px" width="20px" alt="sort" /></TableCell>
                                <TableCell><b>Name</b></TableCell>
                                <TableCell><b>Department</b></TableCell>
                                <TableCell><b>Joining Date </b><img src={sort_logo} onClick={() => this.sortByJoiningDate()} height="20px" width="20px" alt="sort" />  </TableCell>
                                <TableCell><b>E-mail</b></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.employee_data.map(data => (
                                <TableRow key={data.id}>
                                    <TableCell>{data.id}</TableCell>
                                    <TableCell style={{ color: "blue" }} onClick={() => this.sendEmployeedata(data)}>{data.firstName + ' ' + data.lastName}</TableCell>
                                    <TableCell>{data.department_name}</TableCell>
                                    <TableCell>{data.joining_date}</TableCell>
                                    <TableCell>{data.email}</TableCell>
                                    <TableCell style={{ color: "blue" }} onClick={() => this.editEmployeedata(data)}>Edit</TableCell>
                                    <TableCell><img src={delete_icon} onClick={() => this.deleteEmployee(data.id, data.department_id)} height="20px" width="20px" alt="sort" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Add Employee */}
                    <Dialog
                        open={this.state.open} onClose={this.handleClose}>
                        <DialogTitle className="half">Add Employee Data</DialogTitle>

                        <DialogContent>
                            <FormControl component="fieldset" className="half" >
                                <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup aria-label="gender" name="gender" id="gender"
                                    defaultValue={'Male'}
                                    onChange={this.handleGenderChange}
                                >
                                    <FormControlLabel value="Female" control={<Radio color="primary" />} label="Female" />
                                    <FormControlLabel value="Male" control={<Radio color="primary" />} label="Male" />
                                </RadioGroup>
                            </FormControl>

                            <FormControl component="fieldset" className="half lef" >
                                <FormLabel component="legend">Admin</FormLabel>
                                <RadioGroup aria-label="isAdmin" name="isAdmin" id="isAdmin"
                                    defaultValue={'false'}
                                    onChange={this.handleAdminChange}
                                >
                                    <FormControlLabel value="true" control={<Radio color="primary" />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio color="primary" />} label="No" />
                                </RadioGroup>
                            </FormControl>

                            <TextField className="half" autoFocus margin="dense"
                                id="firstName" label="First Name" type="text" />

                            <TextField className="half lef" autoFocus margin="dense"
                                id="lastName" label="Last Name" type="text" />

                            <TextField className="half" autoFocus margin="dense"
                                id="mobile" label="Mobile" type="text" />

                            <TextField className="half lef" autoFocus margin="dense"
                                id="email" label="Email" type="email" />

                            <TextField className="half" autoFocus margin="dense"
                                id="password" label="Password" type="password" />

                            <TextField className="half lef" autoFocus margin="dense"
                                id="confirm_password" label="Confirm Password" type="password" />

                            <MuiPickersUtilsProvider utils={DateFnsUtils} >
                                <KeyboardDatePicker
                                    className="half"
                                    margin="normal"
                                    id="date_of_birth"
                                    label="Date of Birth (YYYY-MM-DD)"
                                    format="yyyy-MM-dd"
                                    maxDate={this.state.date_of_birth}
                                    value={this.state.date_of_birth}
                                    onChange={this.handleDOBChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />

                                <KeyboardDatePicker
                                    className="half lef"
                                    margin="normal"
                                    id="date_of_joining"
                                    label="Date of Joining (YYYY-MM-DD)"
                                    minDate={new Date()}
                                    format="yyyy-MM-dd"
                                    value={this.state.date_of_joining}
                                    onChange={this.handleJOINChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>

                            <InputLabel htmlFor="department1">Department</InputLabel>
                            <FormControl className="department_select" >
                                <Select className="department_select" native id="department1" defaultValue="">
                                    {this.state.department_data.map(d => (
                                        <option key={d.id} value={d.id}>{d.department_name}</option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormLabel component="legend">Sport</FormLabel>
                            {
                                this.state.hobby.sport.map((link) =>
                                    <FormControlLabel key={link}
                                        control={
                                            <Checkbox
                                                key={link}
                                                id={link}
                                                name={link}
                                                onChange={() => this.saveChange(link)}
                                                value={link}
                                                color="primary"
                                            />
                                        }
                                        label={link}
                                    />
                                )
                            }

                            <FormLabel component="legend">Mental Activity</FormLabel>
                            {
                                this.state.hobby.mental_activity.map((link) =>
                                    <FormControlLabel key={link}
                                        control={
                                            <Checkbox
                                                key={link}
                                                id={link}
                                                name={link}
                                                onChange={() => this.saveChange(link)}
                                                value={link}
                                                color="primary"
                                            />
                                        }
                                        label={link}
                                    />
                                )
                            }

                            <FormLabel component="legend">Cultural</FormLabel>
                            {
                                this.state.hobby.cultural.map((link) =>
                                    <FormControlLabel key={link}
                                        control={
                                            <Checkbox
                                                key={link}
                                                id={link}
                                                name={link}
                                                onChange={() => this.saveChange(link)}
                                                value={link}
                                                color="primary"
                                            />
                                        }
                                        label={link}
                                    />
                                )
                            }

                            <Button className="half" variant="contained" color="primary" onClick={this.handleClose}>
                                Cancel
                            </Button>

                            <Button className="half lef" variant="contained" color="primary" onClick={this.handleSubmit}>
                                Save
                            </Button>

                        </DialogContent>
                    </Dialog >

                    {/* Edit Employee */}
                    <Dialog
                        open={this.state.edit_open} onClose={this.handleEditClose}>
                        <DialogTitle className="half">Edit Employee Data</DialogTitle>
                        <DialogContent>
                            <FormControl component="fieldset" className="half" >
                                <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup aria-label="gender" name="gender" id="gender"
                                    defaultValue={this.state.edit_data.gender}
                                    onChange={this.handleGenderChange}
                                >
                                    <FormControlLabel value="Female" control={<Radio color="primary" />} label="Female" />
                                    <FormControlLabel value="Male" control={<Radio color="primary" />} label="Male" />
                                </RadioGroup>
                            </FormControl>

                            <FormControl component="fieldset" className="half lef" >
                                <FormLabel component="legend">Admin</FormLabel>
                                <RadioGroup aria-label="isAdmin" name="isAdmin" id="isAdmin"
                                    defaultValue={this.state.edit_data.isAdmin}
                                    onChange={this.handleAdminChange}
                                >
                                    <FormControlLabel value={'true'} control={<Radio color="primary" />} label="Yes" />
                                    <FormControlLabel value={'false'} control={<Radio color="primary" />} label="No" />
                                </RadioGroup>
                            </FormControl>

                            <TextField className="half" autoFocus margin="dense"
                                defaultValue={this.state.edit_data.firstName}
                                id="firstName" label="First Name" type="text" />

                            <TextField className="half lef" autoFocus margin="dense"
                                defaultValue={this.state.edit_data.lastName}
                                id="lastName" label="Last Name" type="text" />

                            <TextField className="half" autoFocus margin="dense"
                                defaultValue={this.state.edit_data.mobile}
                                id="mobile" label="Mobile" type="text" />

                            <TextField className="half lef" autoFocus margin="dense"
                                defaultValue={this.state.edit_data.email}
                                id="email" label="Email" type="email" />

                            <Button className="half" variant="contained" color="primary" onClick={this.handleEditClose}>
                                Cancel
                            </Button>

                            <Button className="half lef" variant="contained" color="primary" onClick={this.handleEditSubmit}>
                                Save
                            </Button>

                        </DialogContent>
                    </Dialog >
                </React.Fragment >
        );
    }
}

const mapStateToProps = state => ({
    state: state
});

export default connect(mapStateToProps, { setVal, setEmp, setEmployeeProfileData, setChartData })(Employee);