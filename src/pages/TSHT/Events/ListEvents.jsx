import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Row,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, { useEffect, useMemo, useState } from "react";
import {
  getAPIDeleteEvent,
  getAPIEventUpdateDRMStatus,
  getAPIEventUpdateStatus,
  getAPIListEvents,
} from "../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { DatePicker, Table } from "antd";
import ToastCustom from "../../../Components/Common/Toast";
import moment from "moment";
import ButtonLiveChannel from "../LiveChannel/ButtonLiveChannel";
import * as Antd from "antd";
import Loading from "../../../Components/Common/Loading";

const ListEvents = () => {
  document.title = "Sự kiện | Toà Soạn Hội Tụ";
  let keyWord = "";
  const [eventList, setEventList] = useState();
  const [eventId, setEventId] = useState({});
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    event_name: "",
    _fromdate: "",
    _todate: "",
  });

  const onClickDelete = (event_id) => {
    setEventId(event_id);
    setDeleteModal(true);
  };

  const handleDeleteOrder = () => {
    if (eventId) {
      const data = {
        event_id: eventId,
      };
      getAPIDeleteEvent(data).then((r) => {
        if (r.status > 0) {
          ToastCustom("Xoá sự kiện thành công", "success");
          setReload(!reload);
        } else {
          ToastCustom("Xoá kênh thất bại", "fail");
        }
      });
      setDeleteModal(false);
    }
  };

  const handleTableChange = (pagination) => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListEvents(
      offset,
      pagination.pageSize,
      pagination.event_name,
      pagination._todate,
      pagination._fromdate
    ).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setEventList(res.data.list);
        setPagination({ ...pagination, total: res.data.total });
        // setReload(!reload);
      } else {
        setEventList([])
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

  const handleEventStatusChange = (event_id, event_status) => {
    const updateEvent = {
      event_id: event_id,
      status: event_status === 0 ? 1 : 0,
    };
    getAPIEventUpdateStatus(updateEvent.event_id, updateEvent.status).then(
      (r) => {
        if (r.status >= 0) {
          ToastCustom("Cập nhật trạng thái thành công", "success");
          setReload((pre) => !pre);
        } else {
          ToastCustom("Cập nhật trạng thái thất bại", "fail");
        }
      }
    );
  };

  const handleEventDrmChange = (event_id, drm_status) => {
    const updateEvent = {
      event_id: event_id,
      status: drm_status === 0 ? 1 : 0,
    };
    getAPIEventUpdateDRMStatus(updateEvent.event_id, updateEvent.status).then(
      (r) => {
        if (r.status >= 0) {
          ToastCustom("Cập nhật trạng thái thành công", "success");
          setReload((pre) => !pre);
        } else {
          ToastCustom("Cập nhật trạng thái thất bại", "fail");
        }
      }
    );
  };

  useEffect(() => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    // setLoading(true);
    getAPIListEvents(
      offset,
      pagination.pageSize,
      pagination.event_name,
      pagination._todate,
      pagination._fromdate
    ).then((res) => {
      if (res.data && res.data.list && res.status >= 0) {
        setEventList(res.data.list);
        setPagination({ ...pagination, total: res.data.total });
      } else {
        setEventList([]);
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

  const onChangeFromDate = (dates, dateStrings) => {
    setPagination({
      ...pagination,
      _fromdate: dateStrings + " 00:00:00",
    });
    setReload(!reload);
  };
  const onChangeToDate = (dates, dateStrings) => {
    setPagination({
      ...pagination,
      _todate: dateStrings + " 00:00:00",
    });
    setReload(!reload);
  };

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
        title: "Tên sự kiện",
        dataIndex: "event_name",
        className: "text-center",
        width: "25%",
        render: (value) => (
          <Link to="#" className="fw-medium link-primary">
            {value}
          </Link>
        ),
      },

      {
        title: "Bắt đầu",
        dataIndex: "start_date",
        className: "text-center",
        width: "15%",
        render: (value) => (
          <Link to="#" className="fw-medium link-primary">
            {moment(new Date(value)).format("DD/MM/YYYY - h:mm a")}
          </Link>
        ),
      },
      {
        title: "Kết thúc",
        dataIndex: "end_date",
        className: "text-center",
        width: "15%",
        render: (value) => (
          <Link to="#" className="fw-medium link-primary">
            {moment(new Date(value)).format("DD/MM/YYYY - h:mm a")}
          </Link>
        ),
      },
      {
        title: "Phát Sóng",
        dataIndex: "event_status",
        width: "10%",
        render: (_, record) => {
          return (
            <div className="text-center">
              <ButtonLiveChannel
                value={record.event_status}
                name="event_status"
                onChange={() => {
                  handleEventStatusChange(record.event_id, record.event_status);
                }}
              />
            </div>
          );
        },
      },
      {
        title: "DRM",
        dataIndex: "drm_status",
        width: "8%",
        render: (_, record) => (
          <div className="text-center">
            <ButtonLiveChannel
              value={record.drm_status}
              name="drm_status"
              onChange={() => {
                handleEventDrmChange(record.event_id, record.drm_status);
              }}
            />
          </div>
        ),
      },
      {
        title: "Lượt xem",
        dataIndex: "epg",
        width: "10%",
        render: (_, record) => (
          <div>
            <p>9999</p>
          </div>
        ),
      },
      {
        title: "Thao tác",
        dataIndex: "event_id",
        width: "20%",
        render: (_, record) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0 text-center">
              <li className="list-inline-item edit">
                <Link
                  to={`/update-event/${record.event_id}`}
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
                    onClickDelete(record.event_id);
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
          <BreadCrumb title="Sự kiện" pageTitle="Home" />
          <Row>
            <Col lg={12}>
              <Card id="orderList">
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-sm">
                      <Row>
                        <Col className="col-3">
                          <Antd.Input
                            placeholder="Tìm kiếm"
                            onChange={(e) => {
                              keyWord = e.target.value.toString();
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setPagination({
                                  ...pagination,
                                  event_name: keyWord,
                                  current: 1,
                                });
                                setReload(!reload);
                              }
                            }}
                          ></Antd.Input>
                        </Col>
                        <Col className="col-2">
                          <DatePicker
                            allowClear
                            onChange={onChangeFromDate}
                            placeholder="Từ ngày"
                          />
                        </Col>
                        <Col className="col-2">
                          <DatePicker
                            allowClear
                            onChange={onChangeToDate}
                            placeholder="Đến ngày"
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/add-events`}>
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
                    {eventList && eventList.length && !loading ? (
                      <Table
                        className="overflow-auto"
                        columns={columns}
                        dataSource={eventList || []}
                        pagination={pagination}
                        onChange={handleTableChange}
                        rowKey={"event_id"}
                      />
                    ) : (
                      // <Table dataSource={articlePriceList} columns={columns} />
                      eventList && eventList.length > 0 ? (
                        <Table
                          className="overflow-auto"
                          columns={columns}
                          dataSource={eventList}
                          rowKey={"article_id"}
                        />
                      ) : (
                        <div
                          style={{
                            height: 500,
                            display: "flex",
                            textAlign: "center",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <h2>Không có dữ liệu</h2>
                        </div>
                      )
                    )
                    }
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

export default ListEvents;
