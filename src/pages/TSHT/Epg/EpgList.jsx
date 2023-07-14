import React, { useContext, useEffect, useRef, useState } from "react";
import "./styles.css";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  DatePicker,
} from "antd";
import { Link, useParams } from "react-router-dom";
import moment from "moment/moment";
import {
  getAPIEpgGetListByChannelId,
  updateEPGList,
} from "../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import ToastCustom from "../../../Components/Common/Toast";
import "dayjs/locale/vi";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "date" ? (
      <DatePicker
        style={{ width: "100%" }}
        format="HH:mm DD/MM/YYYY"
        showTime={
          {
            // defaultValue: moment("00:00:00", "HH:mm:ss"),
          }
        }
        initialValues={record[dataIndex]}
      />
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Nhập ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const EpgList = (props) => {
  const { filterDate, reload, setReLoad } = props;
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [editingKey, setEditingKey] = useState("");
  useEffect(() => {
    getAPIEpgGetListByChannelId(
      0,
      -1,
      id,
      filterDate ? moment(filterDate.$d).format("YYYY-MM-DD") : ""
    ).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setData(
          res.data.list.map((e) => {
            const start = new Date(e.start_time).toISOString();
            const end = new Date(e.end_time).toISOString();
            return {
              ...e,
              start_time: dayjs(start),
              end_time: dayjs(end),
              key: uuidv4(),
            };
          })
        );
      } else {
        setData([]);
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
  }, [filterDate, reload]);

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      //console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const columns = [
    {
      title: "STT",
      className: "text-center",
      width: "5%",
      render: (record, row, index) => ({
        children: index + 1,
        props: {
          className: "text-center",
        },
      }),
    },
    {
      title: "Chương trình",
      dataIndex: "program_name",
      width: "17%",
      editable: true,
      inputType: "text",
      render: (value) => (
        <Link to="#" className="fw-medium link-primary">
          {value}
        </Link>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "program_description",
      width: "23%",
      editable: true,
      inputType: "text",
      render: (value) => (
        <Link to="#" className="fw-medium link-primary">
          {value}
        </Link>
      ),
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_time",
      width: "17%",
      editable: true,
      inputType: "date",
      render: (value) => {
        return (
          <span>{moment(value.toString()).format("DD/MM/YYYY h:mm a")}</span>
        );
      },
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_time",
      width: "17%",
      editable: true,
      inputType: "date",
      render: (value) => {
        return (
          <span>{moment(value.toString()).format("DD/MM/YYYY h:mm a")}</span>
        );
      },
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      width: "10%",
      render: (value) => (
        <Link to="#" className="fw-medium link-primary">
          {value}
        </Link>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Lưu
            </Typography.Link>
            <Popconfirm
              title="Bạn chắc chứ?"
              onConfirm={cancel}
              okText={"Đồng ý"}
              cancelText={"Hủy bỏ"}
            >
              <a>Thoát</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              {/*<i className="ri-pencil-fill fs-16"></i>*/}
              <Link
                to={`#`}
                className="text-primary d-inline-block edit-item-btn"
              >
                <i className="ri-pencil-fill fs-16"></i>
              </Link>
            </Typography.Link>
            <Popconfirm
              title="Bạn muốn xóa?"
              onConfirm={() => handleDelete(record.key)}
              okText={"Đồng ý"}
              cancelText={"Hủy bỏ"}
            >
              <Link
                to="#"
                className="text-danger d-inline-block remove-item-btn"
              >
                <i className="ri-delete-bin-5-fill fs-16"></i>
              </Link>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const handleAdd = () => {
    const newData = {
      key: uuidv4(),
      program_name: ``,
      program_description: "",
      start_time: dayjs(),
      end_time: dayjs(),
      duration: "",
      live_channel_id: id,
      broadcast_date: dayjs(filterDate).toISOString(),
      //user_create_id: 1, //// mai xoa di
    };
    setData([...data, newData]);
  };

  const handleUpdateData = () => {
    var convert_data = data.map((e) => {
      return {
        key: e.key,
        program_name: e.program_name,
        program_description: e.program_description,
        start_time: dayjs(e.start_time).format("YYYY-MM-DDTHH:mm:ss"),
        end_time: dayjs(e.end_time).format("YYYY-MM-DDTHH:mm:ss"),
        duration: e.duration,
        live_channel_id: e.live_channel_id,
        broadcast_date: e.broadcast_date,
        //user_create_id: 1, //// mai xoa di
      };
    });

    updateEPGList(convert_data).then((res) => {
      if (res.status > 0) {
        ToastCustom("Cập nhật kênh thành công", "success");
        setReLoad(!reload);
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
  return (
    <Form form={form} component={false}>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Thêm mới
      </Button>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        // pagination={{
        //     onChange: cancel,
        // }}
        pagination={false}
      />
      <div className="hstack gap-2 justify-content-end m-lg-3">
        <button
          type="submit"
          className="btn btn-success"
          onClick={handleUpdateData}
        >
          Lưu Tất Cả
        </button>
      </div>
    </Form>
  );
};
export default EpgList;
