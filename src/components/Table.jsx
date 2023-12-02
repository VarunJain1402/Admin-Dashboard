import * as React from 'react'
import { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

const columns = [
  { field: 'id', headerName: 'ID', width: 70, sortable: false },
  { field: 'Name', headerName: 'Name', width: 130, sortable: false , editable: true},
  { field: 'Email', headerName: 'Email', width: 180, sortable: false , editable: true},
  {
    field: 'Role',
    headerName: 'Role',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    // valueGetter: params =>
    //   `${params.row.firstName || ''} ${params.row.lastName || ''}`
  },
  { field: 'actions', headerName: 'Actions', width: 130 }
]


function Table () {
  const [info, setInfo] = useState([])
  useEffect(() => {
    axios
      .get(
        'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
      )
      .then(response => {
        setInfo(response.data)
        console.log(response.data)
      })
  },[])

  const rows = info.map((info) => {
    return({
        id: info.id , 
        Name:info.name , 
        Email:info.email , 
        Role: info.role ,
        // actions: {<><DeleteSharpIcon /></>}
    })
  })
  return (
    <div style={{ width: '100%', marginTop: '5%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 }
          }
        }}
        pageSizeOptions={[10]}
        checkboxSelection
      />
    </div>
  )
}

export default Table
