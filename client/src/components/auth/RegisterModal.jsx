import React, { useState, useCallback, useContext } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  NavLink,
  Alert,
  Fade,
} from "reactstrap";
import Axios from "axios";
import UserContext from "../../context/userContext";

const RegisterModal = () => {
  const { setUserData } = useContext(UserContext);
  const [modal, setModal] = useState(false);
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [fadeIn, setFadeIn] = useState(true);

  const handleToggle = useCallback(() => {
    setModal(!modal);
  }, [modal]);

  const toggle = () => setFadeIn(!fadeIn);

  const handleChangeFirstName = (e) => setfirstName(e.target.value);
  const handleChangeLastName = (e) => setlastName(e.target.value);
  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    // Attempt to Register

    try {
      const newUser = { email, password, firstName, lastName };
      const registerRes = await Axios.post(
        "http://localhost:5000/api/auth/register",
        newUser
      );
      // const loginRes = await Axios.post("http://localhost:5000/users/login", {
      //   email,
      //   password,
      // });
      setUserData({
        token: registerRes.data.access_token,
        user: registerRes.data.user,
      });
      localStorage.setItem("auth-token", registerRes.data.access_token);
    } catch (err) {
      err.response.data.message && setMsg(err.response.data.message);
      console.log(err.response);
    }
  };

  return (
    <div>
      <NavLink onClick={handleToggle} href="#">
        Register
      </NavLink>

      <Modal isOpen={modal} toggle={handleToggle}>
        <ModalHeader toggle={handleToggle}>Register</ModalHeader>
        <ModalBody>
          {msg ? (
            <div>
              <Button color="primary" onClick={toggle}>
                X
              </Button>
              <Fade in={fadeIn} tag="p" className="mt-3">
                <Alert color="danger">{msg}</Alert>
              </Fade>
            </div>
          ) : null}
          <Form onSubmit={handleOnSubmit}>
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First Name"
                className="mb-3"
                onChange={handleChangeFirstName}
              />
              <Label for="lastName">Last Name</Label>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                className="mb-3"
                onChange={handleChangeLastName}
              />

              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="mb-3"
                onChange={handleChangeEmail}
              />

              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="mb-3"
                onChange={handleChangePassword}
              />
              <Button
                color="dark"
                type="submit"
                style={{ marginTop: "2rem" }}
                // onClick={handleOnSubmit}
                block
              >
                Register
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default RegisterModal;
