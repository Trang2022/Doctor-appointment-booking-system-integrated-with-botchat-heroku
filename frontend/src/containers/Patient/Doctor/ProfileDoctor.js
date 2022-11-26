import React, { Component } from "react";
import { connect } from "react-redux";
import { getProfileDoctorById } from "../../../services/userService";
import "./ProfileDoctor.scss";
import NumberFormat from "react-number-format";
import { LANGUAGES } from "../../../utils";

import _ from "lodash";
import moment from "moment";
import { Link } from "react-router-dom";

class ProfileDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProfile: {},
    };
  }
  async componentDidMount() {
    let data = await this.getInforDoctor(this.props.doctorId);
    this.setState({
      dataProfile: data,
    });
  }
  getInforDoctor = async (id) => {
    let result = {};
    if (id) {
      let res = await getProfileDoctorById(id);
      if (res && res.errCode === 0) {
        result = res.data;
      }
    }
    return result;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.doctorId !== prevProps.doctorId) {
      let data = await this.getInforDoctor(this.props.doctorId);
      this.setState({
        dataProfile: data,
      });
    }
  }

  renderTimeBooking = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;

      let date =
        language === LANGUAGES.VI
          ? moment.unix(dataTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment
              .unix(dataTime.date / 1000)
              .locale("en")
              .format("dddd - DD/MM/YYYY");

      return (
        <>
          <div>
            {time} - {date}
          </div>
          <div>Miễn phí đặt lịch </div>
        </>
      );
    }
    return <></>;
  };

  render() {
    let { dataProfile } = this.state;
    let { language } = this.props;
    let {
      isShowDescriptionDoctor,
      dateTime,
      isShowLinkDetail,
      doctorId,
      isShowPrice,
    } = this.props;

    let nameVi = "",
      nameEn = "";
    if (dataProfile && dataProfile.positionData) {
      nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName} `;
      nameEn = `${dataProfile.positionData.valueVi}, ${dataProfile.firstName} ${dataProfile.lastName} `;
    }

    console.log("check doctorID:", dateTime);
    return (
      <div className="doctor-detail-container ">
        <div className="intro-doctor">
          <div
            className="content-left"
            style={{
              backgroundImage: `url(${
                dataProfile && dataProfile.image ? dataProfile.image : ""
              })`,
            }}
          ></div>
          <div className="content-right">
            <div className="up">
              {language === LANGUAGES.VI ? nameVi : nameEn}
            </div>
            <div className="down">
              {isShowDescriptionDoctor === true ? (
                <>
                  {dataProfile &&
                    dataProfile.Markdown &&
                    dataProfile.Markdown.description && (
                      <span> {dataProfile.Markdown.description}</span>
                    )}
                </>
              ) : (
                <>{this.renderTimeBooking(dateTime)}</>
              )}
            </div>
          </div>
        </div>

        {isShowLinkDetail === true && (
          <div className="view-detail-doctor">
            <Link to={`/detail-doctor/${doctorId}`}>Xem thêm ...</Link>
          </div>
        )}
        {isShowPrice && (
          <div className="price">
            Giá khám: &nbsp;
            {dataProfile && dataProfile.Doctor_Infor && (
              <NumberFormat
                className="currency"
                value={dataProfile.Doctor_Infor.priceTypeData.valueVI}
                displayType={"text"}
                thousandSeparator={true}
                suffix={"VND"}
              />
            )}
            {dataProfile &&
              dataProfile.Doctor_Infor &&
              language === LANGUAGES.EN && (
                <NumberFormat
                  className="currency"
                  value={dataProfile.Doctor_Infor.priceData.valueEn}
                  displayType={"text"}
                  thousandSeparator={true}
                  suffix={"USD"}
                />
              )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
