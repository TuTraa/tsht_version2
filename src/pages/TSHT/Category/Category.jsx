import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, { useEffect, useState } from "react";
import {
  getAPIDeleteCategory,
  getAPIListCategory,
  getAPITreeListCategory,
} from "../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { Table } from "antd";
import ToastCustom from "../../../Components/Common/Toast";
import "./category.scss";
import Loading from "../../../Components/Common/Loading";
const Category = () => {
  const [categoryList, setCategoryList] = useState();
  const [categoryId, setcategoryId] = useState({});
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const onClickDelete = (department_id) => {
    setcategoryId(department_id);
    setDeleteModal(true);
  };
  const handleDeleteCategory = () => {
    if (categoryId) {
      const category_id = categoryId;
      getAPIDeleteCategory(category_id).then((r) => {
        if (r.status && r.status > 0) {
          ToastCustom("Xoá chuyên mục thành công", "success");
          setReload(!reload);
        } else {
          ToastCustom(r.message && r.message, "fail");
        }
      });
      setDeleteModal(false);
    }
  };
  const handleTableChange = (pagination, filters) => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPITreeListCategory(offset, pagination.pageSize).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setCategoryList(res.data.list);
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
  };
  useEffect(() => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPITreeListCategory(offset, pagination.pageSize).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setCategoryList(res.data.list);
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
  const columns = [
    {
      title: "Chuyên mục",
      dataIndex: "category_name",
      width: "80%",
      render: (category_name) => (
        <Link to="#" className="fw-medium link-primary">
          {category_name}
        </Link>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "category_id",
      width: "15%",
      render: (category_id) => {
        return (
          <ul className="list-inline hstack gap-2 mb-0">
            <li className="list-inline-item edit">
              <Link
                to={`/update-category/${category_id}`}
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
                  onClickDelete(category_id);
                }}
              >
                <i className="ri-delete-bin-5-fill fs-16"></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];
  const sencondColumns = [
    {
      dataIndex: "category_name",
      width: "80%",
      render: (category_name) => (
        <Link
          to="#"
          style={{ marginLeft: "4%" }}
          className="fw-medium link-primary"
        >
          {category_name}
        </Link>
      ),
    },
    {
      dataIndex: "category_id",
      width: "15%",
      render: (category_id) => {
        return (
          <ul className="list-inline hstack gap-2 mb-0">
            <li className="list-inline-item edit">
              <Link
                to={`/update-category/${category_id}`}
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
                  onClickDelete(category_id);
                }}
              >
                <i className="ri-delete-bin-5-fill fs-16"></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];

  const firstExpandedRow = (record, index, indent, expanded) => {
    return (
      record.list_categories_lv2.length > 0 && (
        <Table
          showHeader={false}
          rowClassName="custom-row"
          rowKey={(e) => e.category_id}
          dataSource={record.list_categories_lv2}
          expandable={{
            expandedRowRender: secondExpandedRow,
            rowExpandable: (record) => record.list_categories_lv3.length > 0,
          }}
          pagination={false}
          key={(e) => e.category_id}
          columns={columns}
        />
      )
    );
  };
  const secondExpandedRow = (record, index, indent, expanded) => {
    return (
      record.list_categories_lv3.length > 0 && (
        <Table
          showHeader={false}
          rowClassName="custom-row"
          rowKey={(e) => e.category_id}
          dataSource={record.list_categories_lv3}
          pagination={false}
          key={(e) => e.category_id}
          columns={sencondColumns}
        />
      )
    );
  };

  document.title = "Chuyên mục | Toà Soạn Hội Tụ";
  return (
    <>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCategory}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid>
          <BreadCrumb title="Chuyên mục" pageTitle="Home" />
          <Row>
            <Col lg={12}>
              <Card id="orderList">
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/add-category`}>
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
                    {categoryList && categoryList.length && !loading ? (
                      <Table
                        dataSource={categoryList || []}
                        columns={columns}
                        rowKey={(e) => e.category_id}
                        pagination={pagination}
                        onChange={handleTableChange}
                        key="b"
                        expandable={{
                          expandedRowRender: firstExpandedRow,
                          rowExpandable: (record) =>
                            record.list_categories_lv2.length > 0,
                        }}
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

export default Category;
