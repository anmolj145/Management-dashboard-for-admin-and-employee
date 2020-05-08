import {
    SET_VAL,
    SET_EMP,
    SET_AUTH,
    SET_PROFILE,
    SET_CHART_DATA,
    UPDATE_LOGIN_LOGOUT,
    SET_CHART_DEPARTMENT,
    SET_EMPLOYEE_PROFILE_DATA
} from '../action/types';

const initialState = {
    auth: false,
    employee_profile: [],
    profile: [],
    toShow: 'Profile',
    emp: {},
    chart_data: [],
    chart_department_id: '',
    chart_department_name: ''
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_AUTH:
            state.auth = action.payload
            return {
                ...state
            };

        case SET_EMPLOYEE_PROFILE_DATA:
            if (state.employee_profile.lenght === 0) { state.employee_profile.push(action.payload) }
            else { state.employee_profile = action.payload }
            return {
                ...state
            };

        case SET_PROFILE:
            if (state.profile.lenght === 0) { state.profile.push(action.payload) }
            else { state.profile = action.payload }
            return {
                ...state
            };

        case SET_VAL:
            state.toShow = action.payload
            return {
                ...state
            };
        case SET_EMP:
            state.emp = action.payload
            return {
                ...state
            };

        case SET_CHART_DATA:
            var title = [['Department', 'Number of Employees']]
            var obj = action.payload
            var array_result = obj.map(d => [d.department_name, (d.count)]);
            var result = title.concat(array_result)
            state.chart_data = result
            return {
                ...state
            };

        case SET_CHART_DEPARTMENT:
            state.toShow = action.payload[0]
            state.chart_department_id = action.payload[1]
            state.chart_department_name = action.payload[2]
            return {
                ...state
            };

        case UPDATE_LOGIN_LOGOUT:
            if (action.payload[1] === 'true')
                state.emp[action.payload[0] - 1].isLoggedin = true
            else
                state.emp[action.payload[0] - 1].isLoggedin = false
            return {
                ...state
            };

        default:
            return state;
    }
}