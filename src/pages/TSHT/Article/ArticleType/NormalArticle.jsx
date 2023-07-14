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
import "./compare-version.scss";
import { TreeSelect, Modal, Select, DatePicker, Image, Button } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastCustom from "../../../../Components/Common/Toast";
import { Link, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import {
  getAPIListArticleRelated,
  getAPIListTag,
  getAPIPostArticle,
  getAPIPostTag,
  getAPITreeListCategory,
} from "../../../../helpers/fakebackend_helper";
import { FilePond, registerPlugin } from "react-filepond";
import Dropzone from "react-dropzone";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import diff from "node-htmldiff";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
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
import { v4 as uuidv4 } from "uuid";

import { PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import SelectTag from "../../../../Components/Common/SelectTag";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const NormalArticle = ({ article_type }) => {
  const [selectedFiles, setselectedFiles] = useState([]);
  const [valueCategory, setValueCategory] = useState();
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [valueAuthor, setValueAuthor] = useState([]);
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  const [version, setVersion] = useState();
  const [version2, setVersion2] = useState();
  const [outstanding1, setOutstanding1] = useState(false);
  const [outstanding2, setOutstanding2] = useState(false);
  let navigate = useNavigate();
  const editorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [publishTime, setPublishTime] = useState(null);
  const [listImage, setListImage] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [optionsTag, setOptionTag] = useState([]);
  const [articleRelate, setArticleRelate] = useState([]);
  const [valueArticleRelate, setValueArticleRelate] = useState([]);

  const { media } = useSelector((state) => ({
    media: state.FileManager.media,
  }));

  const [reloadTag, setReloadTag] = useState();

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };
  const initContent = `<p>Nhập nội dung bài viết.</p>`;

  function compareVersion() {
    showModal();
    setVersion(diff(initContent, editorRef.current.getContent()));
    setVersion2(diff(editorRef.current.getContent(), initContent));
  }

  function addImageLink(e, id, type, originUrl) {
    if (type === "image") {
      const imageLink = `${e}`;
      editorRef.current.insertContent(`
          <figure class="image"  id="add_image_link">
            <img width="500" src=${imageLink} />
            <figcaption></figcaption>
          </figure>
    `);
    }
    if (type === "audio") {
      const imageLink = `/` + encodeURIComponent(originUrl);
      editorRef.current.insertContent(`
          <figure>
          <audio
            controls
            src=${imageLink}
          >
          </audio>
        </figure>
      `);
    }
    if (type === "video") {
      const imageLink = `/` + encodeURIComponent(originUrl);
      editorRef.current.insertContent(`
          <video id="my-video"
          class="video-js"
          controls
          preload="auto"
          width="640"
          height="264"
          poster="MY_VIDEO_POSTER.jpg"
          data-setup="{}">
            <source src=${imageLink} type='video/mp4'>
          </video>
    `);
    }
  }

  function removeImageLink() {
    editorRef.current.dom.remove(
      editorRef.current.dom.select("#add_image_link")
    );
  }

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

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  document.title = "Thêm bài viết | Toà Soạn Hội Tụ";
  const [files, setFiles] = useState([]);
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
        .required("Mời bạn nhập tên bài viết ")
        .max(175, "Tên bài viết không nhập quá 175 ký tự"),
      article_sapo: Yup.string()
        .required("Mời bạn nhập sapo cho bài viết")
        .max(300, "Sapo bài viết không được quá 300 ký tự"),
      slug: Yup.string().required("Mời bạn nhập slug cho bài viết"),
    }),
    onSubmit: (values) => {
      const data = {
        article_title: values.article_title,
        article_sapo: values.article_sapo,
        category_id: valueCategory,
        // author: valueAuthor,
        other_author: "[" + valueAuthor.toString() + "]",
        article_type_id: article_type,
        article_content: editorRef.current.getContent(),
        avatar_image: avatar,
        leak_url: values.leak_url ? values.leak_url : "",
        outstanding: outstanding1 ? 1 : 2,
        enable_comment: values.enable_comment ? 1 : 0,
        tag_list: "[" + selectedTags.toString() + "]",
        slug: values.slug,
        article_files:
          listImage.length > 0
            ? JSON.stringify(listImage.map((e) => e.id))
            : "",
        note: "",
        user_create_id: 90,
        user_modify_id: "",
        list_article_relate: "[" + valueArticleRelate.toString() + "]",
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
      } else if (!result.avatar_image) {
        ToastCustom("Mời bạn chọn ảnh bài viết", "fail");
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
                <div className="mb-3">
                  <Label htmlFor="article_content" className="form-label">
                    Nội dung
                  </Label>
                  <Editor
                    apiKey="g4pmwp4e5kcjz0cum1z0vz2h0tl5vnjwc5ou58yj82sp4kbf"
                    tinymceScriptSrc={
                      process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"
                    }
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={initContent}
                    selector={"textarea"}
                    init={{
                      height: 500,
                      selector: "textarea",
                      menubar: ["tools", "view"],
                      // language: "vi",
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "preview",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help" +
                        "code" +
                        "fullscreen",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
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
              <RequiredIcon />
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
            <CardHeader
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <Label>Media trong bài viết</Label>
              <SelectMedia
                title="Thư viện media"
                onUploadMedia={(url, id, type, originUrl) => {
                  setListImage([...listImage, { url, id, type, originUrl }]);
                }}
                className={"btn btn-success"}
              ></SelectMedia>
            </CardHeader>
            <CardBody>
              <div
                style={{
                  display: "flex",
                  flexFlow: "wrap",
                  gap: "5px",
                }}
              >
                {listImage.map((e) => {
                  return (
                    <div key={uuidv4()}>
                      <Image src={e.url} width={167} height={167}></Image>
                      <div style={{ padding: 10 }}>
                        <Button
                          onClick={() => {
                            setListImage(
                              listImage.filter((element) => element.id !== e.id)
                            );
                          }}
                        >
                          Hủy
                        </Button>
                        <Button
                          type="primary"
                          style={{ marginLeft: 10 }}
                          onClick={() => {
                            addImageLink(e.url, e.id, e.type, e.originUrl);
                          }}
                        >
                          Thêm
                        </Button>
                      </div>
                    </div>
                  );
                })}
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
export default NormalArticle;
