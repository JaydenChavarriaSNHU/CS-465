import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';


@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrl: './edit-trip.component.css'
})
export class EditTripComponent implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message : string = '';
  showModal: boolean = false;
  tripCode: string = ''; 

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tripDataService: TripDataService
  ) {}
    
  ngOnInit() : void{

    // Retrieve stashed trip ID
    let tripCode = localStorage.getItem("tripCode");
    if (!tripCode) {
    alert("Something wrong, couldn’t find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }
    this.tripCode = tripCode;
    
    console.log('EditTripComponent::ngOnInit');
    console.log('tripcode:' + tripCode);
    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    })

    this.tripDataService.getTrip(tripCode)
    .subscribe({
      next: (value: any) => {
        this.trip = value;
        // Format the date before setting it in the form
        if (value[0]) {
          const tripData = value[0];
          // Format the date to YYYY-MM-DD
          const startDate = new Date(tripData.start);
          tripData.start = startDate.toISOString().split('T')[0];
          this.editForm.patchValue(tripData);
        }
        // ... rest of your code ...
      },
      error: (error: any) => {
        console.log('Error:', error);
      }
    })
}

onDeleteClick(): void {
  this.showModal = true;
}

cancelDelete(): void {
  this.showModal = false;
}

confirmDelete(): void {
  if (this.tripCode) { 
    this.tripDataService.deleteTrip(this.tripCode)
      .subscribe({
        next: () => {
          this.showModal = false;
          this.router.navigate(['/list-trips']);
        },
        error: (error) => {
          console.error('Error deleting trip:', error);
        }
      });
  }
}

public onSubmit() {
  this.submitted = true;
  if(this.editForm.valid) {
      console.log('Form data being submitted:', this.editForm.value);
      
      this.tripDataService.updateTrip(this.editForm.value)
          .subscribe({
              next: (result) => {
                  console.log('Update successful:', result);
                  this.router.navigate(['/list-trips']);
              },
              error: (error) => {
                  console.error('Update failed:', error);
                  if (error.status === 401) {
                      alert('Authentication error. Please login again.');
                      this.router.navigate(['/login']);
                  } else {
                      alert('Error updating trip: ' + (error.message || 'Unknown error'));
                  }
              }
          });
  }
}

// get the form short name to access the form fields
get f() { return this.editForm.controls; }
}