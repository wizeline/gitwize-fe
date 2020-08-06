import Papa from 'papaparse'
import { cloneDeep } from 'lodash'
import { createChartFullData, calculateIndexBaseLine } from '../utils/dataUtils'
import { getMonthNumberFromMonthName } from '../utils/dateUtils'

export const readDataFromFile = (filePath) => {
  return new Promise((resolve) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete(result) {
        resolve(result.data)
      },
    })
  })
}

export const getChartColor = (data) => {
  switch (data) {
    case 'Commits':
    case 'Merged':
      return '#000000'
    case 'Additions':
    case 'Rejected':
      return '#00000052'
    case 'Deletions':
    case 'Created':
      return '#0000008f'
    case 'Pull requests':
      return '#0000008f'
    case 'Total lines of code':
      return '#00000052'
    default:
      return '#000000'
  }
}

export const getChartOptions = (chartOptions, chartLines = []) => {
  let newChartOptions = cloneDeep(chartOptions)
  if (chartLines.length > 0 && newChartOptions) {
    chartLines.forEach((item) => {
      const yAxisItem = {
        type: 'linear',
        display: true,
        position: 'right',
        id: item.yAxisId,
        gridLines: {
          display: false,
        },
        labels: {
          show: true,
        },
        stacked: true,
        ticks: {
          fontColor: item.color,
          fontSize: 10,
          beginAtZero: true,
          precision: 0,
          suggestedMax: 10,
        },
      }
      newChartOptions.scales.yAxes.push(yAxisItem)
    })
  }
  return newChartOptions
}

export const buildChartOptionsBasedOnMaxValue = (responseData, chartItems) => {
  if (responseData) {
    const arrays = chartItems.flatMap((item) => responseData[item.fieldName].currentPeriod)
    const maxValue = Number(
      arrays.reduce((a, b) => {
        return Math.max(Number(a), Number(b))
      })
    )
    return {
      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              display: true,
              drawTicks: false,
              drawOnChartArea: false,
            },
            stacked: false,
            ticks: {
              fontColor: '#C4C4C4',
              fontSize: 16,
              autoSkip: true,
              autoSkipPadding: 30,
              padding: 10,
            },
          },
        ],
        yAxes: [
          {
            type: 'linear',
            display: false,
            position: 'left',
            id: 'y-axis-1',
            gridLines: {
              display: false,
            },
            labels: {
              show: false,
            },
            stacked: false,
            ticks: {
              fontColor: '#C4C4C4',
              fontSize: 10,
              beginAtZero: true,
              min: 0,
              max: maxValue <= 0 ? 5 : maxValue + maxValue / 4,
              precision: 0,
              suggestedMax: 5,
            },
          },
        ],
      },
      tooltips: {
        enabled: false,
        callbacks: {
          title: (tooltipItems, data) => {
            const label = tooltipItems[0].label
            switch (label) {
              case 'Churn':
                return 'Churn Percentage'
              case 'New Code':
                return 'New Code Percentage'
              default:
                return ''
            }
          },
        },
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'top',
          offset: -3,
          font: {
            size: 13,
          },
          formatter: (value) => {
            return `${value.toFixed(0)}%`;
        }
        },
      },
      maintainAspectRatio: false,
    }
  }
  return null
}

export const wrapText = (canvasContext, text, x, y, maxWidth, lineHeight) => {
  let lines = text.split('\n')

  for (let i = 0; i < lines.length; i++) {
    let words = lines[i].split(' ')
    let line = ''

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' '
      let metrics = canvasContext.measureText(testLine)
      let testWidth = metrics.width
      if (testWidth > maxWidth && n > 0) {
        canvasContext.fillText(line, x, y)
        line = words[n] + ' '
        y += lineHeight
      } else {
        line = testLine
      }
    }

    canvasContext.fillText(line, x, y)
    y += lineHeight
  }
}

