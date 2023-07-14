import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, { useEffect, useMemo, useState } from "react";
import {
  getAPIDeleteDepartment,
  getAPIDeleteTag,
  getAPIListCategory,
  getAPIListDepartment,
  getAPIListTag,
} from "../../../helpers/fakebackend_helper";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteModal from "../../../Components/Common/DeleteModal";
import TableContainer from "../../../Components/Common/TableContainer";
import DataTable from "react-data-table-component";
import { Table } from "antd";
import ToastCustom from "../../../Components/Common/Toast";
import Loading from "../../../Components/Common/Loading";
const Department = () => {
  document.title = "Phòng ban | Toà Soạn Hội Tụ";

  const [departmentList, setDepartmentList] = useState();
  const [departmentId, setDepartmentId] = useState({});
  const [loading, setLoading] = useState(true);

  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const onClickDelete = (department_id) => {
    setDepartmentId(department_id);
    setDeleteModal(true);
  };
  const handleDeleteOrder = () => {
    if (departmentId) {
      const deparment_id = departmentId;
      getAPIDeleteDepartment(deparment_id).then((r) => {
        if (r.status > 0) {
          ToastCustom("Xoá phòng ban thành công", "success");
          setReload(!reload);
        } else {
          ToastCustom("Xoá phòng ban thất bại", "fail");
        }
      });
      setDeleteModal(false);
    }
  };
  const handleTableChange = (pagination, filters) => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListDepartment(offset, pagination.pageSize).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setDepartmentList(res.data.list);
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
    getAPIListDepartment(offset, pagination.pageSize).then((res) => {
      if (res.data && res.data && res.status > 0) {
        setDepartmentList(res.data.list);
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
        title: "Tên phòng ban",
        dataIndex: "department_name",
        width: "80%",
        render: (tag_name) => (
          <Link to="#" className="fw-medium link-primary">
            {tag_name}
          </Link>
        ),
      },
      {
        title: "Thao tác",
        dataIndex: "department_id",
        width: "15%",
        render: (department_id) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit">
                <Link
                  to={`/update-department/${department_id}`}
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
                    onClickDelete(department_id);
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
          <BreadCrumb title="Phòng ban" pageTitle="Home" />
          <Row>
            <Col lg={12}>
              <Card id="orderList">
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-sm">
                      <h5 className="card-title mb-0">Danh sách phòng ban</h5>
                    </div>
                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/add-department`}>
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
                    {departmentList && departmentList.length && !loading ? (
                      <Table
                        className="overflow-auto"
                        columns={columns}
                        dataSource={departmentList || []}
                        pagination={pagination}
                        onChange={handleTableChange}
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

export default Department;
