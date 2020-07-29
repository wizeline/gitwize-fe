import React, {useEffect, useState, useRef} from 'react'
import { makeStyles, styled } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { Bar, Line } from 'react-chartjs-2'

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 4,
    padding: '30px 40px 30px 10px',
    height: '50vh',
    maxHeight: '50vh'
  },
}))

export const chartTypeEnum = {
  LINE: 'line',
  BAR: 'bar',
}

const ChartLegend = styled('div')(({
  theme
}) => ({
  "& li span": {
    width: '40px',
    height: '12px',
    display: 'inline-block',
    margin: '0 5px 8px 0',
    verticalAlign: '-9.4px'
  },
  "& ul": {
    display: 'flex',
    justifyContent: 'center',
    listStyle: 'none',
    font: '12px',
    whiteSpace: 'nowrap'
  },
  "& li": {
    cursor: 'pointer',
    textAlign: 'left',
    margin: '0px 25px',
    height: '20px',
    fontWeight: 'bold'
  }
}))

const initValue = (chartInstance, chartLines) => {
  chartInstance.options.scales.yAxes[0].display = true;
  chartInstance.options.scales.yAxes[0].gridLines.display = true;
  if(chartLines && chartLines.length > 0) {
    for(let i = 1; i <= chartLines.length; i++) {
      chartInstance.options.scales.yAxes[i].display = true
      chartInstance.options.scales.yAxes[i].gridLines.display = false
    }
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

  //find minimum yAxis index with display === true, mark gridLineDisplay for it
  let yAxisIndexMin = Number.MAX_SAFE_INTEGER;
  for(let i = 1; i < chartInstance.options.scales.yAxes.length; i++) {
    const yAxesValue = chartInstance.options.scales.yAxes[i]
    if(yAxesValue.display && i<yAxisIndexMin) {
      yAxisIndexMin = i
    }
  }

  if(chartBars.length === numberOfBarDisabled  && chartLines.length !== numberOfLineDisabled) {
    chartInstance.options.scales.yAxes[0].display = false;
    chartInstance.options.scales.yAxes[0].gridLines.display = false;
    chartInstance.options.scales.yAxes[yAxisIndexMin].gridLines.display = true
  }

  if(chartBars.length === numberOfBarDisabled  && chartLines.length === numberOfLineDisabled) {
    chartInstance.options.scales.yAxes[0].display = true;
    chartInstance.options.scales.yAxes[0].gridLines.display = true;
    chartInstance.options.scales.yAxes[1].gridLines.display = false
  }
}

const buildChartBasedOnChartType = (chartType, chartRef, data, chartOptions, plugins) => {
  switch (chartType) {
    case chartTypeEnum.LINE:
      return <Line ref={chartRef} data={data} options={chartOptions} plugins={plugins} />
    case chartTypeEnum.BAR:
      return <Bar ref={chartRef} data={data} options={chartOptions} plugins={plugins} />
    default:
      return <Bar ref={chartRef} data={data} options={chartOptions} plugins={plugins} />
  }
}

export default function Chart(props) {

  const chartRef = useRef(null)
  const [legendCallBackGenerate, setLegendCallBackGenerate] = useState(false)
  const {data, chartOptions, chartBars, chartLines, customToolTip, customsStyle, customPlugins = [], isLegendClickable=true, chartLegendId = 'chart-legend', 
          isNeedRedrawOptions = true, chartType = chartTypeEnum.BAR, disableLegend = false} = props

  const classes = useStyles()
  const handleClick = (e, item, index, originalColor) => {
    let ci = chartRef.current.chartInstance;
    let meta = ci.getDatasetMeta(index);
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

    if(isNeedRedrawOptions) {
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

  const plugins = [
  ...customPlugins,
  {
    afterDraw: (chartInstance) => {
      setLegendCallBackGenerate(true)
    }
  }]

  const buildCustomToolTip = (toolTipModel) => {
    customToolTip(toolTipModel, chartRef)
  }

  useEffect(() => {
    if(legendCallBackGenerate) {
      const generateLegend = () => {
        document.getElementById(
          chartLegendId
        ).innerHTML = chartRef.current.chartInstance.generateLegend();
  
        document.querySelectorAll(`#${chartLegendId} li`).forEach((item, index) => {
          const originalColor = item.childNodes[0].style.backgroundColor
          if(isLegendClickable) {
            item.addEventListener("click", e => handleClick(e, item, index, originalColor));
          }
          //keep color as grey if already disabled
          let ci = chartRef.current.chartInstance;
          const meta = ci.getDatasetMeta(index);
          if(meta.hidden) {
            item.style.color = 'grey'
            item.childNodes[0].style.backgroundColor = 'grey'
            item.style.fontWeight = 'normal'
          }
        });
      }
      if(!disableLegend) {
        generateLegend()
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
      
      if(customToolTip) {
        newChartOptions.tooltips.custom = buildCustomToolTip
      }
      
      chartRef.current.chartInstance.options = newChartOptions
      chartRef.current.chartInstance.update();
    }
  // eslint-disable-next-line
  }, [legendCallBackGenerate, chartLines, chartOptions]);

  let chart;
  if(data && data.length !== 0) {
    chart = buildChartBasedOnChartType(chartType, chartRef, data, newChartOptions, plugins)
  } 

  return (
    <Grid container >
      <Grid className={classes.root} style={customsStyle} item xs={12}>
        {chart}
        <ChartLegend id={chartLegendId}/>
      </Grid>
    </Grid>
  )
}