export const buildCustomToolTipQuarterlyTrendAndCodeChangeVelocity = (
  tooltipModel,
  chartRef,
  chartItems,
  responseData,
  dateFrom,
  dateTo
) => {
  // Tooltip Element
  let tooltipEl = document.getElementById('chartjs-tooltip')
  const chartInstance = chartRef.current.chartInstance

  // Create element on first render
  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.id = 'chartjs-tooltip'
    document.body.appendChild(tooltipEl)
  }

  // Hide if no tooltip
  if (tooltipModel.opacity === 0) {
    tooltipEl.style.opacity = 0
    return
  }

  // Set caret Position
  tooltipEl.classList.remove('above', 'below', 'no-transform')
  if (tooltipModel.yAlign) {
    tooltipEl.classList.add(tooltipModel.yAlign)
  } else {
    tooltipEl.classList.add('no-transform')
  }

  // Set Text
  if (tooltipModel.body) {
    let titleLines = tooltipModel.title || []
    let bodyLines = tooltipModel.body.map((bodyItem) => bodyItem.lines)

    if (bodyLines.length > 0) {
      tooltipEl.innerHTML = '<ul></ul>'
      let innerHtml = ''

      titleLines.forEach((title) => {
        innerHtml += '<li style="font-size: 14px">' + title + '</li>'
      })

      const tooltipItems = tooltipModel.dataPoints
      const dataSets = chartInstance.data.datasets

      //find missing data set Index:
      for (let i = 0; i < dataSets.length; i++) {
        const tooltipIndex = tooltipItems.findIndex((item) => item.datasetIndex === i)
        let style = 'background:'
        let body

        const chartItem = chartItems[i]
        const chartRawData = responseData[chartItem.fieldName]
        const rawDataKeys = Object.keys(chartRawData)
        const monthArrays = getMonthNumberFromMonthName(rawDataKeys)
        const chartFullData = createChartFullData(chartRawData, dateFrom, dateTo, monthArrays)

        let indexBaseLine
        for (let i = 0; i < chartFullData.chartData.length; i++) {
          if (indexBaseLine === undefined) {
            indexBaseLine = calculateIndexBaseLine(
              responseData,
              chartItem.fieldName,
              i,
              chartFullData.chartData,
              dateFrom,
              dateTo
            )
          }
        }

        if (tooltipIndex === -1) {
          style += chartItem.color
          style += '; border-color:' + chartItem.color
          body = `${chartItems[i].name}: <div>0 ${chartItem.unit}</div>`
        } else {
          const colors = tooltipModel.labelColors[tooltipIndex]
          const isNegativeValue = Number(tooltipItems[tooltipIndex].value) < 0 ? true : false
          const percentageValue = `(${isNegativeValue ? '' : '+'}${tooltipItems[tooltipIndex].value}%)`
          style += colors.backgroundColor
          style += '; border-color:' + colors.borderColor
          body = `${chartItems[i].name}: <div>${chartFullData.chartData[tooltipItems[0].index]} ${chartItem.unit} ${
            tooltipItems[0].index === indexBaseLine ? '' : percentageValue
          } </div>`
        }

        style += '; border-width: 2px'
        innerHtml += `<li>
                      <span style="${style}"></span>${body}
                    </li>`
      }

      let tableRoot = tooltipEl.querySelector('ul')
      tableRoot.innerHTML = innerHtml
    }

    // `this` will be the overall tooltip
    let position = chartInstance.canvas.getBoundingClientRect()

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 0.9
    let left = position.left + window.pageXOffset + tooltipModel.caretX
    tooltipEl.style.left =
      left + tooltipEl.offsetWidth > window.innerWidth ? left - tooltipEl.offsetWidth + 'px' : left + 'px'
    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px'
    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px'
    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
  }
}

