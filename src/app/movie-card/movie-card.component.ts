import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  favMovies: any[] =[];
  user: any = {};
  constructor(
    public fetchApiData: UserRegistrationService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getMovies();
    this.fetchApiData.getUserData();
    this.getFavoriteMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getUserData().subscribe((resp: any) => {
      this.favMovies = resp.FavoriteMovies || [];
      console.log('Favorite Movies:', this.favMovies);
    });
  }

  isFavorite(movie: any): boolean {
    return this.favMovies.includes(movie._id);
  }

  toggleFavorite(movie: any): void {
    if (this.isFavorite(movie)) {
      // Remove from favorites
      this.fetchApiData.deleteFavMovie(this.user, movie._id).subscribe(
        () => {
          console.log(`${movie.Title} removed from favorites.`);
          this.favMovies = this.favMovies.filter(
            (id) => id !== movie._id
          ); // Update UI
          // Show a snackbar notification
          this.snackBar.open(`${movie.Title} removed from favorites.`, 'OK', {
            duration: 3000,
          });
        },
        (error) => {
          console.error(`Error removing ${movie.Title} from favorites:`, error);
          this.snackBar.open(
            `Could not remove ${movie.Title} from favorites.`,
            'OK',
            {
              duration: 3000,
            }
          );
        }
      );
    } else {
      // Add to favorites
      this.fetchApiData.addFavMovie(this.user, movie._id).subscribe(
        () => {
          console.log(`${movie.Title} added to favorites.`);
          this.favMovies.push(movie._id); // Update UI
          // Show a snackbar notification
          this.snackBar.open(`${movie.Title} added to favorites.`, 'OK', {
            duration: 3000,
          });
        },
        (error) => {
          console.error(`Error adding ${movie.Title} to favorites:`, error);
          this.snackBar.open(
            `Could not add ${movie.Title} to favorites.`,
            'OK',
            {
              duration: 3000,
            }
          );
        }
      );
    }
  }

  openDialog(type: string, data: any): void {
    console.log('Dialog Type:', type);
    console.log('Dialog Data:', data);
    this.dialog.open(MovieDialogComponent, {
      data: { type, data },
      width: '400px',
    });
  }
}