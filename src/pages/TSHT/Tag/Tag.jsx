import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, { useEffect, useMemo, useState } from "react";
import {
  getAPIDeleteTag,
  getAPIListTag,
} from "../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteModal from "../../../Components/Common/DeleteModal";
import TableContainer from "../../../Components/Common/TableContainer";
import DataTable from "react-data-table-component";
import { Table, Input } from "antd";
import ToastCustom from "../../../Components/Common/Toast";
import Loading from "../../../Components/Common/Loading";
const Tag = () => {
  const [tagList, setTagList] = useState();
  const [tagId, setTagId] = useState({});
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [queryString, setQueryString] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const onClickDelete = (tag_id) => {
    setTagId(tag_id);
    setDeleteModal(true);
  };
  const handleDeleteOrder = () => {
    if (tagId) {
      const tag_id = tagId;
      getAPIDeleteTag(tag_id).then((r) => {
        if (r.status > 0) {
          ToastCustom("Xoá tag thành công", "success");
          setReload(!reload);
        } else {
          ToastCustom("Xoá tag thất bại", "fail");
        }
      });
      setDeleteModal(false);
    }
  };
  const handleTableChange = (pagination, filters) => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListTag(offset, pagination.pageSize, queryString).then((res) => {
      if (res.data && res.data?.list && res.status > 0) {
        setTagList(res.data.list);
        setPagination({ ...pagination, total: res.data.total });
      } else if (res.status < 0) {
        ToastCustom("Không tìm thấy dữ liệu!", "fail");
        setTagList([]);
      }
    });
  };
  useEffect(() => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListTag(offset, pagination.pageSize, queryString).then((res) => {
      if (res.data && res.data?.list && res.status > 0) {
        setTagList(res.data.list);
        setPagination({ ...pagination, total: res.data.total });
      } else {
        ToastCustom("Không tìm thấy dữ liệu!", "fail");
        setTagList([]);
      }
      setLoading(false);
    });
  }, [reload]);

  const columns = useMemo(
    () => [
      {
        title: "Tên tag",
        dataIndex: "tag_name",
        width: "80%",
        render: (tag_name) => (
          <Link to="#" className="fw-medium link-primary">
            {tag_name}
          </Link>
        ),
      },
      {
        title: "Thao tác",
        dataIndex: "tag_id",
        width: "15%",
        render: (tag_id) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit">
                <Link
                  to={`/update-tag/${tag_id}`}
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
                    onClickDelete(tag_id);
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
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      setReload(queryString);
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
  }, [queryString]);

  return (
    <>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteOrder}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid>
          <BreadCrumb title="Tag" pageTitle="Home" />
          <Row>
            <Col lg={12}>
              <Card id="orderList">
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-sm">
                      <h5 className="card-title mb-0">Danh sách tag</h5>
                    </div>
                    <Col className="col-3">
                      <Input
                        placeholder="Tìm kiếm"
                        onChange={(e) => {
                          if (e.target.value != undefined) {
                            setQueryString(e.target.value);
                          } else {
                            setQueryString("");
                          }
                        }}
                      ></Input>
                    </Col>
                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/add-tag`}>
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
                    {tagList && !loading ? (
                      <Table
                        className="overflow-auto"
                        columns={columns}
                        dataSource={tagList || []}
                        pagination={pagination}
                        onChange={handleTableChange}
                        rowKey={"tag_id"}
                        locale={{
                          emptyText: () => <a>Không có dữ liệu</a>,
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

export default Tag;
