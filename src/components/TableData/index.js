import React from 'react'

import MaterialTable from "material-table";

const defaultPageSize = 7

export default function TableData(props) {
  const { tableData, tableColumn, isDisplaySearch = false, customComponent } = props
  let tableObject;
  tableObject = (<MaterialTable
                  columns={tableColumn}
                  data={tableData}
                  options={{
                    showTitle: false,
                    headerStyle: {
                      color: '#000000',
                      fontWeight: 500,
                    },
                    search: isDisplaySearch,
                    draggable: false,
                    sorting: false,
                    pageSize: defaultPageSize,
                    paginationType: 'stepped',
                    toolbar: isDisplaySearch,
                    rowStyle: {
                      color: '#707683',
                    }
                  }}
                  components={customComponent}
                />)
  

  return (
    <div>
          {tableObject}
    </div>

  )
}