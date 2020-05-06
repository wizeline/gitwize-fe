import Papa from 'papaparse'

export const formatData = data => {

  //console.log(data)
  let inputData = []
  data.map((row, i) => {
    const country = row.Country || null,
    year = row.Year || null,
    male = row[" Female"] || null,
    female = row[" Male"] || null

    if(!inputData[year]) inputData[year] = {}
    if(year) inputData[year].year = year
    if(country) inputData[year][country] = (male + female) / 2

  })


  let i = 0
  let finalData = []
  inputData.map(row => {
    finalData[i] = row
    ++i
  })

  return finalData
}

export const readDataFromFile = filePath => {

  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: function(result) {
          resolve(result.data)
      }
    })

  })

}





