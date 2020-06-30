import React, {useState} from 'react'

import MaterialTable from "material-table";

const defaultPageSize = 7

export default function TableData(props) {
  const { tableData, tableColumn, isDisplaySearch = false, customComponent } = props
  let tableObject;
  const [selectedRow, setSelectedRow] = useState(null);
  tableObject = (<MaterialTable
                  columns={tableColumn}
                  data={tableData}
                  onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
                  options={{
                    showTitle: false,
                    headerStyle: {
                      color: '#334D6E',
                      opacity: 0.5,
                      fontWeight: 500,
                    },
                    rowStyle: (rowData) => ({
                      borderBottom: '1px solid #EBEFF2',
                      backgroundColor: (selectedRow === rowData.tableData.id) ? '#EC5D5C' : '#FFFFFF',
                      color: (selectedRow === rowData.tableData.id) ? '#FFFFFF' : '#707683'
                    }),
                    search: isDisplaySearch,
                    draggable: false,
                    sorting: false,
                    pageSize: defaultPageSize,
                    paginationType: 'stepped',
                    toolbar: isDisplaySearch
                  }}
                  components={customComponent}
                />)
  

  return (
    <div>
          {tableObject}
    </div>

  )
}