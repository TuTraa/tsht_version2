import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import "./compare-version.scss";
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
} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import {
  getAPIListTag,
  getAPIPostArticle,
  getAPIPostTag,
} from "../../../../helpers/fakebackend_helper";
import { registerPlugin } from "react-filepond";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import diff from "node-htmldiff";
import { useSelector } from "react-redux";
//api
import {
  getAPIDeleteTag,
  getAPIListArticle,
  getAPIListAuthor,
  getAPIListCategory,
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
import dayjs from "dayjs";
import SelectTag from "../../../../Components/Common/SelectTag";
import ToastCustom from "../../../../Components/Common/Toast";

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
const Newspaper = ({ article_type }) => {
  const [valueCategory, setValueCategory] = useState();
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  const [valueAuthor, setValueAuthor] = useState([]);
  const [listNumber, setListNumber] = useState([]);
  const [leakUrl, setLeakUrl] = useState("");
  const [enableComment, setEnableComment] = useState(false);
  const [outstanding1, setOutstanding1] = useState(false);
  const [outstanding2, setOutstanding2] = useState(false);
  const [publishTime, setPublishTime] = useState(null);

  const [reloadTag, setReloadTag] = useState();
  const [selectedTags, setSelectedTags] = useState([]);
  const [optionsTag, setOptionTag] = useState([]);
  const [articleRelate, setArticleRelate] = useState([]);
  const [valueArticleRelate, setValueArticleRelate] = useState([]);

  const [form] = useForm();
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
    const result = {
      ...values,
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
        : "[]",
      list_article_relate: "[" + valueArticleRelate.toString() + "]",
    };
    let data = { ...result };
    if (publishTime !== null) {
      data = { ...data, publish_date: publishTime };
    }

    if (!values.article_content || values.article_content.length === 0) {
      ToastCustom("Mời bạn nhập nội dung bài viết", "fail");
    } else if (!data.avatar_image) {
      ToastCustom("Mời bạn chọn ảnh bài viết", "fail");
    } else if (outstanding1 && outstanding2) {
      toast.error("Chỉ được chọn tin nổi bật hoặc tin tiêu điểm");
    } else {
      getAPIPostArticle(data).then((res) => {
        if (res && res.data) {
          toast.success("Tạo bài viết báo in thành công ");
          navigate("/list-article");
        } else {
          toast.error(res.message ? res.message : "Có lỗi đã xảy ra");
        }
      });
    }
  };
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().startOf("day");
  };
  const onChangeFromDate = (e) => {
    setPublishTime(dayjs(e).format("YYYY-MM-DDTHH:mm:ss"));
  };
  useEffect(() => {
    getAPIListCategory(0, -1).then((res) => {
      var options = [];
      if (res.data && res.data.list && res.status > 0) {
        res.data.list.forEach((e) => {
          options.push({
            value: e.category_id,
            title: e.category_name,
            children: e.list_child_categories.map((x) => ({
              value: x.category_id,
              title: x.category_name,
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
              initialValue={null}
            >
              <SelectMedia
                type={"dropzone"}
                close={true}
                defaultImgSrc={() => {
                  const arr = form.getFieldValue(["article_content"]);
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
  return (
    <div id="article-wrap">
      <Form
        name="dynamic_form_nest"
        onFinish={onFinish}
        form={form}
        autoComplete="off"
      >
        <Row>
          <Col lg={8} style={{ overflow: "auto", height: "69vh" }}>
            <Card>
              <CardBody>
                <Label for="article_title" className="form-label">
                  Tiêu đề
                  <RequiredIcon />
                </Label>
                <Form.Item
                  name={"article_title"}
                  initialValue=""
                  rules={[
                    {
                      required: true,
                      message: "Tiêu đề không được để trống",
                    },
                  ]}
                >
                  <Input
                    id="article_title"
                    name="article_title"
                    placeholder="Nhập tiêu đề"
                    onBlur={() => {
                      form.setFieldValue(
                        "slug",
                        convertVietnamese(form.getFieldValue("article_title"))
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
                  initialValue=""
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
                    treeDefaultExpandAll
                    placeholder="Có thể chọn nhiều tác giả"
                    mode="multiple"
                    showSearch
                    treeNodeFilterProp="title"
                    value={valueAuthor}
                    onChange={onChangeAuthor}
                  />
                </div>

                <Label for="slug" className="form-label">
                  Slug <RequiredIcon />
                </Label>
                <Form.Item
                  name={"slug"}
                  initialValue=""
                  rules={[
                    {
                      required: true,
                      message: "Slug không được để trống",
                    },
                  ]}
                >
                  <Input id="slug" name="slug" placeholder="slug" />
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

                <Label for="article_content" className="form-label">
                  Nội dung
                  <RequiredIcon />
                </Label>
                <Form.Item>
                  <Card>
                    <CardBody
                      style={{ border: "1px solid var(--vz-input-border)" }}
                    >
                      <div style={{ display: "flex", justifyItems: "center" }}>
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
                        <Form.List name={["article_content"]}>
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
                <Form.Item style={{ width: 200 }}>
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
              </CardBody>
            </Card>
          </Col>
          <Col lg={4} style={{ overflow: "auto", height: "69vh" }}>
            <Card>
              <CardBody>
                <div className="mb-3">
                  <Label htmlFor="article_avatar" className="form-label">
                    Ảnh đại diện
                  </Label>
                  <RequiredIcon />
                  <SelectMedia
                    type={"dropzone"}
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
                        onChange={(e) => {
                          setOutstanding2(e.target.checked);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Form
                  className="tablelist-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                >
                  <div className="mb-3">
                    <div className="card-body">
                      <div className="col-lg-12">
                        <Label htmlFor="article_title" className="form-label">
                          Hẹn giờ xuất bản
                        </Label>
                        <DatePicker
                          id="date"
                          format=" DD-MM-YYYY HH:mm"
                          className="col-lg-12 mt-2"
                          showTime
                          defaultValue={
                            publishTime !== null ? dayjs(publishTime) : null
                          }
                          disabledDate={disabledDate}
                          onChange={onChangeFromDate}
                          placeholder="Chọn ngày"
                        />
                      </div>
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default Newspaper;
