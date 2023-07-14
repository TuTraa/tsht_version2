import { CardBody, FormFeedback, Input, Label, Form } from "reactstrap";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createArticlePrice,
  getAPIArticlePriceById,
  getAPIPutArticlePrice,
} from "../../../../helpers/fakebackend_helper";
import ToastCustom from "../../../../Components/Common/Toast";
import { useNavigate } from "react-router-dom";

const ComponentArticlePrice = ({ id }) => {
  const [detailData, setDetailData] = useState(null);

  let navigate = useNavigate();
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      content_quality: detailData ? detailData.content_quality : 0,
      image_quality: detailData ? detailData.image_quality : 0,
      video_quality: detailData ? detailData.video_quality : 0,
      audio_quality: detailData ? detailData.audio_quality : 0,
      other_quality: detailData ? detailData.other_quality : 0,
      price: detailData ? detailData.price : 0,
      note: detailData ? detailData.note : "",
    },

    validationSchema: Yup.object({
      content_quality: Yup.string().required("Vui lòng nhập thông tin"),
      image_quality: Yup.string().required("Vui lòng nhập thông tin"),
      video_quality: Yup.string().required("Vui lòng nhập thông tin"),
      audio_quality: Yup.string().required("Vui lòng nhập thông tin"),
      other_quality: Yup.string().required("Vui lòng nhập thông tin"),
      price: Yup.string().required("Vui lòng nhập thông tin"),
    }),
    onSubmit: (values) => {
      const dataNew = {
        content_quality: values.content_quality,
        image_quality: values.image_quality,
        video_quality: values.video_quality,
        audio_quality: values.audio_quality,
        other_quality: values.other_quality,
        price: values.price,
        note: values.note,
        article_id: id,
      };

      if (detailData === null) {
        createArticlePrice(dataNew).then((res) => {
          if (res && res.status > 0) {
            ToastCustom("Chấm nhuận bút thành công", "success");
            validation.resetForm();
            // navigate("/article-price");
          } else {
            ToastCustom("Có lỗi xảy ra, vui lòng thử lại", "fail");
          }
        });
      }

      const dataUpdate = {
        content_quality: values.content_quality,
        image_quality: values.image_quality,
        video_quality: values.video_quality,
        audio_quality: values.audio_quality,
        other_quality: values.other_quality,
        price: values.price,
        note: values.note,
        article_id: id,
        article_price_id: detailData.article_price_id,
      };

      if (getArticlePrice) {
        getAPIPutArticlePrice(dataUpdate).then((r) => {
          if (r.status > 0) {
            ToastCustom("Sửa chấm nhuận bút thành công", "success");
            validation.resetForm();
            // navigate("/article-price");
          } else if (r.status < 0) {
            ToastCustom(r.message ? r.message : "Sửa sự kiện thất bại", "fail");
          }
        });
      }
    },
  });

  const getArticlePrice = async () => {
    await getAPIArticlePriceById(id).then((res) => {
      setDetailData(res.data);
    });
  };

  useEffect(() => {
    getArticlePrice().then((r) => {});
  }, []);

  return (
    <>
      <div className="card-header">
        <Label htmlFor="article_price" className="form-label">
          Nhuận bút
        </Label>
      </div>
      <CardBody>
        <Form
          className="tablelist-form"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <div className="row mb-3">
            <div className="col-lg-6">
              <Label htmlFor="stat" className="text-muted">
                Hệ số nội dung
              </Label>
              <Input
                type="number"
                min="0"
                className="form-control"
                id="content_quality"
                value={validation.values.content_quality}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                invalid={
                  validation.errors.content_quality &&
                  validation.touched.content_quality
                    ? true
                    : false
                }
              />
              {validation.errors.content_quality &&
              validation.touched.content_quality ? (
                <FormFeedback type="invalid">
                  {validation.errors.content_quality}
                </FormFeedback>
              ) : null}
            </div>
            <div className="col-lg-6">
              <Label htmlFor="stat" className="text-muted">
                Hệ số ảnh
              </Label>
              <Input
                type="number"
                min="0"
                className="form-control"
                id="image_quality"
                value={validation.values.image_quality}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                invalid={
                  validation.errors.image_quality &&
                  validation.touched.image_quality
                    ? true
                    : false
                }
              />
              {validation.errors.image_quality &&
              validation.touched.image_quality ? (
                <FormFeedback type="invalid">
                  {validation.errors.image_quality}
                </FormFeedback>
              ) : null}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-6">
              <Label htmlFor="stat" className="text-muted">
                Hệ số video
              </Label>
              <Input
                type="number"
                min="0"
                className="form-control"
                id="video_quality"
                value={validation.values.video_quality}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                invalid={
                  validation.errors.video_quality &&
                  validation.touched.video_quality
                    ? true
                    : false
                }
              />
              {validation.errors.video_quality &&
              validation.touched.video_quality ? (
                <FormFeedback type="invalid">
                  {validation.errors.video_quality}
                </FormFeedback>
              ) : null}
            </div>
            <div className="col-lg-6">
              <Label htmlFor="stat" className="text-muted">
                Hệ số audio
              </Label>
              <Input
                type="number"
                min="0"
                className="form-control"
                id="audio_quality"
                value={validation.values.audio_quality}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                invalid={
                  validation.errors.audio_quality &&
                  validation.touched.audio_quality
                    ? true
                    : false
                }
              />
              {validation.errors.audio_quality &&
              validation.touched.audio_quality ? (
                <FormFeedback type="invalid">
                  {validation.errors.audio_quality}
                </FormFeedback>
              ) : null}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-6">
              <Label htmlFor="stat" className="text-muted">
                Hệ số khác
              </Label>
              <Input
                type="number"
                min="0"
                className="form-control"
                id="other_quality"
                value={validation.values.other_quality}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                invalid={
                  validation.errors.other_quality &&
                  validation.touched.other_quality
                    ? true
                    : false
                }
              />
              {validation.errors.other_quality &&
              validation.touched.other_quality ? (
                <FormFeedback type="invalid">
                  {validation.errors.other_quality}
                </FormFeedback>
              ) : null}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-12">
              <Label htmlFor="note" className="text-muted">
                Ghi chú
              </Label>
              <textarea
                name="note"
                id="note"
                className="form-control"
                placeholder="Nhập  Ghi chú"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.note || ""}
              />
              {validation.touched.note && validation.errors.note ? (
                <FormFeedback type="invalid">
                  {validation.errors.note}
                </FormFeedback>
              ) : null}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-12">
              <button className="btn btn-success" type="submit">
                Chấm nhuận bút
              </button>
            </div>
          </div>
        </Form>
      </CardBody>
    </>
  );
};
export default ComponentArticlePrice;
