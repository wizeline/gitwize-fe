export const filterObjectByKey = (objects, allowed = []) => {
  const filteredData = []
  objects.forEach((row) => {
    const filteredRow = Object.keys(row)
      .filter((key) => allowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = row[key]
        return obj
      }, {})

    filteredData.push(filteredRow)
  })

  return filteredData
}
