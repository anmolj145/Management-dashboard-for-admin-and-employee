import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import clsx from 'clsx';
import './../../App.css'

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Map from './Map';
import Profile from './Profile';
import DataChart from './Chart';
import Employee from './Employee';
import Department from './Department';
import MainListItems from './MainListItems';
import EmployeeDetail from './EmployeeDetail';
import SortedDepartment from './SortedDepartment';

import { useCookies } from 'react-cookie';
import { setProfile, setChartData } from '../../action/actionDispatch';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import getAxiosData from '../../services/service'
import { EMPLOYEE_URL, DEPARTMENT_URL } from '../../services/url'

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',

        backgroundColor:
            theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    themeSelectToggle: {
        backgroundColor: 'white',
        paddingLeft: theme.spacing(1),
    }
}));

const themeObject = {
    palette: {
        primary: { main: '#053F5B' },
        secondary: { main: '#5e3c6f' },
        type: 'light'
    }
}

const useDarkMode = () => {
    const [theme, setTheme] = useState(themeObject)
    const { palette: { type } } = theme;

    const toggleDarkMode = () => {
        const updatedTheme = {
            ...theme,
            palette: {
                ...theme.palette,
                type: type === 'light' ? 'dark' : 'light'
            }
        }
        setTheme(updatedTheme)
    }
    return [theme, toggleDarkMode]
}

function Dashboard(props) {

    const classes = useStyles();
    const store = useSelector(store => store)
    const [cookies] = useCookies(['profile']);
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => { setOpen(true); };
    const handleDrawerClose = () => { setOpen(false); };
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [theme, toggleDarkMode] = useDarkMode()
    const themeConfig = createMuiTheme(theme)

    function showLoading() {
        getData(cookies.profile)
        return (
            < main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        <Grid item lg={12} >
                            <h1>Loading . . . </h1>
                        </Grid>
                    </Grid>
                </Container>
            </main >
        )
    }

    async function getData(id) {

        const chartData = (response) => { props.dispatch(setChartData(response.data)) }
        await getAxiosData(DEPARTMENT_URL, chartData)

        const employeeProfile = (response) => { props.dispatch(setProfile(response.data)) }
        await getAxiosData(EMPLOYEE_URL + id, employeeProfile)

        // const [chartData, employeeProfile] =
        //     await Promise.all([
        //         // Get Department Data For Chart
        //         axios.get('http://10.12.42.52:3000/department'),
        //         // Get Profile Data
        //         axios.get('http://10.12.42.52:3000/employee/' + id)
        //     ]);
        // console.log(chartData.data, employeeProfile.data)
        // props.dispatch(setChartData(chartData.data))
        // props.dispatch(setProfile(employeeProfile.data))
    }

    return (
        < div className={classes.root} >
            <MuiThemeProvider theme={themeConfig}>
                <CssBaseline />
                <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            data-toggle="tooltip" data-placement="right" title="Menu"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                            {store.app.toShow}
                        </Typography>

                        <FormControlLabel
                            control={<Switch onClick={toggleDarkMode} />}
                        />
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}
                    classes={{
                        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                    }}
                >
                    <div className={classes.toolbarIcon}>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>

                    <Divider />
                    <List><MainListItems /></List>
                </Drawer>
                {
                    store.app.profile.length === 0 ? showLoading() :
                        <main className={classes.content}>
                            <div className={classes.appBarSpacer} />
                            <Container maxWidth="lg" className={classes.container}>

                                <Grid container spacing={3}>
                                    <Grid item lg={12} >
                                        <h2>Last Login : {store.app.profile.last_login} </h2>
                                    </Grid>

                                    {store.app.profile.isAdmin === true || cookies.isAdmin === 'true'
                                        ?
                                        <Grid item lg={6} >
                                            <Paper className={fixedHeightPaper}>
                                                <DataChart />
                                            </Paper>
                                        </Grid> : null}

                                    <Grid item xs={12}>
                                        <Paper className={classes.paper}>
                                            {store.app.toShow === 'Employee' ? <Employee />
                                                :
                                                store.app.toShow === 'Department' ? <Department />
                                                    :
                                                    store.app.toShow === 'Profile' ? <Profile />
                                                        :
                                                        store.app.toShow === 'EmployeeDetail' ? <EmployeeDetail />
                                                            :
                                                            store.app.toShow === 'SortedDepartment' ? <SortedDepartment /> : null}
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Paper className={classes.paper}>
                                            <Map />
                                        </Paper>
                                    </Grid>

                                </Grid>

                                <Box pt={4}>
                                    <Typography variant="body2" color="textSecondary" align="center">
                                        {'Copyright © 2020'}
                                    </Typography>
                                </Box>

                            </Container>
                        </main >
                }
            </MuiThemeProvider>
        </div >
    );
}

export default connect(null)(Dashboard)