import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getAPIListDisplayType,
  getAPIListPageType,
  getAPIPostAds,
} from "../../../helpers/fakebackend_helper";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Link, useNavigate, useParams } from "react-router-dom";
import ToastCustom from "../../../Components/Common/Toast";
import { DatePicker, TreeSelect, Select } from "antd";
import ButtonLiveChannel from "../LiveChannel/ButtonLiveChannel";
import dayjs from "dayjs";
import classnames from "classnames";
// import Select from "react-select";
import UploadComponent from "../Article/ArticleType/UploadComponent";
import CustomToastContainer from "../../../Components/Common/ToastContainer";
import SelectMedia from "../FileManager/FileManagerMedia/SelectMedia";
import { RequiredIcon } from "../../../Components/Common/RequiredIcon";

const AddAdvertisement = () => {
  document.title = "Thêm Quảng Cáo | Toà Soạn Hội Tụ";

  const [valuePageType, setValuePageType] = useState();
  const [valueDisplay, setValueDisplay] = useState();
  const [optionsPageType, setOptionsPageType] = useState([]);
  const [optionsDisplayType, setOptionsDisplayType] = useState([]);
  const [avatar, setAvatar] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [ads, setAds] = useState({});
  const [activeTab, setActiveTab] = useState("Image");
  let navigate = useNavigate();
  let optionsPageName = [];
  let optionsDisplayName = [];

  const onChangePageType = (newValue) => {
    setValuePageType(newValue);
  };

  useEffect(() => {
    if (valuePageType) {
      getAPIListDisplayType(valuePageType).then((resD) => {
        if (resD.data && resD.data && resD.status > 0) {
          resD.data.forEach((b) => {
            optionsDisplayName.push({
              value: b.position_num,
              label: b.position_name,
            });
          });
        }
        setOptionsDisplayType(optionsDisplayName);
      });
    }
  }, [valuePageType]);

  const onChangeDisplayType = (newValue) => {
    setValueDisplay(newValue);
  };

  useEffect(() => {
    getAPIListPageType().then((res) => {
      if (res.data && res.data && res.status > 0) {
        res.data.forEach((e) => {
          optionsPageName.push({
            value: e.page_type_num,
            title: e.page_type_name,
          });
        });
      }
      setOptionsPageType(optionsPageName);
    });
  }, []);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      ad_name: (ads && ads.ad_name) || "",
      ad_type: (activeTab && activeTab) || "",
      device_type: (ads && ads.device_type) || "web",
      page_type: (ads && ads.page_type) || "",
      display_position: (ads && ads.display_position) || "",
      priority: (ads && ads.priority) || 1,
      datetime_to: (ads && ads.datetime_to) || "",
      datetime_from: (ads && ads.datetime_from) || "",
      ad_content: (ads && ads.ad_content) || "",
      customer_info: (ads && ads.customer_info) || "",
      url: (ads && ads.url) || "",
      status: (ads && ads.status) || 0,
      is_display: (ads && ads.is_display) || 0,
      // avatar: (ads && ads.avatar) || "",
    },
    validationSchema: Yup.object({
      ad_name: Yup.string().required("Mời bạn nhập tên quảng cáo"),
      // page_type: Yup.string().required("Mời bạn chọn trang quảng cáo"),
      // display_position: Yup.string().required("Mời bạn chọn vị trí quảng cáo"),
    }),

    onSubmit: (values) => {
      const newAds = {
        ad_name: values.ad_name,
        ad_type: activeTab,
        device_type: values.device_type,
        page_type: valuePageType,
        display_position: valueDisplay,
        priority: values.priority,
        ad_content: values.ad_content,
        customer_info: values.customer_info,
        url: values.url,
        status: values.status,
        is_display: values.is_display,
        datetime_to: dayjs(toDate).toISOString(),
        datetime_from: dayjs(fromDate).toISOString(),
        image_url: avatar,
      };

      // save new ADS

      if (!valuePageType) {
        ToastCustom("Bạn chưa chọn 'Đặt tên trang'", "fail");
      } else if (!valueDisplay) {
        ToastCustom("Bạn chưa chọn 'Vị trí'", "fail");
      }
      else {
        getAPIPostAds(newAds).then((r) => {
          if (r.status >= 0) {
            ToastCustom("Thêm quảng cáo thành công", "success");
            validation.resetForm();
            navigate("/list-advertisement");
          } else if (r.status < 0) {
            ToastCustom(
                r.message ? r.message : "Thêm quảng cáo thất bại",
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

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          title="Thêm Mới Quảng Cáo"
          pageTitle="Danh sách Quảng Cáo"
          previousLink="/list-advertisement"
        />
        <Row>
          <Card>
            <CardHeader>
              <h5 className="card-title mb-4">Loại quảng cáo</h5>
              <Nav
                className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                role="tablist"
              >
                <NavItem>
                  <NavLink
                    to="#"
                    className={classnames({
                      active: activeTab === "Image",
                    })}
                    onClick={() => {
                      tabChange("Image");
                    }}
                    type="button"
                  >
                    <i className="far fa-user"></i>
                    Ảnh
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    to="#"
                    className={classnames({
                      active: activeTab === "Video",
                    })}
                    onClick={() => {
                      tabChange("Video");
                    }}
                    type="button"
                  >
                    <i className="far fa-user"></i>
                    Video
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    to="#"
                    className={classnames({
                      active: activeTab === "JavaScript",
                    })}
                    onClick={() => {
                      tabChange("JavaScript");
                    }}
                    type="button"
                  >
                    <i className="far fa-user"></i>
                    Mã JavaScript
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    to="#"
                    className={classnames({
                      active: activeTab === "Html",
                    })}
                    onClick={() => {
                      tabChange("Html");
                    }}
                    type="button"
                  >
                    <i className="far fa-user"></i>
                    Mã HTML
                  </NavLink>
                </NavItem>
              </Nav>
            </CardHeader>
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
                      Tên Quảng Cáo <RequiredIcon />
                    </Label>
                    <Input
                      name="ad_name"
                      className="form-control"
                      placeholder="Nhập tên quảng cáo"
                      type="text"
                      validate={{
                        required: { value: true },
                      }}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.ad_name || ""}
                      invalid={
                        validation.touched.ad_name && validation.errors.ad_name
                          ? true
                          : false
                      }
                    />
                    {validation.touched.ad_name && validation.errors.ad_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.ad_name}
                      </FormFeedback>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="tagname-field" className="form-label">
                      Đặt trên trang <RequiredIcon />
                    </Label>
                    <Col className="mb-3">
                      <TreeSelect
                        style={{
                          width: "100%",
                        }}
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: "auto",
                        }}
                        placeholder="Bấm chọn trang hiển thị"
                        allowClear
                        treeDefaultExpandAll
                        treeData={optionsPageType}
                        value={valuePageType}
                        onChange={onChangePageType}
                      />
                    </Col>
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="tagname-field" className="form-label">
                      Vị trí <RequiredIcon />
                    </Label>
                    <Col className="mb-3">
                      <Select
                        style={{
                          width: "100%",
                        }}
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: "auto",
                        }}
                        allowClear
                        value={valueDisplay}
                        options={optionsDisplayType}
                        placeholder="Bấm chọn vị trí hiển thị"
                        onChange={onChangeDisplayType}
                      />
                    </Col>
                  </div>

                  <div className="mb-3">
                    <div className="col-lg-4">
                      <Label className="form-label">Độ ưu tiên</Label>
                      <Input
                        id="priority"
                        name="priority"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="1"
                        onChange={validation.handleChange}
                        value={validation.values.priority || " "}
                      />
                    </div>
                  </div>

                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="Image">
                      <div className="mb-3">
                        <Col lg={4}>
                          <Label
                            htmlFor="article_avatar"
                            className="form-label"
                          >
                            Ảnh đại diện
                          </Label>
                          <SelectMedia
                            type={"dropzone"}
                            onUploadMedia={(e) => setAvatar(e)}
                          ></SelectMedia>
                        </Col>
                      </div>
                    </TabPane>
                  </TabContent>

                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="Video">
                      <div className="mb-3">
                        <Col lg={4}>
                          <Label
                            htmlFor="article_avatar"
                            className="form-label"
                          >
                            Video
                          </Label>
                          <UploadComponent />
                        </Col>
                      </div>
                    </TabPane>
                  </TabContent>

                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="Html">
                      <div className="mb-3">
                        <Label className="form-label">Nội dung </Label>
                        <textarea
                          name="event_description"
                          className="form-control"
                          placeholder="Nhập nội dung html"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.ad_content || ""}
                          cols={5}
                        />
                        {validation.touched.ad_content &&
                        validation.errors.ad_content ? (
                          <FormFeedback type="invalid">
                            {validation.errors.ad_content}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </TabPane>
                  </TabContent>

                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="JavaScript">
                      <div className="mb-3">
                        <Label className="form-label">Mô tả</Label>
                        <textarea
                          name="event_description"
                          className="form-control"
                          placeholder="Nhập nội dung JavaScript"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.event_description || ""}
                          cols={5}
                        />
                        {validation.touched.ad_content &&
                        validation.errors.ad_content ? (
                          <FormFeedback type="invalid">
                            {validation.errors.ad_content}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </TabPane>
                  </TabContent>

                  <div className="mb-3">
                    <Row>
                      <div className="col-2">
                        <div className="mb-3">
                          <Label className="form-label">
                            Thời gian bắt đầu
                          </Label>
                          <Col className="col-12">
                            <DatePicker
                              id="datetime_from"
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
                              id="datetime_to"
                              onChange={onChangeToDate}
                              placeholder="Đến ngày"
                              showTime
                            />
                          </Col>
                        </div>
                      </div>

                      <Col lg={2} className="mt-4">
                        <ButtonLiveChannel
                          title={"Trạng thái hoạt động"}
                          value={validation.values.status ? 1 : 0}
                          onChange={(values) => {
                            const temp = { ...ads };
                            temp.status = values.target.checked ? 1 : 0;
                            setAds(temp);
                          }}
                          name="status"
                        />
                      </Col>

                      <Col lg={2} className="mt-4">
                        <ButtonLiveChannel
                          title={"Hiển thị"}
                          value={validation.values.is_display ? 1 : 0}
                          onChange={(values) => {
                            const temp = { ...ads };
                            temp.is_display = values.target.checked ? 1 : 0;
                            setAds(temp);
                          }}
                          name="is_display"
                        />
                      </Col>
                      <Col lg={4}>
                        <Row>
                          <Label className="form-label">Hiển thị trên</Label>
                          <Col lg={2} className="mt-2">
                            <div className="form-check mb-2">
                              <Input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="web"
                                value={
                                  validation.values.device_type
                                    ? "web"
                                    : "mobile"
                                }
                                defaultChecked
                                onChange={(values) => {
                                  const temp = { ...ads };
                                  temp.device_type = values.target.checked
                                    ? "web"
                                    : "mobile";
                                  setAds(temp);
                                }}
                              />
                              <Label className="form-check-label" for="web">
                                Web
                              </Label>
                            </div>
                          </Col>
                          <Col lg={3} className="mt-2">
                            <div className="form-check">
                              <Input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="mobile"
                                value={
                                  validation.values.device_type
                                    ? "mobile"
                                    : "web"
                                }
                                onChange={(values) => {
                                  const temp = { ...ads };
                                  temp.device_type = values.target.checked
                                    ? "mobile"
                                    : "web";
                                  setAds(temp);
                                }}
                              />
                              <Label className="form-check-label" for="mobile">
                                Mobile
                              </Label>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>

                  <div className="mb-3">
                    <Label className="form-label">Đường dẫn đích</Label>
                    <Input
                      name="url"
                      className="form-control"
                      placeholder="Trang đối tác yêu cầu khi bấm quảng cáo sẽ link đến"
                      type="link"
                      validate={{
                        required: { value: true },
                      }}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.url || ""}
                      invalid={
                        validation.touched.url && validation.errors.url
                          ? true
                          : false
                      }
                    />
                    {validation.touched.url && validation.errors.url ? (
                      <FormFeedback type="invalid">
                        {validation.errors.url}
                      </FormFeedback>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <Label className="form-label">Tên đối tác</Label>
                    <Input
                      name="customer_info"
                      className="form-control"
                      placeholder="Nhập tên đối tác "
                      type="text"
                      validate={{
                        required: { value: true },
                      }}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.customer_info || ""}
                      invalid={
                        validation.touched.customer_info &&
                        validation.errors.customer_info
                          ? true
                          : false
                      }
                    />
                    {validation.touched.customer_info &&
                    validation.errors.customer_info ? (
                      <FormFeedback type="invalid">
                        {validation.errors.customer_info}
                      </FormFeedback>
                    ) : null}
                  </div>

                  <div className="hstack gap-2 justify-content-end ">
                    <button type="button" className="btn btn-light">
                      <Link to={`/list-advertisement`}>Quay lại</Link>
                    </button>
                    <button type="submit" className="btn btn-success">
                      Thêm mới
                    </button>
                  </div>
                </Form>
              </Col>
            </CardBody>
          </Card>
        </Row>
        <CustomToastContainer />
      </Container>
    </div>
  );
};
export default AddAdvertisement;
