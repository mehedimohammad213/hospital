import { MyContext } from '@/utils/ContextApi';
import { Stack, Typography } from '@mui/material'
import React, { useContext } from 'react'

function ConteactItemCard({image,title,description}) {
    const { langu } = useContext(MyContext);
  return (
  
      <Stack direction={{md:"row",xs:"column"}} spacing={3} justifyContent={{xs:"center",md:"flex-start"}} alignItems={"center"} >
        <img src={image} alt="Contact Item" width={94} />
        <Stack justifyContent="center" >
          <Typography fontWeight={"bold"} textAlign={{xs:"center",md:"left"}}  color='#fff' dangerouslySetInnerHTML={{ __html: title || "" }} />
          <Typography  color='#fff' textAlign={{xs:"center",md:"left"}}  dangerouslySetInnerHTML={{ __html: description || "" }} />
        </Stack>
    </Stack>
  )
}
export default ConteactItemCard