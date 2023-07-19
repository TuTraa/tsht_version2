import { Card, CardBody, Container } from "reactstrap";
import moment from "moment";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Table, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import {
  getArticlePriceList,
  articlePriceExportExcel,
  getArticleAuthorList,
  getArticleTypeList,
  getAPIListCategory,
} from "../../../helpers/fakebackend_helper";
import FilterQuery from "./FilterQuery";
import Loading from "../../../Components/Common/Loading";

const ArticlePrice = () => {
  const [articlePriceList, setArticlePriceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryAuthor, setQueryAuthor] = useState();
  const [queryType, setQueryType] = useState();
  const [queryCategory, setQueryCategory] = useState();
  const [queryFromDate, setQueryFromDate] = useState();
  const [queryToDate, setQueryToDate] = useState();

  const [query, setQuery] = useState();
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [valueCategory, setValueCategory] = useState();
  const getData = () => {
    getArticlePriceList(query).then((res) => {
      if (res.data && res.status > 0) {
        setArticlePriceList(res.data.list);
      } else {
        setArticlePriceList([]);
      }
      setLoading(false);
    });
  };
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);
  useEffect(() => {
    getArticlePriceList({
      offset: 0,
      limit: -1,
    }).then((res) => {
      if (res.data && res.status > 0) {
        setArticlePriceList(res.data.list);
      }
      setLoading(false);
    });
  }, []);
  const onChangeCategory = (newValue) => {
    if (newValue === undefined) {
      newValue = null;
    }

    setQuery({
      ...query,
      category_id: newValue === null ? "" : newValue,
    });
    setValueCategory(newValue);
    setSearchValue(newValue);

    // Tìm kiếm và mở rộng các nút cây liên quan
    const expandedKeys = optionsCategory

      .map((node) => {
        if (node.title.toLowerCase().includes(newValue.toLowerCase())) {
          return getParentKeys(node);
        }
        return null;
      })
      .flat()
      .filter((key) => key !== null);

    setExpandedKeys([...new Set(expandedKeys)]);
  };
  useEffect(() => {
    getData();
  }, [query]);
  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "article_title",
      key: "article_title",
      render: (text, record) => (
        <>
          <p>{text}</p>
          <p>Tác giả: {record.author}</p>
        </>
      ),
    },
    {
      title: "Chuyên mục",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Loại bài",
      dataIndex: "article_type_name",
      key: "article_type_name",
    },
    {
      title: "Nhuận bút",
      dataIndex: "",
      key: "price",
      render: (_, record) => (
        <>
          <p>Nội dung: {record.content_quality}</p>
          <p>Ảnh: {record.image_quality} </p>
          <p>Video: {record.video_quality} </p>
          <p>Khác: {record.other_quality}</p>
        </>
      ),
    },
    {
      title: "Ngày xuất bản",
      key: "action",
      render: (text) => <>{moment(text).format("DD/MM/YYYY hh:mm")}</>,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ];
  useEffect(() => {
    setLoading(true);
    getAPIListCategory(0, -1).then((res) => {
      var options = [];
      if (res.data && res.data.list && res.status > 0) {
        res.data.list.forEach((e) => {
          options.push({
            value: e.category_id,
            title: e.category_name,
            children: e.list_child_categories.map((x) => ({
              value: x.category_id,
              title: x.category_name,
            })),
          });
        });
      }
      setOptionsCategory(options);
    });

    const data = {
      author_id: queryAuthor ? queryAuthor : "",
      category_id: queryCategory ? queryCategory : "",
      article_type_id: queryType ? queryType : "",
      fromdate: queryFromDate ? queryFromDate : "",
      todate: queryToDate ? queryToDate : "",
      offset: 0,
      limit: -1,
    };
    setQuery(data);
  }, [queryAuthor, queryCategory, queryFromDate, queryType, queryToDate]);
  const handleExportExcel = () => {
    articlePriceExportExcel(query).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Thống Kê Nhuận Bút.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };
  // console.log("optionsCategory", optionsCategory);
  const getParentKeys = (node) => {
    const keys = [];
    if (node.children) {
      keys.push(node.value);
      node.children.forEach((child) => {
        keys.push(...getParentKeys(child));
      });
    } else {
      keys.push(node.value);
    }
    return keys;
  };



  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Thống kê nhuận bút" pageTitle="Nhuận bút" />
        <Card>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 30,
            }}
          >
            <FilterQuery
              type="text"
              apiFunction={getArticleAuthorList}
              value={"author"}
              setQuery={setQueryAuthor}
              textTypingSearch
            />
            <TreeSelect
              style={{ width: 200, height: 38 }}
              value={valueCategory}
              dropdownStyle={{
                maxHeight: 400,
                overflow: "auto",
              }}
              allowClear
              showSearch
              treeData={optionsCategory}
              treeDefaultExpandAll
              placeholder="Chuyên mục"
              onChange={onChangeCategory}
              filterTreeNode={(input, treeNode) =>
                treeNode.title.toLowerCase().includes(input.toLowerCase())
              }
            />
            <FilterQuery
              type="text"
              apiFunction={getArticleTypeList}
              value={"type"}
              setQuery={setQueryType}
            />
            <FilterQuery
              type="date"
              apiFunction={() => { }}
              value={"fromDate"}
              setQuery={setQueryFromDate}
            />
            <FilterQuery
              type="date"
              apiFunction={() => { }}
              value={"toDate"}
              setQuery={setQueryToDate}
            />
            <button
              type="button"
              className="btn btn-success"
              id="create-btn"
              onClick={handleExportExcel}
            >
              Xuất excel
            </button>
          </div>
          <CardBody>
            {loading ? (
              <Loading />
            ) : (
              // <Table dataSource={articlePriceList} columns={columns} />
              articlePriceList && articlePriceList.length > 0 ? (
                <Table
                  className="overflow-auto"
                  columns={columns}
                  dataSource={articlePriceList}
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
            )
            }
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ArticlePrice;
