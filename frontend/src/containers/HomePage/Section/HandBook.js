import React, { Component } from "react";
import { connect } from "react-redux";

import Slider from "react-slick";
import { withRouter } from "react-router";

import { getAllHandBook } from "../../../services/userService";
class HandBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataHandBook: [],
    };
  }

  async componentDidMount() {
    let res = await getAllHandBook();
    if (res && res.errCode === 0) {
      this.setState({
        dataHandBook: res.data ? res.data : [],
      });
    }
  }
  handleViewDetailHandbook = (handbook) => {
    if (this.props.history) {
      this.props.history.push(`/detail-handbook/${handbook.id}`);
    }
  };
  handleViewAllHandbook = () => {
    if (this.props.history) {
      this.props.history.push(`/all-handbook`);
    }
  };
  render() {
    let { dataHandBook } = this.state;
    return (
      <div className="section-share section-handbook">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Cẩm nang </span>
            <button
              className="btn-section"
              onClick={() => {
                this.handleViewAllHandbook();
              }}
            >
              Xem thêm{" "}
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {dataHandBook &&
                dataHandBook.length > 0 &&
                dataHandBook.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="section-customize handbook-child"
                      onClick={() => {
                        this.handleViewDetailHandbook(item);
                      }}
                    >
                      <div
                        className="bg-image section-handbook"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      <div className="handbook-name">{item.name} </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HandBook)
);
