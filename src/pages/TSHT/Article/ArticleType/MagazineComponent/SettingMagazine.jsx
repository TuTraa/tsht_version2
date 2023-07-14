import React, { useState, useRef, useEffect } from "react";
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
  Row,
} from "reactstrap";
import { TreeSelect, Modal, Select, DatePicker, Image, Button } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastCustom from "../../../../../Components/Common/Toast";
import { Link, useNavigate } from "react-router-dom";
import {
  getAPIListArticleRelated,
  getAPIListTag,
  getAPIPostArticle,
  getAPIPostTag,
  getAPITreeListCategory,
} from "../../../../../helpers/fakebackend_helper";
import { FilePond, registerPlugin } from "react-filepond";
import Dropzone from "react-dropzone";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
//api
import {
  getAPIDeleteTag,
  getAPIListArticle,
  getAPIListAuthor,
  getAPIListCategory,
} from "../../../../../helpers/fakebackend_helper";
import SelectMedia from "../../../FileManager/FileManagerMedia/SelectMedia";
import { RequiredIcon } from "../../../../../Components/Common/RequiredIcon";
import { convertVietnamese } from "../../../../../helpers/text_helper";
import { v4 as uuidv4 } from "uuid";

import SelectTag from "../../../../../Components/Common/SelectTag";
import { SketchPicker } from "react-color";
import {
  selectArticleColorText,
  updateArticleBackgroundColor,
} from "../../../../../store/fileManager/action";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const SettingMagazine = ({ article_type }) => {
  const { eMagazineTextColor } = useSelector((state) => ({
    eMagazineTextColor: state.FileManager.eMagazineTextColor,
  }));
  const { eMagazineBackgroundColor } = useSelector((state) => ({
    eMagazineBackgroundColor: state.FileManager.eMagazineBackgroundColor,
  }));
  const dispatch = useDispatch();
  const [valueCategory, setValueCategory] = useState();
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [valueAuthor, setValueAuthor] = useState([]);
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  const [outstanding1, setOutstanding1] = useState(false);
  const [outstanding2, setOutstanding2] = useState(false);
  let navigate = useNavigate();
  const [publishTime, setPublishTime] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [optionsTag, setOptionTag] = useState([]);
  const [articleRelate, setArticleRelate] = useState([]);
  const [valueArticleRelate, setValueArticleRelate] = useState([]);
  const [reloadTag, setReloadTag] = useState();
  const { eMagazineContent } = useSelector((state) => ({
    eMagazineContent: state.FileManager.eMagazineContent,
  }));
  const { eMagazineBlock } = useSelector((state) => ({
    eMagazineBlock: state.FileManager.eMagazineBlock,
  }));
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
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      article_title: "",
      article_sapo: "",
      slug: "",
    },
    validationSchema: Yup.object({
      article_title: Yup.string()
        .trim()
        .required("Mời bạn nhập tên bài viết")
        .max(175, "Tên bài viết không nhập quá 175 ký tự")
        .min(2, "Tên bài viết không nhập nhỏ hơn 2 ký tự "),
      article_sapo: Yup.string()
        .trim()
        .required("Mời bạn nhập sapo cho bài viết")
        .min(2, "Sapo bài viết không nhập nhỏ hơn 2 ký tự ")
        .max(300, "Sapo bài viết không được quá 300 ký tự"),
      slug: Yup.string().required("Mời bạn nhập slug cho bài viết"),
    }),
    onSubmit: (values) => {
      const data = {
        article_title: values.article_title,
        article_sapo: values.article_sapo,
        category_id: valueCategory,
        // author: valueAuthor,
        other_author: "[" + valueAuthor?.toString() + "]",
        article_type_id: 2,
        article_content: eMagazineContent,
        avatar_image: avatar,
        leak_url: values.leak_url ? values.leak_url : "",
        outstanding: outstanding1 ? 1 : 2,
        enable_comment: values.enable_comment ? 1 : 0,
        tag_list: "[" + selectedTags?.toString() + "]",
        slug: values.slug,
        note: "",
        user_create_id: 90,
        user_modify_id: "",
        list_article_relate: "[" + valueArticleRelate?.toString() + "]",
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
        getAPIPostArticle(result).then((r) => {
          if (r.status && r.status > 0) {
            ToastCustom("Thêm bài viết thành công", "success");
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
            // value: e.user_id,
            value: e.author_name,
            title: e.author_name,
          });
        });
      }
      setOptionsAuthor(options);
    });
  }, []);

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().startOf("day");
  };
  const onChangeFromDate = (e) => {
    setPublishTime(dayjs(e).format("YYYY-MM-DDTHH:mm:ss"));
  };
  return (
    <div id="article-wrap">
      <Row>
        <Col lg={8} style={{ overflow: "auto", height: "69vh" }}>
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
          <Card style={{ marginTop: 10 }}>
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
                    placeholder="Nhập tiêu đề bài viết"
                    validate={{
                      required: { value: true },
                    }}
                    onChange={(e) => {
                      validation.handleChange(e);
                    }}
                    onBlur={(e) => {
                      validation.handleBlur(e);
                      validation.values.slug = convertVietnamese(
                        validation.values.article_title
                      );
                    }}
                    invalid={
                      validation.touched.article_title &&
                      validation.errors.article_title
                        ? true
                        : false
                    }
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
                    type="textarea"
                    className="form-control"
                    id="article_sapo"
                    placeholder="Tóm tắt bài viết không quá 300 ký tự"
                    validate={{
                      required: { value: true },
                    }}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={
                      validation.touched.article_sapo &&
                      validation.errors.article_sapo
                        ? true
                        : false
                    }
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
                </div>
                <div className="mb-3">
                  <Label htmlFor="article_category" className="form-label">
                    Chuyên mục <RequiredIcon />
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
                    showSearch
                    treeNodeFilterProp="title"
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
                    // treeDefaultExpandAll
                    placeholder="Có thể chọn nhiều tác giả"
                    mode="multiple"
                    showSearch
                    treeNodeFilterProp="title"
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
                    value={validation.values.slug}
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
        <Col lg={4} style={{ overflow: "auto", height: "69vh" }}>
          <Card>
            <CardHeader>
              <Label htmlFor="article_avatar" className="form-label">
                Ảnh đại diện
              </Label>
            </CardHeader>
            <CardBody>
              <div className="mb-3">
                <SelectMedia
                  type={"dropzone"}
                  onUploadMedia={(e) => setAvatar(e)}
                ></SelectMedia>
              </div>
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
                        value={validation.values.enable_comment}
                        onChange={(e) => {
                          validation.handleChange(e);
                        }}
                        // onChange={(values) => {
                        //   const temp = { ...ads };
                        //   temp.status = values.target.checked ? 1 : 0;
                        //   setAds(temp);
                        // }}
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
              </Form>
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
                    <div style={{ height: "40px" }}></div>
                  </div>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default SettingMagazine;
