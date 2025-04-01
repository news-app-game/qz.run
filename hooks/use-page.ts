import { useState } from "react";
export type PageType = {
  last_page: number
  page: number
  per_page: number
}

const usePage =<T> (per_page: number=10) => { 
  const [page,setPage] = useState<PageType>({
    per_page,
    page: 1,
    last_page:1
  })
  const [data,setData]= useState<T[]>([])
  const [total,setTotal]= useState<number>(0)
  const [loading,setLoading] = useState<boolean>(false)
  return {
    page,
    total,
    loading,
    data,
    setPage,
    setData,
    setTotal,
    setLoading
  }
}
export default usePage