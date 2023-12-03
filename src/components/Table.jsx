import * as React from 'react'
import { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import Icon from '@mui/material/Icon'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp'
import UserActions from './UserActions'


function Table () {
const columns = [
  { field: 'id', headerName: 'ID', width: 200, sortable: false },
  {
    field: 'Name',
    headerName: 'Name',
    width: 200,
    sortable: false,
    editable: true
  },
  {
    field: 'Email',
    headerName: 'Email',
    width: 200,
    sortable: false,
    editable: true
  },
  {
    field: 'Role',
    headerName: 'Role',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 200
    // valueGetter: params =>
    //   `${params.row.firstName || ''} ${params.row.lastName || ''}`
  },
  { field: 'actions', headerName: 'Actions',type:'actions' , width: 200 ,renderCell:(params)=><UserActions {...{params , rowId ,setRowId}}/> ,sortable: false,
  editable: false }
]

const [rowId , setRowId] = useState(null)

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
  }, [])
  
const handleDeleteAll = ()=>{
    console.log(`Delete All btn is clicked`)
    return(info.map(()=> setInfo([])))
}
  const rows = info.map(info => {
    return {
      id: info.id,
      Name: info.name,
      Email: info.email,
      Role: info.role,
      actions: { icons }
    }
  })
  return (
    <div style={{ width: '100%', marginTop: '5%' }}>
      <div style={{display:'flex' , justifyContent:'end'}}>
        <Button variant='outlined' endIcon={< CloudDownloadIcon/>} color = 'error' style ={{margin: '1%'}}> 
          Download
        </Button>
        <Button variant='contained' endIcon={<DeleteIcon/>}  style ={{margin: '1%'}} onClick={handleDeleteAll}>
          Delete All
        </Button>
      </div>
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
        disableRowSelectionOnClick
        // checkboxSelectionVisibleOnly
      />
    </div>
  )
}

export default Table
