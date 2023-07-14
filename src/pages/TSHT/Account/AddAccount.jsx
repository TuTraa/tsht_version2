import UiContent from "../../../Components/Common/UiContent";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Label,
  Button,
  Input,
  FormFeedback,
} from "reactstrap";

import { Select, TreeSelect } from "antd";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import React, { useEffect, useState } from "react";
import classnames from "classnames";
//formik
import { useFormik } from "formik";
import * as Yup from "yup";

import ToastCustom from "../../../Components/Common/Toast";

//api
import {
  getAPIListDepartment,
  getAPIListGroupFunction,
  getAPIPostAccount,
  getAPITreeListCategory,
} from "../../../helpers/fakebackend_helper";

import { getAPIListCategory } from "../../../helpers/fakebackend_helper";
import { Link, useNavigate } from "react-router-dom";
import md5 from "md5";
import { RequiredIcon } from "../../../Components/Common/RequiredIcon";

const AddAccount = () => {
  document.title = "Tạo tài khoản | Toà Soạn Hội Tụ";
  const [activeTab, setActiveTab] = useState("personalDetails");
  const [department, setDepartment] = useState();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGroupFunction, setSelectedGroupFunction] = useState();
  const [optionsDepartment, setOptionsDepartment] = useState([]);
  const [optionsGroupFunction, setOptionsGroupFunction] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const [optionsCategory, setOptionsCategory] = useState([]);
  let navigate = useNavigate();
  function handleSelectDepartment(target) {
    setDepartment(target);
  }
  function handleSelectCategories(target) {
    setSelectedCategories(target);
  }
  function handleSelectGroupFunction(target) {
    setSelectedGroupFunction(target);
  }
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      username: "",
      fullname: "",
      password: "",
      confrim_password: "",
      email: "",
      phone: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Tên tài khoản là bắt buộc")
        .matches(/^[a-z ,.'_]+$/i, "Nhập sai định dạng tên tài khoản")
        .min(3, "Độ dài ít nhất 3 ký tự")
        .max(30, "Độ dài vượt quá 30 ký tự"),
      fullname: Yup.string()
        .required("Họ và tên là bắt buộc")
        .matches(/^[\p{L}\s'-]+$/u, "Nhập sai định dạng họ và tên ")
        .min(3, "Độ dài ít nhất 3 ký tự")
        .max(128, "Độ dài vượt quá 128 ký tự"),
      password: Yup.string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .matches(RegExp("(.*[a-z].*)"), "Ít nhất một ký tự in thường")
        .matches(RegExp("(.*[A-Z].*)"), "Ít nhất một ký tự in hoa")
        .matches(RegExp("(.*[0-9].*)"), "Ít nhất một ký tự số")
        .required("Mật khẩu là bắt buộc"),
      confrim_password: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
        .required("Xác nhận mật khẩu là bắt buộc"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc"),
      phone: Yup.string()
        .required("Số điện thoại là bắt buộc")
        .matches(
          /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
          "Nhật sai định dạng số điện thoại"
        ),
    }),
    onSubmit: (values) => {
      if (department == null) {
        ToastCustom("Hãy chọn phòng ban", "fail");
      } else if (
        selectedCategories == null ||
        selectedCategories.length === 0
      ) {
        ToastCustom("Hãy chọn ít nhất một chuyên muc", "fail");
      } else if (selectedGroupFunction == null) {
        ToastCustom("Hãy chọn phân quyền", "fail");
      } else {
        let result = {
          user_name: values.username,
          full_name: values.fullname,
          phone: values.phone,
          email: values.email,
          password: md5(values.password),
          department_id: department,
          category_list: selectedCategories.join("|"),
          group_list: `${selectedGroupFunction}`,
        };
        getAPIPostAccount(result).then((res) => {
          if (res.status > 0) {
            ToastCustom("Thêm tài khoản thành công", "success");
            validation.resetForm();
            navigate("/list-account");
          } else {
            ToastCustom(res.message, "fail");
          }
        });
      }
    },
  });

  useEffect(() => {
    getAPIListDepartment(0, -1).then((res) => {
      var options = [];
      if (res.data && res.data.list && res.status > 0) {
        res.data.list.forEach((e) => {
          options.push({
            value: e.department_id,
            label: e.department_name,
          });
        });
      }
      setOptionsDepartment(options);
    });
    getAPITreeListCategory(0, -1).then((res) => {
      var options = [];
      if (res.data && res.data.list && res.status > 0) {
        res.data.list.forEach((e) => {
          options.push({
            value: e.category_id,
            title: e.category_name,
            children: e.list_categories_lv2.map((x) => ({
              value: x.category_id,
              title: x.category_name,
              children: x.list_categories_lv3.map((y) => ({
                value: y.category_id,
                title: y.category_name,
              })),
            })),
          });
        });
      }
      setOptionsCategory(options);
    });
    getAPIListGroupFunction().then((res) => {
      var options = [];
      if (res.data && res.status > 0) {
        res.data.forEach((e) => {
          options.push({
            value: e.group_id,
            label: e.group_name,
          });
        });
      }
      setOptionsGroupFunction(options);
    });
  }, []);
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb
            title="Tạo tài khoản"
            pageTitle="Danh sách tài khoản"
            previousLink="/list-account"
          />
          <Card>
            <CardBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label for="usernameInput" className="form-label">
                        Tên tài khoản <RequiredIcon />
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="vtc.intecom"
                        id="username"
                        value={validation.values.username}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        invalid={
                          validation.errors.username &&
                          validation.touched.username
                            ? true
                            : false
                        }
                      />
                      {validation.errors.username &&
                      validation.touched.username ? (
                        <FormFeedback type="invalid">
                          {validation.errors.username}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label for="fullnameInput" className="form-label">
                        Họ và tên <RequiredIcon />
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Toà Soạn Hội Tụ"
                        id="fullname"
                        value={validation.values.fullname}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        invalid={
                          validation.errors.fullname &&
                          validation.touched.fullname
                            ? true
                            : false
                        }
                      />
                      {validation.errors.fullname &&
                      validation.touched.fullname ? (
                        <FormFeedback type="invalid">
                          {validation.errors.fullname}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div
                      className="mb-3"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <Label className="form-label">
                        Phòng Ban/Chức vụ <RequiredIcon />
                      </Label>
                      <Select
                        placeholder="Chọn phòng ban/chức vụ"
                        value={department}
                        onChange={handleSelectDepartment}
                        options={optionsDepartment}
                      />
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div
                      className="mb-3"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <Label className="form-label">
                        Chuyên mục phụ trách <RequiredIcon />
                      </Label>
                      <TreeSelect
                        placeholder="Chọn chuyên mục"
                        value={selectedCategories}
                        onChange={handleSelectCategories}
                        treeData={optionsCategory}
                        treeDefaultExpandAll
                        allowClear
                        multiple={true}
                        isMulti={true}
                      />
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div
                      className="mb-3"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <Label className="form-label">
                        Nhóm quyền <RequiredIcon />
                      </Label>
                      <Select
                        placeholder="Chọn nhóm quyền"
                        value={selectedGroupFunction}
                        onChange={handleSelectGroupFunction}
                        options={optionsGroupFunction}
                        isMulti={false}
                      />
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label for="emailInput" className="form-label">
                        Email <RequiredIcon />
                      </Label>
                      <Input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="intecom@vtc.vn"
                        value={validation.values.email}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        invalid={
                          validation.errors.email && validation.touched.email
                            ? true
                            : false
                        }
                      />
                      {validation.errors.email && validation.touched.email ? (
                        <FormFeedback type="invalid">
                          {validation.errors.email}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label for="phonenumberInput" className="form-label">
                        Số điện thoại <RequiredIcon />
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="phone"
                        placeholder="0912345678"
                        value={validation.values.phone}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        invalid={
                          validation.errors.phone && validation.touched.phone
                            ? true
                            : false
                        }
                      />
                      {validation.errors.phone && validation.touched.phone ? (
                        <FormFeedback type="invalid">
                          {validation.errors.phone}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label htmlFor="password-input" className="form-label">
                        Mật Khẩu <RequiredIcon />
                      </Label>
                      <div className="position-relative auth-pass-inputgroup">
                        <Input
                          type={passwordShow ? "text" : "password"}
                          className="form-control pe-5 password-input"
                          id="password"
                          name="password"
                          placeholder="Nhập mật khẩu mới"
                          value={validation.values.password}
                          onBlur={validation.handleBlur}
                          onChange={validation.handleChange}
                          invalid={
                            validation.errors.password &&
                            validation.touched.password
                              ? true
                              : false
                          }
                        />
                        {validation.errors.password &&
                        validation.touched.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                        <Button
                          color="link"
                          onClick={() => setPasswordShow(!passwordShow)}
                          className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                          type="button"
                          id="password-addon"
                        >
                          <i className="ri-eye-fill align-middle"></i>
                        </Button>
                      </div>
                      <div id="passwordInput" className="form-text">
                        Phải có ít nhất 8 ký tự.
                      </div>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label
                        htmlFor="confirm-password-input"
                        className="form-label"
                      >
                        Xác Nhận Mật Khẩu <RequiredIcon />
                      </Label>
                      <div className="position-relative auth-pass-inputgroup mb-3">
                        <Input
                          type={confirmPasswordShow ? "text" : "password"}
                          className="form-control pe-5 password-input"
                          id="confirm-password-input"
                          name="confrim_password"
                          placeholder="Nhập lại mật khẩu"
                          value={validation.values.confrim_password}
                          onBlur={validation.handleBlur}
                          onChange={validation.handleChange}
                          invalid={
                            validation.errors.confrim_password &&
                            validation.touched.confrim_password
                              ? true
                              : false
                          }
                        />
                        {validation.errors.confrim_password &&
                        validation.touched.confrim_password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.confrim_password}
                          </FormFeedback>
                        ) : null}
                        <Button
                          color="link"
                          onClick={() =>
                            setConfirmPasswordShow(!confirmPasswordShow)
                          }
                          className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                          type="button"
                        >
                          <i className="ri-eye-fill align-middle"></i>
                        </Button>
                      </div>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div
                      id="password-contain"
                      className="p-3 bg-light mb-2 rounded"
                    >
                      <h5 className="fs-13">Mật khẩu phải bao gồm:</h5>
                      <p id="pass-length" className="invalid fs-12 mb-2">
                        Ít nhất <b>8 ký tự</b>
                      </p>
                      <p id="pass-lower" className="invalid fs-12 mb-2">
                        Ít nhất <b>1 ký tự viết thường</b>(a-z)
                      </p>
                      <p id="pass-upper" className="invalid fs-12 mb-2">
                        Ít nhất <b>1 ký tự viết hoa</b>(A-Z)
                      </p>
                      <p id="pass-number" className="invalid fs-12 mb-0">
                        Ít nhất <b>1 số</b> (0-9)
                      </p>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="hstack gap-2 justify-content-start">
                      <button type="submit" className="btn btn-secondary">
                        Tạo
                      </button>
                      <Link to="/list-account">
                        <button type="button" className="btn btn-soft-danger">
                          Huỷ
                        </button>
                      </Link>
                    </div>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default AddAccount;
