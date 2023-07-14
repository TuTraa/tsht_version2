import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, { useEffect, useMemo, useState } from "react";
import {
  getAPIDeleteProcess,
  getAPIListProcess,
} from "../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { Table } from "antd";

const Process = () => {
  document.title = "Quy trình | Toà Soạn Hội Tụ";
  const [process, setProcess] = useState();
  const [processId, setProcessId] = useState({});
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const onClickDelete = (role_id) => {
    setProcessId(role_id);
    setDeleteModal(true);
  };

  const handleDeleteOrder = () => {
    if (processId) {
      const process_id = processId;
      getAPIDeleteProcess(process_id).then((r) => {
        setReload(!reload);
      });
      setDeleteModal(false);
    }
  };

  const handleTableChange = (pagination, filters) => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListProcess(offset, pagination.pageSize).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setProcess(res.data.list);
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

  useEffect(() => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListProcess(offset, pagination.pageSize).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setProcess(res.data.list);
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

  const columns = useMemo(
    () => [
      {
        title: "Tên quy trình",
        dataIndex: "role_name",
        width: "20%",
        render: (role_name) => (
          <Link to="#" className="fw-medium link-primary">
            {role_name}
          </Link>
        ),
      },
      {
        title: "Mô tả",
        dataIndex: "role_description",
        width: "20%",
        render: (role_description) => (
          <Link to="#" className="fw-medium link-primary">
            {role_description}
          </Link>
        ),
      },
      {
        title: "Các bước",
        width: "45%",
        render: (record) => (
          <div style={{ display: "flex", gap: "5px", flexFlow: "wrap" }}>
            {record.role_step_list.map((e, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: "#87AFFF",
                  border: "1px solid #87AFFF",
                  borderRadius: "5px",
                  padding: "6px 8px",
                  fontSize: 12,
                }}
              >
                {e.step_short_name}
              </span>
            ))}
          </div>
        ),
      },
      {
        title: "Thao tác",
        dataIndex: "role_name",
        width: "15%",
        render: (role_id) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit">
                <Link
                  to={`/update-process/${role_id}`}
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
                    onClickDelete(role_id);
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
          <BreadCrumb title="Quy trình" pageTitle="Home" />
          <Row>
            <Col lg={12}>
              <Card id="orderList">
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-sm">
                      <div className={"row"}>
                        <Col lg={4}>
                          <div className="position-relative">
                            <Input
                              type="text"
                              className="form-control"
                              placeholder="Tìm kiếm..."
                              id="search-options"
                              width={30}
                              // value={value}
                              // onChange={(e) => {
                              //     onChangeData(e.target.value);
                              // }}
                            />
                          </div>
                        </Col>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/add-process`}>
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
                    {process && process.length && (
                      <Table
                        className="overflow-auto"
                        columns={columns}
                        dataSource={process || []}
                        pagination={pagination}
                        onChange={handleTableChange}
                        rowKey={"role_id"}
                        // id="role_id"
                      />
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

export default Process;
