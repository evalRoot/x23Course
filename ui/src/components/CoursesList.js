import { useEffect, useState } from "react";
import TableComponent from "../components/Table/TableComponent";
import request from "../helpers/request";

export default function CoursesList (props) {
  const [columns, setColumns] = useState([])
  const {userId} = props
  useEffect(() => {
    ( async () => {
      let response
      if (props.complete) {
      } else if (props.assign) {
        response = await request('assignCourses', 'POST', {
          userId
        }) 
        setColumns(response.courses)
      } else {
        response = await request('allCourse', 'GET', {}) 
        setColumns(response.courses)
      }
    })()
  }, []) 

  return (
    <TableComponent columns={columns} />
  )
}