import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  FormFeedback,
  Input,
  Label,
  Row,
  Container,
  TabContent,
  TabPane,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import {
  TreeSelect,
  Modal,
  Select,
  Form,
  Button,
  Space,
  Popconfirm,
  DatePicker,
  Switch,
  Steps,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getAPIPostArticle,
  getAPIPostTag,
  getAPIGetArticleById,
  getAPIPostTransitionUnPublishRole,
  getAPIPostTransitionPublishRole,
  getAPIRoleByArticleId,
  getAPITreeListCategory,
  getAPIListTag,
  getAPIGetReturnRole,
} from "../../../../helpers/fakebackend_helper";
import { registerPlugin } from "react-filepond";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
//api
import {
  getAPIDeleteTag,
  getAPIListArticle,
  getAPIListAuthor,
  getAPIListCategory,
  getAPIPutArticle,
} from "../../../../helpers/fakebackend_helper";
import SelectMedia from "../../FileManager/FileManagerMedia/SelectMedia";
import { RequiredIcon } from "../../../../Components/Common/RequiredIcon";
import { convertVietnamese } from "../../../../helpers/text_helper";
import { toast } from "react-toastify";
import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { useForm } from "antd/es/form/Form";
import ToastCustom from "../../../../Components/Common/Toast";
import dayjs from "dayjs";
import classnames from "classnames";
import moment from "moment/moment";
import CustomModal from "./ModelStepsInfo.component";
import SelectTag from "../../../../Components/Common/SelectTag";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
export const DragHandle = SortableHandle(() => (
  <span
    style={{
      cursor: "move",
    }}
  >
    ::
  </span>
));
const UpdateNewspaper = ({ article_type, detailData, setReload }) => {
  const [valueCategory, setValueCategory] = useState();
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  const [valueAuthor, setValueAuthor] = useState([]);
  const [listNumber, setListNumber] = useState([]);
  const [form] = useForm();
  const { id } = useParams();

  const [modal_scroll, setmodal_scroll] = useState(false);
  const [currentClick, setCurrentClick] = useState();
  const [listUser, setListUser] = useState();
  const [stepName, setStepName] = useState();
  const [publishTime, setPublishTime] = useState();
  const [articleTypeId, setArticleTypeId] = useState();
  const [currentRole, setCurrentRole] = useState();
  const [role, setRole] = useState();
  const [activeTab, setActiveTab] = useState("article");
  const [leakUrl, setLeakUrl] = useState("");
  const [enableComment, setEnableComment] = useState(false);
  const [outstanding1, setOutstanding1] = useState(false);
  const [outstanding2, setOutstanding2] = useState(false);

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
  let navigate = useNavigate();
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
  document.title = "Thêm bài viết | Toà Soạn Hội Tụ";
  const [avatar, setAvatar] = useState("");
  const onFinish = (values) => {
    const data = {
      ...values,
      article_id: detailData.article_id,
      article_public_role_id: detailData.article_public_role_id,
      avatar_image: avatar,
      category_id: valueCategory,
      // author: valueAuthor,
      other_author: "[" + valueAuthor.toString() + "]",
      leak_url: leakUrl ? leakUrl : "",
      outstanding: outstanding1 ? 1 : 2,
      enable_comment: enableComment ? 1 : 0,
      tag_list: "[" + selectedTags.toString() + "]",
      article_type_id: article_type,
      note: "",
      article_content: values.article_content
        ? JSON.stringify(
            values.article_content.map((e) => {
              return e.id;
            })
          )
        : [],
      list_article_relate: "[" + valueArticleRelate.toString() + "]",
    };
    let result = { ...data };
    if (publishTime !== null) {
      result = { ...data, publish_date: publishTime };
    }
    if (outstanding1 && outstanding2) {
      toast.error("Chỉ được chọn tin nổi bật hoặc tin tiêu điểm");
    } else {
      getAPIPutArticle(result).then((res) => {
        if (res && res.data) {
          toast.success("Chỉnh sửa bài viết báo in thành công ");
          navigate("/list-article");
        } else {
          toast.error(res.message ? res.message : "Có lỗi đã xảy ra");
        }
      });
    }
  };
  useEffect(() => {
    if (detailData) {
      if (detailData.list_file_info && detailData.list_file_info.length > 0) {
        setListNumber(
          detailData.list_file_info.map((e, index) => {
            return index + 1;
          })
        );
      }
      setLeakUrl(detailData.leak_url);
      setEnableComment(detailData.enable_comment === 0 ? false : true);
      setOutstanding1(detailData.outstanding === 1 ? true : false);
      setOutstanding2(detailData.outstanding === 2 ? true : false);
      setPublishTime(
        detailData.publish_date !== null
          ? new Date(detailData.publish_date).toISOString()
          : null
      );
      setCurrentRole(detailData.next_public_role_step - 1);
      setArticleTypeId(detailData.article_status_id);

      getAPIRoleByArticleId(id).then((res) => {
        if (res.data && res.status > 0) {
          setRole(res.data);
        }
      });
      setValueCategory(detailData.category_id);
      setAvatar(detailData.avatar_image);
      setValueAuthor(
        (detailData.other_author_info || []).map((e) => {
          return {
            value: e.user_id,
            label: e.author_name,
          };
        })
      );
      setSelectedTags(
        detailData.list_tag_info
          ? detailData.list_tag_info.map((e) => e.tag_id)
          : []
      );
      setValueArticleRelate(
        detailData.list_article_relate
          ? detailData.list_article_relate.map((e) => {
              return {
                title: e.article_title,
                value: e.article_id,
              };
            })
          : []
      );
    }
  }, [detailData]);

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
  }, []);
  const SortableItem = SortableElement(({ field, index, remove }) => {
    return (
      <div
        style={{
          display: "flex",
          marginBottom: 8,
          width: "100%",
        }}
        align="baseline"
        key={`space + ${field.key}`}
      >
        <Space
          style={{
            border: "1px solid var(--vz-input-border)",
            padding: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DragHandle />
          <div
            className="mb-3"
            style={{
              width: 344,
              height: 230,
              marginTop: 10,
            }}
          >
            <Form.Item
              {...field}
              style={{ margin: 0 }}
              name={[field.name, "image"]}
              fieldKey={[field.fieldKey, "image"]}
              key={`image + ${field.key}`}
            >
              <SelectMedia
                type={"dropzone"}
                close={true}
                defaultImgSrc={() => {
                  const arr = form.getFieldValue(["article_content"]);
                  console.log(arr);
                  if (arr[field.name].image) return arr[field.name].image;
                  else return null;
                }}
                setDefaultImgSrc={(e, id) => {
                  const arr = form.getFieldValue(["article_content"]);
                  arr[field.name] = {
                    image: e,
                    id: id,
                  };
                  form.setFieldsValue({
                    article_content: arr,
                  });
                }}
                onUploadMedia={(e, id) => {
                  const arr = form.getFieldValue(["article_content"]);
                  arr[field.name] = {
                    image: e,
                    id,
                  };
                  form.setFieldsValue({
                    article_content: arr,
                  });
                }}
              ></SelectMedia>
              {/* <Input
                style={{ padding: "5px 10px" }}
                placeholder="Nhập tên bước"
              /> */}
            </Form.Item>
          </div>
        </Space>
        <div style={{ margin: "24px 0 0 10px" }}>
          <Popconfirm
            title={"Xác nhận xoá"}
            icon={<></>}
            okText={"Đồng ý"}
            cancelText={"Hủy bỏ"}
            onConfirm={() => {
              remove(field.name);
              const updatedNumbers = listNumber.slice(0, -1);
              const updatedNumbersWithSequentialOrder = updatedNumbers.map(
                (n, index) => index + 1
              );
              setListNumber(updatedNumbersWithSequentialOrder);
            }}
          >
            <Button
              type="dashed"
              style={{
                border: "1px solid red",
                background: "white",
                padding: "0px 8px",
                height: "28px",
              }}
              className="btn-light"
            >
              <i
                className="ri-subtract-line align-bottom"
                style={{ color: "red" }}
              ></i>
            </Button>
          </Popconfirm>
        </div>
      </div>
    );
  });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    form.setFieldsValue({
      article_content: arrayMoveImmutable(
        form.getFieldValue(["article_content"]),
        oldIndex,
        newIndex
      ),
    });
  };

  const SortableContainerComponent = SortableContainer(({ children }) => (
    <CardBody>{children}</CardBody>
  ));
  const addField = (add) => {
    add();
    const newNumber = listNumber.length + 1;
    setListNumber([...listNumber, newNumber]);
  };
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
  function tog_scroll() {
    setmodal_scroll(!modal_scroll);
  }
  return (
    <div className="page-content">
      <div id="article-wrap">
        <Container fluid={true}>
          <BreadCrumb
            previousLink={"/list-article"}
            title="Sửa bài viết"
            pageTitle="Danh sách bài viết"
          />
          <Form
            name="dynamic_form_nest"
            onFinish={onFinish}
            form={form}
            autoComplete="off"
          >
            <Row>
              <Col lg={8} style={{ overflow: "auto", height: "80vh" }}>
                <Card>
                  <CardBody>
                    <Label for="article_title" className="form-label">
                      Tiêu đề
                      <RequiredIcon />
                    </Label>
                    <Form.Item
                      name={"article_title"}
                      initialValue={detailData?.article_title}
                      rules={[
                        {
                          required: true,
                          message: "Tiêu đề không được để trống",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nhập tiêu đề"
                        onBlur={() => {
                          form.setFieldValue(
                            "slug",
                            convertVietnamese(
                              form.getFieldValue("article_title")
                                ? form.getFieldValue("article_title")
                                : ""
                            )
                          );
                        }}
                      />
                    </Form.Item>

                    <Label for="article_category" className="form-label">
                      Chuyên mục
                      <RequiredIcon />
                    </Label>
                    <Form.Item
                      name={"article_category"}
                      initialValue={detailData?.article_category}
                      rules={[
                        {
                          required: true,
                          message: "Chuyên mục không được để trống",
                        },
                      ]}
                    >
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
                    </Form.Item>
                    <Form.Item>
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
                    </Form.Item>
                    <Label for="slug" className="form-label">
                      Slug <RequiredIcon />
                    </Label>
                    <Form.Item
                      name={"slug"}
                      initialValue={detailData?.slug}
                      rules={[
                        {
                          required: true,
                          message: "Slug không được để trống",
                        },
                      ]}
                    >
                      <Input placeholder="slug" />
                    </Form.Item>
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
                    <Form.Item name={"article_relevant"} initialValue="">
                      <TreeSelect
                        style={{
                          width: "100%",
                        }}
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: "auto",
                        }}
                        allowClear
                        // treeData={optionsAuthor}
                        treeDefaultExpandAll
                        placeholder="Tin liên quan"
                        // value={valueAuthor}
                        // onChange={onChangeAuthor}
                      />
                    </Form.Item>

                    <Label for="article_content" className="form-label">
                      Nội dung
                      <RequiredIcon />
                    </Label>
                    <Form.Item>
                      <Card>
                        <CardBody
                          style={{ border: "1px solid var(--vz-input-border)" }}
                        >
                          <div
                            style={{ display: "flex", justifyItems: "center" }}
                          >
                            <div style={{ padding: 16, paddingRight: 0 }}>
                              {listNumber.map((num) => (
                                <Space
                                  style={{
                                    display: "flex",
                                    width: "80%",
                                    padding: 10,
                                    height: "278px",
                                    marginBottom: "8px",
                                    justifyItems: "center",
                                    alignItems: "center",
                                  }}
                                  align="baseline"
                                  key={num}
                                >
                                  <p
                                    style={{
                                      background: " #3668C9",
                                      color: "white",
                                      padding: "2px 10px",
                                      borderRadius: 4,
                                      fontWeight: "bold",
                                      marginTop: 14,
                                    }}
                                  >
                                    {num}
                                  </p>
                                </Space>
                              ))}
                            </div>
                            <Form.List
                              name={["article_content"]}
                              initialValue={detailData?.article_content}
                            >
                              {(fields, { add, remove }) => (
                                <SortableContainerComponent
                                  onSortEnd={onSortEnd}
                                  useDragHandle
                                >
                                  {fields.map((field, index) => (
                                    <SortableItem
                                      key={`item-${index}`}
                                      index={index}
                                      field={field}
                                      remove={remove}
                                    />
                                  ))}
                                  <Space
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <Form.Item style={{ width: 200 }}>
                                      <Button
                                        htmlType="submit"
                                        type="dashed"
                                        onClick={() => addField(add)}
                                        block
                                      >
                                        + Thêm nội dung
                                      </Button>
                                    </Form.Item>
                                  </Space>
                                </SortableContainerComponent>
                              )}
                            </Form.List>
                          </div>
                        </CardBody>
                      </Card>
                    </Form.Item>
                    <div className="hstack gap-2 justify-content-start">
                      <Form.Item>
                        <button
                          style={{
                            fontSize: "14px",
                          }}
                          type="submit"
                          className="btn btn-success"
                          // onClick={onFinish}
                        >
                          Lưu bài viết
                        </button>
                      </Form.Item>
                      <Form.Item>
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
                                  setReload();
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
                      </Form.Item>
                      <Form.Item>
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
                                    setReload();
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
                                      setReload();
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
                            <button
                              type="button"
                              onClick={showModalStep}
                              className="btn btn-primary"
                            >
                              Chuyển tiếp
                            </button>
                          ))
                        )}
                      </Form.Item>
                    </div>
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
                            <Label htmlFor="leak_url" className="form-label">
                              Nhập link từ báo khác
                            </Label>
                            <div className="input-group">
                              <Input
                                type="text"
                                className="form-control"
                                id="leak_url"
                                placeholder=""
                                aria-label="Example text with two button addons"
                                value={leakUrl}
                                defaultValue={leakUrl}
                                onChange={(e) => {
                                  setLeakUrl(e.target.value);
                                }}
                              />
                              <button className="btn btn-primary" type="button">
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
                                id="enable_comment"
                                value={enableComment}
                                defaultChecked={enableComment}
                                onChange={(e) => {
                                  setEnableComment(e.target.value);
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
                                value={outstanding1}
                                defaultChecked={outstanding1}
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
                                value={outstanding2}
                                defaultChecked={outstanding2}
                                onChange={(e) => {
                                  setOutstanding2(e.target.checked);
                                }}
                              />
                            </div>
                          </div>
                        </div>
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
                                setReload={() => setReload()}
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
                      form={form}
                      onFinish={onFinish}
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
          </Form>
        </Container>
      </div>
    </div>
  );
};
export default UpdateNewspaper;
