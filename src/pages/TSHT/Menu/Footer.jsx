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
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getAPIFooterById,
  getAPIPostFooter,
} from "../../../helpers/fakebackend_helper";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import ToastCustom from "../../../Components/Common/Toast";
import SelectMedia from "../FileManager/FileManagerMedia/SelectMedia";
import ContentEditor from "../Article/UpdateArticleType/ContentEditor";

const Footer = () => {
  document.title = "Quản lý giao diện | Toà Soạn Hội Tụ";

  const [header, setHeader] = useState({});
  const [avatar, setAvatar] = useState([]);
  // const initContent = `<p>Toà Soạn Hội Tụ.</p>`;
  const editorRef = useRef(null);
  const [initContent, setInitContent] = useState();

  const getFooter = async () => {
    await getAPIFooterById(0).then((res) => {
      setHeader(res.data);
      setAvatar(res.data.logo_url);
      setInitContent(res.data.contact_info);
    });
  };
  useEffect(() => {
    getFooter().then((r) => {});
  }, []);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      footer_id: (header && header.footer_id) || 0,
      logo_url: (header && header.logo_url) || "",
      description: (header && header.description) || "",
      contact_info: (header && header.contact_info) || "",
      copyright_info: (header && header.copyright_info) || "",
      android_link: (header && header.android_link) || "",
      ios_link: (header && header.ios_link) || "",
      facebook_link: (header && header.facebook_link) || "",
      zalo_link: (header && header.zalo_link) || "",
      youtube_link: (header && header.youtube_link) || "",
    },
    validationSchema: Yup.object({
      // logo_url: Yup.string().required("Mời bạn chọn ảnh"),
      // contact_info: Yup.string().required("Mời bạn nhập thông tin"),
    }),
    onSubmit: (values) => {
      const newFooter = {
        footer_id: 0,
        logo_url: avatar,
        contact_info: editorRef.current.getContent(),
        description: values.description,
        copyright_info: values.copyright_info,
        android_link: values.android_link,
        ios_link: values.ios_link,
        facebook_link: values.facebook_link,
        zalo_link: values.zalo_link,
        youtube_link: values.youtube_link,
      };
      // save new Header
      getAPIPostFooter(newFooter).then((r) => {
        if (r.status >= 0) {
          ToastCustom("Thêm Footer thành công", "success");
          validation.resetForm();
          // navigate("/footer");
        } else if (r.status < 0) {
          ToastCustom(r.message ? r.message : "Thêm Footer thất bại", "fail");
        }
      });
    },
  });
  return (
    <div>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Footer" />
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
                      <Col lg={4}>
                        <Label htmlFor="logo_url" className="form-label">
                          Ảnh Footer (ảnh logo)
                        </Label>
                        <SelectMedia
                          type={"dropzone"}
                          showImage={true}
                          defaultImgSrc={avatar}
                          onUploadMedia={(e) => setAvatar(e)}
                        ></SelectMedia>
                      </Col>
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Mô tả</Label>
                      <textarea
                        name="description"
                        className="form-control"
                        placeholder="Nhập mô tả tên báo"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.description || ""}
                      />
                    </div>

                    <div className="mb-3">
                      {editorRef !== null && (
                        <ContentEditor
                          title="Thông tin liên hệ"
                          value={initContent}
                          editorRef={editorRef}
                        />
                      )}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="copyright_info" className="form-label">
                        Thông tin bản quyền
                      </Label>
                      <Input
                        name="copyright_info"
                        type="text"
                        className="form-control"
                        id="copyright_info"
                        placeholder="Nội dung cần hiển thị theo từng báo đài"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={(e) => {
                          validation.handleChange(e);
                        }}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.copyright_info &&
                          validation.errors.copyright_info
                            ? true
                            : false
                        }
                        value={validation.values.copyright_info || ""}
                      />
                      {validation.touched.copyright_info &&
                      validation.errors.copyright_info ? (
                        <FormFeedback type="invalid">
                          {validation.errors.copyright_info}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Link tải ứng dụng</Label>
                      <Input
                        name="android_link"
                        type="link"
                        className="form-control"
                        id="android_link"
                        placeholder="Nhập đường dẫn ứng dụng trên Google Play "
                        validate={{
                          required: { value: true },
                        }}
                        onChange={(e) => {
                          validation.handleChange(e);
                        }}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.android_link &&
                          validation.errors.android_link
                            ? true
                            : false
                        }
                        value={validation.values.android_link || ""}
                      />
                      <Input
                        name="ios_link"
                        type="link"
                        className="form-control mt-3 "
                        id="ios_link"
                        placeholder="Nhập đường dẫn ứng dụng trên App Store "
                        validate={{
                          required: { value: true },
                        }}
                        onChange={(e) => {
                          validation.handleChange(e);
                        }}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.ios_link &&
                          validation.errors.ios_link
                            ? true
                            : false
                        }
                        value={validation.values.ios_link || ""}
                      />
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="link" className="form-label">
                        Link nhanh
                      </Label>
                      <Input
                        name="facebook_link"
                        type="link"
                        className="form-control"
                        id="facebook_link"
                        placeholder=" Link nhanh Facebook "
                        validate={{
                          required: { value: true },
                        }}
                        onChange={(e) => {
                          validation.handleChange(e);
                        }}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.facebook_link &&
                          validation.errors.facebook_link
                            ? true
                            : false
                        }
                        value={validation.values.facebook_link || ""}
                      />
                      <Input
                        name="zalo_link"
                        type="link"
                        className="form-control mt-3 "
                        id="zalo_link"
                        placeholder="Link nhanh Zalo "
                        validate={{
                          required: { value: true },
                        }}
                        onChange={(e) => {
                          validation.handleChange(e);
                        }}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.zalo_link &&
                          validation.errors.zalo_link
                            ? true
                            : false
                        }
                        value={validation.values.zalo_link || ""}
                      />
                      <Input
                        name="youtube_link"
                        type="link"
                        className="form-control mt-3 "
                        id="youtube_link"
                        placeholder="Link nhanh Youtube "
                        validate={{
                          required: { value: true },
                        }}
                        onChange={(e) => {
                          validation.handleChange(e);
                        }}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.youtube_link &&
                          validation.errors.youtube_link
                            ? true
                            : false
                        }
                        value={validation.values.youtube_link || ""}
                      />
                    </div>

                    <div className="hstack gap-2 justify-content-end">
                      <button type="submit" className="btn btn-success">
                        Lưu
                      </button>
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
export default Footer;
