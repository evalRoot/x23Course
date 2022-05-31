
import { Container, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useContext, useEffect, useState } from "react";
import { Context } from "..";
import { LEADER_ROLE, USER_ROLE } from "../const";
import request from "../helpers/request";

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
    </Container>
  )
})