import React from "react";
import{ Col, Row } from "react-bootstrap";
import { connect } from "react-redux";

import VisibilityFilterInput from "../visibility-filter-input/visibility-filter-input";
import { MovieCard } from "../movie-card/movie-card";

import "./movies-list.scss";

const mapStateToProps = (state) => {
  const { visibilityFilter } = state;
  return { visibilityFilter };
};

function MoviesList(props) {
  const { movies, visibilityFilter } = props;
  let filteredMovies = movies;

  if (visibilityFilter !== "") {
    filteredMovies = movies.filter((m) =>
      m.Title.toLowerCase().includes(visibilityFilter.toLowerCase())
    );
  }

  if (!movies) return <div className="main-view" />;

  return (
    <>
      <Col md={12} style={{ margin: "1em" }}>
        <VisibilityFilterInput visibilityFilter={visibilityFilter} />
      </Col>
      {filteredMovies.map(m => (
        <Col lg={3} md={4} sm={6} key={m._id}>
          <MovieCard movie={m} />
        </Col>
      ))}
    </>
  );
}

export default connect(mapStateToProps)(MoviesList);
