import React from "react";
import axios from "axios";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link,
} from "react-router-dom";

import { LoginView } from "../login-view/login-view";
import { NavbarView } from "../navbar-view/navbar-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { DirectorView } from "../director-view/director-view";
import { GenreView } from "../genre-view/genre-view";
import { RegistrationView } from "../registration-view/registration-view";
import { ProfileView } from "../profile-view/profile-view";

import "./main-view.scss";
// Bootstrap components
import { Row, Col, Container, Button, Card } from "react-bootstrap";
class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      token: null,
      isLoaded: false,
      isLoaded2: false,
      selectedMovie: null,
      user: null,
      userData: null
    };
  }

  getMovies(token) {
    axios
      .get("https://brunoza-api.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Assign the result to the state
        this.setState({
          movies: response.data,
        });
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    let userToken = localStorage.getItem('user');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user'),
        token: localStorage.getItem('token')
      });
      this.getAcc(accessToken, userToken);
      this.getMovies(accessToken);
    }
  }

  newUser(newData) {
    localStorage.setItem('user', newData.Username);
    this.setState({
      userData: newData,
      user: newData.Username
    });
  }

  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie
    });
  }

  getAcc(token, user) {
    axios.get(`https://brunoza-api.herokuapp.com/users/${user}`, {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(response => {
      console.log('Success with getAcc');
      this.setState({
        userData: response.data
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  /*When a user logs in, this function updates the user property in state to that particular user */
  onLoggedIn(authData) {
    this.setState({
      user: authData.user.Username,
      token: authData.token,
      // userData: authData.data
    });
    // LocalStorage will be used as a to retrive current user if needed
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    // localStorage.setItem("userData", authData.user.Username);
    this.getAcc(authData.token, authData.user.Username);
    this.getMovies(authData.token);
  }

  onLoggedOut() {
    localStorage.clear();
    this.setState({
      user: null,
      token: null,
      userData: null
    });
  }

  loading(){
    setTimeout(() => {
      this.setState({
        isLoaded: true
      })
    }, 1400);
  }

  loading2(){
    setTimeout(() => {
      this.setState({
        isLoaded2: true
      })
    }, 3000);
  }

  render() {
    const { movies, user, isLoaded, isLoaded2, token, userData } = this.state;

    return (
      <>
        <Router>
          <NavbarView />
          <Row className="main-view justify-content-md-center">
            <Route
              exact
              path="/"
              render={() => {
                if (!user)
                  return (
                    <Col key="LoginView">
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );
                if (movies.length === 0) return <div className="main-view" />;
                return movies.map((m) => (
                  <Col md={3} key={m._id}>
                    <MovieCard movie={m} />
                  </Col>
                ));
              }}
            />
            <Route
              path="/register"
              render={() => {
                if (user) return <Redirect to="/" />;
                return (
                  <Col>
                    <RegistrationView />
                  </Col>
                );
              }}
            />
            <Route
              path="/movies/:movieId"
              render={({ match, history }) => {
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );
                if (movies.length === 0) return <div className="main-view" />;
                return (
                  <Col md={8}>
                    <MovieView
                      movie={movies.find((m) => m._id === match.params.movieId)}
                      onBackClick={() => history.goBack()}
                    />
                  </Col>
                );
              }}
            />
            <Route
              path="/directors/:name"
              render={({ match, history }) => {
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );
                if (movies.length === 0) return <div className="main-view" />;
                return (
                  <Col md={8} key="Director">
                    <DirectorView
                      director={movies.filter(
                        (m) => m.Director.Name === match.params.name
                      )}
                      onBackClick={() => history.goBack()}
                    />
                  </Col>
                );
              }}
            />
            <Route
              path="/genres/:name"
              render={({ match, history }) => {
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );
                if (movies.length === 0) return <div className="main-view" />;
                return (
                  <Col md={8} key="Genre">
                    <GenreView
                      movies={movies.filter(
                        (m) => m.Genre.Name === match.params.name
                      )}
                      onBackClick={() => history.goBack()}
                    />
                  </Col>
                );
              }}
            />
            <Route
              path={`/profile`}
              render={({ history }) => {
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );

                if (!userData && !isLoaded2) {
                  return (
                    <>
                      <div className="loading">
                        Loading<span className="spinner"></span>
                      </div>
                      {this.loading2()}
                    </>
                  );
                }
                return (
                  <>
                    <Col md={8}>
                      <ProfileView
                        user={user}
                        token={token}
                        history={history}
                        userData={userData}
                        onNewUser={(newData) => {
                          this.newUser(newData);
                        }}
                        onSignOut={(signState) => {
                          this.signOut(signState);
                        }}
                      />
                    </Col>
                  </>
                );
              }}
            />
          </Row>
        </Router>
      </>
    );
  }
}
export default MainView;
