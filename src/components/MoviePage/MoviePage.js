import PropTypes from 'prop-types';
import './MoviePage.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MoviePage({ movie: initialMovie, onBackClick }) {
  const { movieID } = useParams();
  const [movie, setMovie] = useState(initialMovie || null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!initialMovie) {
      handleMovieSelection(movieID);
    }
  }, [movieID, initialMovie]);

  const handleMovieSelection = async (id) => {
    try {
      const response = await fetch(`https://rancid-tomatillos.herokuapp.com/api/v2/movies/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      const data = await response.json();
      setMovie(data.movie);
    } catch (error) {
      setError(true);
    }
  };

  if (error) {
    return <div>Error: Failed to fetch movie details. Please try again later.</div>;
  }

  if (!movie) {
    return <div>Loading...</div>;
  }

  const backdropStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)), url(${movie.backdrop_path})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="movie-detail" style={backdropStyle}>
      <button onClick={onBackClick}>Back to All Movies</button>
      <div className='poster'>
        <img src={movie.poster_path} alt={movie.title} />
      </div>
      <div className='movieSpecs'>
        <h3 className='movie-title'>{movie.title}</h3>
        <h4 className='movie-rating'>⭐️ {movie.average_rating.toFixed(2)}</h4>
        <h4 className='movie-released'>Released: {movie.release_date}</h4>
        <div className='overview'>
          <p>Overview: {movie.overview}</p>
          <p>Movie Length: {movie.runtime} min.</p>
        </div>
      </div>
    </div>
  );
}

MoviePage.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    backdrop_path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    release_date: PropTypes.string.isRequired,
    average_rating: PropTypes.number.isRequired,
  }).isRequired,
  onBackClick: PropTypes.func.isRequired,
};

export default MoviePage;
