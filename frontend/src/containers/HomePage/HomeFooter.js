import React, { Component } from "react";
import { connect } from "react-redux";

import Slider from "react-slick";

class HomeFooter extends Component {
  render() {
    return (
      <div className="home-footer">
        <p>
          &copy; 2022 Hệ thống quản lý bác sĩ. Để biết thêm thông tin, vui lòng
          truy cập Facebook và Github của tôi. &nbsp;&nbsp;&nbsp;&nbsp;
          <a target="_blank" href="https://www.facebook.com/trang.quach.56679/">
            <i className="fab fa-facebook"></i>
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a target="_blank" href="https://github.com/Trang2022">
            <i class="fab fa-github"></i>
          </a>
        </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
