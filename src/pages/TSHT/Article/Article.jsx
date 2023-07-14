import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import React, { useEffect, useMemo, useState } from "react";
import {
  downloadDocumentArticle,
  getAPIDeleteArticle,
  getAPIListArticle,
  getAPIListAuthor,
  getAPIListCategory,
  getAPITreeListCategory,
} from "../../../helpers/fakebackend_helper";
import ToastCustom from "../../../Components/Common/Toast";
import { toast } from "react-toastify";
import * as Antd from "antd";
import { DatePicker, Table, TreeSelect, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";
import { Spin } from "antd/lib";
import DeleteModal from "../../../Components/Common/DeleteModal";

const SpanArticle = styled.p`
  font-size: 12px;
  color: #6f727a;
`;
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

const statusListType = [
  {
    value: 1,
    label: "Bài nháp",
  },
  {
    value: 2,
    label: "Chờ duyệt",
  },
  {
    value: 3,
    label: "Chờ xuất bản",
  },
  {
    value: 4,
    label: "Đã xuất bản",
  },
  {
    value: 5,
    label: "Hạ xuất bản",
  },
  {
    value: 6,
    label: "Hủy",
  },
];

const articleListType = [
  {
    value: 1,
    label: "Bài thường",
  },
  {
    value: 2,
    label: "E-magazine",
  },
  {
    value: 3,
    label: "Bài video",
  },
  {
    value: 4,
    label: "Bài audio",
  },
  {
    value: 5,
    label: "Báo in",
  },
];

const Article = () => {
  document.title = "Danh sách bài viết | Toà Soạn Hội Tụ";

  const [articleList, setArticleList] = useState();
  const [articleId, setArticleId] = useState({});
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [optionsCategory, setOptionsCategory] = useState([]);
  const navigate = useNavigate();
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  let keyWord = "";
  const [paginationFilter, setPaginationFilter] = useState({
    current: 1,
    pageSize: 10,
    _article_title: "",
    _category_id: "",
    _author: "",
    _todate: "",
    _fromdate: "",
    lst_status: "",
    _article_type_id: "",
  });
  const onClickDelete = (article_id) => {
    setArticleId(article_id);
    setDeleteModal(true);
  };
  const [valueCategory, setValueCategory] = useState();
  const [valueAuthor, setValueAuthor] = useState([]);
  const onChangeCategory = (newValue) => {
    if (newValue === undefined) {
      newValue = null;
    }
    setPaginationFilter({
      ...paginationFilter,
      _category_id: newValue === null ? "" : newValue,
      current: 1,
    });
    setValueCategory(newValue);
    setReload(!reload);
  };
  const onChangeAuthor = (newValue) => {
    if (newValue === undefined) {
      newValue = null;
    }
    setPaginationFilter({
      ...paginationFilter,
      _author: newValue === null ? "" : newValue,
      current: 1,
    });
    setValueAuthor(newValue);
    setReload(!reload);
  };
  const onChangeFromDate = (dates, dateStrings) => {
    setPaginationFilter({
      ...paginationFilter,
      _fromdate: dateStrings !== "" ? dateStrings + " 00:00:00" : "",
      current: 1,
    });
    setReload(!reload);
  };
  const onChangeToDate = (dates, dateStrings) => {
    setPaginationFilter({
      ...paginationFilter,
      _todate: dateStrings !== "" ? dateStrings + " 00:00:00" : "",
      current: 1,
    });
    setReload(!reload);
  };

  const handleDeleteOrder = () => {
    if (articleId) {
      getAPIDeleteArticle(articleId).then((r) => {
        if (r.status > 0) {
          ToastCustom("Xoá bài viết thành công", "success");
          setReload(!reload);
        } else {
          ToastCustom("Xoá bài viết thất bại", "fail");
        }
      });
      setDeleteModal(false);
    }
  };

  const handleTableChange = (pagination, filters) => {
    setIsLoading(true);
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;

    getAPIListArticle(
      offset,
      paginationFilter.pageSize,
      paginationFilter._article_title,
      paginationFilter._category_id,
      paginationFilter._author,
      paginationFilter._todate,
      paginationFilter._fromdate,
      paginationFilter.lst_status,
      paginationFilter._article_type_id
    ).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setArticleList(res.data.list);
        setPaginationFilter({
          ...paginationFilter,
          current: pagination.current,
          total: res.data.total,
        });
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
      setIsLoading(false);
    });
  };
  useEffect(() => {
    getAPITreeListCategory(0, -1).then((res) => {
      var options = [];
      if (res.data && res.data.list && res.status > 0) {
        res.data.list.forEach((e) => {
          options.push({
            value: e.category_id,
            title: e.category_name,
            children: e.list_categories_lv2.map((x) => ({
              value: x.category_id,
              title: x.category_name,
              children: x.list_categories_lv3.map((y) => ({
                value: y.category_id,
                title: y.category_name,
              })),
            })),
          });
        });
      }
      setOptionsCategory(options);
    });

    getAPIListAuthor().then((res) => {
      if (res.data && res.status > 0) {
        var options = [];
        options.push({
          value: "",
          title: "Tất cả",
        });
        res.data.forEach((e) => {
          options.push({
            value: e.user_id,
            label: e.author_name,
          });
        });
      }
      setOptionsAuthor(options);
    });
  }, []);

  useEffect(() => {
    let offset =
      paginationFilter.current * paginationFilter.pageSize -
      paginationFilter.pageSize;
    setIsLoading(true);
    getAPIListArticle(
      offset,
      paginationFilter.pageSize,
      paginationFilter._article_title,
      paginationFilter._category_id,
      paginationFilter._author,
      paginationFilter._todate,
      paginationFilter._fromdate,
      paginationFilter.lst_status,
      paginationFilter._article_type_id
    ).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setArticleList(res.data.list);
        setPaginationFilter({ ...paginationFilter, total: res.data.total });
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
        setArticleList([]);
      }
      setIsLoading(false);
    });
  }, [reload]);
  const pArticle = {
    marginBottom: 5,
  };

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
    color: "#FFFFFF",
  };
  const columns = useMemo(
    () => [
      {
        title: "Tên bài viết",
        width: "35%",
        render: (record) => (
          <div
            className="d-flex flex-column"
            onClick={() => {
              navigate(`/update-article/${record.article_id}`, {
                state: {
                  type: record.article_type_id,
                },
              });
            }}
          >
            <p style={pArticle}>{record.article_title}</p>
            <SpanArticle style={{ marginBottom: 0 }}>
              {record.article_type_name}{" "}
              {record.created_date === null
                ? ""
                : `| ${moment(new Date(record.created_date)).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}`}
            </SpanArticle>
          </div>
        ),
      },
      {
        title: "Chuyên mục",
        width: "18%",
        render: (record) => (
          <div className="d-flex flex-column">
            <p style={pArticle}>{record.category_name}</p>
            <SpanArticle
              style={{
                color: "rgba(26, 114, 246, 0.8)",
                fontSize: "12px",
                fontWeight: 700,
                marginBottom: 0,
              }}
            >
              {(record.is_selected === 2 && "Tin tiêu điểm") ||
                (record.outstanding === 1 && "Tin nổi bật") ||
                ""}
            </SpanArticle>
          </div>
        ),
      },
      {
        title: "Tác giả",
        width: "16%",
        render: (record) => (
          <div className="d-flex flex-column">
            <p style={pArticle}>{record.author_name}</p>
            <SpanArticle style={{ minHeight: 18, marginBottom: 0 }}>
              {record.other_author?.trim().length >= 1 ? "Nhóm tác giả" : ""}
            </SpanArticle>
          </div>
        ),
      },
      {
        title: "Trạng thái",
        width: "15%",
        render: (record) => (
          <div className="d-flex flex-column" style={{ marginBottom: 0 }}>
            <StatusBtn
              style={
                (record.article_status_id == 1 && btnNew) ||
                (record.article_status_id == 2 && btnPending) ||
                (record.article_status_id == 3 && btnIsWaitApproved) ||
                (record.article_status_id == 4 && btnPublished) ||
                (record.article_status_id == 5 && btnDelete)
              }
            >
              {record.status}
            </StatusBtn>
            <SpanArticle style={{ marginBottom: 0 }}>
              {record.modified_date === null
                ? ""
                : moment(new Date(record.modified_date)).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}
            </SpanArticle>
          </div>
        ),
      },

      {
        title: "Thao tác",
        width: "8%",
        render: (record) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li
                className="list-inline-item edit"
                onClick={() => {
                  navigate(`/update-article/${record.article_id}`, {
                    state: {
                      type: record.article_type_id,
                    },
                  });
                }}
              >
                <Link className="text-primary d-inline-block edit-item-btn">
                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => {
                    onClickDelete(record.article_id);
                  }}
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
              {record.article_type_id === 1 && (
                <li className="list-inline-item">
                  <i
                    class="ri-download-line"
                    onClick={() => {
                      downloadDocumentArticle({
                        article_id: record.article_id,
                      }).then((res) => {
                        const url = window.URL.createObjectURL(new Blob([res]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute(
                          "download",
                          `${record.article_title}.doc`
                        );
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      });
                    }}
                  ></i>
                </li>
              )}
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
        <Container fluid={true}>
          <BreadCrumb title="Bài viết" pageTitle="Home" />
          <Row>
            <Col lg={12}>
              <Card id="orderList">
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-lg">
                      <Row style={{ marginBottom: "5px" }}>
                        <Col className="col-2">
                          <Antd.Input
                            placeholder="Tìm kiếm"
                            onChange={(e) => {
                              keyWord = e.target.value.toString();
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setPaginationFilter({
                                  ...paginationFilter,
                                  _article_title: keyWord,
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
                            value={valueCategory}
                            dropdownStyle={{
                              maxHeight: 400,
                              overflow: "auto",
                            }}
                            allowClear
                            treeData={optionsCategory}
                            treeDefaultExpandAll
                            placeholder="Chuyên mục"
                            onChange={onChangeCategory}
                          />
                        </Col>
                        <Col className="col-2">
                          <TreeSelect
                            style={{
                              width: "100%",
                            }}
                            value={valueAuthor}
                            dropdownStyle={{
                              maxHeight: 400,
                              overflow: "auto",
                            }}
                            allowClear
                            treeData={optionsAuthor}
                            treeDefaultExpandAll
                            placeholder="Tác giả"
                            onChange={onChangeAuthor}
                          />
                        </Col>

                        <Col className="col-2">
                          <Select
                            options={statusListType}
                            mode="multiple"
                            allowClear
                            style={{
                              width: "100%",
                            }}
                            placeholder="Trạng thái"
                            onChange={(e) => {
                              setPaginationFilter({
                                ...paginationFilter,
                                offset: 0,
                                lst_status:
                                  e.length > 0 ? JSON.stringify(e) : "",
                              });
                              setReload(!reload);
                            }}
                          ></Select>
                        </Col>
                        <Col className="col-2">
                          <Select
                            options={articleListType}
                            allowClear
                            style={{
                              width: "100%",
                            }}
                            placeholder="Loại bài"
                            onChange={(e) => {
                              setPaginationFilter({
                                ...paginationFilter,
                                offset: 0,
                                _article_type_id: e ? e : "",
                              });
                              setReload(!reload);
                            }}
                          ></Select>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="col-3">
                          <DatePicker
                            allowClear
                            onChange={onChangeFromDate}
                            placeholder="Từ ngày"
                            style={{ width: "100%" }}
                          />
                        </Col>
                        <Col className="col-3">
                          <DatePicker
                            allowClear
                            onChange={onChangeToDate}
                            placeholder="Đến ngày"
                            style={{ width: "100%" }}
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/add-article`}>
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
                      articleList && articleList.length ? (
                        <Table
                          className="overflow-auto"
                          columns={columns}
                          dataSource={articleList || []}
                          pagination={paginationFilter}
                          onChange={handleTableChange}
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

export default Article;
