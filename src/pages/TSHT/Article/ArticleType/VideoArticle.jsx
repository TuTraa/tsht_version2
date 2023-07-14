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
import { TreeSelect, DatePicker, Select } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastCustom from "../../../../Components/Common/Toast";
import { Link, useNavigate } from "react-router-dom";
import {
  getAPIListArticleRelated,
  getAPIListTag,
  getAPIPostArticle,
  getAPIPostTag,
  getAPITreeListCategory,
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
} from "../../../../helpers/fakebackend_helper";
import UploadComponent from "./UploadComponent";
import DateTime from "./DateTime";
import SelectMedia from "../../FileManager/FileManagerMedia/SelectMedia";
import { RequiredIcon } from "../../../../Components/Common/RequiredIcon";
import { convertVietnamese } from "../../../../helpers/text_helper";
import { Player } from "react-tuby";
import "react-tuby/css/main.css";
import ReactHlsPlayer from "react-hls-player";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import SelectTag from "../../../../Components/Common/SelectTag";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
const VideoArticle = ({ article_type }) => {
  const [valueCategory, setValueCategory] = useState();
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [valueAuthor, setValueAuthor] = useState([]);
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  const [outstanding1, setOutstanding1] = useState(false);
  const [outstanding2, setOutstanding2] = useState(false);
  const [videoMedia, setVideoMedia] = useState();
  const [publishTime, setPublishTime] = useState(null);
  const [videoID, setVideoID] = useState();
  const [tagList, setTagList] = useState([]);
  const [tagValue, setTagValue] = useState([]);
  let navigate = useNavigate();

  const [reloadTag, setReloadTag] = useState();
  const [selectedTags, setSelectedTags] = useState([]);
  const [optionsTag, setOptionTag] = useState([]);
  const [articleRelate, setArticleRelate] = useState([]);
  const [valueArticleRelate, setValueArticleRelate] = useState([]);

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
      article_title: Yup.string()
        .trim()
        .required("Mời bạn nhập tên bài viết")
        .min(2, "Tên bài viết lớn hơn 2 ký tự")
        .max(175, "Tên bài viết không được quá 175 ký tự"),
      article_sapo: Yup.string()
        .trim()
        .required("Mời bạn nhập sapo cho bài viết")
        .min(2, "Sapo bài viết lớn hơn 2 ký tự")
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
        article_content: JSON.stringify([videoID]),
        avatar_image: avatar,
        leak_url: values.leak_url ? values.leak_url : "",
        enable_comment: values.enable_comment ? 1 : 0,
        outstanding: outstanding1 ? 1 : 2,
        tag_list: "[" + selectedTags.toString() + "]",
        slug: values.slug,
        note: "",
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
      } else if (!result.avatar_image) {
        ToastCustom("Mời bạn nhập ảnh bài viết", "fail");
      } else if (!result.category_id) {
        ToastCustom("Mời bạn chọn chuyên mục bài viết", "fail");
      } else if (outstanding1 && outstanding2) {
        ToastCustom("Chỉ được chọn tin nổi bật hoặc tin tiêu điểm", "fail");
      } else {
        // save new article
        getAPIPostArticle(result).then((r) => {
          if (r.status > 0) {
            ToastCustom("Thêm bài viết thành công", "success");
            validation.resetForm();
            navigate("/list-article");
          } else if (r.status === -1) {
            ToastCustom("Thêm bài viết thất bại", "fail");
          } else if (r.status === -2) {
            ToastCustom("Slug của bài viết bị trùng", "fail");
          }
        });
      }
    },
  });
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().startOf("day");
  };
  const onChangeFromDate = (e) => {
    setPublishTime(dayjs(e).format("YYYY-MM-DDTHH:mm:ss"));
  };

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
    getAPIListTag(0, -1, "").then((res) => {
      if (res && res.data && res.status > 0) {
        setTagValue(
          res.data.list.map((e) => {
            return {
              value: e.tag_id,
              label: e.tag_name,
            };
          })
        );
      }
    });
  }, []);

  return (
    <div id="article-wrap">
      <Row>
        <div className="row">
          <div className="col-8" style={{ overflow: "auto", height: "69vh" }}>
            <Col lg={12}>
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
                      <Label htmlFor="article_sapo" className="form-label">
                        Nội dung
                      </Label>
                      <div>
                        {videoMedia && (
                          <Player
                            src={`${videoMedia}`}
                            keyboardShortcut={false}
                          >
                            {(ref, props) => (
                              <ReactHlsPlayer playerRef={ref} {...props} />
                            )}
                          </Player>
                        )}
                        {/* {videoMedia && <div>{videoMedia}</div>} */}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-lg-12 hstack gap-2 justify-content-end m-lg-3">
                        <SelectMedia
                          title="Thêm Video"
                          onUploadMedia={(e, id, type) => {
                            if (type !== "video") {
                              toast.error(
                                "Bạn hãy chọn Video để thêm vào bài viết"
                              );
                            } else {
                              setVideoMedia(e);
                              setVideoID(id);
                            }
                          }}
                          className={"btn btn-success"}
                        ></SelectMedia>
                        <button
                          type="submit"
                          className="btn btn-success m-lg-2"
                        >
                          Lưu bài viết
                        </button>
                        {/* <button
                          type="button"
                          className="btn btn-primary m-lg-2"
                        >
                          Chuyển tiếp
                        </button> */}
                      </div>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col lg={12}>
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
                      <Label htmlFor="article_category" className="form-label">
                        Chuyên mục
                      </Label>{" "}
                      <RequiredIcon />
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
                        treeDefaultExpandAll
                        placeholder="Có thể chọn nhiều tác giả"
                        mode="multiple"
                        showSearch
                        treeNodeFilterProp="title"
                        value={valueAuthor}
                        onChange={onChangeAuthor}
                      />
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
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </div>
          <div className="col-4" style={{ overflow: "auto", height: "69vh" }}>
            <Col lg={12}>
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
                      <Label htmlFor="article_avatar" className="form-label">
                        Ảnh đại diện <RequiredIcon />
                      </Label>
                      <SelectMedia
                        type={"dropzone"}
                        onUploadMedia={(e) => setAvatar(e)}
                      ></SelectMedia>
                    </div>

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
                          value={validation.values.leak_url}
                          onChange={validation.handleChange}
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
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col lg={12}>
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
                          <DateTime />
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
          </div>
        </div>
      </Row>
    </div>
  );
};
export default VideoArticle;
