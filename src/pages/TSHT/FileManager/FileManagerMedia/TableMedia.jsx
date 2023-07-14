import React, { useState, useRef, useEffect } from "react";
import {
  TreeSelect,
  Modal,
  Table,
  Image,
  Popconfirm,
  Button,
  Spin,
} from "antd";
import ToastCustom from "../../../../Components/Common/Toast";
import Loader from "../../../../Components/Common/Loader";
import "./style.css";
import Loading from "../../../../Components/Common/Loading";

export default function TableMedia(props) {
  const {
    sidebarData,
    setSidebarData,
    columns,
    apiGetList,
    reload,
    filterParams,
    onSelectMedia,
  } = props;
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalData, setTotalData] = useState(0);
  useEffect(() => {
    apiGetList({
      ...filterParams,
      offset: (page - 1) * 10,
      limit: 10,
    }).then((res) => {
      if (res && res.data && res.status > 0) {
        setDataSource(res.data.list);
        setTotalData(res.data.total);
        setLoading(false);
      }
    });
  }, [reload, page]);
  useEffect(() => {
    setPage(1);
    apiGetList({
      ...filterParams,
      offset: 0,
      limit: 10,
    }).then((res) => {
      if (res && res.data && res.status > 0) {
        setDataSource(res.data.list);
        setTotalData(res.data.total);
        setLoading(false);
      }
    });
  }, [filterParams]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Table
          dataSource={dataSource}
          locale={{
            emptyText: () => <a>Không có dữ liệu</a>,
          }}
          rowClassName={(record) =>
            sidebarData && record.file_info_id === sidebarData.file_info_id
              ? "ant-table-row-custom"
              : "ant-table-row"
          }
          columns={columns}
          style={{
            marginTop: 20,
          }}
          pagination={{
            current: page,
            pageSize: 10,
            total: totalData,
            onChange: (page) => {
              setPage(page);
            },
            showSizeChanger: false,
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                setSidebarData(record);
              },
              onDoubleClick: () => {
                onSelectMedia(record);
              },
            };
          }}
        />
      )}
    </>
  );
}