export const buildCustomPluginQuarterlyTrendsAndCodeChangeVelocity = (chartData) => {
  return [
    {
      afterDraw: (chartInstance, easing) => {
        const ctx = chartInstance.chart.ctx
        ctx.font = '9px Poppins'
        ctx.fillStyle = '#6A707E'
        if (chartData) {
          const data = chartData.datasets.flatMap((dataSet) => dataSet.data)
          //find index first month
          const indexFirstMonth = data.findIndex((item, i) => {
            return item !== undefined && i % 3 === 0
          })

          //find index second month
          const indexSecondMonth = data.findIndex((item, i) => {
            return item !== undefined && i % 3 === 1
          })

          if (indexFirstMonth === -1 && indexSecondMonth !== -1) {
            wrapText(
              ctx,
              `There was no activity for the month of ${chartData.labels[0]}`,
              40,
              ctx.canvas.offsetHeight / 2,
              ctx.canvas.offsetWidth / 4,
              20
            )
          }
        }
      },
    },
  ]
}

export const buildCustomToolTipPullRequestSize = (tooltipModel, chartRef) => {
  // Tooltip Element
  let tooltipEl = document.getElementById('chartjs-tooltip-1')
  const chartInstance = chartRef.current.chartInstance
  // Create element on first render
  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.id = 'chartjs-tooltip'
    document.body.appendChild(tooltipEl)
  }
  // Hide if no tooltip
  tooltipEl.classList.remove('nothover')
  if (tooltipModel.opacity === 0) {
    tooltipEl.classList.add('nothover')
    tooltipEl.style.opacity = null
    return
  }
  // Set caret Position
  tooltipEl.classList.remove('above', 'below', 'no-transform')
  if (tooltipModel.yAlign) {
    tooltipEl.classList.add(tooltipModel.yAlign)
  } else {
    tooltipEl.classList.add('no-transform')
  }
  // Set Text
  if (tooltipModel.body) {
    let bodyLines = tooltipModel.body.map((bodyItem) => bodyItem.lines)
    if (bodyLines.length > 0) {
      tooltipEl.innerHTML = '<ul></ul>'
      let innerHtml = ''
      const tooltipItems = tooltipModel.dataPoints
      const dataSets = chartInstance.data.datasets
      const index = tooltipItems[0].index
      const fullData = dataSets[0].data[index]
      let prReviewTime
      
      if(fullData.statusOfPr !== 'opened') {
        const reviewTime =  fullData.PRReviewTime >= 60 ? `${(fullData.PRReviewTime / 60).toFixed(1)} hrs`  : `${fullData.PRReviewTime} mins`
        
        prReviewTime = `<li>
                          PR Review Time: <div> ${reviewTime}</div>
                        </li>`
      } else {
        prReviewTime = ``
      }
      //find missing data set Index:
      innerHtml += `
                   <li class="title"> ${fullData.prTitle} </li>
                   <li>
                       PR Creation Date: <div> ${fullData.creationDate} </div>
                   </li>
                   <li>
                       PR Size: <div> ${fullData.PRSize} </div>
                   </li>
                   <li>
                       Status of PR: <div> ${fullData.statusOfPr} </div>
                   </li>
                   ${prReviewTime}
                   <li>
                       Created by <div> ${fullData.createdBy} </div>
                   </li>
                   <a href=${fullData.url} target="_blank"><button class="toolTipButton">View PR</button></a>`
      let tableRoot = tooltipEl.querySelector('ul')
      tableRoot.innerHTML = innerHtml
    }
    document.querySelectorAll(`.toolTipButton`).forEach((item, index) => {
      item.addEventListener('click', (e) => {
        // TODO: View PR
      })
    })
    // `this` will be the overall tooltip
    let position = chartInstance.canvas.getBoundingClientRect()
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 0.9
    let left = position.left + window.pageXOffset + tooltipModel.caretX
    tooltipEl.style.left =
      left + tooltipEl.offsetWidth > window.innerWidth ? left - tooltipEl.offsetWidth + 'px' : left + 'px'
    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.y + 'px'
    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px'
    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
  }
}
