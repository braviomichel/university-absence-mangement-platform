import React from 'react';
import ApexCharts from 'apexcharts';

class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    this.generateChart();
  }

  generateChart() {
    const options = {
      chart: {
        type: 'bar',
      },
      series: [
        {
          name: 'Nombre dabsences',
          data: [5, 8, 3, 2, 6],
        },
      ],
      xaxis: {
        categories: ['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5'],
      },
    };

    const chart = new ApexCharts(this.chartRef.current, options);
    chart.render();
  }

  render() {
    return <div ref={this.chartRef}></div>;
  }
}

export default BarChart;
