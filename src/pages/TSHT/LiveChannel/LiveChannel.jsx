import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, { useEffect, useMemo, useState } from "react";
import {
  getAPIDeleteChannel,
  getAPIListLiveChannel,
  getAPILiveChannelUpdateDRMStatus,
  getAPILiveChannelUpdateStatus,
} from "../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { Table } from "antd";
import ToastCustom from "../../../Components/Common/Toast";
import moment from "moment";
import ButtonLiveChannel from "./ButtonLiveChannel";
import Loading from "../../../Components/Common/Loading";

const LiveChannel = () => {
  document.title = "Kênh | Toà Soạn Hội Tụ";
  const [channelList, setChannelList] = useState();
  const [channelId, setChannelId] = useState({});
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const onClickDelete = (live_channel_id) => {
    setChannelId(live_channel_id);
    setDeleteModal(true);
  };

  const handleDeleteOrder = () => {
    if (channelId) {
      getAPIDeleteChannel(channelId).then((r) => {
        if (r.status > 0) {
          ToastCustom("Xoá kênh thành công", "success");
          setReload((pre) => !pre);
        } else {
          ToastCustom("Xoá kênh thất bại", "fail");
        }
      });
      setDeleteModal(false);
    }
  };

  const handleTableChange = (pagination) => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListLiveChannel(offset, pagination.pageSize).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setChannelList(res.data.list);
        setPagination({ ...pagination, total: res.data.total });
      } else {
        toast.error("Không tìm thấy dữ liệu!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    });
  };

  const handleStatusChange = (id, channel_status) => {
    const updateChannel = {
      live_channel_id: id,
      status: channel_status === 0 ? 1 : 0,
    };
    getAPILiveChannelUpdateStatus(
      updateChannel.live_channel_id,
      updateChannel.status
    ).then((r) => {
      if (r.status >= 0) {
        ToastCustom("Cập nhật trạng thái thành công", "success");
        setReload((pre) => !pre);
      } else {
        ToastCustom("Cập nhật trạng thái thất bại", "fail");
      }
    });
  };

  const handleDrmChange = (id, drm_status) => {
    const updateChannel = {
      live_channel_id: id,
      status: drm_status === 0 ? 1 : 0,
    };
    getAPILiveChannelUpdateDRMStatus(
      updateChannel.live_channel_id,
      updateChannel.status
    ).then((r) => {
      if (r.status >= 0) {
        ToastCustom("Cập nhật trạng thái thành công", "success");
        setReload((pre) => !pre);
      } else {
        ToastCustom("Cập nhật trạng thái thất bại", "fail");
      }
    });
  };

  useEffect(() => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    // setLoading(true);
    getAPIListLiveChannel(offset, pagination.pageSize).then((res) => {
      if (res.data && res.data.list && res.status >= 0) {
        setChannelList(res.data.list);
        setPagination({ ...pagination, total: res.data.total });
      } else {
        toast.error("Không tìm thấy dữ liệu!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setLoading(false);
    });
  }, [reload]);

  const columns = useMemo(
    () => [
      {
        title: "STT",
        className: "text-center",
        width: "5%",
        render: (record, row, index) => ({
          children: index + 1,
          props: {
            className: "text-center",
          },
        }),
      },
      {
        title: "Tên kênh",
        dataIndex: "channel_title",
        className: "text-center",
        width: "15%",
        render: (channel_title) => (
          <Link to="#" className="fw-medium link-primary">
            {channel_title}
          </Link>
        ),
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        className: "text-center",
        width: "30%",
        render: (description) => (
          <Link to="#" className="fw-medium link-primary">
            {description}
          </Link>
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "created_date",
        className: "text-center",
        width: "15%",
        render: (created_date) => (
          <Link to="#" className="fw-medium link-primary">
            {moment(new Date(created_date)).format("DD/MM/YYYY")}
          </Link>
        ),
      },
      {
        title: "Phát",
        dataIndex: "channel_status",
        width: "10%",
        render: (_, record) => {
          return (
            <div className="text-center">
              <ButtonLiveChannel
                value={record.channel_status}
                name="channel_status"
                onChange={() => {
                  handleStatusChange(
                    record.live_channel_id,
                    record.channel_status
                  );
                }}
              />
            </div>
          );
        },
      },
      {
        title: "DRM",
        dataIndex: "drm",
        width: "10%",
        render: (_, record) => (
          <div className="text-center">
            <ButtonLiveChannel
              value={record.drm_status}
              name="drm_status"
              onChange={() => {
                handleDrmChange(record.live_channel_id, record.drm_status);
              }}
            />
          </div>
        ),
      },
      {
        title: "EPG",
        dataIndex: "epg",
        width: "5%",
        render: (_, record) => (
          <div className="text-center">
            <Link to={`/epg/${record.live_channel_id}`}>
              <button className="btn btn-outline-secondary">EPG</button>
            </Link>
          </div>
        ),
      },
      {
        title: "Thao tác",
        dataIndex: "channel_id",
        width: "20%",
        render: (_, record) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit">
                <Link
                  to={`/update-live-channel/${record.live_channel_id}`}
                  className="text-primary d-inline-block edit-item-btn"
                >
                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => {
                    onClickDelete(record.live_channel_id);
                  }}
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteOrder}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid>
          <BreadCrumb title="Kênh" pageTitle="Home" />
          <Row>
            <Col lg={12}>
              <Card id="orderList">
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-sm">
                      <h5 className="card-title mb-0">Danh sách kênh</h5>
                    </div>
                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/add-live-channel`}>
                          <button
                            type="button"
                            className="btn btn-success add-btn"
                            id="create-btn"
                          >
                            <i className="ri-add-line align-bottom me-1"></i>
                            Thêm mới
                          </button>
                        </Link>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    {channelList && channelList.length && !loading ? (
                      <Table
                        className="overflow-auto"
                        columns={columns}
                        dataSource={channelList || []}
                        pagination={pagination}
                        onChange={handleTableChange}
                        rowKey={"live_channel_id"}
                      />
                    ) : (
                      <Loading />
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default LiveChannel;
