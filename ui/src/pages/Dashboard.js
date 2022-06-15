
import { Container, Typography, Card } from "@mui/material";
import { observer } from "mobx-react";
import { useContext, useEffect, useState } from "react";
import { Context } from "..";
import { LEADER_ROLE, USER_ROLE } from "../const";
import request from "../helpers/request";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

const options = {
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Bar Chart - Stacked',
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export default observer(function Dashboard() {
  const [leader, setLeader] = useState({})
  const [stateChart, setStateChart] = useState({
    labels:[],
    datasets:[{}]
  })
  const {user} = useContext(Context)
  const isShowLeader = (user.getUser.role === USER_ROLE || user.getUser.role === LEADER_ROLE) && user.getUser.UserId !== null

  useEffect(() => {

    if (isShowLeader) {
      (async () => {
        const response = await request('getLeader', 'POST', {
          UserId: user.getUser.UserId
        })
        setLeader(response.user)
      })()
    }

    if (user.getUser.role === LEADER_ROLE) {
      (async () => {
        const response = await request('leaderAssignCourse', 'POST', {
          id: user.getUser.id
        })
        const courses = response.mappedCourses
        const usersCourses = response.usersCourses.map(userCourse => userCourse.userCourses).flat()
        let usersCoursesFilter = []
        let passeds = []
        let faileds = []
        let passed = 0
        let failed = 0 

        for (let i = 0; i < courses.length; i++) {
          passed = 0
          failed = 0
          usersCoursesFilter = usersCourses.filter(userCourse => userCourse.CourseId === courses[i].id)
          for (let j = 0; j < usersCoursesFilter.length; j++) {
            if (usersCoursesFilter[j].score > 70) {
              passed++
            } else {
              failed++
            }
          }
          passeds.push(passed)
          faileds.push(failed)
        }


        const data = {
          labels: courses.map(course => course.name),
          datasets: [
            {
              type: 'line',
              label: 'Сдали',
              borderColor: 'blue',
              borderWidth: 2,
              fill: false,
              data: passeds,
            },
            {
              type: 'bar',
              label: 'Сдали',
              backgroundColor: 'rgb(75, 192, 192)',
              borderColor: 'white',
              borderWidth: 2,
              data: passeds,
            },
            {
              type: 'bar',
              label: 'Не сдали',
              data: faileds,
              backgroundColor: 'rgb(255, 99, 132)',
            },
          ],
        }

        console.log(data)

        setStateChart(data)
      })()
    }
    console.log(stateChart, 'state')
  }, [])

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Сводка:
      </Typography>
      {isShowLeader && leader.lastName && leader.firstName && leader.middleName  &&
        <>
          <Typography>
            Руководитель:
          </Typography>
          <p style={{marginBottom: 20}}>{`${leader.lastName} ${leader.firstName} ${leader.middleName}`}</p>
        </>
      }
      <Card style={{ padding: 15 }}>
        <Chart options={options} type='bar' data={stateChart} />
      </Card>
    </Container>
  )
})