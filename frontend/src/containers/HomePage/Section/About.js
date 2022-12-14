import React, { Component } from "react";
import { connect } from "react-redux";

import Slider from "react-slick";

class About extends Component {
  render() {
    return (
      <div className="section-share section-about">
        <div className="section-about-header">Truyền thông </div>
        <div className="section-about-content">
          <div className="content-left">
            <iframe
              width="100%"
              height="400px"
              src="https://www.youtube.com/embed/e8b0QdRvNS8"
              title="Bệnh đột quỵ: Dấu hiệu, nguyên nhân và cách phòng tránh | VTC Now"
              // frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              // allowfullscreen
            ></iframe>
          </div>
          <div className="content-right">
            <p>
              Tai biến mạch máu não là một bệnh cấp tính, nguy hiểm, thường xảy
              ra đột ngột, với Tỷ lệ tử vong cao nếu không được phát hiện sớm và
              điều trị kịp thời. Đáng lo ngại, tai biến mạch máu não đang có dấu
              hiệu trẻ hóa và ngày càng gia tăng mạnh từ 40 đến 45 tuổi, thậm
              chí 20 tuổi. Vì vậy, căn bệnh này là nguyên nhân Nguyên nhân là gì
              và làm thế nào để tránh nó?{" "}
            </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
