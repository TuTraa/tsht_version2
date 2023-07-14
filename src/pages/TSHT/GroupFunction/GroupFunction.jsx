import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Card, CardHeader, CardBody, Col, Container, Row } from "reactstrap";
import {
  getAPIListGroupFunction,
  getAPIDeleteGroupFunction,
} from "../../../helpers/fakebackend_helper";
import { Link } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { Table, Spin } from "antd";
import { toast } from "react-toastify";
import ToastCustom from "../../../Components/Common/Toast";
import DeleteModal from "../../../Components/Common/DeleteModal";

const GroupFunction = () => {
  document.title = "Nhóm quyền | Toà Soạn Hội Tụ";
  const [groupFunctionList, setGroupFunctionList] = useState();
  const [groupFunctionId, setGroupFuntionId] = useState({});
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (group_function_id) => {
    setGroupFuntionId(group_function_id);
    setDeleteModal(true);
  };
  const handleDeleteOrder = () => {
    if (groupFunctionId) {
      const group_function_id = groupFunctionId;
      getAPIDeleteGroupFunction(group_function_id).then((r) => {
        if (r.status > 0) {
          ToastCustom("Xoá nhóm quyền thành công", "success");
          setReload(!reload);
        } else {
          ToastCustom("Xoá nhóm quyền thất bại", "fail");
        }
      });
      setDeleteModal(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Nhóm quyền",
        dataIndex: "group_name",
        width: "10%",
        render: (group_name) => (
          <Link to="#" className="fw-medium link-primary">
            {group_name}
          </Link>
        ),
      },
      {
        title: "Ký hiệu",
        dataIndex: "group_short_name",
        width: "5%",
        render: (group_short_name) => <span>{group_short_name}</span>,
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        width: "20%",
        render: (description) => <span>{description}</span>,
      },

      {
        title: "Thao tác",
        dataIndex: "group_id",
        width: "10%",
        render: (group_id) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit">
                <Link
                  to={`/update-group-function/${group_id}`}
                  className="text-primary d-inline-block edit-item-btn"
                >
                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>

              <li className="list-inline-item">
                <Link
                  to={`/setting-group-function/${group_id}`}
                  className="text-primary d-inline-block edit-item-btn"
                  onClick={() => {}}
                >
                  <i className="ri-settings-5-line fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );
  useEffect(() => {
    getAPIListGroupFunction().then((res) => {
      if (res.data && res.status > 0) {
        setGroupFunctionList(res.data);
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
  return (
    <>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteOrder}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid={true}>
          <BreadCrumb title="Nhóm quyền" pageTitle="Nhóm quyền" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-sm">
                      <h5 className="card-title mb-0">Danh sách nhóm quyền</h5>
                    </div>

                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/add-group-function`}>
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
                    {groupFunctionList && groupFunctionList.length ? (
                      <Table
                        className="overflow-auto"
                        columns={columns}
                        dataSource={groupFunctionList || []}
                        pagination={false}
                        rowKey={"group_id"}
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

export default GroupFunction;
