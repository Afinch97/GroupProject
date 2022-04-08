import React from 'react';

// async function fetchRecommended() {
//   try {
//     const response = await flaskClient.get('/recommended/movie');
//     return response.data;
//   } catch (error) {
//     return error;
//   }
// }

// function FavoriteMovieList() {
//   const [movieRecommendations, setMovieRecommendations] = useState();
//   const [isLoading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchMovieList() {
//       setMovieRecommendations(await fetchRecommended());
//       setLoading(false);
//     }
//     fetchMovieList();
//   }, []);

//   return (
//     <div>
//       <h2>Favorite Movies</h2>
//       <div>
//         {isLoading && <div>Loading... </div>}
//         {!isLoading
//           && movieRecommendations.map((movie) => <MovieTile movie={movie} key={movie.id} />)}
//       </div>
//     </div>
//   );
// }

function ProfilePage() {
  return (
    <div>
      TDB
    </div>
  );
}

export default ProfilePage;
