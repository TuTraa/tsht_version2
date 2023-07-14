import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  CardHeader,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Meta from "antd/es/card/Meta";
import {
  getListMenu,
  updateMenu,
  getAPITreeListCategory,
} from "../../../helpers/fakebackend_helper";
import { List, Pagination, Button, Space, Form, TreeSelect } from "antd";
import Loading from "../../../Components/Common/Loading";
import { arrayMoveImmutable } from "array-move";
import { useForm } from "antd/es/form/Form";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
export const DragHandle = SortableHandle(() => (
  <span
    style={{
      cursor: "move",
    }}
  >
    ::
  </span>
));
const Menu = () => {
  const [menuList, setMenuList] = useState([]);
  const [sortedMenuList, setSortedMenuList] = useState([]);
  const [loadingLeft, setLoadingLeft] = useState(true);
  const [loadingRight, setLoadingRight] = useState(true);
  const [filter, setFilter] = useState(
    "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
  );
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [record, setRecord] = useState(0);
  const [page, setPage] = useState(1);
  const [form] = useForm();
  const addFunction = useRef(() => {});
  const [listNumber, setListNumber] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        getAPITreeListCategory(offset, limit).then((res) => {
          if (res.data && res.status > 0) {
            setRecord(res.data.total);
            setPage(1);
            setMenuList(res.data.list);
          }
          setLoadingLeft(false);
        });
        getListMenu({
          offset: offset,
          limit: limit,
        }).then((res) => {
          if (res.data && res.status > 0) {
            setSortedMenuList(res.data);
            form.setFieldValue({
              sortMenu: res.data,
            });
          }
          setLoadingRight(false);
        });
      } catch (e) {
        // this should catch all exceptions
      }
    })();
  }, []);

  const handleUpdateListSelected = (element) => {
    const list = [...sortedMenuList];
    const check = list.some((e) => {
      return e.category_id === element.category_id;
    });
    if (check) {
      toast.error("Menu đã được thêm trước đó");
    } else {
      toast.success("Thêm Menu thành công");
      list.push(element);
      addFunction.current(element);
      setSortedMenuList(list);
    }
  };
  const handleRemoveListSelected = (element) => {
    const list = [...sortedMenuList];
    const check = list.filter((e) => {
      return e.category_id !== element.category_id;
    });
    toast.success("Bỏ Menu thành công");
    setSortedMenuList(check);
  };

  const onUpdateSelected = () => {
    const body = form.getFieldValue(["sortMenu"]).map((e) => {
      return e.category_id;
    });
    // const bodyPosition = form.getFieldValue(["sortMenu"]).map((e) => {
    //   return e.order_position;
    // });
    updateMenu({
      // menu_id:values.menu_id,
      list_category_id: body,
      // order_position: bodyPosition,
    }).then((res) => {
      if (res.status > 0) {
        toast.success("Lưu Menu thành công");
      } else {
        toast.error("Có lỗi đã xảy ra");
      }
    });
  };
  useEffect(() => {
    if (
      filter !==
      "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
    ) {
      setPage(1);
    }
    const delayDebounceFn = setTimeout(() => {
      if (
        filter &&
        filter !==
          "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
      ) {
        getAPITreeListCategory(offset, limit).then((res) => {
          if (res.data && res.status > 0) {
            setMenuList(res.data.list);
          }
        });
      } else {
        getAPITreeListCategory(offset, limit).then((res) => {
          if (res.data && res.status > 0) {
            setMenuList(res.data.list);
          }
        });
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [filter]);

  useEffect(() => {
    if (
      filter &&
      filter !==
        "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
    ) {
      getAPITreeListCategory(offset, limit).then((res) => {
        if (res.data && res.status > 0) {
          setMenuList(res.data.list);
        }
      });
    } else {
      getAPITreeListCategory(offset, limit).then((res) => {
        if (res.data && res.status > 0) {
          setMenuList(res.data.list);
        }
      });
    }
  }, [offset]);

  const onFilterText = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    setOffset((page - 1) * 10);
  }, [page]);
  const SortableItem = SortableElement(({ field, index, remove }) => {
    const item = form.getFieldValue("sortMenu")[field.name] || null;
    return (
      <div
        style={{
          display: "flex",
          marginBottom: 8,
          width: "100%",
        }}
        align="baseline"
        key={`space + ${field.key}`}
      >
        <Space
          style={{
            border: "1px solid var(--vz-input-border)",
            padding: 10,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
          }}
        >
          <DragHandle />
          <Form.Item
            {...field}
            style={{
              margin: 0,
              height: 70,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
            // name={[field.name, "list"]}
            key={`list + ${field.key}`}
            initialValue={null}
          >
            <Meta title={item?.category_name} />
          </Form.Item>
        </Space>
        <div style={{ margin: "24px 0 0 10px" }}>
          <Button
            type="dashed"
            style={{
              border: "1px solid red",
              background: "white",
              padding: "0px 8px",
              height: "28px",
            }}
            className="btn-light"
            onClick={() => {
              remove(field.name);
              const updatedNumbers = listNumber.slice(0, -1);
              const updatedNumbersWithSequentialOrder = updatedNumbers.map(
                (n, index) => index + 1
              );
              setListNumber(updatedNumbersWithSequentialOrder);
              handleRemoveListSelected(item);
            }}
          >
            <i
              className="ri-subtract-line align-bottom"
              style={{ color: "red" }}
            ></i>
          </Button>
        </div>
      </div>
    );
  });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    form.setFieldsValue({
      sortMenu: arrayMoveImmutable(
        form.getFieldValue(["sortMenu"]),
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
  useEffect(() => {
    setListNumber(sortedMenuList.map((e, i) => i + 1));
  }, [sortedMenuList]);

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Menu" />
        <Col lg={12}>
          <Row>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <div className="search-box ms-0 col-sm-12 mb-3">
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Tìm kiếm"
                      onChange={onFilterText}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                  {loadingLeft ? (
                    <Loading />
                  ) : (
                    <List
                      // pagination={{ position: "bottom", align: "end" }}
                      dataSource={menuList}
                      locale={{
                        emptyText: "Không có dữ liệu",
                      }}
                      renderItem={(item, index) => (
                        <List.Item key={item.category_id}>
                          <List.Item.Meta
                            title={<a href="#">{item.category_name}</a>}
                            // dataSource={item.list_categories_lv2}
                          />

                          <button
                            type="button"
                            className="btn btn-success add-btn"
                            id="create-btn"
                            onClick={() => handleUpdateListSelected(item)}
                          >
                            <i className="ri-add-line align-bottom"></i>
                          </button>
                        </List.Item>
                      )}
                    ></List>
                  )}
                  <Pagination
                    defaultCurrent={1}
                    style={{
                      marginLeft: 200,
                    }}
                    total={record}
                    current={page}
                    onChange={(e) => {
                      setPage(e);
                    }}
                  />
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <Label className="search-box ms-0 col-sm-12">
                    Sắp xếp menu
                  </Label>
                </CardHeader>
                <CardBody>
                  <div className="mb-3">
                    {loadingRight ? (
                      <Loading />
                    ) : (
                      <>
                        <Form
                          form={form}
                          autoComplete="off"
                          name="dynamic_form_nest_item"
                          initialValues={{
                            sortMenu: sortedMenuList,
                          }}
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
                                    height: "92px",
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
                            <Form.List
                              name={["sortMenu"]}
                              initialValue={sortedMenuList}
                            >
                              {(fields, { add, remove }) => {
                                addFunction.current = add;
                                return (
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
                                  </SortableContainerComponent>
                                );
                              }}
                            </Form.List>
                          </div>
                        </Form>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-success add-btn"
                    id="create-btn"
                    onClick={onUpdateSelected}
                  >
                    Lưu
                  </button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Container>
    </div>
  );
};

export default Menu;
