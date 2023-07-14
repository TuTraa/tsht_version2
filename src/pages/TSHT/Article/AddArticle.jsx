import BreadCrumb from "../../../Components/Common/BreadCrumb";
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
import { Select } from "antd";
import "./ArticleType/compare-version.scss";

import { getAPIListArticleType } from "../../../helpers/fakebackend_helper";
import NormalArticle from "./ArticleType/NormalArticle";
import VideoArticle from "./ArticleType/VideoArticle";
import AudioArticle from "./ArticleType/AudioArticle";
import Newspaper from "./ArticleType/Newspaper";
import Magazine from "./ArticleType/Magazine";
import { useScrollLock } from "../../../Components/Hooks/UseScrollLock";
const AddArticle = () => {
  const { lockScroll, unlockScroll } = useScrollLock();
  lockScroll();
  document.title = "Tạo bài viết | Toà Soạn Hội Tụ";
  const [articleType, setArticleType] = useState([]);
  const [selectedArticleType, setSelectedArticleType] = useState(0);
  function handleChange(value) {
    setSelectedArticleType(value);
  }
  useEffect(() => {
    getAPIListArticleType().then((res) => {
      if (res.data && res.status > 0) {
        let result = [];
        res.data.map((e) => {
          result.push({
            value: e.article_type_id,
            label: e.article_type_name,
          });
        });
        setArticleType(result);
      }
    });
  }, []);
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb
            title="Thêm bài viết"
            pageTitle="Danh sách bài viết"
            previousLink="/list-article"
          />
          <Card>
            <CardBody>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Label htmlFor="article_sapo" className="form-label">
                  Loại bài viết
                </Label>
                <Select
                  placeholder="Chọn loại bài viết"
                  style={{ width: 220 }}
                  onChange={handleChange}
                  options={articleType}
                />
              </div>
            </CardBody>
          </Card>
          {selectedArticleType === 1 && (
            <NormalArticle article_type={selectedArticleType} />
          )}
          {selectedArticleType === 2 && (
            <Magazine article_type={selectedArticleType} />
          )}
          {selectedArticleType === 3 && (
            <VideoArticle article_type={selectedArticleType} />
          )}
          {selectedArticleType === 4 && (
            <AudioArticle article_type={selectedArticleType} />
          )}
          {selectedArticleType === 5 && (
            <Newspaper article_type={selectedArticleType} />
          )}
        </Container>
      </div>
    </>
  );
};

export default AddArticle;
