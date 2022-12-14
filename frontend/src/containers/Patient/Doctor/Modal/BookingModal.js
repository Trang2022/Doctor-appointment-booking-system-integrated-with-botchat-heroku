import React, { Component } from "react";
import { connect } from "react-redux";
import "./BookingModal.scss";
import { Modal } from "reactstrap";

import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";

import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";

import Select from "react-select";
import { toast } from "react-toastify";

import { postPatientBookAppointment } from "../../../../services/userService";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
      doctorId: "",
      genders: "",
      timeType: "",
      isShowLoading: false,
    };
  }
  async componentDidMount() {
    this.props.getGenders();
  }

  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.genders !== prevProps.genders) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.dataTime !== prevProps.dataTime) {
      if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
        // console.log("check timeType: ", this.props.dataTime);
        let doctorId = this.props.dataTime.doctorId;
        let timeType = this.props.dataTime.timeType;

        this.setState({
          doctorId: doctorId,
          timeType: timeType,
        });
      }
    }
  }

  handleOnchangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
  };

  handleOnchangeDatePicker = (date) => {
    // console.log(date);
    this.setState({
      birthday: date[0],
    });
  };

  handleChangeSelect = (selectOption) => {
    this.setState({
      selectedGender: selectOption,
    });
  };

  handleConfirmBooking = async () => {
    this.setState({
      isShowLoading: true,
    });
    let date = new Date(this.state.birthday).getTime();

    let timeString = this.builtTimeBooking(this.props.dataTime);
    let doctorName = this.builtDoctorName(this.props.dataTime);

    let res = await postPatientBookAppointment({
      fullName: this.state.fullName,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      address: this.state.address,
      reason: this.state.reason,
      date: this.props.dataTime.date,
      birthday: date,
      selectedGender: this.state.selectedGender.value,
      doctorId: this.state.doctorId,
      timeType: this.state.timeType,
      language: this.props.language,
      timeString: timeString,
      doctorName: doctorName,
    });

    this.setState({
      isShowLoading: false,
    });

    if (res && res.errCode === 0) {
      toast.success("Booking a new appointment succeed!");

      this.props.closeBookingClose();
    } else {
      toast.error(" Booking a new appointment error!");
    }
    console.log("check confirm button: ", this.state);
  };

  builtTimeBooking = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment
              .unix(+dataTime.date / 1000)
              .locale("en")
              .format("dddd - DD/MM/YYYY");
      return `${time} - ${date}`;
    }
    return "";
  };

  builtDoctorName = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let name =
        language === LANGUAGES.VI
          ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
          : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
      return name;
    }
    return "";
  };

  render() {
    let { isOpenModal, closeBookingClose, dataTime } = this.props;
    let doctorId = "";
    if (dataTime && !_.isEmpty(dataTime)) {
      doctorId = dataTime.doctorId;
    }

    // console.log("check state inside booking modal: ", this.state);

    // console.log("doctor id ", this.props.genders);
    return (
      <>
        <LoadingOverlay active={this.isShowLoading} spinner text="Loading...">
          <Modal
            isOpen={isOpenModal}
            className={"booking-modal-container"}
            size="lg"
            centered
          >
            <div className="booking-modal-content">
              <div className="booking-modal-header">
                <span className="left">Th??ng tin ?????t l???ch kh??m b???nh </span>
                <span className="right" onClick={closeBookingClose}>
                  <i className="fas fa-times"></i>
                </span>
              </div>
              <div className="booking-modal-body">
                <div className="doctor-infor">
                  <ProfileDoctor
                    doctorId={doctorId}
                    isShowDescriptionDoctor={false}
                    dateTime={dataTime}
                    isShowLinkDetail={true}
                    isShowPrice={false}
                  />
                </div>
              </div>

              <div className="row m-20">
                <div className="col-6 form-group">
                  <label>H??? v?? t??n </label>
                  <input
                    className="form-control"
                    value={this.state.fullName}
                    onChange={(event) =>
                      this.handleOnchangeInput(event, "fullName")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label> S??? ??i???n tho???i </label>
                  <input
                    className="form-control"
                    value={this.state.phoneNumber}
                    onChange={(event) =>
                      this.handleOnchangeInput(event, "phoneNumber")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label>?????a ch??? email </label>
                  <input
                    className="form-control"
                    value={this.state.email}
                    onChange={(event) =>
                      this.handleOnchangeInput(event, "email")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label>?????a ch??? li??n l???c </label>
                  <input
                    className="form-control"
                    value={this.state.address}
                    onChange={(event) =>
                      this.handleOnchangeInput(event, "address")
                    }
                  />
                </div>
                <div className="col-12 form-group">
                  <label>L?? do kh??m </label>
                  <input
                    className="form-control"
                    value={this.state.reason}
                    onChange={(event) =>
                      this.handleOnchangeInput(event, "reason")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label> Ng??y sinh </label>
                  <DatePicker
                    className="form-control"
                    value={this.state.birthday}
                    onChange={this.handleOnchangeDatePicker}
                  />
                </div>
                <div className="col-6 form-group">
                  <label>Gi???i t??nh </label>
                  <Select
                    value={this.state.selectedGender}
                    onChange={this.handleChangeSelect}
                    options={this.state.genders}
                  />
                </div>
              </div>
              <div className="booking-modal-footer">
                <button
                  className="btn-booking-confirm"
                  onClick={() => this.handleConfirmBooking()}
                >
                  X??c nh???n{" "}
                </button>
                <button
                  className="btn-booking-cancel"
                  onClick={closeBookingClose}
                >
                  H???y{" "}
                </button>
              </div>
            </div>
          </Modal>
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenders: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
