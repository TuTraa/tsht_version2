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
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";

import React, { useEffect, useMemo, useState } from "react";
import { Table, Center, Spin, Input, Menu } from "antd";
import { toast, ToastContainer } from "react-toastify";
import ToastCustom from "../../../Components/Common/Toast";
import DeleteModal from "../../../Components/Common/DeleteModal";
import {
  getAPIListFunction,
  deleteFunction,
} from "../../../helpers/fakebackend_helper";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../../../Components/Common/Loading";

const Function = () => {
  document.title = "Chức năng hệ thống | Toà Soạn Hội Tụ";
  const [functionList, setFunctionList] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);

  const deleteFunctionAction = (function_id) => {
    deleteFunction(function_id).then((res) => {
      if (res.data && res.status > 0) {
        ToastCustom("Xoá chức năng thành công", "success");
        setReload(!reload);
      } else {
        ToastCustom("Xoá chức năng thất bại", "fail");
      }
    });
  };

  useEffect(() => {
    getAPIListFunction().then((res) => {
      if (res.data && res.status > 0) {
        const temp = res.data.map((e) => {
          return {
            ...e,
            key: uuidv4(),
          };
        });
        const parentArray = new Set([]);
        const result = [];
        temp.forEach((e, i) => parentArray.add(e.parent_id));
        const parentIdList = Array.from(parentArray);
        for (var index = 0; index < temp.length; index++) {
          const item = temp[index];
          if (item.parent_id === 0) {
            const list = [];
            temp.forEach((e, i) => {
              if (e.parent_id === item.function_id) {
                list.push(e);
              }
            });
            result.push({
              ...item,
              list_function_lv2: list,
            });
          }
        }

        setFunctionList(result);
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
  // const onOpenChange = (items) => {
  //   const latestOpenKey = items.find((key) => openKeys.indexOf(key) === -1);
  //   const rootKeys = functionList.map((e) => e.key);
  //   if (rootKeys.indexOf(latestOpenKey) === -1) {
  //     setOpenKeys(items);
  //   } else {
  //     setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  //   }
  // };
  const columns = [
    {
      title: "Chức năng",
      dataIndex: "function_name",
      width: "70%",
      render: (function_name) => (
        <Link to="#" className="fw-medium link-primary">
          {function_name}
        </Link>
      ),
    },
    {
      title: "Hiển thị",
      dataIndex: "is_display",
      width: "15%",
      render: (is_active) =>
        is_active === 1 ? (
          <span
            style={{
              backgroundColor: "#DCFBEA",
              border: "1px solid #DCFBEA",
              borderRadius: "20px",
              padding: "8px 16px",
            }}
          >
            Có
          </span>
        ) : (
          <span
            style={{
              backgroundColor: "#E0E2E7",
              border: "1px solid #E0E2E7",
              borderRadius: "20px",
              padding: "8px 16px",
            }}
          >
            Không
          </span>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      width: "15%",
      render: (is_active) =>
        is_active === 1 ? (
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
        ) : (
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
        ),
    },
    {
      title: "Thao tác",
      dataIndex: "function_id",
      width: "15%",
      render: (value) => {
        return (
          <ul className="list-inline hstack gap-2 mb-0">
            <li className="list-inline-item edit">
              <Link
                to={`/edit-function/${value}`}
                className="text-primary d-inline-block edit-item-btn"
              >
                <i className="ri-pencil-fill fs-16"></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];
  const columnsLv2 = [
    {
      title: "Chức năng",
      dataIndex: "function_name",
      width: "66.5%",
      render: (function_name) => (
        <Link
          to="#"
          className="fw-medium link-primary"
          style={{ marginLeft: "4%" }}
        >
          {function_name}
        </Link>
      ),
    },
    {
      title: "Hiển thị",
      dataIndex: "is_display",
      width: "14.5%",
      render: (is_active) =>
        is_active === 1 ? (
          <span
            style={{
              backgroundColor: "#DCFBEA",
              border: "1px solid #DCFBEA",
              borderRadius: "20px",
              padding: "8px 16px",
            }}
          >
            Có
          </span>
        ) : (
          <span
            style={{
              backgroundColor: "#FC957F",
              border: "1px solid #FC957F",
              borderRadius: "20px",
              padding: "8px 16px",
            }}
          >
            Không
          </span>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      width: "14.6%",
      render: (is_active) =>
        is_active === 1 ? (
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
        ) : (
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
        ),
    },
    {
      title: "Thao tác",
      dataIndex: "function_id",
      width: "15%",
      render: (value) => {
        return (
          <ul className="list-inline hstack gap-2 mb-0">
            <li className="list-inline-item edit">
              <Link
                to={`/edit-function/${value}`}
                className="text-primary d-inline-block edit-item-btn"
              >
                <i className="ri-pencil-fill fs-16"></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];
  const firstExpandedRow = (record) => {
    return (
      record.list_function_lv2.length > 0 && (
        <Table
          showHeader={false}
          rowClassName="custom-row"
          rowKey={(e) => e.function_id}
          dataSource={record.list_function_lv2}
          pagination={false}
          key={(e) => e.function_id}
          columns={columnsLv2}
        />
      )
    );
  };
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb
            title="Chức năng hệ thống"
            pageTitle="Chức năng hệ thống"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-sm">
                      <h5 className="card-title mb-0">
                        Danh sách chức năng hệ thống
                      </h5>
                    </div>
                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/add-function`}>
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
                  {functionList && functionList.length && !loading ? (
                    <Table
                      dataSource={functionList || []}
                      columns={columns}
                      rowKey={(e) => e.function_id}
                      key="b"
                      expandable={{
                        expandedRowRender: firstExpandedRow,
                        rowExpandable: (record) =>
                          record.list_function_lv2.length > 0,
                      }}
                    />
                  ) : (
                    <Loading />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Function;
