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
  const [legendCallbackGenerate, setLegendCallbackGenerate] = useState(false)
  const {data, chartOptions, customToolTip, customsStyle, customHandleClickLegend, customPlugins = [], isLegendClickable=true, chartLegendId = 'chart-legend', 
          chartType = chartTypeEnum.BAR, disableLegend = false} = props

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

    if(customHandleClickLegend) {
      customHandleClickLegend(ci, ci.data.datasets)
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
      setLegendCallbackGenerate(true)
    }
  }]

  const buildCustomToolTip = (toolTipModel) => {
    customToolTip(toolTipModel, chartRef)
  }

  useEffect(() => {
    if(legendCallbackGenerate) {
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
      }
      
      if(customToolTip) {
        newChartOptions.tooltips.custom = buildCustomToolTip
      }
      
      chartRef.current.chartInstance.options = {
        ...chartRef.current.chartInstance.options,
        ...newChartOptions
      }
      chartRef.current.chartInstance.update();
    }
  // eslint-disable-next-line
  }, [legendCallbackGenerate, chartOptions]);

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
