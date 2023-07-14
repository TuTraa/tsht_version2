import React, { useState, useRef, useEffect } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, theme, Row, Col, Button, Card } from "antd";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import BlockMagazine from "./BlockMagazine";
import { useDispatch, useSelector } from "react-redux";
import {
  updateArticleBlock,
  updateArticleContent,
  updateKeyIndex,
} from "../../../../../store/fileManager/action";

export default function ContentMagazine() {
  const { token } = theme.useToken();
  const dispatch = useDispatch();
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };
  const { eMagazineBlock } = useSelector((state) => ({
    eMagazineBlock: state.FileManager.eMagazineBlock,
  }));
  const { eMagazineListKey } = useSelector((state) => ({
    eMagazineListKey: state.FileManager.eMagazineListKey,
  }));
  const { eMagazineBackgroundColor } = useSelector((state) => ({
    eMagazineBackgroundColor: state.FileManager.eMagazineBackgroundColor,
  }));
  const { eMagazineTextColor } = useSelector((state) => ({
    eMagazineTextColor: state.FileManager.eMagazineTextColor,
  }));
  const [refresh, setRefresh] = useState(true);
  const [listNumber, setListNumber] = useState([]);
  const listItem = useRef([]);
  const articleContent = useRef([]);
  const magazineContent = useRef([]);
  const finalContent = useRef("");
  // const [articleContent, setArticleContent] = useState([]);
  const onUpdateContent = (e, numb, magazine) => {
    const content = articleContent.current.map((element, index) => {
      if (index === numb) {
        return e;
      } else {
        return element;
      }
    });
    const tempMagazine = magazineContent.current.map((element, index) => {
      if (index === numb) {
        return magazine;
      } else {
        return element;
      }
    });
    articleContent.current = content;
    magazineContent.current = tempMagazine;
    finalContent.current = magazineContent.current.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      ""
    );
    dispatch(updateArticleContent(finalContent.current));
    setRefresh((pre) => !pre);
  };
  const handleDeleteItem = (key) => {
    const keyIndex = listItem.current.findIndex((e, i) => e.key === key);

    const contentTemp = articleContent.current.filter((e, i) => i !== keyIndex);
    articleContent.current = contentTemp;
    const magazineTemp = magazineContent.current.filter(
      (e, i) => i !== keyIndex
    );
    magazineContent.current = magazineTemp;
    const listTemp = [...listItem.current].filter((e, i) => i !== keyIndex);
    const numberTemp = listNumber.filter((e, i) => i !== keyIndex);
    const blockTemp = eMagazineBlock.filter((e, i) => i !== keyIndex);
    dispatch(updateArticleBlock([...blockTemp]));
    dispatch(updateKeyIndex(listTemp.map((e) => e.key)));
    setListNumber(numberTemp.map((e, i) => i));
    listItem.current = listTemp;
    setRefresh((pre) => !pre);
  };
  return (
    <div>
      <Row lang="12" style={{ overflow: "auto", height: "69vh" }}>
        <Col lg={8}>
          <Collapse
            bordered={false}
            accordion
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            style={{
              background: token.colorBgContainer,
            }}
            items={listItem.current}
          />
          <Button
            onClick={() => {
              const key = uuidv4();
              listItem.current = [
                ...listItem.current,
                {
                  key: key,
                  label: `Khối ${listNumber.length + 1}`,
                  children: (
                    <BlockMagazine
                      itemkey={key}
                      onUpdateContent={onUpdateContent}
                    />
                  ),
                  extra: (
                    <Button
                      color="red"
                      onClick={() => {
                        handleDeleteItem(key);
                      }}
                      danger
                      type="primary"
                    >
                      -
                    </Button>
                  ),
                },
              ];
              setListNumber([...listNumber, listNumber.length]);
              articleContent.current = [...articleContent.current, <></>];
              magazineContent.current = [...magazineContent.current, ""];
              dispatch(updateArticleBlock([...eMagazineBlock, {}]));
              dispatch(updateKeyIndex([...eMagazineListKey, key]));
            }}
          >
            Thêm
          </Button>
        </Col>
        <Col lg={16}>
          <Card>{articleContent.current.map((e) => e)}</Card>
        </Col>
      </Row>
    </div>
  );
}
