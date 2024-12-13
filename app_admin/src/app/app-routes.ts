import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TripListingComponent } from './trip-listing/trip-listing.component';
import { AddTripComponent } from './add-trip/add-trip.component';
import { EditTripComponent } from './edit-trip/edit-trip.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    { path: 'add-trip', component: AddTripComponent },
    { path: 'edit-trip', component: EditTripComponent },
    { path: 'login', component: LoginComponent },
    { path: 'list-trips', component: TripListingComponent },
    { path: '', redirectTo: '/list-trips', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent }
];