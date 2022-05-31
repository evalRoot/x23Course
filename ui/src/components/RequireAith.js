import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Context } from "..";

export default observer(function RequireAuth ({children}) {
  const location = useLocation()
  const { user } = useContext(Context)
  if (!user.getAuth) {
    return <Navigate to='/login' state={{from: location}} />
  }

  return children
})

