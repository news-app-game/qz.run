'use client';
import React from 'react'
const GenerateThali = ({ params}: { params:  Promise<{ id?: string[] }> }) => {
  console.log(params.id);
  
  
  return (
    <div>生成套餐</div>
  )
}

export default GenerateThali