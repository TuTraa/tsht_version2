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
  getAPIDeleteRole,
  getAPIListRole,
} from "../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { Table } from "antd";
import ToastCustom from "../../../Components/Common/Toast";

const Role = () => {
  document.title = "Quy trình | Toà Soạn Hội Tụ";
  const [role, setRole] = useState();
  const [roleId, setRoleId] = useState({});
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const onClickDelete = (role_id) => {
    setRoleId(role_id);
    setDeleteModal(true);
  };

  const handleDeleteOrder = () => {
    if (roleId) {
      const role_id = roleId;
      getAPIDeleteRole(role_id).then((r) => {
        if (r.status > 0) {
          ToastCustom("Xoá quy trình thành công", "success");
          setReload(!reload);
        } else {
          ToastCustom("Xoá quy trình thất bại", "fail");
        }
      });
      setDeleteModal(false);
    }
  };

  const handleTableChange = (pagination, filters) => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListRole(offset, pagination.pageSize).then((res) => {
      if (res.data && res.data && res.status > 0) {
        setRole(res.data.list);
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
    getAPIListRole(offset, pagination.pageSize).then((res) => {
      if (res.data && res.data && res.status > 0) {
        setRole(res.data.list);
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
        width: "25%",
        render: (role_name) => (
          <Link to="#" className="fw-medium link-primary">
            {role_name}
          </Link>
        ),
      },
      {
        title: "Mô tả",
        dataIndex: "role_description",
        width: "25%",
        render: (role_description) => (
          <Link to="#" className="fw-medium link-primary">
            {role_description}
          </Link>
        ),
      },
      {
        title: "Các bước",
        dataIndex: "role_step_list",
        width: "40%",
        render: (role_step_list) => {
          return (
            <div style={{ display: "flex", gap: "5px", flexFlow: "wrap" }}>
              {role_step_list.map((e, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: "rgb(220, 251, 234)",
                    border: "1px solid rgb(220, 251, 234)",
                    borderRadius: "8px",
                    padding: "2px 16px",
                    height: "30px",
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                >
                  {e.step_short_name}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        title: "Thao tác",
        dataIndex: "role_id",
        width: "10%",
        render: (role_id) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit">
                <Link
                  to={`/update-role/${role_id}`}
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
                      <div className="row">
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
                        <Link to={`/add-role`}>
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
                    {role && role.length && (
                      <Table
                        className="overflow-auto"
                        columns={columns}
                        dataSource={role || []}
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

export default Role;
