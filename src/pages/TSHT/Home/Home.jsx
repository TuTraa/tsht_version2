import UiContent from "../../../Components/Common/UiContent";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Alert, Card, CardBody, Col, Container, Row } from "reactstrap";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import React from "react";
import LineCharts from "./LineCharts";

const Home = () => {
  document.title = "Trang chủ | Toà Soạn Hội Tụ";
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb title="Trang chủ" pageTitle="Trang chủ" />
          <Row>
            <Col lg={12}>
              <Card>
                <LineCharts key={"1"}></LineCharts>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Home;
