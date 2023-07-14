import React from "react";
import ReactDragListView from "react-drag-listview/lib/index.js";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

class SortablesRole extends React.Component {
  constructor(props) {
    super(props);
    const data = [
      { id: 1, class: "nested-2", title: "Item 2.1" },
      {
        id: 2,
        class: "nested-2",
        title: "Item 2.2",
        set1: [
          { id: 1, class: "nested-3", title: "Item 3.1" },
          { id: 2, class: "nested-3", title: "Item 3.2" },
        ],
      },
      { id: 3, class: "nested-2", title: "Item 2.3" },
      { id: 4, class: "nested-2", title: "Item 2.4" },
    ];

    this.state = {
      data,
    };
  }

  render() {
    const that = this;
    const dragProps = {
      onDragEnd(fromIndex, toIndex) {
        const data = [...that.state.data];
        const item = data.splice(fromIndex, 1)[0];
        data.splice(toIndex, 0, item);
        that.setState({ data });
      },
      nodeSelector: "li",
      handleSelector: "i",
    };

    return (
      <Card>
        <ListGroup className="col nested-list nested-sortable-handle">
          <ReactDragListView {...dragProps}>
            {this.state.data.map((item, key) => (
              <React.Fragment key={key}>
                {!item.set1 ? (
                  <ListGroupItem className={item.class}>
                    <i className="ri-drag-move-fill align-bottom handle"></i>
                    {item.title}
                  </ListGroupItem>
                ) : (
                  <ListGroupItem className={item.class}>
                    <i className="ri-drag-move-fill align-bottom handle"></i>
                    {item.title}
                    <ListGroup className="nested-list nested-sortable-handle">
                      {item.set1.map((item, key) => (
                        <ListGroupItem className={item.class} key={key}>
                          <i className="ri-drag-move-fill align-bottom handle"></i>
                          {item.title}
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </ListGroupItem>
                )}
              </React.Fragment>
            ))}
          </ReactDragListView>
        </ListGroup>
      </Card>
    );
  }
}

export default SortablesRole;
