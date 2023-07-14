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
    label: "Kéo căng",
    value: "stretch",
  },
  {
    label: "Căn giữa",
    value: "center",
  },
  {
    label: "Căn trên",
    value: "flex-start",
  },
  {
    label: "Căn dưới",
    value: "flex-end",
  },
  {
    label: "Tự động",
    value: "auto",
  },
];

const justifyContentBlock = [
  {
    label: "Căn trái",
    value: "flex-start",
  },
  {
    label: "Căn phải",
    value: "flex-end",
  },
  {
    label: "Căn giữa",
    value: "center",
  },
  {
    label: "Sát lề hai bên",
    value: "space-between",
  },
  {
    label: "Căn hai bên phần tử",
    value: "space-around",
  },
  {
    label: "Khoảng cách đều nhau",
    value: "space-evenly",
  },
];

export default function BlockMagazine(props) {
  const dispatch = useDispatch();
  const { onUpdateContent, itemkey, type } = props;
  const [text, setText] = useState("");
  const [number, setNumber] = useState(-1);
  const [image, setImage] = useState("");
  const [clasCss, setClassCss] = useState("Căn đều");
  const [switchItem, setSwitchItem] = useState(true);
  const [justifyContent, setJustifyContent] = useState("Căn trái");
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
  const renderItem = (type) => {
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
              defaultImgSrc={image}
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
              value={caption}
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
              defaultValue={clasCss}
            ></Select>
            <TextArea
              style={{
                marginTop: 10,
              }}
              placeholder="Nội dung"
              onChange={(e) => {
                setText(e.target.value);
              }}
              defaultValue={
                type === "update" && number !== -1
                  ? eMagazineBlock[number]?.block_text?.content
                  : ""
              }
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
              defaultValue={justifyContent}
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
  //   handleUpdateContent();
  //   const temp = eMagazineBlock.map((e, i) => {
  //     return {
  //       ...e,
  //       color: eMagazineTextColor,
  //       background_color: eMagazineBackgroundColor,
  //     };
  //   });
  //   dispatch(updateArticleBlock(temp));
  // }, [eMagazineBackgroundColor, eMagazineTextColor]);
  const [listItem, setListItem] = useState([
    {
      key: uuidv4(),
      label: "Chữ",
      children: renderItem("text"),
    },
    {
      key: uuidv4(),
      label: "Ảnh",
      children: renderItem("image"),
    },
    {
      key: uuidv4(),
      label: "Khối",
      children: renderItem("block"),
    },
  ]);
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
