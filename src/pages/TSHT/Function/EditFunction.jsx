import UiContent from "../../../Components/Common/UiContent";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Label,
  Row,
  Input,
  FormFeedback,
} from "reactstrap";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createFunction,
  getAPIListFunction,
  updateFunction,
} from "../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import ToastCustom from "../../../Components/Common/Toast";
import { RequiredIcon } from "../../../Components/Common/RequiredIcon";
import { Checkbox, Select } from "antd";
//   "function_name": "string",    input
//   "url": "string",    input
//   "is_active": 0,    checkBox
//   "parent_id": 0,    list select
//   "order": 0,   input
//   "css_icon": "string",   input

//   "user_create_id": 0,
//   "created_time": "2023-05-23T09:59:55.404Z",

const EditFunction = () => {
  document.title = "Sửa chức năng hệ thống | Toà Soạn Hội Tụ";
  const [listFunction, setListFunction] = useState([]);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  const [valueFun, setValueFun] = useState();
  const [funStatus, setFunStatus] = useState();
  const [statusDisplay, setStatusDisplay] = useState();
  const [detailtData, setDetailData] = useState(null);
  const { id } = useParams();

  function changeStatus(event) {
    var result = event.target.checked;
    setFunStatus(result);
  }
  function changeFunStatus(event) {
    var result = event.target.checked;
    setStatusDisplay(result);
  }
  function onChangeFun(value) {
    if (value === undefined) {
      value = null;
    }
    setValueFun(value);
  }
  useEffect(() => {
    getAPIListFunction().then((res) => {
      if (res.data && res.status > 0) {
        var options = [];
        res.data
          .filter((e) => e.parent_id === 0)
          .forEach((x) => {
            options.push({
              value: x.function_id,
              label: x.function_name,
            });
          });
        setListFunction(options);
        const detail = res.data.find((e) => e.function_id == id);
        setDetailData(detail || null);
        setValueFun(detail.parent_id);
        setFunStatus(detail.is_active === 1 ? true : false);
        setStatusDisplay(detail.is_display === 1 ? true : false);
      } else {
        toast.error("Không tìm thấy dữ liệu!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    });
  }, []);
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      function_name: detailtData ? detailtData.function_name : "",
      url: detailtData ? detailtData.url : "",
      order: detailtData ? detailtData.order : "",
      css_icon: detailtData ? detailtData.css_icon : "",
      parent_id: detailtData ? detailtData.parent_id : "",
    },
    validationSchema: Yup.object({
      function_name: Yup.string().required("Vui lòng nhập thông tin"),
      order: Yup.string().required("Vui lòng nhập thông tin"),
    }),
    onSubmit: (values) => {
      const data = {
        ...values,
        is_active: funStatus ? 1 : 0,
        is_display: statusDisplay ? 1 : 0,
        created_time: new Date().toISOString(),
        function_id: detailtData.function_id,
        action_name: detailtData.action_name,
        parent_id: valueFun === null ? 0 : valueFun,
      };
      updateFunction(data).then((res) => {
        if (res && res.status > 0) {
          ToastCustom("Cập nhật chức năng thành công", "success");
          validation.resetForm();
          navigate("/list-function");
        } else {
          ToastCustom("Có lỗi xảy ra, vui lòng thử lại", "fail");
        }
      });
    },
  });
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb
            title="Sửa chức năng hệ thống"
            pageTitle="Chức năng hệ thống"
            previousLink="/list-function"
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
                      <Label>Tên chức năng</Label>
                      <RequiredIcon />
                      <Input
                        placeholder="Nhập tên chức năng"
                        type="text"
                        className="form-control"
                        id="function_name"
                        value={validation.values.function_name}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        invalid={
                          validation.errors.function_name &&
                          validation.touched.function_name
                            ? true
                            : false
                        }
                      />
                      {validation.errors.function_name &&
                      validation.touched.function_name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.function_name}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label>Đường dẫn</Label>
                      <Input
                        placeholder="Nhập url"
                        type="text"
                        className="form-control"
                        id="url"
                        value={validation.values.url}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <Label>Vị trí chức năng</Label>
                      <RequiredIcon />
                      <Input
                        type="number"
                        placeholder="Nhập order"
                        className="form-control"
                        id="order"
                        value={validation.values.order}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        invalid={
                          validation.errors.order && validation.touched.order
                            ? true
                            : false
                        }
                      />
                      {validation.errors.order && validation.touched.order ? (
                        <FormFeedback type="invalid">
                          {validation.errors.order}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label>Thông tin chức năng cha</Label>
                      <Select
                        style={{
                          width: "100%",
                        }}
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: "auto",
                        }}
                        allowClear
                        options={listFunction}
                        placeholder="chức năng cha"
                        multiple
                        value={valueFun}
                        onChange={onChangeFun}
                      />
                    </div>
                    <div className="mb-3">
                      <Label>Thông tin icon</Label>
                      <Input
                        type="text"
                        placeholder="Nhập css_icon"
                        className="form-control"
                        id="css_icon"
                        value={validation.values.css_icon}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                      />
                    </div>

                    <div className="mb-3 d-flex">
                      <div style={{ marginRight: 10 }}>
                        <Checkbox
                          style={{
                            marginRight: 10,
                          }}
                          checked={funStatus}
                          onChange={changeStatus}
                        ></Checkbox>
                        <Label>Trạng thái</Label>
                      </div>
                      <div>
                        <Checkbox
                          style={{
                            marginRight: 10,
                          }}
                          checked={statusDisplay}
                          onChange={changeFunStatus}
                        ></Checkbox>
                        <Label>Hiển thị</Label>
                      </div>
                    </div>
                    <div
                      className="mb-3"
                      style={{ float: "right", gap: "5px", display: "flex" }}
                    >
                      <button type="submit" className="btn btn-secondary">
                        Xác nhận
                      </button>
                      <Link to="/list-function">
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

export default EditFunction;
