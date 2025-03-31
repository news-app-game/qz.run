import React from 'react'

interface GenerateThaliProps {
  searchParams:Promise<{
    id?: string;
  }> ;
}

const GenerateThali = (props:GenerateThaliProps ) => {
  // console.log(searchParams.id);
  console.log(props);
  
  
  
  return (
    <div>生成套餐</div>
  )
}

export default GenerateThali