import React, { Component } from 'react';
import { Chart } from 'react-google-charts';
import Title from './Title';
import { connect } from 'react-redux';

import { setChartDepartment } from '../../action/actionDispatch';

class DataChart extends Component {

    onSelectEvent(chartWrapper) {
        let id = chartWrapper.getChart().getSelection()[0].row + 1
        let name = chartWrapper.getChart().J.jc[chartWrapper.getChart().getSelection()[0].row][0].gf
        this.props.setChartDepartment('SortedDepartment', id, name)
    }

    componentDidMount() {
        this.chartEvents = [
            {
                eventName: 'select',
                callback: ({ chartWrapper }) => {
                    this.onSelectEvent(chartWrapper)
                }
            }
        ];
    }

    render() {
        return (
            <React.Fragment>
                <Title>Department Wise Employee</Title>
                <Chart
                    width={'400px'}
                    height={'165px'}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={this.props.state.app.chart_data}
                    chartEvents={this.chartEvents}
                />
            </React.Fragment >
        );
    }
}

const mapStateToProps = state => ({
    state: state
});

export default connect(mapStateToProps, { setChartDepartment })(DataChart);