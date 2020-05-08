import {
    SET_VAL, 
    SET_EMP,
    SET_AUTH, 
    SET_PROFILE, 
    SET_CHART_DATA, 
    UPDATE_LOGIN_LOGOUT,
    SET_CHART_DEPARTMENT,
    SET_EMPLOYEE_PROFILE_DATA
} from './types';

export const setAuth = (auth_status) => dispatch => {
    dispatch({
        type: SET_AUTH,
        payload: auth_status
    })
};

export const setEmployeeProfileData = (data) => dispatch => {
    dispatch({
        type: SET_EMPLOYEE_PROFILE_DATA,
        payload: data
    })
};

export const setProfile = (data) => dispatch => {
    dispatch({
        type: SET_PROFILE,
        payload: data
    })
};

export const setVal = (data) => dispatch => {
    dispatch({
        type: SET_VAL,
        payload: data
    })
};

export const setEmp = (data) => dispatch => {
    dispatch({
        type: SET_EMP,
        payload: data
    })
};

export const setChartData = (data) => dispatch => {
    dispatch({
        type: SET_CHART_DATA,
        payload: data
    })
};

export const setChartDepartment = (type, id, name) => dispatch => {
    dispatch({
        type: SET_CHART_DEPARTMENT,
        payload: [type, id, name]
    })
};

export const updateLoginLogout = (id, data) => dispatch => {
    dispatch({
        type: UPDATE_LOGIN_LOGOUT,
        payload: [id, data]
    })
};