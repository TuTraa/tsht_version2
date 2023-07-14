import {
  getAPIDepartmentById,
  getAPIListTag,
  getAPIPostTag,
  getAPIPutDepartment,
  getAPIPutTag,
  getAPITagById,
} from "../../../helpers/fakebackend_helper";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
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
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import ToastCustom from "../../../Components/Common/Toast";

const UpdateDepartment = () => {
  document.title = "Sửa phòng ban | Toà Soạn Hội Tụ";

  const navigate = useNavigate();
  const [department, setDepartment] = useState({});
  const { id } = useParams();
  const getDepartment = async () => {
    await getAPIDepartmentById(id).then((res) => {
      setDepartment(res.data);
    });
  };
  useEffect(() => {
    getDepartment().then((r) => {});
  }, []);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      department_id: (department && department.department_id) || "",
      department_name: (department && department.department_name) || "",
      description: (department && department.description) || "",
    },
    validationSchema: Yup.object({
      department_name: Yup.string().required("Mời bạn nhập tên phòng ban"),
    }),
    onSubmit: (values) => {
      const updateDepartment = {
        department_id: id,
        department_name: values.department_name,
        description: values.description,
      };
      // save new tag
      getAPIPutDepartment(updateDepartment).then((r) => {
        if (r.status > 0) {
          ToastCustom("Sửa phòng ban thành công", "success");
          validation.resetForm();
          navigate("/list-department");
        } else if (r.status === -1) {
          ToastCustom("Sửa phòng ban thất bại", "fail");
        }
      });
    },
  });
  return (
    <div>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Sửa phòng ban" pageTitle="Danh sách phòng ban" />
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
                          validation.touched.department_name &&
                          validation.errors.department_name
                            ? true
                            : false
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
                        Chỉnh sửa
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
export default UpdateDepartment;
