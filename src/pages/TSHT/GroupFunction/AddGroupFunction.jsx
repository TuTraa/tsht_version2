import UiContent from "../../../Components/Common/UiContent";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
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
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";

import React, { useEffect, useState } from "react";
import { Checkbox } from "antd";
import { useNavigate, Link } from "react-router-dom";
//formik
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAPIListFunction } from "../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import ToastCustom from "../../../Components/Common/Toast";
import { getAPIPostGroupFunction } from "../../../helpers/fakebackend_helper";
import { RequiredIcon } from "../../../Components/Common/RequiredIcon";
const AddGroupFunction = () => {
  document.title = "Tạo Nhóm quyền | Toà Soạn Hội Tụ";
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [options, setOptions] = useState([]);
  let navigate = useNavigate();
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      group_name: "",
      description: "",
      group_short_name: "",
    },
    validationSchema: Yup.object({
      group_name: Yup.string()
        .required("Tên nhóm quyền là bắt buộc")
        .max(45, "Tên nhóm quyền không được quá 45 ký tự"),
      description: Yup.string().required("Mô tả là bắt buộc"),
      group_short_name: Yup.string()
        .required("Tên ký hiệu là bắt buộc")
        .max(200, "Tên ký hiệu không được quá 200 ký tự"),
    }),
    onSubmit: (values) => {
      let result = {
        group_name: values.group_name,
        description: values.description,
        group_short_name: values.group_short_name,
      };
      getAPIPostGroupFunction(result).then((res) => {
        if (res.status > 0) {
          ToastCustom("Thêm nhóm quyền thành công", "success");
          validation.resetForm();
          navigate("/list-group-function");
        } else {
          ToastCustom(res.message, "fail");
        }
      });
    },
  });
  const onChange = (checkedValues) => {
    setCheckedList(checkedValues);
  };
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? options.map((e) => e.value) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  // useEffect(() => {
  //   getAPIListFunction().then((res) => {
  //     if (res.data && res.status > 0) {
  //       const option_list = res.data.map((e) => {
  //         return { value: e.function_id, label: e.function_name };
  //       });
  //       setOptions(option_list);
  //     } else {
  //       toast.error("Không tìm thấy dữ liệu!", {
  //         position: "top-right",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //     }
  //   });
  // }, []);
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb
            title="Tạo Nhóm quyền"
            pageTitle="Danh sách nhóm quyền"
            previousLink="/list-group-function"
          />
          <Card>
            <CardBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                }}
              >
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label>Tên nhóm quyền</Label> <RequiredIcon />
                      <Input
                        placeholder="Nhập tên nhóm quyền"
                        type="text"
                        className="form-control"
                        id="group_name"
                        value={validation.values.group_name}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        invalid={
                          validation.errors.group_name &&
                          validation.touched.group_name
                            ? true
                            : false
                        }
                      />
                      {validation.errors.group_name &&
                      validation.touched.group_name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.group_name}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label>Ký hiệu nhóm quyền</Label>
                      <RequiredIcon />
                      <Input
                        placeholder="Nhập ký hiệu (viết tắt) nhóm quyền"
                        type="text"
                        className="form-control"
                        id="group_short_name"
                        value={validation.values.group_short_name}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        invalid={
                          validation.errors.group_short_name &&
                          validation.touched.group_short_name
                            ? true
                            : false
                        }
                      />
                      {validation.errors.group_short_name &&
                      validation.touched.group_short_name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.group_short_name}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label>Thông tin mô tả</Label>
                      <Input
                        type="textarea"
                        placeholder="Nhập thông tin mô tả nhóm quyền (nếu có), tối đa 1000 ký tự"
                        className="form-control"
                        id="description"
                        value={validation.values.description}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                      />
                    </div>
                    {/* <div
                      className="mb-3"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <div style={{ display: "flex", gap: "5px" }}>
                        <Label>Các quyền</Label>
                        <Checkbox
                          indeterminate={indeterminate}
                          onChange={onCheckAllChange}
                          checked={checkAll}
                        />
                      </div>
                      <Checkbox.Group
                        options={options}
                        value={checkedList}
                        onChange={onChange}
                      />
                    </div> */}
                    <div
                      className="mb-3"
                      style={{ float: "right", gap: "5px", display: "flex" }}
                    >
                      <button type="submit" className="btn btn-secondary">
                        Tạo
                      </button>
                      <Link to="/list-group-function">
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

export default AddGroupFunction;
