import React, { Fragment, useState, useEffect } from "react";
import AppNavbar from "./components/AppNavbar";
import { Container } from "reactstrap";
import Axios from "axios";
import UserContext from "./context/userContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [userData, setUserData] = useState({
    token: null,
    user: null,
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const userRes = await Axios.get("http://localhost:5000/api/auth/user/", {
        headers: { "x-auth-token": token },
      });
      // console.log(userRes.data);
      setUserData({
        token,
        user: userRes.data.user,
      });
    };

    checkLoggedIn();
  }, [userData.token]);

  return (
    <Fragment>
      <UserContext.Provider value={{ userData, setUserData }}>
        <div className="App">
          <AppNavbar />
          <Container>
            <h2>My react app {userData.token}</h2>
          </Container>
        </div>
      </UserContext.Provider>
    </Fragment>
  );
};

export default App;
