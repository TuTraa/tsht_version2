import React, { useState, useRef, useEffect } from "react";
import { Collapse, theme, Row, Col, Button, Select } from "antd";
import { toast } from "react-toastify";
import { Input } from "reactstrap";
import SelectMedia from "../../../FileManager/FileManagerMedia/SelectMedia";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import ArticleCustomEditor from "./CustomEditor";
import { updateArticleBlock } from "../../../../../store/fileManager/action";
import TextArea from "antd/es/input/TextArea";

const ClassCssArr = [
  {
    label: "stretch",
    value: "stretch",
  },
  {
    label: "center",
    value: "center",
  },
  {
    label: "flex-start",
    value: "flex-start",
  },
  {
    label: "flex-end",
    value: "flex-end",
  },
  {
    label: "auto",
    value: "auto",
  },
];

const justifyContentBlock = [
  {
    label: "flex-start",
    value: "flex-start",
  },
  {
    label: "flex-end",
    value: "flex-end",
  },
  {
    label: "center",
    value: "center",
  },
  {
    label: "space-between",
    value: "space-between",
  },
  {
    label: "space-around",
    value: "space-around",
  },
  {
    label: "space-evenly",
    value: "space-evenly",
  },
];

export default function UpdateBlockMagazine(props) {
  const dispatch = useDispatch();
  const { onUpdateContent, itemkey, type, detailData } = props;
  const [defaultSetting, setDefaultSetting] = useState(false);
  const [text, setText] = useState("");
  const [number, setNumber] = useState(-1);
  const [image, setImage] = useState("");
  const [clasCss, setClassCss] = useState("justify");
  const [switchItem, setSwitchItem] = useState(true);
  const [justifyContent, setJustifyContent] = useState("flex-start");
  const { eMagazineTextColor } = useSelector((state) => ({
    eMagazineTextColor: state.FileManager.eMagazineTextColor,
  }));
  const { eMagazineBlock } = useSelector((state) => ({
    eMagazineBlock: state.FileManager.eMagazineBlock,
  }));
  const { eMagazineListKey } = useSelector((state) => ({
    eMagazineListKey: state.FileManager.eMagazineListKey,
  }));
  const { eMagazineBackgroundColor } = useSelector((state) => ({
    eMagazineBackgroundColor: state.FileManager.eMagazineBackgroundColor,
  }));
  useEffect(() => {
    if (eMagazineListKey.length > 0) {
      const index = eMagazineListKey.findIndex((e) => e === itemkey);
      setNumber(index);
    }
  }, [eMagazineListKey]);
  const [caption, setCaption] = useState("");
  const renderItem = (type, content, dataClass, dataJusttify, dataCaption) => {
    return (
      <div>
        {type === "image" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SelectMedia
              type={"dropzone"}
              onUploadMedia={(e) => {
                setImage(e);
              }}
              defaultImgSrc={content}
              setDefaultImgSrc={() => {
                setImage("");
              }}
            ></SelectMedia>
            <Input
              style={{
                marginTop: 10,
              }}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Chú thích ảnh"
              value={dataCaption}
            ></Input>
          </div>
        )}
        {type === "text" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Select
              placeholder="Class css"
              options={ClassCssArr}
              onChange={(e) => setClassCss((pre) => e)}
              defaultValue={dataClass}
            ></Select>
            <TextArea
              style={{
                marginTop: 10,
              }}
              placeholder="Nội dung"
              onChange={(e) => {
                setText(e.target.value);
              }}
              defaultValue={content}
            ></TextArea>
          </div>
        )}
        {type === "block" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Select
              placeholder="Class css"
              options={justifyContentBlock}
              onChange={(e) => setJustifyContent((pre) => e)}
              defaultValue={dataJusttify}
            ></Select>
            <Button
              style={{
                marginTop: 10,
              }}
              onClick={() => {
                setListItem((pre) => [pre[1], pre[0], pre[2]]);
                setSwitchItem((pre) => !pre);
              }}
            >
              Đổi vị trí
            </Button>
          </div>
        )}
      </div>
    );
  };
  useEffect(() => {
    if (eMagazineBlock && !defaultSetting && number !== -1) {
      setClassCss(eMagazineBlock[number]?.block_text?.class_css || "");
      setText(eMagazineBlock[number]?.block_text?.content || "");
      setCaption(eMagazineBlock[number]?.block_image?.text_image || "");
      setImage(eMagazineBlock[number]?.block_image?.content || "");
      setJustifyContent(eMagazineBlock[number]?.class_css || "");
      setSwitchItem(
        eMagazineBlock[number]?.block_text?.locate === 0 ? true : false
      );
      setDefaultSetting(true);
    }
  }, [eMagazineBlock, number]);

  useEffect(() => {
    handleUpdateContent();
    const temp = eMagazineBlock.map((e, i) => {
      if (i === number) {
        return {
          block_text: {
            clas_css: clasCss,
            content: text,
            locate: switchItem ? 0 : 1,
          },
          block_image: {
            content: image,
            text_image: caption,
            locate: switchItem ? 1 : 0,
          },
          class_css: justifyContent,
          color: eMagazineTextColor,
          background_color: eMagazineBackgroundColor,
        };
      } else {
        return e;
      }
    });
    dispatch(updateArticleBlock(temp));
  }, [
    text,
    image,
    clasCss,
    switchItem,
    justifyContent,
    caption,
    eMagazineBackgroundColor,
    eMagazineTextColor,
  ]);
  // useEffect(() => {
  //   const temp = eMagazineBlock.map((e, i) => {
  //     return {
  //       ...e,
  //       color: eMagazineTextColor,
  //       background_color: eMagazineBackgroundColor,
  //     };
  //   });
  //   dispatch(updateArticleBlock(temp));
  // }, [eMagazineBackgroundColor, eMagazineTextColor]);
  const [listItem, setListItem] = useState([]);
  useEffect(() => {
    if (number !== -1) {
      setListItem([
        {
          key: uuidv4(),
          label: "Chữ",
          forceRender: true,
          children: renderItem(
            "text",
            eMagazineBlock[number]?.block_text?.content,
            eMagazineBlock[number]?.block_text?.class_css,
            eMagazineBlock[number]?.class_css,
            eMagazineBlock[number]?.block_image?.text_image
          ),
        },
        {
          key: uuidv4(),
          label: "Ảnh",
          forceRender: true,
          children: renderItem(
            "image",
            eMagazineBlock[number]?.block_image?.content,
            eMagazineBlock[number]?.block_text?.class_css,
            eMagazineBlock[number]?.class_css,
            eMagazineBlock[number]?.block_image?.text_image
          ),
        },
        {
          key: uuidv4(),
          label: "Khối",
          forceRender: true,
          children: renderItem(
            "block",
            eMagazineBlock[number]?.block_text?.content,
            eMagazineBlock[number]?.block_text?.class_css,
            eMagazineBlock[number]?.class_css,
            eMagazineBlock[number]?.block_image?.text_image
          ),
        },
      ]);
    }
  }, [number]);
  const handleUpdateContent = () => {
    onUpdateContent(
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: `${justifyContent}`,
          backgroundColor: eMagazineBackgroundColor,
        }}
      >
        {switchItem ? (
          <>
            <p style={{ alignSelf: clasCss, color: eMagazineTextColor }}>
              {text}
            </p>
            <figure className="image" id="add_image_link">
              <img width="500" src={image} alt="" />
              <figcaption>{caption}</figcaption>
            </figure>
          </>
        ) : (
          <>
            <figure className="image" id="add_image_link">
              <img width="500" src={image} alt="" />
              <figcaption>{caption}</figcaption>
            </figure>
            <p style={{ alignSelf: clasCss, color: eMagazineTextColor }}>
              {text}
            </p>
          </>
        )}
      </div>,
      number,
      ArticleCustomEditor(
        eMagazineTextColor,
        eMagazineBackgroundColor,
        text,
        clasCss,
        image,
        caption,
        justifyContent,
        switchItem
      )
    );
  };
  return <Collapse accordion items={listItem} />;
}
