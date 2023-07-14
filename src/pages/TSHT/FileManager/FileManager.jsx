import UiContent from "../../../Components/Common/UiContent";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Alert, Card, CardBody, Col, Container, Row } from "reactstrap";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import FileMedia from "./FileManagerMedia/FileMedia";
import React from "react";

const FileManager = () => {
  document.title = "Thư viện Media | Toà Soạn Hội Tụ";
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb title="Thư viện Media" pageTitle="Thư viện Media" />
          <Card>
            <CardBody>
              <Row>
                {/* <FileManagerMedia></FileManagerMedia> */}
                <FileMedia type={"component"}></FileMedia>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default FileManager;
