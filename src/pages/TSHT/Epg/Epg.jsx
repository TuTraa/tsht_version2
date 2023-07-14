import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Row,
} from "reactstrap";
import React, { useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Button, DatePicker } from "antd";
import EpgList from "./EpgList";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import ExcelEpg from "./ExcelEpg";
import { useParams } from "react-router-dom";

dayjs.locale("vi");
const Epg = () => {
  document.title = "Kênh EPG | Toà Soạn Hội Tụ";
  const [filter, setFilter] = useState(dayjs());
  const [reload, setReLoad] = useState(true);
  const { id } = useParams();
  const onChangeToDate = (e) => {
    setFilter(e ? e : null);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Kênh" pageTitle="Home" />
        <Row>
          <Col lg={12}>
            <Card id="orderList">
              <CardHeader className="card-header border-0">
                <Row className="align-items-center gy-3">
                  <div className="col-sm">
                    <h5 className="card-title mb-0">Lịch phát sóng kênh</h5>
                  </div>
                  <div className="col-lg">
                    <Row>
                      {/*<Col className="col-4" style={{ marginLeft: "33%" }}>*/}
                      <Col className="col-4">
                        <Label
                          htmlFor="formFileMultiple"
                          className="form-label"
                        >
                          Chọn ngày
                        </Label>
                        <DatePicker
                          allowClear
                          onChange={onChangeToDate}
                          placeholder="Từ ngày..."
                          defaultValue={filter}
                        />
                      </Col>
                      <ExcelEpg id={id} reload={reload} setReLoad={setReLoad} />
                    </Row>
                  </div>
                </Row>
              </CardHeader>
              <CardBody className="pt-0">
                <EpgList filterDate={filter} reload={reload} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Epg;
