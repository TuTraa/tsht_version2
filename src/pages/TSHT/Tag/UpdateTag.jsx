import {
  getAPIListTag,
  getAPIPostTag,
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
import { convertVietnamese } from "../../../helpers/text_helper";
import { RequiredIcon } from "../../../Components/Common/RequiredIcon";

const UpdateTag = () => {
  document.title = "Cập nhập tag | Toà Soạn Hội Tụ";

  const navigate = useNavigate();
  const [tag, setTag] = useState({});
  const { id } = useParams();
  const getTag = async () => {
    await getAPITagById(id).then((res) => {
      setTag(res.data);
    });
  };
  useEffect(() => {
    getTag().then((r) => {});
  }, []);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      tag_id: (tag && tag.tag_id) || "",
      tag_name: (tag && tag.tag_name) || "",
      tag_slug: (tag && tag.tag_slug) || "",
    },
    validationSchema: Yup.object({
      tag_name: Yup.string().required("Mời bạn nhập tên tag"),
      tag_slug: Yup.string().required("Mời bạn nhập slug tag"),
    }),
    onSubmit: (values) => {
      const updateTag = {
        tag_id: tag.tag_id,
        tag_name: values.tag_name,
        tag_slug: values.tag_slug,
      };
      // save new tag
      getAPIPutTag(updateTag).then((r) => {
        if (r.status > 0) {
          ToastCustom("Sửa tag thành công", "success");
          validation.resetForm();
          navigate("/list-tag");
        } else if (r.status === -1) {
          ToastCustom("Sửa tag thất bại", "fail");
        } else if (r.status === -2) {
          ToastCustom("Slug của tag bị trùng", "fail");
        }
      });
    },
  });
  return (
    <div>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Tag" pageTitle="Danh sách tag" />
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
                      <Label htmlFor="tagname-field" className="form-label">
                        Tên <RequiredIcon />
                      </Label>
                      <Input
                        name="tag_name"
                        id="tagname-field"
                        className="form-control"
                        placeholder="Nhập tên tag"
                        type="text"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={(e) => {
                          validation.handleBlur(e);
                          validation.values.tag_slug = convertVietnamese(
                            validation.values.tag_name
                          );
                        }}
                        value={validation.values.tag_name || ""}
                        invalid={
                          validation.touched.tag_name &&
                          validation.errors.tag_name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.tag_name &&
                      validation.errors.tag_name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.tag_name}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="tagslug-field" className="form-label">
                        Slug <RequiredIcon />
                      </Label>
                      <Input
                        name="tag_slug"
                        id="tagslug-field"
                        className="form-control"
                        placeholder="Nhập slug tag"
                        type="text"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.tag_slug || ""}
                        invalid={
                          validation.touched.tag_slug &&
                          validation.errors.tag_slug
                            ? true
                            : false
                        }
                      />
                      {validation.touched.tag_slug &&
                      validation.errors.tag_slug ? (
                        <FormFeedback type="invalid">
                          {validation.errors.tag_slug}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="hstack gap-2 justify-content-start">
                      <button type="submit" className="btn btn-success">
                        Chỉnh sửa
                      </button>
                      <Link to={`/list-tag`}>
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
export default UpdateTag;
