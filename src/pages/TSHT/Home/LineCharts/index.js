import React from "react";
import { CardBody, CardHeader, Row } from "reactstrap";
import StatusLineChart from "./StatusLineChart";

const LineCharts = () => {
  return (
    <>
      <CardHeader className="card-header border-0">
        <Row className="align-items-center gy-3">
          <div className="col-sm">
            <span className="card-title m-lg-3">Tổng Quan</span>
          </div>
        </Row>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="row">
          <StatusLineChart status="2" title="Chờ duyệt" />
          <StatusLineChart status="3" title="Đã duyệt" />
          <StatusLineChart status="4" title="Đã xuất bản" />
        </div>
      </CardBody>

      {/*<Row>*/}
      {/*  <Col lg={6}>*/}
      {/*    <Card>*/}
      {/*      <CardHeader>*/}
      {/*        <h4 className="card-title mb-0">Thống kê theo tháng</h4>*/}
      {/*      </CardHeader>*/}
      {/*      <CardBody>*/}
      {/*        <div>*/}
      {/*          <BasicLineCharts dataColors='["--vz-primary"]' />*/}
      {/*        </div>*/}
      {/*      </CardBody>*/}
      {/*    </Card>*/}
      {/*  </Col>*/}

      {/*  <Col lg={6}>*/}
      {/*    <Card>*/}
      {/*      <CardHeader>*/}
      {/*        <h4 className="card-title mb-0">Thống kê theo tháng</h4>*/}
      {/*      </CardHeader>*/}
      {/*      <CardBody>*/}
      {/*        <ZoomableTimeseries dataColors='["--vz-success"]' />*/}
      {/*      </CardBody>*/}
      {/*    </Card>*/}
      {/*  </Col>*/}
      {/*</Row>*/}

      {/*<Row>*/}
      {/*  <Col lg={6}>*/}
      {/*    <Card>*/}
      {/*      <CardHeader>*/}
      {/*        <h4 className="card-title mb-0">Thống kê theo tháng</h4>*/}
      {/*      </CardHeader>*/}
      {/*      <CardBody>*/}
      {/*        <LinewithDataLabels dataColors='["--vz-primary", "--vz-success"]' />*/}
      {/*      </CardBody>*/}
      {/*    </Card>*/}
      {/*  </Col>*/}

      {/*  <Col lg={6}>*/}
      {/*    <Card>*/}
      {/*      <CardHeader>*/}
      {/*        <h4 className="card-title mb-0">Thống kê theo tháng</h4>*/}
      {/*      </CardHeader>*/}
      {/*      <CardBody>*/}
      {/*        <div>*/}
      {/*          <BrushChart dataColors='["--vz-danger"]' />*/}
      {/*        </div>*/}
      {/*        <div>*/}
      {/*          <BrushChart1 dataColors='["--vz-info"]' />*/}
      {/*        </div>*/}
      {/*      </CardBody>*/}
      {/*    </Card>*/}
      {/*  </Col>*/}
      {/*</Row>*/}

      {/* <Row>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Line with Annotations</h4>
                </CardHeader>
                <CardBody>
                  <LinewithAnnotations dataColors='["--vz-primary"]' />
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Thống kê theo tháng</h4>
                </CardHeader>
                <CardBody>
                  <DashedLine dataColors='["--vz-primary", "--vz-danger", "--vz-success"]' />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Stepline Chart</h4>
                </CardHeader>
                <CardBody>
                  <SteplineChart dataColors='["--vz-success"]' />
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Gradient Chart</h4>
                </CardHeader>
                <CardBody>
                  <div>
                    <GradientCharts dataColors='["--vz-success"]' />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">
                    Missing Data/ Null Value Charts
                  </h4>
                </CardHeader>
                <CardBody>
                  <MissingData dataColors='["--vz-primary", "--vz-danger", "--vz-success"]' />
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Syncing Charts</h4>
                </CardHeader>
                <CardBody>
                  <div>
                    <ChartSyncingLine
                      dataColors='["--vz-primary"]'
                      className="apex-charts"
                      dir="ltr"
                    />
                    <ChartSyncingLine2
                      dataColors='["--vz-warning"]'
                      className="apex-charts"
                      dir="ltr"
                    />
                    <ChartSyncingArea
                      dataColors='["--vz-success"]'
                      className="apex-charts"
                      dir="ltr"
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row> */}
    </>
  );
};

export default LineCharts;
