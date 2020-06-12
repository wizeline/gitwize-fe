import React, {useEffect, useRef, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import styled from "styled-components";
import Grid from '@material-ui/core/Grid'

import {Bar} from 'react-chartjs-2';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    marginBottom: theme.spacing(6),
    padding: '30px 40px 30px 10px',
  },
}))

const ChartLegend = styled.div`
      li span {
        width: 40px;
        height: 12px;
        display: inline-block;
        margin: 0 5px 8px 0;
        vertical-align: -9.4px;
      }
      ul {
        display: flex;
        justify-content: center;
        list-style: none;
        font: 12px;
        white-space: nowrap;
      }
      li {
        cursor: pointer;
        text-align: left;
        margin: 0px 25px;
        height: 20px
      }`;

export default function Chart(props) {

  const chartRef = useRef(null)
  const [isDisplayLegend, setDisplayLegend] = useState(false)
  useEffect(() => {
    if(isDisplayLegend) {
      document.getElementById(
        "chart-legend"
      ).innerHTML = chartRef.current.chartInstance.generateLegend();

      document.querySelectorAll("#chart-legend li").forEach((item, index) => {
        item.addEventListener("click", e => handleClick(e, item, index));
      });
    }
  }, [isDisplayLegend]);

  const plugins = [{
      afterDraw: (chartInstance) => {
        setDisplayLegend(true)
      }
  }]

  const {data, chartOptions} = props
  const classes = useStyles()
  const handleClick = (e, item, index) => {
    let ci = chartRef.current.chartInstance;
    var meta = ci.getDatasetMeta(index);
    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    if(item.style.color !== 'grey') {
      item.style.color = 'grey'
    } else {
      item.style.color = 'black'
    }

    ci.update();
  }

  const newChartOptions = {
    ...chartOptions,
    responsive: true,
    tooltips: {
      mode: 'label',
      bodySpacing: 10,
      titleMarginBottom: 10,
      titleFontSize: 14,
      titleFontStyle: 'bold',
      footerAlign: 'right',
      callbacks: {
        label: (tooltipItem, data) => {
          const label = data.datasets[tooltipItem.datasetIndex].label || ''
          const value = tooltipItem.value
          return `   ${label}: ${value}`
        }
      }
    },
    elements: {
      line: {
        fill: false
      }
    },
    legend: {
      display: false
    },
    legendCallback: (chart) => {
      let text = [];
      text.push('<ul>');
      for (let i = 0; i < chart.data.datasets.length; i++) {
        text.push('<li><span style="background-color:' + chart.data.datasets[i].backgroundColor + '"></span>');
        if (chart.data.datasets[i].label) {
          text.push(chart.data.datasets[i].label);
        }
        text.push('</li>');
      }
      text.push('</ul>');
      return text.join("");
    }
  }
  let chart;
  if(data && data.length !== 0) {
    chart  = (<Bar ref={chartRef}
                data={data}
                options={newChartOptions}
                plugins={plugins}
              />)
  } 

  return (
    <Grid container className={classes.root} >
      <Grid item xs={12}>
        {chart}
      </Grid>
      <Grid item xs={12}>
        <ChartLegend id='chart-legend'/>
      </Grid>
    </Grid>
  )
}
