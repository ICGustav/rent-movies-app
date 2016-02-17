//main entry point
import {bootstrap} from 'angular2/platform/browser';
import {App} from './src/app';
import {provideStore} from '@ngrx/store';
import {MoviesService, movies, selectedMovie} from './src/movies';
import {HTTP_PROVIDERS} from 'angular2/http';

bootstrap(App, [
  MoviesService,
  HTTP_PROVIDERS,
  provideStore({movies, selectedMovie})
])
.catch(err => console.error(err));
