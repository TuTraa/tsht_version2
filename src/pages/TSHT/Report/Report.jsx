import UiContent from "../../../Components/Common/UiContent";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Alert, Card, CardBody, Col, Container, Row } from "reactstrap";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";

import React from "react";
const Report = () => {
  return (
    <div className="page-content">
      <Container fluid={true}>
        <BreadCrumb title="Thư viện Media" pageTitle="Thư viện Media" />
        <Row>
          <Col lg={12}>{/* <FileMedia></FileMedia> */}</Col>
        </Row>
      </Container>
    </div>
  );
};

export default Report;
