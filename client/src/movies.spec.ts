import {movies, selectedMovie} from './movies';

import {
  it,
  describe,
  expect
} from 'angular2/testing';

describe('Movies', () => {
  describe('`selectedMovie` store', () => {
    it('returns null by default', () => {
      let defaultState = selectedMovie(undefined, {type: 'random', payload: {}});

      expect(defaultState).toBeNull();
    });

    it('`SELECT_MOVIE` returns the provided payload', () => {
      let selectMovie = selectedMovie(undefined, {type: 'SELECT_MOVIE', payload: 'payload'});

      expect(selectMovie).toBe('payload');
    });
  });

  describe('`movies` store', () => {
    let initialState = [
      { id: 0, name: 'First Movie' },
      { id: 1, name: 'Second Movie' }
    ];

    it('returns an empty array by default', () => {
      let defaultState = movies(undefined, {type: 'random', payload: {}});

      expect(defaultState).toEqual([]);
    });

    it('`ADD_MOVIES`', () => {
      let payload = initialState,
          stateMovies = movies([], {type: 'ADD_MOVIES', payload: payload});

      expect(stateMovies).toEqual(payload);
    });

    it('`CREATE_MOVIE`', () => {
      let payload = {id: 2, name: 'added movie'},
          result = [...initialState, payload],
          stateMovies = movies(initialState, {type: 'CREATE_MOVIE', payload: payload});

      expect(stateMovies).toEqual(result);
    });

    it('`UPDATE_MOVIE`', () => {
      let payload = { id: 1, name: 'Updated Movie' },
          result = [ initialState[0], { id: 1, name: 'Updated Movie' } ],
          stateMovies = movies(initialState, {type: 'UPDATE_MOVIE', payload: payload});

      expect(stateMovies).toEqual(result);
    });

    it('`DELETE_MOVIE`', () => {
      let payload = { id: 0 },
          result = [ initialState[1] ],
          stateMovies = movies(initialState, {type: 'DELETE_MOVIE', payload: payload});

      expect(stateMovies).toEqual(result);
    });
  });
});
