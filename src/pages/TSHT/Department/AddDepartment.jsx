import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getAPIPostDepartment,
  getAPIPostTag,
} from "../../../helpers/fakebackend_helper";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ToastCustom from "../../../Components/Common/Toast";

const AddDepartment = () => {
  document.title = "Thêm phòng ban | Toà Soạn Hội Tụ";

  const [department, setDepartment] = useState({});
  let navigate = useNavigate();
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      department_id: (department && department.department_id) || "",
      department_name: (department && department.department_name) || "",
      description: (department && department.description) || "",
    },
    validationSchema: Yup.object({
      department_name: Yup.string().trim().required("Mời bạn nhập tên phòng ban")
        .min(2, 'Tên phòng ban không được nhỏ hơn 2 ký tự')
        .max(2, 'Tên phòng ban không được lớn hơn 50 ký tự')
    }),
    onSubmit: (values) => {
      const newDepartment = {
        department_name: values.department_name,
        description: values.description,
      };
      // save new department
      getAPIPostDepartment(newDepartment).then((r) => {
        if (r.status > 0) {
          ToastCustom("Thêm phòng ban thành công", "success");
          validation.resetForm();
          navigate("/list-department");
        } else if (r.status === -1) {
          ToastCustom("Thêm phòng ban thất bại", "fail");
        }
      });
    },
  });
  return (
    <div>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Thêm phòng ban" pageTitle="Danh sách phòng ban" />
          <Row>
            <Card>
              <CardBody>
                <Col lg={12}>
                  <Form
                    className="tablelist-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <div className="mb-3">
                      <Label
                        htmlFor="departmentname-field"
                        className="form-label"
                      >
                        Tên
                      </Label>
                      <Input
                        name="department_name"
                        id="departmentname-field"
                        className="form-control"
                        placeholder="Nhập tên phòng ban"
                        type="text"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.department_name || ""}
                        invalid={
                          !!(
                            validation.touched.department_name &&
                            validation.errors.department_name
                          )
                        }
                      />
                      {validation.touched.department_name &&
                        validation.errors.department_name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.department_name}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="description-field" className="form-label">
                        Slug
                      </Label>
                      <Input
                        name="description"
                        id="description-field"
                        className="form-control"
                        placeholder="Nhập mô tả phòng ban"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.description || ""}
                      />
                    </div>

                    <div className="hstack gap-2 justify-content-start">
                      <button type="submit" className="btn btn-success">
                        Thêm mới
                      </button>
                      <Link to={`/list-department`}>
                        <button type="button" className="btn btn-light">
                          Quay lại
                        </button>
                      </Link>
                    </div>
                  </Form>
                </Col>
              </CardBody>
            </Card>
          </Row>
        </Container>
      </div>
    </div>
  );
};
export default AddDepartment;
