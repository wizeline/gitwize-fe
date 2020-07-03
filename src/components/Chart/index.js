import React, {useEffect, useState, useRef} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import styled from "styled-components";
import Grid from '@material-ui/core/Grid'

import {Bar} from 'react-chartjs-2';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 4,
    padding: '30px 40px 30px 10px',
    height: '70vh'
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
        height: 20px;
        font-weight: bold;
      }`;

const initValue = (chartInstance, chartLines) => {
  chartInstance.options.scales.yAxes[0].display = true;
  chartInstance.options.scales.yAxes[0].gridLines.display = true;
  if(chartLines && chartLines.length > 0) {
    for(let i = 1; i <= chartLines.length; i++) {
      chartInstance.options.scales.yAxes[i].display = true
    }
    chartInstance.options.scales.yAxes[1].gridLines.display = false
  }
}
const drawNewOptions = (chartInstance, datasets, chartBars, chartLines = []) => {
  
  initValue(chartInstance, chartLines)
  
  let numberOfLineDisabled = 0;
  let numberOfBarDisabled = 0;
  let i = 0;

  datasets.forEach(item => {
    const meta = chartInstance.getDatasetMeta(i);
    if(item.type === 'line') {
      const yAxisID = item.yAxisID
      if(meta.hidden) {
        numberOfLineDisabled++
        const index = chartInstance.options.scales.yAxes.findIndex(yAxesItem => yAxesItem.id === yAxisID)
        if(index !== -1) {
          chartInstance.options.scales.yAxes[index].display = false
        }
      }
    }

    if(item.type === 'bar') {
      if(meta.hidden) {
        numberOfBarDisabled++
      }
    }
    i++
  })

  if(chartBars.length === numberOfBarDisabled  && chartLines.length !== numberOfLineDisabled) {
    chartInstance.options.scales.yAxes[0].display = false;
    chartInstance.options.scales.yAxes[0].gridLines.display = false;
    chartInstance.options.scales.yAxes[1].gridLines.display = true
  }

  if(chartBars.length === numberOfBarDisabled  && chartLines.length === numberOfLineDisabled) {
    chartInstance.options.scales.yAxes[0].display = true;
    chartInstance.options.scales.yAxes[0].gridLines.display = true;
    chartInstance.options.scales.yAxes[1].gridLines.display = false
  }
}

export default function Chart(props) {

  const chartRef = useRef(null)
  const [isDisplayLegend, setDisplayLegend] = useState(false)
  const {data, chartOptions, chartBars, chartLines, chartLegendId = 'chart-legend'} = props

  const plugins = [{
      afterDraw: (chartInstance) => {
        setDisplayLegend(true)
      }
  }]

  const classes = useStyles()
  const handleClick = (e, item, index, originalColor) => {
    let ci = chartRef.current.chartInstance;
    var meta = ci.getDatasetMeta(index);
    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    if(item.style.color !== 'grey') {
      item.style.color = 'grey'
      item.childNodes[0].style.backgroundColor = 'grey'
      item.style.fontWeight = 'normal'
    } else {
      item.style.color = 'black'
      item.childNodes[0].style.backgroundColor = originalColor
      item.style.fontWeight = 'bold'
    }

    if(chartLines && chartLines.length !== 0) {
      drawNewOptions(ci, ci.data.datasets, chartBars, chartLines)
    }
    ci.update();
  }

  const newChartOptions = {
    ...chartOptions,
    responsive: true,
    elements: {
      line: {
        fill: false
      }
    },
    legend: {
      display: false
    },
    legendCallback: (chartInstance) => {
      let text = [];
      text.push('<ul>');
      for (let i = 0; i < chartInstance.data.datasets.length; i++) {
        text.push('<li><span style="background-color:' + chartInstance.data.datasets[i].backgroundColor + '"></span>');
        if (chartInstance.data.datasets[i].label) {
          text.push(chartInstance.data.datasets[i].label);
        }
        text.push('</li>');
      }
      text.push('</ul>');
      return text.join("");
    }
  }
  
  useEffect(() => {
    if(isDisplayLegend) {
      document.getElementById(
        chartLegendId
      ).innerHTML = chartRef.current.chartInstance.generateLegend();

      document.querySelectorAll(`#${chartLegendId} li`).forEach((item, index) => {
        const originalColor = item.childNodes[0].style.backgroundColor
        item.addEventListener("click", e => handleClick(e, item, index, originalColor));
      });
      chartRef.current.chartInstance.options = newChartOptions
      chartRef.current.chartInstance.update();
    }
  // eslint-disable-next-line
  }, [isDisplayLegend, chartLines, chartOptions]);

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
        <ChartLegend id={chartLegendId}/>
      </Grid>
    </Grid>
  )
}
