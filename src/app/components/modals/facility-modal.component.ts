import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Facility } from '../../services/facility.service';

@Component({
    selector: 'app-facility-modal',
    standalone: true, // Use standalone component
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="modal-overlay" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h2>{{ isEditMode ? 'Edit' : 'New' }} Facility</h2>
        
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          
          <div class="form-group">
            <label for="name">Facility Name</label>
            <input 
              type="text" 
              id="name" 
              class="form-control" 
              formControlName="name" 
              placeholder="e.g., Main Building"
            />
            <div *ngIf="form.get('name')?.touched && form.get('name')?.invalid" class="error-text">
              Name is required
            </div>
          </div>

          <div class="form-group checkbox-group">
            <label class="switch">
              <input type="checkbox" formControlName="isWorking">
              <span class="slider round"></span>
            </label>
            <span>Is Facility Active?</span>
          </div>

          <!-- TimeRunning field for completeness, though usually auto-managed or simpler -->
          <div class="form-group" style="display: none;"> <!-- Hidden for now unless user wants to edit time -->
             <label>Time Running</label>
             <input type="datetime-local" formControlName="timeRunning">
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="form.invalid || isLoading">
               {{ isLoading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    }
    .modal-content {
      background: #1e1b4b; /* Dark blue/purple to match theme */
      padding: 2rem;
      border-radius: 12px;
      width: 100%;
      max-width: 400px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      color: white;
    }
    h2 { margin-top: 0; color: white; }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #a5b4fc; }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      font-size: 1rem;
    }
    .form-control:focus {
      outline: none;
      border-color: #6366f1;
      background: rgba(255, 255, 255, 0.1);
    }
    .error-text { color: #f87171; font-size: 0.8rem; margin-top: 5px; }
    
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }
    .btn-secondary {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-primary {
      background: #6366f1;
      border: none;
      color: white;
      padding: 0.5rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

    /* Toggle Switch */
    .checkbox-group { display: flex; align-items: center; gap: 10px; }
    .switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
    }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 34px;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
    input:checked + .slider { background-color: #6366f1; }
    input:checked + .slider:before { transform: translateX(20px); }
  `]
})
export class FacilityModal implements OnInit {
    @Input() facility: Facility | null = null; // If null, create mode
    @Input() parentId: number | null = null;
    @Output() save = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    form: FormGroup;
    isLoading = false;

    get isEditMode() { return !!this.facility; }

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            isWorking: [true],
            timeRunning: [new Date().toISOString()] // Default to now
        });
    }

    ngOnInit() {
        if (this.facility) {
            this.form.patchValue({
                name: this.facility.name,
                isWorking: this.facility.isWorking,
                timeRunning: this.facility.timeRunning
            });
        }
    }

    onCancel() {
        this.cancel.emit();
    }

    onSubmit() {
        if (this.form.valid) {
            this.isLoading = true;
            const formData = {
                ...this.form.value,
                parentId: this.parentId // Attach parentId on create if provided
            };

            this.save.emit(formData);
        }
    }
}
