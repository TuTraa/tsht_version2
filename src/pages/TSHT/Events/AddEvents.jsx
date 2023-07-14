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
  getAPIPostEvent,
} from "../../../helpers/fakebackend_helper";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ToastCustom from "../../../Components/Common/Toast";
import { DatePicker, TreeSelect } from "antd";
import ButtonLiveChannel from "../LiveChannel/ButtonLiveChannel";
import { FilePond } from "react-filepond";
import dayjs from "dayjs";
import SelectMedia from "../FileManager/FileManagerMedia/SelectMedia";
import { RequiredIcon } from "../../../Components/Common/RequiredIcon";
import { convertVietnamese } from "../../../helpers/text_helper";

const AddEvents = () => {
  document.title = "Thêm Sự kiện | Toà Soạn Hội Tụ";

  const [paginationFilter, setPaginationFilter] = useState({
    current: 1,
    pageSize: 10,
  });
  const [reload, setReload] = useState(false);
  const [valueSourceType, setValueSourceType] = useState();
  const [optionsSourceType, setOptionsSourceType] = useState([]);
  const [avatar, setAvatar] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const onChangeSourceType = (newValue) => {
    if (newValue === undefined) {
      newValue = null;
    }

    setPaginationFilter({
      ...paginationFilter,
      _event_id: newValue === null ? "" : newValue,
    });
    setValueSourceType(newValue);
    setReload(!reload);
  };

  useEffect(() => {
    getAPIListLiveChannelSourceType().then((res) => {
      let options = [];
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

  const [event, setEvent] = useState({});
  let navigate = useNavigate();
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      event_id: (event && event.event_id) || "",
      event_name: (event && event.event_name) || "",
      event_content: (event && event.event_content) || "",
      media_link: (event && event.media_link) || "",
      event_description: (event && event.event_description) || "",
      tag_list: (event && event.tag_list) || "",
      event_slug: (event && event.event_slug) || "",
      source_type: (event && event.source_type) || "",
      event_status: 0,
      drm_status: 0,
      start_date: (event && event.start_date) || "",
      end_date: (event && event.end_date) || "",
      user_create_id: 1,
    },
    validationSchema: Yup.object({
      event_name: Yup.string()
        .required("Mời bạn nhập tên sự kiện")
        .max(175, "Tên sự kiện không nhập quá 175 ký tự")
        .min(2, "Tên sự kiện không nhập nhỏ hơn 2 ký tự "),
      tag_list: Yup.string().required("Mời bạn nhập tag"),
      event_slug: Yup.string().required("Mời bạn nhập slug"),
    }),

    onSubmit: (values) => {
      const newEvent = {
        event_name: values.event_name,
        event_content: values.event_content,
        media_link: values.media_link,
        event_description: values.event_description,
        tag_list: values.tag_list,
        event_slug: values.event_slug,
        source_type:
          optionsSourceType.find((e) => {
            return e.value === values.source_type;
          }) || optionsSourceType[0].title,
        event_status: values.event_status,
        drm_status: values.drm_status,
        start_date: dayjs(fromDate).toISOString(),
        end_date: dayjs(toDate).toISOString(),
        image_link: avatar,
      };

      let result = { ...newEvent };
      // save new Events
      if (!result.image_link) {
        ToastCustom("Vui lòng chọn ảnh đại diện", "fail");
      } else {
        getAPIPostEvent(newEvent).then((r) => {
          if (r.status > 0) {
            ToastCustom("Thêm sự kiện thành công", "success");
            validation.resetForm();
            navigate("/list-events");
          } else if (r.status < 0) {
            ToastCustom(
              r.message ? r.message : "Thêm sự kiện thất bại",
              "fail"
            );
          }
        });
      }
    },
  });

  const onChangeFromDate = (e) => {
    setFromDate(e);
  };
  const onChangeToDate = (e) => {
    setToDate(e);
  };

  return (
    <div>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Thêm Mới Sự Kiện" pageTitle="Danh sách Sự Kiện" />
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
                      <Label className="form-label">
                        Tên Sự Kiện
                        <RequiredIcon />
                      </Label>
                      <Input
                        name="event_name"
                        className="form-control"
                        placeholder="Nhập tên sự kiện"
                        type="text"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={(e) => {
                          validation.handleBlur(e);
                          validation.values.event_slug = convertVietnamese(
                            validation.values.event_name || ""
                          );
                        }}
                        value={validation.values.event_name || ""}
                        invalid={
                          validation.touched.event_name &&
                          validation.errors.event_name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.event_name &&
                      validation.errors.event_name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.event_name}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">Mô tả</Label>
                      <textarea
                        name="event_description"
                        className="form-control"
                        placeholder="Nhập nội dung mô tả sự kiện"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.event_description || ""}
                      />
                      {validation.touched.event_description &&
                      validation.errors.event_description ? (
                        <FormFeedback type="invalid">
                          {validation.errors.event_description}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Col lg={4}>
                        <Label htmlFor="article_avatar" className="form-label">
                          Ảnh đại diện <RequiredIcon />
                        </Label>
                        <SelectMedia
                          type={"dropzone"}
                          onUploadMedia={(e) => setAvatar(e)}
                        ></SelectMedia>
                      </Col>
                    </div>

                    <div className="mb-3">
                      <Row>
                        <div className="col-2">
                          <div className="mb-3">
                            <Label className="form-label">
                              Thời gian bắt đầu
                            </Label>
                            <Col className="col-12">
                              <DatePicker
                                id="start_date"
                                allowClear
                                onChange={onChangeFromDate}
                                placeholder="Từ ngày"
                                showTime
                              />
                            </Col>
                          </div>
                        </div>

                        <div className="col-2">
                          <div className="mb-3">
                            <Label className="form-label">
                              Thời gian kết thúc
                            </Label>
                            <Col className="col-12">
                              <DatePicker
                                allowClear
                                id="end_date"
                                onChange={onChangeToDate}
                                placeholder="Đến ngày"
                                showTime
                              />
                            </Col>
                          </div>
                        </div>
                        <div className="col-3">
                          <Label className="form-label">Nguồn Livestream</Label>
                          <Col className="mb-3">
                            <TreeSelect
                              style={{
                                width: "80%",
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
                        </div>

                        <Col
                          lg={3}
                          className="mt-4"
                          style={{ marginLeft: -20 }}
                        >
                          <div
                            className="form-check form-switch form-switch-md mt-2"
                            dir="ltr"
                          >
                            <Input
                              type="switch"
                              className="form-check-input"
                              value={validation.values.event_status}
                              onChange={validation.handleChange}
                              name="event_status"
                            />
                            <Label className="form-check-label">
                              {"Trạng thái hoạt động"}
                            </Label>
                          </div>
                        </Col>

                        <Col lg={2} className="mt-4">
                          <div
                            className="form-check form-switch form-switch-md mt-2"
                            dir="ltr"
                          >
                            <Input
                              type="switch"
                              className="form-check-input"
                              value={validation.values.drm_status}
                              onChange={validation.handleChange}
                              name="drm_status"
                            />
                            <Label className="form-check-label">
                              {"Bật/Tắt DRM"}
                            </Label>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Nhập Link</Label>
                      <Input
                        name="media_link"
                        className="form-control"
                        placeholder="Nhập Link sự kiện nếu có..."
                        type="link"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.media_link || ""}
                        invalid={
                          validation.touched.media_link &&
                          validation.errors.media_link
                            ? true
                            : false
                        }
                      />
                      {validation.touched.media_link &&
                      validation.errors.media_link ? (
                        <FormFeedback type="invalid">
                          {validation.errors.media_link}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">Chèn chữ</Label>
                      <Input
                        name="event_content"
                        className="form-control"
                        placeholder="Chèn chữ sự kiện nếu có..."
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.event_content || ""}
                        invalid={
                          validation.touched.event_content &&
                          validation.errors.event_content
                            ? true
                            : false
                        }
                      />
                      {validation.touched.event_content &&
                      validation.errors.event_content ? (
                        <FormFeedback type="invalid">
                          {validation.errors.event_content}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">
                        Slug
                        <RequiredIcon />
                      </Label>
                      <Input
                        name="event_slug"
                        className="form-control"
                        placeholder="Nhập slug"
                        type="text"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.event_slug || ""}
                        invalid={
                          validation.touched.event_slug &&
                          validation.errors.event_slug
                            ? true
                            : false
                        }
                      />
                      {validation.touched.event_slug &&
                      validation.errors.event_slug ? (
                        <FormFeedback type="invalid">
                          {validation.errors.event_slug}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">
                        Tag
                        <RequiredIcon />
                      </Label>
                      <Input
                        name="tag_list"
                        className="form-control"
                        placeholder="Nhập tags: nội dung tags, tag sự kiện........ "
                        type="text"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.tag_list || ""}
                        invalid={
                          validation.touched.tag_list &&
                          validation.errors.tag_list
                            ? true
                            : false
                        }
                      />
                      {validation.touched.tag_list &&
                      validation.errors.tag_list ? (
                        <FormFeedback type="invalid">
                          {validation.errors.tag_list}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="hstack gap-2 justify-content-end m-lg-3">
                      <button type="submit" className="btn btn-success">
                        Thêm mới
                      </button>
                      <button type="button" className="btn btn-light">
                        <Link to={`/list-events`}>Quay lại</Link>
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
export default AddEvents;
