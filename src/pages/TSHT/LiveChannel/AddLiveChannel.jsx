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
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getAPIListLiveChannelSourceType,
  getAPIPostChannel,
} from "../../../helpers/fakebackend_helper";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ToastCustom from "../../../Components/Common/Toast";
import ButtonLiveChannel from "./ButtonLiveChannel";
import { TreeSelect } from "antd";
import { FilePond } from "react-filepond";
import { RequiredIcon } from "../../../Components/Common/RequiredIcon";
import SelectMedia from "../FileManager/FileManagerMedia/SelectMedia";
import { convertVietnamese } from "../../../helpers/text_helper";

const AddLiveChannel = () => {
  document.title = "Thêm kênh | Toà Soạn Hội Tụ";
  const [avatar, setAvatar] = useState();
  const [paginationFilter, setPaginationFilter] = useState({
    current: 1,
    pageSize: 10,
  });
  const [reload, setReload] = useState(false);
  const [valueSourceType, setValueSourceType] = useState();
  const [optionsSourceType, setOptionsSourceType] = useState([]);
  const onChangeSourceType = (newValue) => {
    if (newValue === undefined) {
      newValue = null;
    }

    setPaginationFilter({
      ...paginationFilter,
      _live_channel_source_type_id: newValue === null ? "" : newValue,
    });
    setValueSourceType(newValue);
    setReload(!reload);
  };

  useEffect(() => {
    getAPIListLiveChannelSourceType().then((res) => {
      var options = [];
      if (res.data && res.data && res.status > 0) {
        res.data.forEach((e) => {
          options.push({
            value: e.live_channel_source_type_id,
            title: e.source_type,
          });
        });
      }
      setOptionsSourceType(options);
    });
  }, []);

  const [channel, setChannel] = useState({});
  let navigate = useNavigate();
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      channel_id: (channel && channel.channel_id) || "",
      channel_title: (channel && channel.channel_title) || "",
      description: (channel && channel.description) || "",
      link: (channel && channel.link) || "",
      slug: (channel && channel.slug) || "",
      source_type: (channel && channel.source_type) || "",
      channel_status: (channel && channel.channel_status) || 0,
      drm_status: (channel && channel.drm_status) || 0,
      user_create_id: 1,
    },
    validationSchema: Yup.object({
      channel_title: Yup.string()
        .trim()
        .required("Mời bạn nhập tên kênh")
        .max(175, "Tên kênh không nhập quá 175 ký tự")
        .min(2, "Tên kênh không nhập nhỏ hơn 2 ký tự "),
      link: Yup.string().trim().required("Mời bạn nhập đường dẫn kênh"),
      slug: Yup.string().trim().required("Mời bạn nhập slug"),
    }),
    onSubmit: (values) => {
      const newChannel = {
        channel_title: values.channel_title,
        description: values.description,
        link: values.link,
        slug: values.slug,
        source_type:
          optionsSourceType.find((e) => {
            return e.value === values.source_type;
          }) || optionsSourceType[0].title,
        channel_status: values.channel_status,
        drm_status: values.drm_status,
        user_create_id: 1,
        image_url: avatar,
      };
      let result = { ...newChannel };

      if (!result.channel_title) {
        ToastCustom("Mời bạn nhập tên kênh", "fail");
      } else if (!result.image_url) {
        ToastCustom("Mời bạn nhập ảnh kênh", "fail");
      } else {
        // save new liveChannel
        getAPIPostChannel(result).then((r) => {
          if (r.status >= 0) {
            ToastCustom("Thêm kênh thành công", "success");
            validation.resetForm();
            navigate("/list-live-channel");
          } else if (r.status < 0) {
            ToastCustom(r.message ? r.message : "Thêm kênh thất bại", "fail");
          }
        });
      }
    },
  });
  return (
    <div>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Thêm Mới Kênh" pageTitle="Danh sách kênh" />
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
                    <div className="row">
                      <Col lg={4}>
                        <div className="mb-3">
                          <Label htmlFor="tagname-field" className="form-label">
                            Tên kênh
                            <RequiredIcon />
                          </Label>
                          <Input
                            name="channel_title"
                            id="tagname-field"
                            className="form-control"
                            placeholder="Nhập tên kênh"
                            type="text"
                            validate={{
                              required: { value: true },
                            }}
                            onChange={validation.handleChange}
                            onBlur={(e) => {
                              validation.handleBlur(e);
                              validation.values.slug = convertVietnamese(
                                validation.values.channel_title
                              );
                            }}
                            value={validation.values.channel_title || ""}
                            invalid={
                              validation.touched.channel_title &&
                                validation.errors.channel_title
                                ? true
                                : false
                            }
                          />
                          {validation.touched.channel_title &&
                            validation.errors.channel_title ? (
                            <FormFeedback type="invalid">
                              {validation.errors.channel_title}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={4}>
                        <Label htmlFor="tagname-field" className="form-label">
                          Nguồn livestream
                        </Label>
                        <Col className="mb-3">
                          <TreeSelect
                            style={{
                              width: "100%",
                            }}
                            value={valueSourceType}
                            dropdownStyle={{
                              maxHeight: 400,
                              overflow: "auto",
                            }}
                            allowClear
                            treeData={optionsSourceType}
                            treeDefaultExpandAll
                            placeholder="Nguồn livestream"
                            onChange={onChangeSourceType}
                          />
                        </Col>
                      </Col>

                      {/*<Col lg={2} className="mt-4">*/}
                      {/*  <ButtonLiveChannel*/}
                      {/*    title={"Trạng thái hoạt động"}*/}
                      {/*    value={validation.values.channel_status ? 1 : 0}*/}
                      {/*    onChange={(values) => {*/}
                      {/*      const temp = { ...channel };*/}
                      {/*      temp.channel_status = values.target.checked ? 1 : 0;*/}
                      {/*      setChannel(temp);*/}
                      {/*    }}*/}
                      {/*    name="channel_status"*/}
                      {/*  />*/}
                      {/*</Col>*/}

                      {/*<Col lg={2} className="mt-4">*/}
                      {/*  <ButtonLiveChannel*/}
                      {/*    title={"Bật/Tắt DRM"}*/}
                      {/*    value={validation.values.drm_status ? 1 : 0}*/}
                      {/*    onChange={(values) => {*/}
                      {/*      const temp = { ...channel };*/}
                      {/*      temp.drm_status = values.target.checked ? 1 : 0;*/}
                      {/*      setChannel(temp);*/}
                      {/*    }}*/}
                      {/*    name="drm_status"*/}
                      {/*  />*/}
                      {/*</Col>*/}
                    </div>

                    <div className="mb-3">
                      <Col lg={4}>
                        <Label htmlFor="article_avatar" className="form-label">
                          Ảnh đại diện
                          <RequiredIcon />
                        </Label>
                        <SelectMedia
                          type={"dropzone"}
                          onUploadMedia={(e) => setAvatar(e)}
                        ></SelectMedia>
                      </Col>
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="slug" className="form-label">
                        Slug <RequiredIcon />
                      </Label>
                      <Input
                        name="slug"
                        type="text"
                        className="form-control"
                        id="slug"
                        placeholder="slug"
                        validate={{
                          required: { value: true },
                        }}
                        value={validation.values.slug || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.slug && validation.errors.slug
                            ? true
                            : false
                        }
                      />
                      {validation.touched.slug && validation.errors.slug ? (
                        <FormFeedback type="invalid">
                          {validation.errors.slug}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="tagname-field" className="form-label">
                        Đường dẫn kênh
                        <RequiredIcon />
                      </Label>
                      <Input
                        name="link"
                        id="tagname-field"
                        className="form-control"
                        placeholder="Nhập đường dẫn kênh"
                        type="text"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.link || ""}
                        invalid={
                          validation.touched.link && validation.errors.link
                            ? true
                            : false
                        }
                      />
                      {validation.touched.link && validation.errors.link ? (
                        <FormFeedback type="invalid">
                          {validation.errors.link}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="description-field" className="form-label">
                        Mô tả
                      </Label>
                      <textarea
                        name="description"
                        id="description-field"
                        className="form-control"
                        placeholder="Nhập mô tả"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.description || ""}
                      />
                      {validation.touched.description &&
                        validation.errors.description ? (
                        <FormFeedback type="invalid">
                          {validation.errors.description}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="hstack gap-2 justify-content-end">
                      <button type="submit" className="btn btn-success">
                        Thêm mới
                      </button>
                      <button type="button" className="btn btn-light">
                        <Link to={`/list-live-channel`}>Quay lại</Link>
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
export default AddLiveChannel;
