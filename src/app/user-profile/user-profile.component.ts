import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserRegistrationService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MovieDialogComponent} from '../movie-dialog/movie-dialog.component'
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  //initialize
  user: any = {};
  userData: any ={};
  favMovies: any[] = [];
  movies: any[] = [];
  newPassword: any = "";
  editForm: FormGroup;
  isEditing: boolean = false;
  isLoading: boolean = true;

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
  ) {
    this.editForm = this.formBuilder.group({
      Username: [''],
      Password: [''],
      Email: [''],
      Birthday: [''],
    });
   }

  ngOnInit(): void {
    this.fetchApiData.getUserData().subscribe((resp: any) => {
      this.userData = resp;
      console.log('User data:', this.userData); // Debug user data
      // Once user data is loaded, fetch and filter favorite movies
      this.loadFavoriteMovies();
    });
  }

  openDialog(type: string, data: any): void {
    // console.log('Dialog Type:', type);
    // console.log('Dialog Data:', data);
    this.dialog.open(MovieDialogComponent, {
      data: { type, data },
      width: '400px',
    });
  }

  getUserData(): void {
    this.fetchApiData.getUserData().subscribe((resp: any) => {
      this.userData = resp;
      // console.log(this.userData);
      // console.log('FavoriteMovies (IDs):', this.userData.FavoriteMovies);

      if (this.userData.FavoriteMovies?.length > 0) {
        this.loadFavoriteMovies();
      } else {
        this.isLoading = false; // Set loading to false if no favorite movies
      }

      this.editForm.patchValue({
        Username: this.userData.Username,
        Email: this.userData.Email,
        Birthday: this.userData.Birthday,
      });
    });
  }

  /**
   * Enables editing of user data.
   */
  enableEdit(): void {
    this.isEditing = true;
  }

  /**
   * Saves changes to user data.
   */
  saveChanges(): void {
    if (this.editForm.valid) {
      this.fetchApiData
        .editUserDetails(this.user, this.editForm.value)
        .subscribe((resp: any) => {
          // console.log(resp);
          this.isEditing = false;
          this.getUserData();
        });
    }
  }

  /**
   * Cancels editing of user data.
   */
  cancelEdit(): void {
    this.isEditing = false;
    this.editForm.patchValue({
      Username: this.userData.Username,
      Email: this.userData.Email,
      Birthday: this.userData.Birthday,
    });
  }

  /**
   * Confirms and deletes the user profile.
   * If confirmed, the deleteProfile method is called.
   * If canceled, the dialog is closed.
   */
  confirmDelete(): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete your profile? This action is irreversible.'
    );
    if (confirmDelete) {
      this.deleteProfile();
    }
  }

  /**
   * Deletes the user profile.
   * On success, the user is logged out and redirected to the login or home page.
   */
  deleteProfile(): void {
    this.fetchApiData.deleteUserDetails(this.user).subscribe(
      () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Your profile has been deleted.');
        window.location.href = '/login'; // Redirect to login or home page
      }
      // (err) => console.error('Error deleting profile', err)
    );
  }

  /**
   * Fetches and filters favorite movies.
   * The favoriteMovies array is populated with full movie details.
   */
  loadFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (movies: any[]) => {
        // console.log('All movies:', movies); // Debug all movies fetched
        this.favMovies = movies.filter((movie) =>
          this.userData.FavoriteMovies.includes(movie._id)
        );
        // console.log('Filtered favoriteMovies:', this.favoriteMovies); // Debug favorites
        this.isLoading = false; // Loading complete
      },
      (err: any) => {
        // console.error('Error fetching all movies:', err);
        this.isLoading = false; // Ensure loading state is false on error
      }
    );
  }


  
}

