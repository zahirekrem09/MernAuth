import React, { Fragment, useContext, useState } from "react";
import { NavLink, Alert } from "reactstrap";
import UserContext from "../../context/userContext";
import Axios from "axios";

export const Logout = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [msg, setMsg] = useState(null);

  const handleLogout = async (e) => {
    try {
      const logoutRes = await Axios.get(
        "http://localhost:5000/api/auth/logout",
        { headers: { "x-auth-token": userData.token } }
      );
      setMsg(logoutRes.data.message);
      localStorage.setItem("auth-token", "");
      setUserData({
        token: null,
        user: null,
      });
    } catch (err) {
      err.response.data.message && setMsg(err.response.data.message);
    }
  };

  return (
    <Fragment>
      <NavLink onClick={handleLogout} href="#">
        Logout
      </NavLink>
      {msg ? <Alert color="danger">{msg}</Alert> : null}
    </Fragment>
  );
};

export default Logout;
