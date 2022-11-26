import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorExtraInfor.scss";
// import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
// import { getScheduleDoctorByDate } from "../../../services/userService";
import NumberFormat from "react-number-format";
import { getExtraInforDoctorById } from "../../../services/userService";

class DoctorExtraInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetailInfor: false,
      extraInfor: {},
    };
  }
  async componentDidMount() {
    if (this.props.doctorIdFromParent) {
      let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
      if (res && res.errCode === 0) {
        this.setState({
          extraInfor: res.data,
        });
      }
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
      if (res && res.errCode === 0) {
        this.setState({
          extraInfor: res.data,
        });
      }
    }
  }
  showHideDetailInfor = (status) => {
    this.setState({
      isShowDetailInfor: status,
    });
  };
  render() {
    let { isShowDetailInfor, extraInfor } = this.state;
    let { language } = this.props;

    return (
      <div className="doctor-extra-infor-container">
        <div className="content-up">
          <div className="text-address">Địa chỉ khám </div>
          <div className="name-clinic">
            {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ""}
          </div>
          <div className="detail-address">
            {extraInfor && extraInfor.addressClinic
              ? extraInfor.addressClinic
              : ""}
          </div>
        </div>
        <div className="content-down">
          {isShowDetailInfor === false && (
            <div className="short-infor">
              Giá Khám
              {extraInfor &&
                extraInfor.priceData &&
                language === LANGUAGES.VI && (
                  <NumberFormat
                    className="currency"
                    value={extraInfor.priceData.valueVi}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={"VND"}
                  />
                )}
              {extraInfor &&
                extraInfor.priceData &&
                language === LANGUAGES.EN && (
                  <NumberFormat
                    className="currency"
                    value={extraInfor.priceData.valueEn}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={"USD"}
                  />
                )}
              <span
                className="detail"
                onClick={() => this.showHideDetailInfor(true)}
              >
                Xem chi tiết{" "}
              </span>
            </div>
          )}
          {isShowDetailInfor === true && (
            <>
              <div className="title-price">Giá Khám </div>
              <div className="detail-infor">
                <div className="price">
                  <span className="left">Giá Khám </span>
                  <span className="right">
                    {extraInfor &&
                      extraInfor.priceData &&
                      language === LANGUAGES.VI && (
                        <NumberFormat
                          className="currency"
                          value={extraInfor.priceData.valueVi}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix={"VND"}
                        />
                      )}

                    {extraInfor &&
                      extraInfor.priceData &&
                      language === LANGUAGES.EN && (
                        <NumberFormat
                          className="currency"
                          value={extraInfor.priceData.valueEn}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix={"USD"}
                        />
                      )}
                  </span>
                </div>
                <div className="note">
                  {extraInfor && extraInfor.note ? extraInfor.note : ""}
                </div>
              </div>
              <div className="payment">
                Hình thức thanh toán
                {extraInfor &&
                extraInfor.paymentData &&
                language === LANGUAGES.VI
                  ? extraInfor.paymentData.valueVi
                  : ""}
                {extraInfor &&
                extraInfor.paymentData &&
                language === LANGUAGES.EN
                  ? extraInfor.paymentData.valueEn
                  : ""}
              </div>
              <div className="hide-price">
                <span onClick={() => this.showHideDetailInfor(false)}>
                  Ẩn bảng giá{" "}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allDoctors: state.admin.allDoctors,
    allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    // getRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
    // saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctorAction(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
