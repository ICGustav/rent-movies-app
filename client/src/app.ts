import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {MoviesService, Movie, AppStore} from './movies';
// import {MyDate} from './utils/date';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';

//-------------------------------------------------------------------
// MOVIES-LIST
//-------------------------------------------------------------------
@Component({
  selector: 'movies-list',
  directives: [NgClass],
  template: `
  <div *ngFor="#movie of movies" (click)="selected.emit(movie)"
    class="movie-card mdl-card mdl-shadow--2dp"
    [ngClass]="{borrowed: movie.alreadyBorrowed}">
    <div class="mdl-card__title">
      <h2 class="mdl-card__title-text">{{movie.name}}</h2>
    </div>
    <div class="mdl-card__supporting-text">
      {{movie.description}}
    </div>
    <div class="mdl-card__menu">
      <button (click)="deleted.emit(movie); $event.stopPropagation();"
        class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
        <i class="material-icons">close</i>
      </button>
    </div>
  </div>
  `
})
class MovieList {
  @Input() movies: Movie[];
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}

//-------------------------------------------------------------------
// MOVIE DETAIL
//-------------------------------------------------------------------
@Component({
  selector: 'movie-detail',
//   directives: [MyDate],
  template: `
  <div class="movie-card mdl-card mdl-shadow--2dp">
    <div class="mdl-card__title">
      <h2 class="mdl-card__title-text" *ngIf="selectedMovie.id">Editing {{originalName}}</h2>
      <h2 class="mdl-card__title-text" *ngIf="!selectedMovie.id">Create New Movie</h2>
    </div>
    <div class="mdl-card__supporting-text">
      <form novalidate>
          <div class="mdl-textfield mdl-js-textfield">
            <label>Movie Name</label>
            <input [(ngModel)]="selectedMovie.name"
              placeholder="Enter a name of movie"
              class="mdl-textfield__input" type="text">
          </div>

          <div class="mdl-textfield mdl-js-textfield">
            <label>Movie Created</label>
            <input [(ngModel)]="selectedMovie.createDate"
              placeholder="Create date of the movie"
              class="mdl-textfield__input" type="date">
          </div>

          <div class="mdl-textfield mdl-js-textfield">
            <label>Movie Duration</label>
            <input [(ngModel)]="selectedMovie.duration"
              placeholder="Enter how long is the movie"
              class="mdl-textfield__input" type="number">
          </div>

          <div class="mdl-textfield mdl-js-textfield">
            <label>Movie Description</label>
            <input [(ngModel)]="selectedMovie.description"
              placeholder="Enter a description"
              class="mdl-textfield__input" type="text">
          </div>

          <div class="mdl-textfield mdl-js-textfield">
            <label>Movie last time borrowed</label>
            <input [(ngModel)]="selectedMovie.lastTimeBorrowed"
              placeholder="Was not borrowed yet!"
              class="mdl-textfield__input" type="text"
              readonly="true">
          </div>

          <div class="mdl-textfield mdl-js-textfield">
            <label>Movie last time refunded</label>
            <input [(ngModel)]="selectedMovie.lastTimeRefunded"
              placeholder="Was not refunded yet!"
              class="mdl-textfield__input" type="text"
              readonly="true">
          </div>
      </form>
    </div>
    <div class="mdl-card__actions">
        <button type="submit" (click)="cancelled.emit(selectedMovie)"
          class="mdl-button mdl-js-button mdl-js-ripple-effect">Cancel</button>
        <button type="submit" (click)="saved.emit(selectedMovie)"
          class="mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect">Save</button>
        <button type="submit" (click)="borrow.emit(selectedMovie)"
          class="mdl-button mdl-js-button mdl-button--primary mdl-js-ripple-effect">Borrow</button>
    </div>
  </div>
  `
})
class MovieDetail {
  @Input('movie') _movie: Movie;
  originalName: string;
  selectedMovie: Movie;
  @Output() saved = new EventEmitter();
  @Output() cancelled = new EventEmitter();
  @Output() borrow = new EventEmitter();

  set _movie(value: Movie){
    if (value) this.originalName = value.name;
	  this.selectedMovie = Object.assign({}, value);
  }
}

//-------------------------------------------------------------------
// MAIN COMPONENT
//-------------------------------------------------------------------
@Component({
  selector: 'my-app',
  providers: [],
  template: `
  <div class="mdl-cell mdl-cell--6-col">
    <movies-list [movies]="movies | async"
      (selected)="selectMovie($event)" (deleted)="deleteMovie($event)">
    </movies-list>
  </div>
  <div class="mdl-cell mdl-cell--6-col">
    <movie-detail
      (saved)="saveMovie($event)" (cancelled)="resetMovie($event)" (borrow)="borrowMovie($event)"
      [movie]="selectedMovie | async">Select an Movie</movie-detail>
  </div>
  `,
  directives: [MovieList, MovieDetail],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  movies: Observable<Array<Movie>>;
  selectedMovie: Observable<Movie>;

  constructor(private moviesService: MoviesService, private store: Store<AppStore>) {
    this.movies = moviesService.movies;
    this.selectedMovie = store.select('selectedMovie');
    this.selectedMovie.subscribe(v => console.log('Selected Movie:', v));

    moviesService.loadMovies();
  }

  resetMovie() {
    let emptyMovie: Movie = {
        id: null,
        name: '',
        createDate: '',
        duration: 0,
        description: '',
        lastTimeBorrowed: '',
        lastTimeRefunded: '',
        alreadyBorrowed: false
    };
    this.store.dispatch({type: 'SELECT_MOVIE', payload: emptyMovie});
  }

  selectMovie(movie: Movie) {
    this.store.dispatch({type: 'SELECT_MOVIE', payload: movie});
  }

  saveMovie(movie: Movie) {
    // if unfied date standard set uncomment row below
    // movie.createDate = new Date(movie.createDate).toDateString();
    this.moviesService.saveMovie(movie);
    this.resetMovie();
  }

  borrowMovie(movie: Movie) {
    // if is already borrowed set value of lastTimeBorrowed otherwise set value of lastTimeRefunded
    (movie.alreadyBorrowed === false)
        ? movie.lastTimeBorrowed = new Date(new Date().setHours(0, 0, 0, 0)).toDateString()
        : movie.lastTimeRefunded = new Date(new Date().setHours(0, 0, 0, 0)).toDateString();
    // change boolean value of state of alreadyBorrowed
    movie.alreadyBorrowed = !movie.alreadyBorrowed;
    // just console log
    (movie.alreadyBorrowed === false)
        ? console.log('Result of borrowing movie method:', movie)
        : console.log('Result of refunding movie method:', movie);
    // call PUT service to update values on server side
    this.moviesService.updateMovie(movie);
  }

  deleteMovie(movie: Movie) {
    this.moviesService.deleteMovie(movie);
  }
}
