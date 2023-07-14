import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import UpdateContentMagazine from "../ArticleType/MagazineComponent/UpdateContentMagazine";
import UpdateSettingMagazine from "../ArticleType/MagazineComponent/UpdateSettingMagazine";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Tabs } from "antd";
import { getAPIGetArticleById } from "../../../../helpers/fakebackend_helper";
import { v4 as uuidv4 } from "uuid";
import {
  updateArticleBlock,
  updateArticleContent,
  updateKeyIndex,
  updateArticleBackgroundColor,
  selectArticleColorText,
} from "../../../../store/fileManager/action";

export default function UpdateMagazine(props) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [detailData, setDetailData] = useState({});
  useEffect(() => {
    getAPIGetArticleById(id).then((res) => {
      if (res && res.status > 0) {
        setDetailData(res.data);
        if (res?.data?.magazine_info?.blocks.length > 0) {
          dispatch(
            updateArticleBackgroundColor(
              res.data.magazine_info.blocks[0]?.background_color || "#FFFFFF"
            )
          );
          dispatch(
            selectArticleColorText(
              res.data.magazine_info.blocks[0]?.color || "#000000"
            )
          );
          const keyList = res?.data?.magazine_info?.blocks.map((e) => uuidv4());
          dispatch(updateKeyIndex(keyList));
          dispatch(updateArticleContent(res.data.article_content));
          const blockTemp = res.data.magazine_info.blocks.map((e) => {
            return {
              block_text: {
                clas_css: e?.block_text?.class_css,
                content: e?.block_text?.content,
                locate: e?.block_text?.locate,
              },
              block_image: {
                content: e?.block_image?.content,
                text_image: e?.block_image?.text_image,
                locate: e?.block_image?.locate,
              },
              class_css: e?.class_css,
              color: e?.color,
              background_color: e?.background_color,
            };
          });
          dispatch(updateArticleBlock(blockTemp));
        }
      }
    });
  }, []);
  const Item = [
    {
      key: "1",
      label: `Nội dung`,
      children: <UpdateContentMagazine detailData={detailData} />,
    },
    {
      key: "2",
      label: `Thông tin bài viết`,
      children: <UpdateSettingMagazine />,
    },
  ];
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb
            previousLink={"/list-article"}
            title="Sửa bài viết"
            pageTitle="Danh sách bài viết"
          />
          <Tabs defaultActiveKey="1" items={Item} />
        </Container>
      </div>
    </>
  );
}
