import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { FacilityService } from '../../services/facility.service';
import { EquipmentService } from '../../services/equipment.service';
import { ToastService } from '../../services/toast.service';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let facilityServiceMock: any;
  let equipmentServiceMock: any;
  let toastServiceMock: any;

  beforeEach(async () => {
    facilityServiceMock = {
      getAll: vi.fn().mockReturnValue(of([])),
      delete: vi.fn(),
      create: vi.fn(),
      update: vi.fn()
    };

    equipmentServiceMock = {
      delete: vi.fn(),
      create: vi.fn(),
      update: vi.fn()
    };

    toastServiceMock = {
      show: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: FacilityService, useValue: facilityServiceMock },
        { provide: EquipmentService, useValue: equipmentServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load facilities on init', () => {
    expect(facilityServiceMock.getAll).toHaveBeenCalled();
  });
});
