import React from "react";
import ContentMagazine from "./MagazineComponent/ContentMagazine";
import SettingMagazine from "./MagazineComponent/SettingMagazine";
import { Tabs } from "antd";

export default function Magazine(props) {
  const Item = [
    {
      key: "1",
      label: `Nội dung`,
      children: <ContentMagazine />,
    },
    {
      key: "2",
      label: `Thông tin bài viết`,
      children: <SettingMagazine />,
    },
  ];
  return <Tabs defaultActiveKey="1" items={Item} />;
}
