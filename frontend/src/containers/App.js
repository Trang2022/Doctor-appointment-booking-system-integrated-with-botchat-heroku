import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { toast, ToastContainer } from "react-toastify";

import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from "../hoc/authentication";

import { path } from "../utils";
import Home from "../routes/Home";
// import Login from "../routes/Login";
import Login from "./Auth/Login";
import System from "../routes/System";
import Doctor from "../routes/Doctor";

import { CustomToastCloseButton } from "../components/CustomToast";
// import ConfirmModal from "../components/ConfirmModal";

import HomePage from "./HomePage/HomePage";
import CustomScrollbars from "../components/CustomScrollbars";
// import Doctor from "../routes/Doctor";

import DetailDoctor from "./Patient/Doctor/DetailDoctor";
import VerifyEmail from "./Patient/VerifyEmail";

import DetailSpecialty from "./Patient/Specialty/DetailSpecialty";
import DetailClinic from "./Patient/Clinic/DetailClinic";

import ListSpecialty from "../containers/HomePage/Section/specialty/ListSpecialty";
import ListClinic from "../containers/HomePage/Section/Clinics/ListClinic";
import ListDoctors from "../containers/HomePage/Section/Doctors/ListDoctors";
import DetailHandbook from "./Patient/Handbook/DetailHandbook";
import ListHandbook from "../containers/HomePage/Section/AllHandbook/ListHandbook";

class App extends Component {
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };

  componentDidMount() {
    this.handlePersistorState();
  }

  render() {
    return (
      <Fragment>
        <Router history={history}>
          <div className="main-container">
            <div className="content-container">
              <CustomScrollbars style={{ width: "100%", height: "100vh" }}>
                <Switch>
                  <Route path={path.HOME} exact component={Home} />
                  <Route
                    path={path.LOGIN}
                    component={userIsNotAuthenticated(Login)}
                  />
                  <Route
                    path={path.SYSTEM}
                    component={userIsAuthenticated(System)}
                  />
                  <Route
                    path={"/doctor/"}
                    component={userIsAuthenticated(Doctor)}
                  />
                  <Route path={path.HOMEPAGE} component={HomePage} />
                  <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                  <Route
                    path={path.VERIFY_EMAIL_BOOKING}
                    component={VerifyEmail}
                  />
                  <Route
                    path={path.DETAIL_SPECIALTY}
                    component={DetailSpecialty}
                  />
                  <Route path={path.ALL_SPECIALTY} component={ListSpecialty} />
                  <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                  <Route
                    path={path.DETAIL_HANDBOOK}
                    component={DetailHandbook}
                  />
                  <Route path={path.ALL_CLINIC} component={ListClinic} />
                  <Route path={path.ALL_HANDBOOK} component={ListHandbook} />
                  <Route path={path.ALL_DOCTORS} component={ListDoctors} />
                </Switch>
              </CustomScrollbars>
            </div>

            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
