import { Delete, DeleteForever } from '@mui/icons-material'
import { Box, Icon } from '@mui/material'
import React from 'react'

const UserActions = ({params , rowId ,setRowId}) => {
// console.log(params)
    // const handleDeleteRow = (rowId)=>{
    //     console.log('delete')
    //     console.log(rowId)
    // }
  return (
    <Box>
      <Icon>
        {/* <DeleteForever color='error' onClick ={handleDeleteRow} /> */}
        <DeleteForever color='error' />
      </Icon>
    </Box>
  )
}

export default UserActions
