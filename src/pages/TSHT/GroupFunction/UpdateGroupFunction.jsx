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
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getAPIListGroupFunction,
  getAPIPutGroupFunction,
} from "../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
//formik
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastCustom from "../../../Components/Common/Toast";
import { RequiredIcon } from "../../../Components/Common/RequiredIcon";
const UpdateGroupFunction = () => {
  document.title = "Cập nhật Nhóm quyền | Toà Soạn Hội Tụ";
  const navigate = useNavigate();
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [groupFunction, setGroupFunction] = useState();
  const { id } = useParams();
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      group_name: "",
      description: "",
      group_short_name: "",
    },
    validationSchema: Yup.object({
      group_name: Yup.string().required("Tên nhóm quyền là bắt buộc"),
      description: Yup.string().required("Mô tả là bắt buộc"),
      group_short_name: Yup.string().required("Tên ký hiệu là bắt buộc"),
    }),
    onSubmit: (values) => {
      let result = {
        group_id: parseInt(id),
        group_name: values.group_name,
        description: values.description,
        group_short_name: values.group_short_name,
      };
      getAPIPutGroupFunction(result).then((res) => {
        if (res.status > 0) {
          ToastCustom("Cập nhật nhóm quyền thành công", "success");
          validation.resetForm();
          navigate("/list-group-function");
        } else {
          ToastCustom(res.message, "fail");
        }
      });
    },
  });
  const options = [
    {
      label: "Apple",
      value: "1",
    },
    {
      label: "Pear",
      value: "2",
    },
    {
      label: "Orange",
      value: "3",
    },
  ];
  const onChange = (checkedValues) => {
    setCheckedList(checkedValues);
  };
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? options.map((e) => e.value) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  useEffect(() => {
    getAPIListGroupFunction().then((res) => {
      if (res.data && res.status > 0) {
        var data = res.data.filter((e) => e.group_id == id);
        if (data.length > 0) {
          const result = data[0];
          validation.setFieldValue("group_name", result.group_name);
          validation.setFieldValue("description", result.description);
          validation.setFieldValue("group_short_name", result.group_short_name);
        }
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
  }, [id]);
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb
            title="Cập nhật nhóm quyền"
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
                      <Label>Tên nhóm quyền</Label>
                      <RequiredIcon />
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
                        Cập nhật
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

export default UpdateGroupFunction;
