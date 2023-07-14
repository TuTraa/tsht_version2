import { convertVietnamese } from "../../helpers/text_helper";
import {
  getAPIListArticleRelated,
  getAPIListTag,
  getAPIPostTag,
} from "../../helpers/fakebackend_helper";
import ToastCustom from "./Toast";
import React, { useEffect, useState } from "react";
import { Input, Label } from "reactstrap";
import { Button, Modal, TreeSelect } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

const SelectTag = ({
  articleRelate,
  setSelectedTags,
  setValueArticleRelate,
  selectedTags,
  valueArticleRelate,
  optionsTag,
  setReloadTag,
  setArticleRelate,
  setOptionTag,
  reloadTag,
}) => {
  const [tagName, setTagName] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    var options = [];
    setArticleRelate([]);
    getAPIListArticleRelated(
      selectedTags && selectedTags.length > 0 && "[" + selectedTags + "]",
      -1
    ).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        res.data.list.forEach((e) => {
          options.push({
            value: e.article_id,
            title: e.article_title,
          });
        });
        setArticleRelate(options);
      }
    });
  }, [selectedTags]);
  useEffect(() => {
    getAPIListTag(0, -1, "").then((res) => {
      var options = [];
      if (res.data && res.data.list && res.status > 0) {
        res.data.list.forEach((e) => {
          options.push({
            value: e.tag_id,
            title: e.tag_name,
          });
        });
      }
      setOptionTag(options);
    });
  }, [reloadTag]);
  const onAddTag = () => {
    if (tagName && tagName !== "") {
      const newTag = {
        tag_name: tagName,
        tag_slug: convertVietnamese(tagName),
      };
      getAPIPostTag(newTag).then((r) => {
        if (r.status > 0) {
          ToastCustom("Thêm tag thành công", "success");
          setReloadTag();
          setIsModalOpen(false);
          setTagName("");
        } else if (r.status === -1) {
          ToastCustom("Thêm tag thất bại", "fail");
        } else if (r.status === -2) {
          ToastCustom("Slug tag bị trùng", "fail");
        }
      });
    } else {
      ToastCustom("Tên tag không được để trống", "fail");
    }
  };
  const closeTagModal = () => {
    setIsModalOpen(false);
    setTagName("");
  };

  function handleSelectTags(target) {
    if (target !== undefined) {
      setSelectedTags(target);
    }
  }

  function handleSelectRelate(target) {
    setValueArticleRelate(target);
  }

  return (
    <>
      <div className="mb-3">
        <Label htmlFor="article_tags" className="form-label">
          Tag
        </Label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TreeSelect
            style={{
              width: "100%",
            }}
            dropdownStyle={{
              maxHeight: 400,
              overflow: "auto",
            }}
            placeholder="Có thể chọn nhiều Tag"
            value={selectedTags}
            onChange={handleSelectTags}
            treeData={optionsTag}
            treeDefaultExpandAll
            allowClear
            showSearch
            treeNodeFilterProp="title"
            multiple={true}
            isMulti={true}
            onDeselect={() => setValueArticleRelate([])}
          />
          <div
            style={{ display: "flex", alignItems: "center", marginLeft: 10 }}
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircleOutlined />
          </div>
          <Modal
            title="Thêm mới tag"
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => closeTagModal()}
            centered
            footer={[
              <Button key="back" onClick={closeTagModal}>
                Hủy
              </Button>,
              <Button key="submit" type="primary" onClick={onAddTag}>
                Thêm
              </Button>,
            ]}
          >
            <Input
              value={tagName}
              placeholder="Nhập tên tag"
              onChange={(e) => setTagName(e.target.value)}
            />
          </Modal>
        </div>
      </div>
      <div className="mb-3">
        <Label htmlFor="article_relevant" className="form-label">
          Tin liên quan
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
          treeData={articleRelate}
          treeDefaultExpandAll
          placeholder="Có thể chọn nhiều tin liên quan"
          value={valueArticleRelate}
          multiple={true}
          isMulti={true}
          showSearch
          treeNodeFilterProp="title"
          onChange={handleSelectRelate}
        />
      </div>
      <div style={{ height: "40px" }}></div>
    </>
  );
};
export default SelectTag;
