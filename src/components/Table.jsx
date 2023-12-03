import React,{ useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import Icon from '@mui/material/Icon'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp'
import UserActions from './UserActions'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

function Table () {
  const [rowId, setRowId] = useState(null)
  const [info, setInfo] = useState([])
  const [download, setDownload] = useState(false)
  const fileName = 'Users Data'
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
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 200,
      renderCell: params => <UserActions {...{ params, rowId, setRowId }} />,
      sortable: false,
      editable: false
    }
  ]
  useEffect(() => {
    axios
      .get(
        'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
      )
      .then(response => {
        setInfo(response.data)
        console.log(response.data)

        // reshaping the array
        const customHeadings = response.data.map(item => ({
          ID: item.id,
          Name: item.name,
          Email: item.email,
          Role: item.role
        }))
      })
  }, [])

  const handleDeleteAll = () => {
    console.log(`Delete All btn is clicked`)
    return info.map(() => setInfo([]))
  }
  const rows = info.map(info => {
    return {
      id: info.id,
      Name: info.name,
      Email: info.email,
      Role: info.role
    }
  })

  const [deletedRows, setDeletedRows] = useState([])

  const handleRowSelection = e => {
    console.log(`Selected row: ${e}`)
    setDeletedRows([
      ...deletedRows,
      ...rows.filter(r => {
        // console.log(`${r.id}`)
        return r.id === e
      })
    ])
  }

  const handleDownload = () => {
    if (info.length > 0) {
      console.log(`Clicked on Download Btn`)
    } else {
      console.log('No item present to download')
    }
    {
      setDownload(!download)
      console.log(download)
      if (download && info.length > 0) {
        function exportToCSV(apiData, fileName){
          const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
          const fileExtension = '.xlsx'
          const ws = XLSX.utils.json_to_sheet(apiData)
          const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
          const excelBuffer = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array'
          })
          const data = new Blob([excelBuffer], { type: fileType })
          FileSaver.saveAs(data, fileName + fileExtension)
        }
        const apiData=info
        exportToCSV( apiData , fileName )
      }
    }
  }
  return (
    <div style={{ width: '100%', marginTop: '5%' }}>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          variant='outlined'
          endIcon={<CloudDownloadIcon />}
          color='error'
          style={{ margin: '1%' }}
          onClick={handleDownload}
        >
          Download
        </Button>
        <Button
          variant='contained'
          endIcon={<DeleteIcon />}
          style={{ margin: '1%' }}
          onClick={handleDeleteAll}
        >
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
        onRowSelectionModelChange={handleRowSelection}
      />
    </div>
  )
}

export default Table
