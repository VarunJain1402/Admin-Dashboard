import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

function Table () {
  const [rowId, setRowId] = useState(null)
  const [info, setInfo] = useState([])
  const [download, setDownload] = useState(false)
  const [deletedRows, setDeletedRows] = useState([])
  const fileName = 'Users Data'
  const columns = [
    { field: 'id', headerName: 'ID', sortable: false, flex: 1 },
    {
      field: 'name',
      headerName: 'Name',

      sortable: false,
      editable: true,
      flex: 1
    },
    {
      field: 'email',
      headerName: 'Email',

      sortable: false,
      editable: true,
      flex: 1
    },
    {
      field: 'role',
      headerName: 'Role',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1
    }
    //     {
    //       field: 'actions',
    //       headerName: 'Actions',
    //       type: 'actions',
    //       width: 200,
    //       renderCell: params => <UserActions {...{ params, rowId, setRowId }} />,
    //       sortable: false,
    //       editable: false
    //     }
  ]
  useEffect(() => {
    axios
      .get(
        'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
      )
      .then(response => {
        setInfo(response.data)
        // console.log(response.data)

        // reshaping the array
        const customHeadings = response.data.map(item => ({
          ID: item.id,
          Name: item.name,
          Email: item.email,
          Role: item.role
        }))
      })
  }, [])

  const handleDelete = () => {
    console.log(
      info.filter(r => deletedRows.filter(sr => sr.id === r.id).length < 1)
    )
    setInfo(info.filter(row => !deletedRows.includes(row.id)))
  }
  const rows = info.map(info => {
    return {
      id: info.id,
      Name: info.name,
      Email: info.email,
      Role: info.role
    }
  })


  const handleRowSelection = e => {
    console.log(typeof e)
    console.log(e)
    console.log(...info.filter(r => r.id === e))
    setDeletedRows(e)
  }
  const handleDownload = () => {
    if (info.length > 0) {
      //   console.log(`Clicked on Download Btn`)

      if (!download) {
        setDownload(true)
        // console.log(download)

        // Trigger the download logic
        function exportToCSV (apiData, fileName) {
          const fileType =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
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

        const apiData = info
        exportToCSV(apiData, fileName)
        setDownload(false)
      }
    } else {
      //   console.log('No item present to download')
    }
  }
  return (
    <div style={{ width: '100%', marginTop: '5%' }}>
       
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant='h6' align='center'>
                  Double click on any element to edit the cell data
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant='h6' align='center' >
                  To search data click on any column header
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant='outlined'
                  endIcon={<CloudDownloadIcon />}
                  style={{ margin: '1%' }}
                  onClick={handleDownload}
                >
                  Download
                </Button>
                <Button
                  variant='contained'
                  endIcon={<DeleteIcon />}
                  style={{ margin: '1%' }}
                  onClick={handleDelete}
                  color='error'
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Box>
    
      <DataGrid
        rows={info}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 }
          }
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        onRowSelectionModelChange={handleRowSelection}
      />
    </div>
  )
}

export default Table
