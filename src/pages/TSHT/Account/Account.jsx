import UiContent from "../../../Components/Common/UiContent";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  Alert,
  Card,
  CardHeader,
  CardBody,
  Col,
  Container,
  Row,
} from "reactstrap";
import {
  getAPIDeleteTag,
  getAPIListTag,
  getAPIListAccount,
  searchGetAPIListAccount,
  getAPIDeleteAccount,
} from "../../../helpers/fakebackend_helper";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";

import { Link } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { Table, Center } from "antd";
import { toast, ToastContainer } from "react-toastify";
import ToastCustom from "../../../Components/Common/Toast";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { Input } from "antd";
import { Spin } from "antd";
const { Search } = Input;
const Account = () => {
  document.title = "Danh sách tài khoản | Toà Soạn Hội Tụ";
  const [accountList, setAccountList] = useState();
  const [accountId, setAcccountId] = useState({});
  const [searchKey, setSearchKey] = useState();
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const onClickDelete = (account_id) => {
    setAcccountId(account_id);
    setDeleteModal(true);
  };
  const handleDeleteOrder = () => {
    if (accountId) {
      const user_id = accountId;
      getAPIDeleteAccount(user_id).then((r) => {
        if (r.status > 0) {
          ToastCustom("Xoá tài khoản thành công", "success");
          setReload(!reload);
        } else {
          ToastCustom("Xoá tài khoản thất bại", "fail");
        }
      });
      setDeleteModal(false);
    }
  };
  const handleTableChange = (pagination, filters) => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListAccount(offset, pagination.pageSize, searchKey).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setAccountList(res.data.list);
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
        setAccountList([]);
      }
    });
  };
  const columns = useMemo(
    () => [
      {
        title: "Tên tài khoản",
        dataIndex: "user_name",
        width: "10%",
        render: (user_name) => (
          <Link to="#" className="fw-medium link-primary">
            {user_name}
          </Link>
        ),
      },
      {
        title: "Chức danh",
        dataIndex: "department_name",
        width: "20%",
        render: (department_name) => <span>{department_name}</span>,
      },
      {
        title: "Chuyên mục",
        dataIndex: "category_list",
        width: "30%",
        render: (category_list) => {
          category_list = JSON.parse(category_list);
          return (
            <div style={{ display: "flex", gap: "5px", flexFlow: "wrap" }}>
              {category_list.map((e, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: "#DCFBEA",
                    border: "1px solid #DCFBEA",
                    borderRadius: "20px",
                    padding: "8px 16px",
                  }}
                >
                  {e.category_name}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        width: "15%",
        render: (status) => {
          if (status === 1) {
            return (
              <span
                style={{
                  backgroundColor: "#DCFBEA",
                  border: "1px solid #DCFBEA",
                  borderRadius: "20px",
                  padding: "8px 16px",
                }}
              >
                Hoạt Động
              </span>
            );
          } else {
            return (
              <span
                style={{
                  backgroundColor: "#E0E2E7",
                  border: "1px solid #E0E2E7",
                  borderRadius: "20px",
                  padding: "8px 16px",
                }}
              >
                Không Hoạt Động
              </span>
            );
          }
        },
      },
      {
        title: "Thao tác",
        dataIndex: "user_id",
        width: "10%",
        render: (user_id) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit">
                <Link
                  to={`/update-account/${user_id}`}
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
                    onClickDelete(user_id);
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
  useEffect(() => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListAccount(offset, pagination.pageSize, searchKey).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setAccountList(res.data.list);
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
        setAccountList([]);
      }
    });
  }, [reload]);
  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      setReload(searchKey);
      setPagination({
        current: 1,
        pageSize: 10,
      });
    }, 500);

    setTimeoutId(newTimeoutId);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [searchKey]);
  return (
    <>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteOrder}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid={true}>
          <BreadCrumb
            title="Danh sách tài khoản"
            pageTitle="Danh sách tài khoản"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-sm">
                      <h5 className="card-title mb-0">Danh sách tài khoản</h5>
                    </div>

                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/add-account`}>
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
                  <Row className="mt-3">
                    <div className="col-3">
                      <Input
                        placeholder="Tìm kiếm"
                        onChange={(e) => {
                          if (e.target.value != undefined) {
                            setSearchKey(e.target.value);
                          } else {
                            setSearchKey("");
                          }
                        }}
                      ></Input>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    {accountList ? (
                      <Table
                        className="overflow-auto"
                        columns={columns}
                        dataSource={accountList || []}
                        pagination={pagination}
                        onChange={handleTableChange}
                        rowKey={"user_id"}
                        locale={{
                          emptyText: () => <a>Không có dữ liệu</a>,
                        }}
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

export default Account;
