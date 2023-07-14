import { Card, CardBody, Col, Container, Label, Row } from "reactstrap";
import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useNavigate } from "react-router-dom";
import {
  Button,
  InputNumber,
  Form,
  Space,
  Select,
  Popconfirm,
  Input,
} from "antd";
import {
  getAPIListAccount,
  getAPIListAccountPermissiton,
  getAPIListArticleTypeAvailability,
  getAPIPostProcess,
} from "../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import { useForm } from "antd/es/form/Form";
import { arrayMoveImmutable } from "array-move";
import TextArea from "antd/es/input/TextArea";
import ToastCustom from "../../../Components/Common/Toast";
import { RequiredIcon } from "../../../Components/Common/RequiredIcon";

export const DragHandle = SortableHandle(() => (
  <span
    style={{
      cursor: "move",
    }}
  >
    ::
  </span>
));

const AddProcess = () => {
  let navigate = useNavigate();
  const [accountList, setAccountList] = useState();
  const [articleTypeList, setArticleTypeList] = useState();
  const [form] = useForm();
  const [listNumber, setListNumber] = useState([]);

  useEffect(() => {
    getAPIListAccountPermissiton(0, -1).then((res) => {
      if (res.data && res.data.list && res.status >= 0) {
        const options = [];
        res.data.list.forEach((e) => {
          options.push({
            value: e.user_id,
            label: e.user_name,
          });
        });
        setAccountList(options);
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
    getAPIListArticleTypeAvailability().then((res) => {
      if (res.data && res.status > 0) {
        const options = [];
        res.data.forEach((e) => {
          options.push({
            value: e.article_type_id,
            label: e.article_type_name,
          });
        });
        setArticleTypeList(options);
      }
    });
  }, []);

  const onFinish = (values) => {
    if (values._role_steps && values._role_steps.length > 0) {
      const arr = values._role_steps.map((role, index) => ({
        ...role,
        list_user_accept: "[" + role.list_user_accept.toString() + "]",
        step: index + 1,
      }));
      const role = {
        ...values._role,
        list_article_type:
          "[" + values._role.list_article_type.toString() + "]",
      };
      const final = { _role: role, _role_steps: arr };
      getAPIPostProcess(final).then((r) => {
        if (r.status > 0) {
          ToastCustom("Thêm quy trình thành công", "success");
          navigate("/list-role");
        }
      });
    } else {
      toast.error("Các bước quy trình là bắt buộc!", {
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
  };

  const SortableItem = SortableElement(({ field, index, remove }) => (
    <div
      style={{
        display: "flex",
        marginBottom: 8,
        width: "100%",
        justifyContent: "space-around",
      }}
      align="baseline"
      key={`space + ${field.key}`}
    >
      <Space
        style={{ border: "1px solid var(--vz-input-border)", padding: 10 }}
      >
        <DragHandle />
        <Form.Item
          {...field}
          style={{ margin: 0 }}
          name={[field.name, "step_name"]}
          fieldKey={[field.fieldKey, "step_name"]}
          rules={[
            {
              required: true,
              message: "Tên bước là bắt buộc",
            },
          ]}
          key={`step_name + ${field.key}`}
          initialValue=""
        >
          <Input style={{ padding: "5px 10px" }} placeholder="Nhập tên bước" />
        </Form.Item>
        <Form.Item
          {...field}
          style={{ margin: 0 }}
          name={[field.name, "step_short_name"]}
          fieldKey={[field.fieldKey, "step_short_name"]}
          rules={[
            {
              required: true,
              message: "Tên tắt là bắt buộc",
            },
          ]}
          key={`step_short_name + ${field.key}`}
          initialValue=""
        >
          <Input style={{ padding: "5px 10px" }} placeholder="Nhập tên tắt" />
        </Form.Item>
        <Form.Item
          style={{ width: 550, margin: 0 }}
          {...field}
          name={[field.name, "list_user_accept"]}
          fieldKey={[field.fieldKey, "list_user_accept"]}
          rules={[
            {
              required: true,
              message: "Người duyệt là bắt buộc",
            },
          ]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{
              width: "100%",
            }}
            placeholder="Chọn tài khoản"
            options={accountList}
          />
        </Form.Item>
      </Space>
      <div style={{ margin: "18px 0 0 10px" }}>
        <Popconfirm
          title={"Xác nhận xoá"}
          icon={<></>}
          okText={"Đồng ý"}
          cancelText={"Hủy bỏ"}
          onConfirm={() => {
            remove(field.name);
            const updatedNumbers = listNumber.slice(0, -1);
            const updatedNumbersWithSequentialOrder = updatedNumbers.map(
              (n, index) => index + 1
            );
            setListNumber(updatedNumbersWithSequentialOrder);
          }}
        >
          <Button
            type="dashed"
            style={{
              border: "1px solid red",
              background: "white",
              padding: "0px 8px",
              height: "28px",
            }}
            className="btn-light"
          >
            <i
              className="ri-subtract-line align-bottom"
              style={{ color: "red" }}
            ></i>
          </Button>
        </Popconfirm>
      </div>
    </div>
  ));

  const onSortEnd = ({ oldIndex, newIndex }) => {
    form.setFieldsValue({
      _role_steps: arrayMoveImmutable(
        form.getFieldValue(["_role_steps"]),
        oldIndex,
        newIndex
      ),
    });
  };

  const SortableContainerComponent = SortableContainer(({ children }) => (
    <CardBody>{children}</CardBody>
  ));
  const addField = (add) => {
    add();
    const newNumber = listNumber.length + 1;
    setListNumber([...listNumber, newNumber]);
  };
  return (
    <div>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Thêm quy trình" pageTitle="Danh sách quy trình" />
          <Row>
            <Card>
              <CardBody>
                <Col lg={12}>
                  <Form
                    name="dynamic_form_nest_item"
                    onFinish={onFinish}
                    form={form}
                    autoComplete="off"
                  >
                    <Label for="nameInput" className="form-label">
                      Tên quy trình
                    </Label>
                    <RequiredIcon />
                    <Form.Item
                      name={["_role", "role_name"]}
                      initialValue=""
                      rules={[
                        {
                          required: true,
                          message:
                            "Tên quy trình là bắt buộc và Tên quy trình không nhập quá 45 ký tự",
                          max: 45,
                        },
                      ]}
                    >
                      <Input
                        id="nameInput"
                        name="name"
                        placeholder="Nhập tên quy trình"
                      />
                    </Form.Item>
                    <Label for="descInput" className="form-label">
                      Mô tả quy trình
                    </Label>
                    <Form.Item
                      name={["_role", "role_description"]}
                      initialValue=""
                      rules={[
                        {
                          required: false,
                          message: " Mô tả quy trình không nhập quá 200 ký tự",
                          max: 200,
                        },
                      ]}
                    >
                      <TextArea
                        id="descInput"
                        placeholder="Nhập mô tả quy trình"
                        type="textarea"
                        rows="4"
                      />
                    </Form.Item>
                    <Label for="articleTypeInput" className="form-label">
                      Loại bài viết
                    </Label>
                    <RequiredIcon />
                    <Form.Item
                      name={["_role", "list_article_type"]}
                      rules={[
                        {
                          required: true,
                          message: "Loại bài viết là bắt buộc",
                        },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{
                          width: "100%",
                        }}
                        placeholder="Chọn loại bài viết"
                        options={articleTypeList}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Label className="form-label">Các bước quy trình</Label>
                      <RequiredIcon />
                      <Card>
                        <CardBody
                          style={{ border: "1px solid var(--vz-input-border)" }}
                        >
                          <div
                            style={{ display: "flex", justifyItems: "center" }}
                          >
                            <div style={{ padding: 16, paddingRight: 0 }}>
                              {listNumber.map((num) => (
                                <Space
                                  style={{
                                    display: "flex",
                                    width: "80%",
                                    padding: 10,
                                    height: "54px",
                                    marginBottom: "8px",
                                    justifyItems: "center",
                                    alignItems: "center",
                                  }}
                                  align="baseline"
                                  key={num}
                                >
                                  <p
                                    style={{
                                      background: " #3668C9",
                                      color: "white",
                                      padding: "2px 10px",
                                      borderRadius: 4,
                                      fontWeight: "bold",
                                      marginTop: 14,
                                    }}
                                  >
                                    {num}
                                  </p>
                                </Space>
                              ))}
                            </div>
                            <Form.List name={["_role_steps"]}>
                              {(fields, { add, remove }) => (
                                <SortableContainerComponent
                                  onSortEnd={onSortEnd}
                                  useDragHandle
                                >
                                  {fields.map((field, index) => (
                                    <SortableItem
                                      key={`item-${index}`}
                                      index={index}
                                      field={field}
                                      remove={remove}
                                    />
                                  ))}
                                  <Form.Item style={{ width: 200 }}>
                                    <Button
                                      htmlType="submit"
                                      type="dashed"
                                      onClick={() => addField(add)}
                                      block
                                      style={{ marginLeft: 13 }}
                                    >
                                      + Thêm bước
                                    </Button>
                                  </Form.Item>
                                </SortableContainerComponent>
                              )}
                            </Form.List>
                          </div>
                        </CardBody>
                      </Card>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        style={{
                          width: "10%",
                          fontSize: "14px",
                          background: "rgb(54, 104, 201)",
                          color: "white",
                        }}
                        htmlType="submit"
                      >
                        LƯU
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </CardBody>
            </Card>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AddProcess;
