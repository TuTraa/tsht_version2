import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
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
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SketchPicker } from "react-color";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastCustom from "../../../../../Components/Common/Toast";
import {
  getAPIGetArticleById,
  getAPIListAuthor,
  getAPIListCategory,
  getAPIPostTransitionPublishRole,
  getAPIPostTransitionUnPublishRole,
  getAPIPutArticle,
  getAPIRoleByArticleId,
  getAPITreeListCategory,
  getAPIArticleHistory,
  getAPIListTag,
  getArticleFileMediaList,
  getAPIListArticleRelated,
  getAPIGetReturnRole,
} from "../../../../../helpers/fakebackend_helper";
import {
  DatePicker,
  Popconfirm,
  Select,
  Steps,
  TreeSelect,
  Modal,
  Image,
  Button,
} from "antd";
import classnames from "classnames";

import { convertVietnamese } from "../../../../../helpers/text_helper";
import { RequiredIcon } from "../../../../../Components/Common/RequiredIcon";
import CustomModal from "./../../UpdateArticleType/ModelStepsInfo.component";
import moment from "moment";
import SelectMedia from "../../../FileManager/FileManagerMedia/SelectMedia";
import DeleteModal from "../../../../../Components/Common/DeleteModal";
import DateTime from "./../../ArticleType/DateTime";
import dayjs from "dayjs";
import diff from "node-htmldiff";
import ComponentArticlePrice from "../../UpdateArticleType/ComponentArticlePrice";
import { v4 as uuidv4 } from "uuid";
import SelectTag from "../../../../../Components/Common/SelectTag";
import {
  selectArticleColorText,
  updateArticleBackgroundColor,
} from "../../../../../store/fileManager/action";

