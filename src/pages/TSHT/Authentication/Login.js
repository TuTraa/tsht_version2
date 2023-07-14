import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Social Media Imports
import { GoogleLogin } from "react-google-login";
// import TwitterLogin from "react-twitter-auth"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
// actions
import { loginUser, socialLogin, resetLoginFlag } from "../../../store/actions";

// import logoLight from '../../assets/images/logo-light.png';
import vtcWhite from "../../../assets/images/vtc-white.png";
//Import config
import { api, facebook, google } from "../../../config";

import withRouter from "../../../Components/Common/withRouter";
import * as url from "../../../helpers/url_helper";
import CustomToastContainer from "../../../Components/Common/ToastContainer";
import { toast } from "react-toastify";

const Login = (props) => {
  const dispatch = useDispatch();
  const { user, errorMsg, loading, error } = useSelector((state) => ({
    user: state.Account.user,
    errorMsg: state.Login.errorMsg,
    loading: state.Login.loading,
    error: state.Login.error,
  }));

  const [userLogin, setUserLogin] = useState([]);
  const [passwordShow, setPasswordShow] = useState(false);
  useEffect(() => {
    if (user && user) {
      setUserLogin({
        email: user.user.email,
        password: user.user.confirm_password,
      });
    }
  }, [user]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: userLogin.email || "admin@themesbrand.com" || "",
      password: userLogin.password || "123456" || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values, props.router.navigate));
    },
  });

  const signIn = (res, type) => {
    if (type === "google" && res) {
      const postData = {
        name: res.profileObj.name,
        email: res.profileObj.email,
        token: res.tokenObj.access_token,
        idToken: res.tokenId,
      };
      dispatch(socialLogin(postData, props.router.navigate, type));
    } else if (type === "facebook" && res) {
      const postData = {
        name: res.name,
        email: res.email,
        token: res.accessToken,
        idToken: res.tokenId,
      };
      dispatch(socialLogin(postData, props.router.navigate, type));
    }
  };

  //handleGoogleLoginResponse
  const googleResponse = (response) => {
    signIn(response, "google");
  };

  //handleTwitterLoginResponse
  // const twitterResponse = e => {}

  //handleFacebookLoginResponse
  const facebookResponse = (response) => {
    signIn(response, "facebook");
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(resetLoginFlag());
      }, 3000);
    }
  }, [dispatch, error]);

  document.title = "Đăng nhập | Toà Soạn Hội Tụ";
  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={vtcWhite} alt="" height="50" />
                    </Link>
                  </div>
                  <p className="mt-3 fs-15 fw-medium">Toà Soạn Hội Tụ</p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Chào mừng trở lại !</h5>
                      <p className="text-muted">
                        Đăng nhập để tiếp tục tới Toà Soạn Hội Tụ.
                      </p>
                    </div>
                    {errorMsg && errorMsg ? (
                      <Alert color="danger"> {errorMsg} </Alert>
                    ) : null}
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        action="#"
                      >
                        <div className="mb-3">
                          <Label htmlFor="email" className="form-label">
                            Tài khoản
                          </Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Nhập tài khoản"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="password-input"
                          >
                            Mật khẩu
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              name="password"
                              type={passwordShow ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Mật khẩu"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password &&
                                validation.errors.password
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.password &&
                            validation.errors.password ? (
                              <FormFeedback type="invalid">
                                {validation.errors.password}
                              </FormFeedback>
                            ) : null}
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                              type="button"
                              id="password-addon"
                              onClick={() => setPasswordShow(!passwordShow)}
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </button>
                          </div>
                        </div>

                        <div className="form-check">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="auth-remember-check"
                          />
                          <Label
                            className="form-check-label"
                            htmlFor="auth-remember-check"
                          >
                            Ghi nhớ
                          </Label>
                          <div className="float-end">
                            <Link to="/forgot-password" className="text-muted">
                              Quên mật khẩu?
                            </Link>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Button
                            disabled={error ? null : loading ? true : false}
                            color="success"
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            {error ? null : loading ? (
                              <Spinner size="sm" className="me-2">
                                Loading...
                              </Spinner>
                            ) : null}
                            Đăng nhập
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <CustomToastContainer />
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default withRouter(Login);
