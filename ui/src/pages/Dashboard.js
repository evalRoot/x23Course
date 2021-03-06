
import { Container, Typography, Card } from "@mui/material";
import { observer } from "mobx-react";
import { useContext, useEffect, useState } from "react";
import { Context } from "..";
import { LEADER_ROLE, USER_ROLE } from "../const";
import request from "../helpers/request";
import imageTP1 from '../img/img1.png'
import imageTP2 from '../img/img2.png'
import imageTP3 from '../img/img3.png'
import imageTP4 from '../img/img4.png'
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
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    }
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
              label: '??????????',
              borderColor: 'blue',
              borderWidth: 2,
              fill: false,
              data: passeds,
            },
            {
              type: 'bar',
              label: '??????????',
              backgroundColor: 'rgb(75, 192, 192)',
              borderColor: 'white',
              borderWidth: 2,
              data: passeds,
            },
            {
              type: 'bar',
              label: '???? ??????????',
              data: faileds,
              backgroundColor: 'rgb(255, 99, 132)',
            },
          ],
        }

        setStateChart(data)
      })()
    }
  }, [])

  return (
    <Container>
      {isShowLeader && leader.lastName && leader.firstName && leader.middleName  &&
        <>
          <strong>
            ????????????????????????:
          </strong>
          <span style={{display: "inline-block", marginBottom: 10, marginLeft: 5}}>{`${leader.lastName} ${leader.firstName} ${leader.middleName}`}</span>
        </>
      }
      <div style={{ display: 'flex', marginBottom: 20, justifyContent: 'space-between'}}>
        <div style={{width: '25%', margin: '0 10px', textAlign: 'center'}}>
          <a href="https://support.x5.ru/login">
            <img style={{height: 200, margin: '0 auto'}} src={imageTP1} alt="atom" />
          </a>
          <span>?????? ??????????????????</span>
        </div>
        <div style={{width: '25%', margin: '0 10px', textAlign: 'center'}}>
          <a href="https://newportal.x5.ru/">
            <img style={{height: 200, margin: '0 auto'}} src={imageTP2} alt="atom" />
          </a>
          <span>???????????? ??5</span>
        </div>
        <div style={{width: '25%', margin: '0 10px', textAlign: 'center'}}>
          <a href="https://lk.x5.ru/">
            <img style={{height: 200, margin: '0 auto'}} src={imageTP3} alt="atom" />
          </a>
          <span>???????????? ??????????????</span>
        </div>
        <div style={{width: '25%', margin: '0 10px', textAlign: 'center'}}>
          <a href="https://wiki.x5.ru/">
            <img style={{height: 200, margin: '0 auto'}} src={imageTP4} alt="atom" />
          </a>
          <span>???????? ????????????</span>
        </div>
      </div>
      { user.getUser.role === LEADER_ROLE  &&
        <>
          <Typography variant="h4" sx={{ mb: 2 }}>
            ????????????:
          </Typography>
          <Card style={{position:'relative', padding: '25px 45px' }}>
          <div style={{position: 'absolute', left: '20px', top: '10px', fontSize: 14, lineHeight: '16px', textAlign: 'center'}}>
            ???????????????????? <br/> ??????????????????????
          </div>
            <Chart options={options} type='bar' data={stateChart} />
          </Card>
        </>
      }
    </Container>
  )
})