const UpdateSettingMagazine = () => {
  document.title = "Thông tin bài viết | Toà Soạn Hội Tụ";
  const dispatch = useDispatch();
  const [valueCategory, setValueCategory] = useState();
  const [activeTab, setActiveTab] = useState("article");
  const [role, setRole] = useState();
  const [reload, setReload] = useState(false);
  const [currentRole, setCurrentRole] = useState();
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [publishTime, setPublishTime] = useState();
  const [valueAuthor, setValueAuthor] = useState([]);
  const [articleTypeId, setArticleTypeId] = useState();
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  const [outstanding1, setOutstanding1] = useState();
  const [outstanding2, setOutstanding2] = useState();
  const [listImage, setListImage] = useState([]);
  const { id } = useParams();
  let navigate = useNavigate();
  const [modal_scroll, setmodal_scroll] = useState(false);
  const [currentClick, setCurrentClick] = useState();
  const [listUser, setListUser] = useState();
  const [stepName, setStepName] = useState();
  const [articlePrice, setArticlePrice] = useState();
  const [articleHistory, setArticleHistory] = useState([]);
  const [listHistory, setListHistory] = useState([]);
  const [enableComment, setEnableComment] = useState();
  const [open, setOpen] = useState(false);
  const { eMagazineContent } = useSelector((state) => ({
    eMagazineContent: state.FileManager.eMagazineContent,
  }));
  const { eMagazineBlock } = useSelector((state) => ({
    eMagazineBlock: state.FileManager.eMagazineBlock,
  }));
  const { eMagazineTextColor } = useSelector((state) => ({
    eMagazineTextColor: state.FileManager.eMagazineTextColor,
  }));
  const { eMagazineBackgroundColor } = useSelector((state) => ({
    eMagazineBackgroundColor: state.FileManager.eMagazineBackgroundColor,
  }));
  const [reloadTag, setReloadTag] = useState();
  const [selectedTags, setSelectedTags] = useState([]);
  const [optionsTag, setOptionTag] = useState([]);
  const [articleRelate, setArticleRelate] = useState([]);
  const [valueArticleRelate, setValueArticleRelate] = useState([]);
  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().startOf("day");
  };

  function onChangeAuthor(value) {
    if (value === undefined) {
      value = null;
    }
    setValueAuthor(value);
  }

  function onChangeCategory(value) {
    if (value === undefined) {
      value = null;
    }
    setValueCategory(value);
  }

  const [avatar, setAvatar] = useState();
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      article_title: "",
      article_sapo: "",
      slug: "",
    },
    validationSchema: Yup.object({
      article_title: Yup.string().required("Mời bạn nhập tên bài viết"),
      article_sapo: Yup.string()
        .required("Mời bạn nhập sapo cho bài viết")
        .max(300, "Sapo bài viết không được quá 300 kí tự"),
      slug: Yup.string().required("Mời bạn nhập slug cho bài viết"),
    }),
    onSubmit: (values) => {
      const data = {
        article_id: id,
        article_title: values.article_title,
        article_sapo: values.article_sapo,
        category_id: valueCategory.value ? valueCategory.value : valueCategory,
        // author: valueAuthor.value ? valueAuthor.value : valueAuthor,
        other_author: "[" + valueAuthor.toString() + "]",
        article_type_id: 2,
        article_content: eMagazineContent,
        avatar_image: avatar,
        leak_url: values.leak_url ? values.leak_url : "",
        article_files:
          listImage.length > 0
            ? JSON.stringify(listImage.map((e) => e.id))
            : "",
        outstanding: outstanding1 ? 1 : 2,
        enable_comment: enableComment ? 1 : 0,
        tag_list: "[" + selectedTags.toString() + "]",
        slug: values.slug,
        note: "",
        user_create_id: 90,
        user_modify_id: 90,
        list_article_relate: "[" + valueArticleRelate.toString() + "]",
        magazine: {
          blocks: eMagazineBlock,
        },
      };
      let result = { ...data };
      if (publishTime !== null) {
        result = { ...data, publish_date: publishTime };
      }
      if (!result.article_content) {
        ToastCustom("Mời bạn nhập nội dung bài viết", "fail");
      } else if (!result.article_type_id) {
        ToastCustom("Loại bài viết không xác định", "fail");
      } else if (!result.category_id) {
        ToastCustom("Mời bạn chọn chuyên mục bài viết", "fail");
      } else if (outstanding1 && outstanding2) {
        ToastCustom("Chỉ được chọn tin nổi bật hoặc tin tiêu điểm", "fail");
      } else {
        // save new article
        getAPIPutArticle(result).then((r) => {
          if (r.status && r.status > 0) {
            ToastCustom("Sửa bài viết thành công", "success");
            validation.resetForm();
            navigate("/list-article");
          } else {
            ToastCustom(r.message && r.message, "fail");
          }
        });
      }
    },
  });
  useEffect(() => {
    getAPIGetArticleById(id).then((res) => {
      if (res.status > 0) {
        validation.setFieldValue("article_title", res.data.article_title);
        validation.setFieldValue("article_sapo", res.data.article_sapo);
        validation.setFieldValue("slug", res.data.slug);
        validation.setFieldValue("leak_url", res.data.leak_url);
        setSelectedTags(
          res.data.list_tag_info
            ? res.data.list_tag_info.map((e) => e.tag_id)
            : []
        );
        setValueArticleRelate(
          res.data.list_article_relate
            ? res.data.list_article_relate.map((e) => {
                return {
                  title: e.article_title,
                  value: e.article_id,
                };
              })
            : []
        );
        setOutstanding1(res.data.outstanding === 1 ? true : false);
        setOutstanding2(res.data.outstanding === 2 ? true : false);
        setEnableComment(res.data.enable_comment === 1 ? true : false);

        setCurrentRole(res.data.next_public_role_step - 1);
        setPublishTime(
          res.data.publish_date !== null
            ? new Date(res.data.publish_date).toISOString()
            : null
        );
        setArticleTypeId(res.data.article_status_id);
        setValueCategory({
          value: res.data.category_id,
          label: res.data.category_name,
        });
        setAvatar(res.data.avatar_image);
        setValueAuthor(JSON.parse(res.data.other_author || "[]"));
      }
    });
    getAPIRoleByArticleId(id).then((res) => {
      if (res.data && res.status > 0) {
        setRole(res.data);
      }
    });
  }, [reload]);
  useEffect(() => {
    getAPITreeListCategory(0, -1).then((res) => {
      var options = [];
      if (res.data && res.data.list && res.status > 0) {
        res.data.list.forEach((e) => {
          options.push({
            value: e.category_id,
            title: e.category_name,
            children: e.list_categories_lv2.map((x) => ({
              value: x.category_id,
              title: x.category_name,
              children: x.list_categories_lv3.map((y) => ({
                value: y.category_id,
                title: y.category_name,
              })),
            })),
          });
        });
      }
      setOptionsCategory(options);
    });
    getArticleFileMediaList({ article_id: id }).then((res) => {
      if (res && res.status > 0) {
        setListImage(
          res.data.map((e) => {
            return {
              url: `${e.file_url}`,
              id: e.file_info_id,
              type: e.file_type,
              originUrl: e.file_url,
            };
          })
        );
      }
    });
    getAPIListAuthor().then((res) => {
      if (res.data && res.status > 0) {
        var options = [];
        res.data.forEach((e) => {
          options.push({
            value: e.user_id,
            label: e.author_name,
          });
        });
      }
      setOptionsAuthor(options);
    });
    getAPIArticleHistory(id).then((res) => {
      if (res.data && res.status > 0) {
        var options = [];
        res.data.forEach((e) => {
          options.push({
            value: e.modified_date,
            label: `Phiên bản ${moment(e.modified_date).format(
              "DD/MM/YYYY HH:mm"
            )} tạo bởi ${e.user_name}`,
          });
        });
        setListHistory(options);
        setArticleHistory(res.data);
      }
    });
  }, []);
  function tog_scroll() {
    setmodal_scroll(!modal_scroll);
  }
  const handleStepChange = (current) => {
    if (current >= currentRole) {
      setCurrentClick(current);
      setmodal_scroll(!modal_scroll);
      const currentStep = role._role_steps_info[current];
      setStepName(currentStep.step_name);
      setListUser(currentStep.list_user_accept);
    }
  };
  const showModalStep = () => {
    setCurrentClick(currentRole + 1);
    setmodal_scroll(!modal_scroll);
    const currentStep = role._role_steps_info[currentRole + 1];
    setStepName(currentStep.step_name);
    setListUser(currentStep.list_user_accept);
  };
  const onChangeFromDate = (e) => {
    setPublishTime(dayjs(e).format("YYYY-MM-DDTHH:mm:ss"));
  };
  return (
    <>
      <Row>
        <Col lg={12}>
          <div id="article-wrap">
            <Row>
              <Col lg={8} style={{ overflow: "auto", height: "80vh" }}>
                <Row>
                  <Col>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Label>Màu chữ</Label>
                      <SketchPicker
                        onChangeComplete={(e) =>
                          dispatch(selectArticleColorText(e.hex))
                        }
                        color={eMagazineTextColor}
                      />
                    </div>
                  </Col>
                  <Col>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Label>Màu nền</Label>
                      <SketchPicker
                        onChangeComplete={(e) =>
                          dispatch(updateArticleBackgroundColor(e.hex))
                        }
                        color={eMagazineBackgroundColor}
                      />
                    </div>
                  </Col>
                </Row>
                <Card>
                  <CardBody>
                    <Form
                      className="tablelist-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-3">
                        <Label htmlFor="article_title" className="form-label">
                          Tiêu đề <RequiredIcon />
                        </Label>
                        <Input
                          name="article_title"
                          type="text"
                          className="form-control"
                          id="article_title"
                          placeholder="Toà Soạn Hội Tụ"
                          validate={{
                            required: { value: true },
                          }}
                          onChange={validation.handleChange}
                          onBlur={(e) => {
                            validation.handleBlur(e);
                            validation.values.slug = convertVietnamese(
                              validation.values.article_title
                            );
                          }}
                          invalid={
                            !!(
                              validation.touched.article_title &&
                              validation.errors.article_title
                            )
                          }
                          value={validation.values.article_title}
                        />
                        {validation.touched.article_title &&
                        validation.errors.article_title ? (
                          <FormFeedback type="invalid">
                            {validation.errors.article_title}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label htmlFor="article_sapo" className="form-label">
                          Sapo <RequiredIcon />
                        </Label>
                        <Input
                          name="article_sapo"
                          type="text"
                          className="form-control"
                          id="article_sapo"
                          placeholder="Toà Soạn Hội Tụ"
                          validate={{
                            required: { value: true },
                          }}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            !!(
                              validation.touched.article_sapo &&
                              validation.errors.article_sapo
                            )
                          }
                          value={validation.values.article_sapo}
                        />
                        {validation.touched.article_sapo &&
                        validation.errors.article_sapo ? (
                          <FormFeedback type="invalid">
                            {validation.errors.article_sapo}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="hstack gap-2 justify-content-end">
                        <button type="submit" className="btn btn-success">
                          Lưu bài viết
                        </button>
                        {currentRole >= 1 && articleTypeId !== 4 && (
                          <Popconfirm
                            title={"Xác nhận trả bài"}
                            icon={<></>}
                            okText={"Đồng ý"}
                            cancelText={"Hủy bỏ"}
                            onConfirm={() => {
                              getAPIGetReturnRole(id).then((res) => {
                                if (res && res.status > 0) {
                                  ToastCustom(
                                    "Trả bài viết thành công",
                                    "success"
                                  );
                                  setReload(!reload);
                                } else {
                                  ToastCustom(
                                    res.message && res.message,
                                    "fail"
                                  );
                                }
                              });
                            }}
                          >
                            <button type="button" className="btn btn-primary">
                              Trả bài
                            </button>
                          </Popconfirm>
                        )}
                        {articleTypeId && articleTypeId === 4 ? (
                          <Popconfirm
                            title={"Xác nhận hạ xuất bản"}
                            icon={<></>}
                            okText={"Đồng ý"}
                            cancelText={"Hủy bỏ"}
                            onConfirm={() => {
                              getAPIPostTransitionUnPublishRole(id).then(
                                (res) => {
                                  if (res && res.status > 0) {
                                    ToastCustom(
                                      "Hạ Xuất bản bài viết thành công",
                                      "success"
                                    );
                                    setReload(!reload);
                                  } else {
                                    ToastCustom(
                                      res.message && res.message,
                                      "fail"
                                    );
                                  }
                                }
                              );
                            }}
                          >
                            <button type="button" className="btn btn-primary">
                              Hạ Xuất bản
                            </button>
                          </Popconfirm>
                        ) : (
                          role &&
                          role._role_steps_info &&
                          (currentRole >= role._role_steps_info.length - 1 ? (
                            <Popconfirm
                              title={"Xác nhận xuất bản"}
                              icon={<></>}
                              okText={"Đồng ý"}
                              cancelText={"Hủy bỏ"}
                              onConfirm={() => {
                                getAPIPostTransitionPublishRole(id).then(
                                  (res) => {
                                    if (res && res.status > 0) {
                                      ToastCustom(
                                        "Xuất bản bài viết thành công",
                                        "success"
                                      );
                                      setReload(!reload);
                                    } else {
                                      ToastCustom(
                                        res.message && res.message,
                                        "fail"
                                      );
                                    }
                                  }
                                );
                              }}
                            >
                              <button type="button" className="btn btn-primary">
                                Xuất bản
                              </button>
                            </Popconfirm>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={showModalStep}
                                className="btn btn-primary"
                              >
                                Chuyển tiếp
                              </button>
                            </>
                          ))
                        )}
                      </div>
                      <div className="mb-3">
                        <Label
                          htmlFor="article_category"
                          className="form-label"
                        >
                          Chuyên mục
                        </Label>
                        <TreeSelect
                          style={{
                            width: "100%",
                          }}
                          dropdownStyle={{
                            maxHeight: 400,
                            overflow: "auto",
                          }}
                          allowClear
                          treeData={optionsCategory}
                          treeDefaultExpandAll
                          placeholder="Chuyên mục"
                          value={valueCategory}
                          onChange={onChangeCategory}
                        />
                      </div>
                      <div className="mb-3">
                        <Label htmlFor="article_author" className="form-label">
                          Tác giả khác
                        </Label>
                        <Select
                          style={{
                            width: "100%",
                          }}
                          dropdownStyle={{
                            maxHeight: 400,
                            overflow: "auto",
                          }}
                          allowClear
                          options={optionsAuthor}
                          placeholder="Có thể chọn nhiều tác giả"
                          mode="multiple"
                          showSearch
                          value={valueAuthor}
                          onChange={onChangeAuthor}
                        />
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
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.slug}
                          invalid={
                            !!(
                              validation.touched.slug && validation.errors.slug
                            )
                          }
                        />
                        {validation.touched.slug && validation.errors.slug ? (
                          <FormFeedback type="invalid">
                            {validation.errors.slug}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <SelectTag
                        setOptionTag={setOptionTag}
                        setSelectedTags={setSelectedTags}
                        setValueArticleRelate={setValueArticleRelate}
                        optionsTag={optionsTag}
                        articleRelate={articleRelate}
                        selectedTags={selectedTags}
                        valueArticleRelate={valueArticleRelate}
                        setReloadTag={() => setReloadTag(!reloadTag)}
                        setArticleRelate={setArticleRelate}
                        reloadTag={reloadTag}
                      />
                    </Form>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={4} style={{ overflow: "auto", height: "80vh" }}>
                <Card>
                  <CardHeader>
                    <Nav
                      className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                      role="tablist"
                    >
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "article",
                          })}
                          onClick={() => {
                            tabChange("article");
                          }}
                          type="button"
                        >
                          <i className="fas fa-home"></i>
                          Thông tin bài viết
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          to="#"
                          className={classnames({
                            active: activeTab === "process",
                          })}
                          onClick={() => {
                            tabChange("process");
                          }}
                          type="button"
                        >
                          <i className="far fa-user"></i>
                          Quy trình
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </CardHeader>
                  <CardBody>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="article">
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
                              htmlFor="article_avatar"
                              className="form-label"
                            >
                              Ảnh đại diện
                            </Label>
                            <SelectMedia
                              type={"dropzone"}
                              defaultImgSrc={avatar}
                              setDefaultImgSrc={() => setAvatar()}
                              onUploadMedia={(e) => setAvatar(e)}
                            ></SelectMedia>
                          </div>
                          <div className="mb-3">
                            {/* <div className="mb-3">
                                  <Label
                                    htmlFor="leak_url"
                                    className="form-label"
                                  >
                                    Nhập link từ báo khác
                                  </Label>
                                  <div className="input-group">
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="leak_url"
                                      placeholder=""
                                      aria-label="Example text with two button addons"
                                      value={validation.values.leak_url}
                                      onChange={validation.handleChange}
                                    />
                                    <button
                                      className="btn btn-primary"
                                      type="button"
                                    >
                                      Lấy bài
                                    </button>
                                  </div>
                                </div> */}
                            <div className="mb-3">
                              <div
                                className="form-check form-switch form-switch-lg"
                                dir="ltr"
                              >
                                <Label
                                  className="form-check-label"
                                  htmlFor="enable_comment"
                                >
                                  Cho phép bình luận
                                </Label>
                                <Input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="enableComment"
                                  value={enableComment}
                                  checked={enableComment}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    setEnableComment(e.target.checked);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="mb-3">
                              <div
                                className="form-check form-switch form-switch-lg"
                                dir="ltr"
                              >
                                <Label
                                  className="form-check-label"
                                  htmlFor="outstanding1"
                                >
                                  Lưu kho tin nổi bật
                                </Label>
                                <Input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="outstanding1"
                                  defaultChecked={outstanding1}
                                  value={outstanding1}
                                  onChange={(e) => {
                                    setOutstanding1(e.target.checked);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="mb-3">
                              <div
                                className="form-check form-switch form-switch-lg"
                                dir="ltr"
                              >
                                <Label
                                  className="form-check-label"
                                  htmlFor="outstanding2"
                                >
                                  Lưu kho tin tiêu điểm
                                </Label>
                                <Input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="outstanding2"
                                  defaultChecked={outstanding2}
                                  value={outstanding2}
                                  onChange={(e) => {
                                    setOutstanding2(e.target.checked);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </Form>
                        <ComponentArticlePrice id={id} />
                      </TabPane>
                      <TabPane tabId="process">
                        <div>
                          {role &&
                          role._role_steps_info &&
                          role._role_steps_info.length > 0 ? (
                            <>
                              <Steps
                                current={currentRole}
                                direction="vertical"
                                onChange={handleStepChange}
                                items={role._role_steps_info.map(
                                  (role, key) => {
                                    return {
                                      title: role.step_name,
                                      description:
                                        (role.user_accept &&
                                          ((role.status === 1 &&
                                            role.user_accept.full_name +
                                              " " +
                                              moment(role.accept_date).format(
                                                "DD/MM/YYYY HH:mm:ss"
                                              )) ||
                                            (role.status == 0 &&
                                              key !== currentRole &&
                                              "Chưa thực hiện"))) ||
                                        (role.status === -1 && "Bỏ qua") ||
                                        (role.status === -3 &&
                                          "Đang chờ hẹn giờ xuất bản"),
                                    };
                                  }
                                )}
                              />
                              <CustomModal
                                togScroll={() => tog_scroll()}
                                modalScroll={modal_scroll}
                                setModelScroll={setmodal_scroll}
                                listUser={listUser}
                                stepName={stepName}
                                articleId={id}
                                setReload={() => setReload(!reload)}
                                currentClick={currentClick}
                              />
                            </>
                          ) : (
                            <div>Không có dữ liệu</div>
                          )}
                        </div>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Form
                      className="tablelist-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-3">
                        <div className="card-body">
                          <div className="col-lg-12">
                            <Label
                              htmlFor="article_title"
                              className="form-label"
                            >
                              Hẹn giờ xuất bản
                            </Label>
                            {publishTime !== undefined && (
                              <DatePicker
                                id="date"
                                format=" DD-MM-YYYY HH:mm"
                                className="col-lg-12 mt-2"
                                showTime
                                defaultValue={
                                  publishTime !== null
                                    ? dayjs(publishTime)
                                    : null
                                }
                                disabledDate={disabledDate}
                                onChange={onChangeFromDate}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
};
export default UpdateSettingMagazine;
