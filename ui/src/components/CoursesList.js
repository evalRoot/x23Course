import { useEffect, useState } from "react";
import TableComponent from "../components/Table/TableComponent";
import request from "../helpers/request";
import PropTypes from 'prop-types';
import { COURSE_COMPLETE_STATUS } from "../const";
import moment from "moment";

CoursesList.propTypes = {
  assign: PropTypes.bool,
  all: PropTypes.bool
};

export default function CoursesList (props) {
  const [columnsState, setColumns] = useState([])
  const {userId} = props
  useEffect(() => {
    ( async () => {
      let response
      let columns = {
        header: [],
        rows: []
      }
      if (props.all) {
        response = await request('allCourse', 'GET', {})

        columns.header.push({
          label: 'Название Курса'
        })

        response.courses.forEach(course => {
          columns.rows.push({
            link: {linkTo: `courses/${course.id}`, title: course.name},
            sortBy: course.name,
            orderBy: course.name
          })
        });

        setColumns(columns)

      } else {
        response = await request('assignCourses', 'POST', {userId})
        let filteredCourses = {}
        if (props.assign) {
          filteredCourses = response.courses.filter(course => course.status !== COURSE_COMPLETE_STATUS)
        } else {
          filteredCourses = response.courses.filter(course => course.status === COURSE_COMPLETE_STATUS)
        }

        columns.header.push(
          {
            label: 'Название Курса'
          },
          {
            label: 'Дата активации'
          },
          {
            label: 'Дата начала'
          },
          {
            label: 'Дата завершения',
          },
          {
            label: 'Баллы'
          },
          {
            label: 'Статус'
          }
        )

        filteredCourses.forEach(course => {
          columns.rows.push(
            {
              link: {linkTo: `courses/${course.CourseId}`, title: course.name},
              activationDate: course.activationDate ? moment(course.createdAt).format('DD.MM.YYYY HH:mm:ss') : '',
              startDate : course.startDate ? moment(course.startDate).format('DD.MM.YYYY HH:mm:ss') : '',
              endDate: course.endDate ? moment(course.endDate).format('DD.MM.YYYY HH:mm:ss') : '',
              score: course.score,
              status: course.status,
              sortBy: course.name,
              orderBy: course.name
            }
          )
        })

        setColumns(columns)
      }
    })()
  }, []) 

  return (
    <TableComponent header={columnsState.header} rows={columnsState.rows} />
  )
}