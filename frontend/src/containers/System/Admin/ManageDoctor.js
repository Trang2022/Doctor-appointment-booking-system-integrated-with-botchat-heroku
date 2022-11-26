import React, { Component } from "react";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

import "./ManageDoctor.scss";
import Select from "react-select";

import { LANGUAGES, CRUD_ACTIONS } from "../../../utils";
import { getDetailInforDoctor } from "../../../services/userService";

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentMarkdown: "",
      contentHTML: "",
      selectedOption: "",
      description: "",
      listDoctors: [],
      hasOldData: false,

      //save to doctor_infor table
      listPrice: [],
      listPayment: [],
      listProvince: [],

      listSpecialty: [],
      listClinic: [],

      selectPrice: "",
      selectPayment: "",
      selectProvince: "",

      selectSpecialty: "",
      selectClinic: "",

      nameClinic: "",
      addressClinic: "",
      // note: "",

      clinicId: "",
      specialtyId: "",
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.getRequiredDoctorInfor();
  }

  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      if (type === "USERS") {
        inputData.map((item, index) => {
          let object = {};
          let labelEn = `${item.firstName} ${item.lastName}`;
          let labelVi = `${item.lastName} ${item.firstName}`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.id;
          result.push(object);
        });
      }

      if (type === "PRICE") {
        // if (inputData && inputData.length > 0) {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.valueVi} VND`;
          let labelEn = `${item.valueEn} USD`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        });
        // }
      }
      if (type === "PAYMENT" || type === "PROVINCE") {
        // if (inputData && inputData.length > 0) {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.valueVi}`;
          let labelEn = `${item.valueEn}`;

          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        });
      }

      if (type === "SPECIALTY") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        });
      }

      if (type === "CLINIC") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        });
      }
    }

    return result;
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      this.setState({
        listDoctors: dataSelect,
      });
    }

    if (
      prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor
    ) {
      let {
        resPayment,
        resPrice,
        resProvince,
        resSpecialty,
        resClinic,
      } = this.props.allRequiredDoctorInfor;

      let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE"
      );

      let dataSelectSpecialty = this.buildDataInputSelect(
        resSpecialty,
        "SPECIALTY"
      );
      let dataSelectClinic = this.buildDataInputSelect(resClinic, "CLINIC");

      // console.log(
      //   "data new: ",
      //   dataSelectPrice,
      //   dataSelectPayment,
      //   dataSelectProvince
      // );

      this.setState({
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
        listSpecialty: dataSelectSpecialty,
        listClinic: dataSelectClinic,
      });
    }

    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      let {
        resPrice,
        resPayment,
        resProvince,
      } = this.props.allRequiredDoctorInfor;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE"
      );

      this.setState({
        listDoctors: dataSelect,
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
      });
    }
  }

  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
  };

  handleSaveContentMarkdown = () => {
    let { hasOldData } = this.state;
    this.props.saveDetailDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectedOption.value,
      action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

      selectPrice: this.state.selectPrice.value,
      selectPayment: this.state.selectPayment.value,
      selectProvince: this.state.selectProvince.value,

      nameClinic: this.state.nameClinic,
      addressClinic: this.state.addressClinic,
      // note: this.state.note,
      clinicId:
        this.state.selectClinic && this.state.selectClinic.value
          ? this.state.selectClinic.value
          : "",
      specialtyId: this.state.selectSpecialty.value,
    });
  };

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedOption });
    let {
      listPayment,
      listPrice,
      listProvince,
      listSpecialty,
      listClinic,
    } = this.state;

    let res = await getDetailInforDoctor(selectedOption.value);
    if (res && res.errCode === 0 && res.data && res.data.Markdown) {
      let markdown = res.data.Markdown;
      let addressClinic = "",
        nameClinic = "",
        // note = "",
        paymentId = "",
        priceId = "",
        provinceId = "",
        selectPayment = "",
        selectPrice = "",
        selectProvince = "",
        selectSpecialty = "",
        selectClinic = "",
        clinicId = "",
        specialtyId = "";

      if (res.data.Doctor_Infor) {
        addressClinic = res.data.Doctor_Infor.addressClinic;
        nameClinic = res.data.Doctor_Infor.nameClinic;
        // note = res.data.Doctor_Infor.note;
        paymentId = res.data.Doctor_Infor.paymentId;
        priceId = res.data.Doctor_Infor.priceId;
        provinceId = res.data.Doctor_Infor.provinceId;
        specialtyId = res.data.Doctor_Infor.specialtyId;
        clinicId = res.data.Doctor_Infor.clinicId;

        selectPayment = listPayment.find((item) => {
          return item && item.value === paymentId;
        });
        selectPrice = listPrice.find((item) => {
          return item && item.value === priceId;
        });
        selectProvince = listProvince.find((item) => {
          return item && item.value === provinceId;
        });
        selectSpecialty = listSpecialty.find((item) => {
          return item && item.value === specialtyId;
        });
        selectClinic = listClinic.find((item) => {
          return item && item.value === clinicId;
        });
      }
      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.description,
        hasOldData: true,
        addressClinic: addressClinic,
        nameClinic: nameClinic,
        // note: note,
        selectPayment: selectPayment,
        selectPrice: selectPrice,
        selectProvince: selectProvince,
        selectSpecialty: selectSpecialty,
        selectClinic: selectClinic,
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        description: "",
        hasOldData: false,
        addressClinic: "",
        nameClinic: "",
        note: "",
        selectPayment: "",
        selectProvince: "",
        selectPrice: "",
        selectSpecialty: "",
        selectClinic: "",
      });
    }
  };

  handleChangeSelectDoctorInfor = async (selectedOption, name) => {
    let stateName = name.name;
    let stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({
      ...stateCopy,
    });
  };

  handleOnChangeText = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };

  render() {
    let { hasOldData } = this.state;
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">Quản lý bác sĩ </div>
        <div className="more-infor">
          <div className="content-left form-group">
            <label htmlFor=""> Chọn bác sĩ </label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeSelect}
              options={this.state.listDoctors}
              placeholder={"Nhập bác sĩ cần tìm"}
            />
          </div>
          <div className="content-right ">
            <label>Thông tin giới thiệu </label>
            <textarea
              defaultValue={
                this.state.description ? this.state.description : ""
              }
              className="form-control"
              onChange={(event) =>
                this.handleOnChangeText(event, "description")
              }
              value={this.state.description}
            ></textarea>
          </div>
        </div>
        <div className="more-infor-extra row">
          <div className="col-4 form-group">
            <label>Giá khám bệnh </label>
            <Select
              value={this.state.selectPrice}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listPrice}
              placeholder={"Giá khám bệnh"}
              name="selectPrice"
            />
          </div>
          <div className="col-4 form-group">
            <label>Phương thức thanh toán </label>
            <Select
              value={this.state.selectPayment}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listPayment}
              placeholder={"Phương thức thanh toán"}
              name="selectPayment"
            />
          </div>
          <div className="col-4 form-group">
            <label>Tỉnh thành </label>
            <Select
              value={this.state.selectProvince}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listProvince}
              placeholder={"Tỉnh thành"}
              name="selectProvince"
            />
          </div>
          <div className="col-4 form-group">
            <label>Tên Phòng khám </label>
            <input
              className="form-control"
              value={this.state.nameClinic}
              onChange={(event) => this.handleOnChangeText(event, "nameClinic")}
            />
          </div>
          <div className="col-4 form-group">
            <label>Địa chỉ phòng khám </label>
            <input
              className="form-control"
              value={this.state.addressClinic}
              onChange={(event) =>
                this.handleOnChangeText(event, "addressClinic")
              }
            />
          </div>
          {/* <div className="col-4 form-group">
            <label>

Ghi chú            </label>
            <textarea
              className="form-control"
              value={this.state.note}
              onChange={(event) => this.handleOnChangeText(event, "note")}
            />
          </div> */}
          {/* <div className="row"> */}
          <div className="col-4 form-group">
            <label>Chọn phòng khám </label>
            <Select
              value={this.state.selectClinic}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listClinic}
              placeholder={"Chọn phòng khám"}
              name="selectClinic"
            />
          </div>
          <div className="col-4 form-group">
            <label>Chọn chuyên khoa </label>
            <Select
              value={this.state.selectSpecialty}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listSpecialty}
              placeholder={"Chọn chuyên khoa"}
              name="selectSpecialty"
            />
          </div>
        </div>

        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "300px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.contentMarkdown ? this.state.contentMarkdown : ""}
          />
        </div>
        <button
          className={
            this.state.hasOldData === true
              ? "edit-content-doctor"
              : "save-content-doctor"
          }
          onClick={() => this.handleSaveContentMarkdown()}
        >
          {this.state.hasOldData === true ? "Lưu thông tin" : "Tạo thông tin "}
        </button>
      </div>
      // </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    allDoctors: state.admin.allDoctors,
    language: state.app.language,
    allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    getRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
