export const filterObjectByKey = (objects, allowed = []) => {
  let filteredData = []
  objects.map(row => {
    const filteredRow = Object.keys(row)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = row[key];
        return obj;
      }, {});
      
      filteredData.push(filteredRow)
  })
  
  return filteredData 
}

