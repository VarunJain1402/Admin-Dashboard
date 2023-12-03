import { Delete, DeleteForever } from '@mui/icons-material'
import { Box, Icon } from '@mui/material'
import React from 'react'

const UserActions = ({params , rowId ,setRowId}) => {
    const handleDeleteRow = ()=>{
        console.log('delete')
        console.log(rowId)
    }
  return (
    <Box>
      <Icon>
        <DeleteForever color='error' onClick ={handleDeleteRow} />
      </Icon>
    </Box>
  )
}

export default UserActions
