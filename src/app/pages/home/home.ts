import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Facility, FacilityService } from '../../services/facility.service';
import { Equipment, EquipmentService } from '../../services/equipment.service';
import { TreeNodeComponent } from '../../components/tree-node/tree-node.component';
import { ToastService } from '../../services/toast.service';
import { FacilityModal } from '../../components/modals/facility-modal.component';
import { EquipmentModal } from '../../components/modals/equipment-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TreeNodeComponent, FacilityModal, EquipmentModal],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  facilities = signal<Facility[]>([]);
  isLoading = signal<boolean>(false);

  // Modal State
  isFacilityModalOpen = false;
  isEquipmentModalOpen = false;

  selectedFacility: Facility | null = null; // For editing facility
  selectedParentId: number | null = null; // For creating child facility

  selectedEquipment: Equipment | null = null; // For editing equipment
  targetFacilityIdForEquipment: number | null = null; // For creating equipment

  constructor(
    private facilityService: FacilityService,
    private equipmentService: EquipmentService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadFacilities();
  }

  loadFacilities() {
    this.isLoading.set(true);
    console.log('Fetching facilities...');
    this.facilityService.getAll().subscribe({
      next: (data) => {
        console.log('Facilities loaded:', data);
        // Assume backend returns all nodes, filter for roots (parentId === null)
        const roots = data.filter(f => f.parentId === null);
        console.log('Root facilities:', roots);

        this.facilities.set(roots);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading facilities:', err);
        this.toastService.show('Failed to load facilities', 'error');
        this.isLoading.set(false);
      }
    });
  }

  // --- Facility Actions ---

  onAddFacility(parent: Facility | null) {
    this.selectedFacility = null; // Create mode
    this.selectedParentId = parent ? parent.id : null;
    this.isFacilityModalOpen = true;
  }

  onEditFacility(facility: Facility) {
    this.selectedFacility = facility; // Edit mode
    this.selectedParentId = facility.parentId || null;
    this.isFacilityModalOpen = true;
  }

  onSaveFacility(data: any) {
    if (this.selectedFacility) {
      // Update
      this.facilityService.update(this.selectedFacility.id, data).subscribe({
        next: () => {
          this.toastService.show('Facility updated!', 'success');
          this.closeModals();
          this.loadFacilities();
        },
        error: () => this.toastService.show('Failed to update facility', 'error')
      });
    } else {
      // Create
      this.facilityService.create(data).subscribe({
        next: () => {
          this.toastService.show('Facility created!', 'success');
          this.closeModals();
          this.loadFacilities();
        },
        error: () => this.toastService.show('Failed to create facility', 'error')
      });
    }
  }

  onDeleteFacility(id: number) {
    if (confirm('Are you sure you want to delete this facility? All children will be deleted too.')) {
      this.facilityService.delete(id).subscribe({
        next: () => {
          this.toastService.show('Facility deleted', 'success');
          this.loadFacilities();
        },
        error: () => this.toastService.show('Failed to delete facility', 'error')
      });
    }
  }

  // --- Equipment Actions ---

  onAddEquipment(facility: Facility) {
    this.selectedEquipment = null;
    this.targetFacilityIdForEquipment = facility.id;
    this.isEquipmentModalOpen = true;
  }

  onEditEquipment(equipment: Equipment) {
    this.selectedEquipment = equipment;
    this.targetFacilityIdForEquipment = equipment.facilityId;
    this.isEquipmentModalOpen = true;
  }

  onSaveEquipment(data: any) {
    if (this.selectedEquipment) {
      // Update
      this.equipmentService.update(this.selectedEquipment.id, data).subscribe({
        next: () => {
          this.toastService.show('Equipment updated!', 'success');
          this.closeModals();
          this.loadFacilities();
        },
        error: () => this.toastService.show('Failed to update equipment', 'error')
      });
    } else {
      // Create
      this.equipmentService.create(data).subscribe({
        next: () => {
          this.toastService.show('Equipment added!', 'success');
          this.closeModals();
          this.loadFacilities();
        },
        error: () => this.toastService.show('Failed to add equipment', 'error')
      });
    }
  }

  onDeleteEquipment(id: number) {
    if (confirm('Are you sure you want to delete this equipment?')) {
      this.equipmentService.delete(id).subscribe({
        next: () => {
          this.toastService.show('Equipment deleted', 'success');
          this.loadFacilities();
        },
        error: () => this.toastService.show('Failed to delete equipment', 'error')
      });
    }
  }

  closeModals() {
    this.isFacilityModalOpen = false;
    this.isEquipmentModalOpen = false;
    this.selectedFacility = null;
    this.selectedEquipment = null;
  }
}
