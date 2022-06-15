
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

const labels = ['Курс: Введение в JavaScript', 'Курс Основы JavaScript'];

const data = {
  labels,
  datasets: [
    {
      type: 'line',
      label: 'Сдали',
      borderColor: 'blue',
      borderWidth: 2,
      fill: false,
      data: [8, 7],
    },
    {
      type: 'bar',
      label: 'Сдали',
      backgroundColor: 'rgb(75, 192, 192)',
      borderColor: 'white',
      borderWidth: 2,
      data: [8, 7],
    },
    {
      label: 'Не сдали',
      data:[4, 7],
      backgroundColor: 'rgb(255, 99, 132)',
    },
  ],
};

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
  }, [])

  return (
    <Container>
      {isShowLeader &&
        <>
          <Typography>
            Руководитель:
          </Typography>
          <p>{`${leader.lastName} ${leader.firstName} ${leader.middleName}`}</p>
        </>
      }
      <Card style={{ padding: 15 }}>
        <Chart options={options} type='bar' data={data} />
      </Card>
    </Container>
  )
})