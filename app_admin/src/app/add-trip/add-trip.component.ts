import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TripDataService } from '../services/trip-data.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css'
})
export class AddTripComponent implements OnInit {
  addForm!: FormGroup;
  submitted = false;
constructor(
  private formBuilder: FormBuilder,
  private router: Router,
  private tripService: TripDataService,
  private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
  this.addForm = this.formBuilder.group({
    _id: [],
    code: ['', Validators.required],
    name: ['', Validators.required],
    length: ['', Validators.required],
    start: ['', Validators.required],
    resort: ['', Validators.required],
    perPerson: ['', Validators.required],
    image: ['', Validators.required],
    description: ['', Validators.required],
    })
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public onSubmit() {
    this.submitted = true;
    if(this.addForm.valid){
      this.tripService.addTrip(this.addForm.value)
        .subscribe({
          next: (data: any) => {
            console.log('Success:', data);
            this.router.navigate(['/list-trips']);
          },
          error: (error: any) => {
            console.error('Error details:', error);
            if (error.status === 401) {
              alert('Authentication error. Please login again.');
              this.router.navigate(['/login']);
            } else {
              alert('Error saving trip: ' + (error.error?.message || error.message));
            }
          }
        });
    }
  }
// get the form short name to access the form fields
get f() { return this.addForm.controls; }
}
