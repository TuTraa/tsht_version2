import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, { useEffect, useMemo, useState } from "react";
import {
  getAPIDeleteAds,
  getAPIListAds,
} from "../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { DatePicker, Table, TreeSelect } from "antd";
import ToastCustom from "../../../Components/Common/Toast";
import moment from "moment";
import ButtonLiveChannel from "../LiveChannel/ButtonLiveChannel";
import * as Antd from "antd";
import styled from "styled-components";
import { Spin } from "antd/lib";

const ListAdvertisement = () => {
  document.title = "Quảng cáo | Toà Soạn Hội Tụ";
  let keyWord = "";
  const [adsList, setAdsList] = useState();
  const [adsId, setAdsId] = useState({});
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Image");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    ad_type: "",
    customer_info: "",
    status: "",
    date_to: "",
    date_from: "",
    ad_name: "",
  });

  const optionsStatusType = [
    {
      value: "xuất bản",
      title: "xuất bản",
    },
    {
      value: "chờ duyệt",
      title: "chờ duyệt",
    },
  ];
  const optionsAdType = [
    {
      value: "Image",
      title: "Image",
    },
    {
      value: "Video",
      title: "Video",
    },
    {
      value: "Html",
      title: "Html",
    },
    {
      value: "JavaScript",
      title: "JavaScript",
    },
  ];

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const StatusBtn = styled.p`
    border: 1px solid #ffffff;
    border-radius: 20px;
    width: 83px;
    height: 33px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    margin-bottom: 5px;
  `;
  const pAdvertisement = {
    marginBottom: 5,
  };
  const SpanAdvertisement = styled.p`
    font-size: 12px;
    color: #6f727a;
  `;

  const btnNew = {
    background: "#FFD88C",
    color: "#F47113",
  };
  const btnPending = {
    background: "#8F49E7",
    color: "#FFFFFF",
  };
  const btnIsWaitApproved = {
    background: "#FFD88C",
    color: "#FFFFFF",
  };
  const btnPublished = {
    background: "#256AD0",
    color: "#FFFFFF",
  };
  const btnDelete = {
    background: "#FC957F",
    color: "#FF0000",
  };

  const onClickDelete = (ad_id) => {
    setAdsId(ad_id);
    setDeleteModal(true);
  };

  const handleDeleteOrder = () => {
    if (adsId) {
      const data = {
        ad_id: adsId,
      };
      getAPIDeleteAds(data).then((r) => {
        if (r.status > 0) {
          ToastCustom("Xoá quảng cáo thành công", "success");
          setReload(!reload);
        } else {
          ToastCustom("Xoá quảng cáo thất bại", "fail");
        }
      });
      setDeleteModal(false);
    }
  };

  const handleTableChange = (pagination) => {
    setIsLoading(true);
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListAds(
      offset,
      pagination.ad_type,
      pagination.customer_info,
      pagination.status,
      pagination.date_to,
      pagination.date_from,
      pagination.ad_name
    ).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setAdsList(res.data.list);
        setPagination({ ...pagination, total: res.data.total });
        setReload(!reload);
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

  useEffect(() => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListAds(
      offset,
      pagination.pageSize,
      pagination.ad_type,
      pagination.customer_info,
      pagination.status,
      pagination.date_to,
      pagination.date_from,
      pagination.ad_name
    ).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setAdsList(res.data.list);
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
  }, [reload]);

  const onChangeFromDate = (dates, dateStrings) => {
    setPagination({
      ...pagination,
      date_from: dateStrings + " 00:00:00",
    });
    setReload(!reload);
  };
  const onChangeToDate = (dates, dateStrings) => {
    setPagination({
      ...pagination,
      date_to: dateStrings + " 00:00:00",
    });
    setReload(!reload);
  };

  const columns = useMemo(
    () => [
      {
        title: "Tên",
        width: "25%",
        render: (value) => (
          <div className="d-flex flex-column">
            <p style={pAdvertisement}>{value.ad_name}</p>
            <SpanAdvertisement>
              {` Loại QC : ${value.ad_type}`}
            </SpanAdvertisement>
          </div>
        ),
      },
      {
        title: "Vị trí",
        dataIndex: "display_position_name",
        width: "20%",
        render: (value) => (
          <Link to="#" className="fw-medium link-primary">
            {value ? value : ""}
          </Link>
        ),
      },
      {
        title: "Tên đối tác",
        dataIndex: "customer_info",
        width: "15%",
        render: (value) => (
          <Link to="#" className="fw-medium link-primary">
            {value}
          </Link>
        ),
      },

      {
        title: "Thời gian hoạt động",
        // className: "text-center",
        width: "15%",
        render: (value) => (
          <div className="d-flex flex-column">
            <p>
              Từ :{" "}
              {moment(new Date(value.datetime_from)).format(
                "DD/MM/YYYY - h:mm "
              )}
            </p>
            <p>
              Đến :{" "}
              {moment(new Date(value.datetime_to)).format("DD/MM/YYYY - h:mm ")}
            </p>
          </div>
        ),
      },
      {
        title: "Trạng thái",
        width: "10%",
        render: (_, record) => {
          return (
            <div className="d-flex flex-column">
              <StatusBtn
                style={
                  (record.status == 0 && btnNew) ||
                  (record.status == 1 && btnPending)
                  // (record.event_status_id == 3 && btnIsWaitApproved) ||
                  // (record.event_status_id == 4 && btnPublished) ||
                  // (record.event_status_id == 5 && btnDelete)
                }
              >
                {record.status_display}
              </StatusBtn>
            </div>
          );
        },
      },
      {
        title: "Hiển thị",
        dataIndex: "is_display",
        width: "8%",
        render: (_, record) => (
          <div className="text-center">
            <ButtonLiveChannel
              value={record.is_display}
              name="is_display"
              disabled={true}
            />
          </div>
        ),
      },

      {
        title: "Thao tác",
        dataIndex: "advertisement_id",
        width: "20%",
        render: (_, record) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0 text-center">
              <li className="list-inline-item edit">
                <Link
                  to={`/update-advertisement/${record.ad_id}`}
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
                    onClickDelete(record.ad_id);
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
          <BreadCrumb title="Quảng cáo" pageTitle="Home" />
          <Row>
            <Col lg={12}>
              <Card id="orderList">
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-sm">
                      <Row>
                        <Col className="col-2">
                          <Antd.Input
                            placeholder="Tìm kiếm"
                            onChange={(e) => {
                              keyWord = e.target.value.toString();
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setPagination({
                                  ...pagination,
                                  ad_name: keyWord,
                                  current: 1,
                                });
                                setReload(!reload);
                              }
                            }}
                          ></Antd.Input>
                        </Col>
                        <Col className="col-2">
                          <TreeSelect
                            style={{
                              width: "100%",
                            }}
                            dropdownStyle={{
                              maxHeight: 400,
                              overflow: "auto",
                            }}
                            allowClear
                            treeDefaultExpandAll
                            placeholder="Tên đối tác"
                          />
                        </Col>
                        <Col className="col-2">
                          <TreeSelect
                            style={{
                              width: "100%",
                            }}
                            value={optionsStatusType.value}
                            dropdownStyle={{
                              maxHeight: 400,
                              overflow: "auto",
                            }}
                            allowClear
                            treeData={optionsStatusType}
                            treeDefaultExpandAll
                            placeholder="Trạng thái"
                            onChange={tabChange}
                          />
                        </Col>
                        <Col className="col-2">
                          <TreeSelect
                            style={{
                              width: "100%",
                            }}
                            value={optionsAdType.value}
                            dropdownStyle={{
                              maxHeight: 400,
                              overflow: "auto",
                            }}
                            allowClear
                            treeData={optionsAdType}
                            treeDefaultExpandAll
                            placeholder="Loại quảng cáo"
                            onChange={tabChange}
                          />
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
                        <Link to={`/add-advertisement`}>
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
                    {!isLoading ? (
                      adsList && adsList.length ? (
                        <Table
                          className="overflow-auto"
                          columns={columns}
                          dataSource={adsList || []}
                          pagination={pagination}
                          onChange={handleTableChange}
                          rowKey={"advertisement_id"}
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
                        <Spin />
                      </div>
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

export default ListAdvertisement;
