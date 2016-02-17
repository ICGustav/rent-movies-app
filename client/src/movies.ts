import {Http, Headers} from 'angular2/http';
import {Store} from '@ngrx/store';
import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

const BASE_URL = 'http://localhost:3000/movies/';
const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

export interface Movie {
  id: number;
  name: string;
  createDate: string;
  duration: number;
  description: string;
  lastTimeBorrowed: string;
  lastTimeRefunded: string;
  alreadyBorrowed: boolean;
};

export interface AppStore {
  movies: Movie[];
  selectedMovie: Movie;
};

//-------------------------------------------------------------------
// MOVIES STORE
//-------------------------------------------------------------------
export const movies = (state: any = [], {type, payload}) => {
  let index: number;
  switch (type) {
    case 'ADD_MOVIES':
      return payload;
    case 'CREATE_MOVIE':
      return [...state, payload];
    case 'UPDATE_MOVIE':
      return state.map(movie => {
        return movie.id === payload.id ? Object.assign({}, movie, payload) : movie;
      });
    case 'DELETE_MOVIE':
      return state.filter(movie => {
        return movie.id !== payload.id;
      });
    case 'BORROW_MOVIE':
      return state.map(movie => {
        return movie.id === payload.id ? Object.assign({}, movie, payload) : movie;
      });
    case 'REFUND_MOVIE':
      return state.map(movie => {
        return movie.id === payload.id ? Object.assign({}, movie, payload) : movie;
      });
    default:
      return state;
  }
};

//-------------------------------------------------------------------
// SELECTED MOVIE STORE
//-------------------------------------------------------------------
export const selectedMovie = (state: any = null, {type, payload}) => {
  switch (type) {
    case 'SELECT_MOVIE':
      return payload;
    default:
      return state;
  }
};

//-------------------------------------------------------------------
// MOVIES SERVICE
//-------------------------------------------------------------------
@Injectable()
export class MoviesService {
  movies: Observable<Array<Movie>>;

  constructor(private http: Http, private store: Store<AppStore>) {
    this.movies = store.select('movies');
  }

  loadMovies() {
    this.http.get(BASE_URL)
      .map(res => res.json())
      .map(payload => ({ type: 'ADD_MOVIES', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  saveMovie(movie: Movie) {
    (movie.id) ? this.updateMovie(movie) : this.createMovie(movie);
  }

  createMovie(movie: Movie) {
    // movie.createDate = new Date(movie.createDate).toDateString();
    this.http.post(`${BASE_URL}`, JSON.stringify(movie), HEADER)
      .map(res => res.json())
      .map(payload => ({ type: 'CREATE_MOVIE', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  updateMovie(movie: Movie) {
    this.http.put(`${BASE_URL}${movie.id}`, JSON.stringify(movie), HEADER)
      .subscribe(action => this.store.dispatch({ type: 'UPDATE_MOVIE', payload: movie }));
  }

  deleteMovie(movie: Movie) {
    this.http.delete(`${BASE_URL}${movie.id}`)
      .subscribe(action => this.store.dispatch({ type: 'DELETE_MOVIE', payload: movie }));
  }
}
