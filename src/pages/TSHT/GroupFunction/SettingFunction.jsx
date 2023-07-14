import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Label,
  Row,
  FormFeedback,
  CardHeader,
} from "reactstrap";
import { List, Typography, Input, Checkbox, Table } from "antd";
import {
  getAPIListFunction,
  getAPIListGroupFunction,
  getAPIGroupFunction,
  updateAPIFunctionGroup,
} from "../../../helpers/fakebackend_helper";
import ToastCustom from "../../../Components/Common/Toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../Components/Common/Loading";
import Title from "antd/es/typography/Title";

const SettingFunction = () => {
  const [permision, setPermistion] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [listFunction, setListFunction] = useState();
  const getListFunction = async () => {
    const res = await getAPIGroupFunction(id);
    if (res && res.data && res.status > 0) {
      setListFunction(res.data);
      setLoading(false);
    }
  };
  useEffect(() => {
    getAPIListGroupFunction().then((res) => {
      if (res.data && res.status > 0) {
        var data = res.data.filter((e) => e.group_id == id);
        if (data.length > 0) {
          setPermistion(data[0]);
          getListFunction();
        }
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
  }, [id]);
  const onChangeFunction = async (e, item) => {
    try {
      const data = {
        group_id: id,
        function_id: item.function_id,
      };
      const res = await updateAPIFunctionGroup(
        e.target.checked ? "insert" : "delete",
        data
      );
      if (res && res.status > 0) {
        setLoading(true);
        getListFunction();
        ToastCustom(
          e.target.checked
            ? "Thêm chức năng thành công"
            : "Hủy chức năng thành công",
          "success"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const columns = [
    {
      dataIndex: "function_name",
      width: "80%",
      render: (function_name) => (
        <Link
          to="#"
          style={{ marginLeft: "4%" }}
          className="fw-medium link-primary"
        >
          {function_name}
        </Link>
      ),
    },
    {
      dataIndex: "",
      width: "15%",
      render: (record) => {
        return (
          <Checkbox
            onChange={(e) => onChangeFunction(e, record)}
            defaultChecked={record.isShare}
          ></Checkbox>
        );
      },
    },
  ];
  const firstExpandedRow = (record, index, indent, expanded) => {
    return (
      record.child_functions.length > 0 && (
        <Table
          showHeader={false}
          rowClassName="custom-row"
          rowKey={(e) => e.function_id}
          dataSource={record.child_functions}
          expandable={{
            expandedRowRender: secondExpandedRow,
            rowExpandable: (record) => record.child_functions.length > 0,
          }}
          pagination={false}
          key={(e) => e.function_id}
          columns={columns}
        />
      )
    );
  };
  const secondExpandedRow = (record, index, indent, expanded) => {
    return (
      record.child_functions.length > 0 && (
        <Table
          showHeader={false}
          rowClassName="custom-row"
          rowKey={(e) => e.function_id}
          dataSource={record.child_functions}
          pagination={false}
          key={(e) => e.function_id}
          columns={columns}
        />
      )
    );
  };
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb
            title="Thêm chức năng nhóm quyền"
            pageTitle="Danh sách nhóm quyền"
            previousLink="/list-group-function"
          />
          <Card>
            <CardHeader>
              <Title level={2}>{permision ? permision.group_name : ""}</Title>
            </CardHeader>
            <CardBody>
              <div
                style={{
                  marginTop: 30,
                }}
              >
                {loading ? (
                  <Loading />
                ) : (
                  <Table
                    showHeader={false}
                    dataSource={listFunction}
                    columns={columns}
                    rowKey={(e) => e.function_id}
                    key="b"
                    expandable={{
                      expandedRowRender: firstExpandedRow,
                      rowExpandable: (record) =>
                        record.child_functions.length > 0,
                    }}
                  />
                )}
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default SettingFunction;
