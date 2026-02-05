import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Facility } from '../../services/facility.service';
import { Equipment } from '../../services/equipment.service';

@Component({
    selector: 'app-tree-node',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="tree-node">
      <div class="node-content">
        <div class="node-info" (click)="toggleExpand()">
          <span class="expand-icon" [class.expanded]="isExpanded" *ngIf="hasChildren">▶</span>
          <span class="empty-icon" *ngIf="!hasChildren"></span>
          
          <div class="icon-wrapper facility-icon">
             <!-- Facility Icon -->
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8"/>
             </svg>
          </div>

          <span class="node-name">{{ facility.name }}</span>
          
          <span class="status-badge" [class.working]="facility.isWorking" [class.stopped]="!facility.isWorking">
            {{ facility.isWorking ? 'Running' : 'Stopped' }}
          </span>
        </div>

        <div class="node-actions">
          <button class="btn-icon" (click)="onAddChild()" title="Add Sub-Facility">+ Facility</button>
          <button class="btn-icon" (click)="onAddEquipment()" title="Add Equipment">+ Equipment</button>
          <button class="btn-icon" (click)="onEdit()" title="Edit">Edit</button>
          <button class="btn-icon danger" (click)="onDelete()" title="Delete">Delete</button>
        </div>
      </div>

      <div class="node-children" *ngIf="isExpanded">
        <!-- Recursive Facilities -->
        <app-tree-node
          *ngFor="let child of facility.children"
          [facility]="child"
          (addFacility)="addFacility.emit($event)"
          (addEquipment)="addEquipment.emit($event)"
          (editFacility)="editFacility.emit($event)"
          (deleteFacility)="deleteFacility.emit($event)"
          (editEquipment)="editEquipment.emit($event)"
          (deleteEquipment)="deleteEquipment.emit($event)"
        ></app-tree-node>

        <!-- Equipments -->
        <div class="equipment-node" *ngFor="let equip of facility.equipments">
          <div class="node-content equipment-content">
            <div class="node-info">
               <span class="empty-icon"></span>
               <div class="icon-wrapper equipment-icon">
                 <!-- Equipment Icon -->
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                   <circle cx="12" cy="12" r="3"/>
                   <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                 </svg>
               </div>
               <span class="node-name">{{ equip.name }}</span>
               <span class="status-badge" [class.working]="equip.isOperational" [class.stopped]="!equip.isOperational">
                  {{ equip.isOperational ? 'Operational' : 'Down' }}
               </span>
            </div>
            <div class="node-actions">
              <button class="btn-icon" (click)="editEquipment.emit(equip)">Edit</button>
              <button class="btn-icon danger" (click)="deleteEquipment.emit(equip.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .tree-node {
      margin-left: 20px;
      border-left: 1px solid rgba(255,255,255,0.1);
    }
    .node-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-radius: 8px;
      background: rgba(255,255,255,0.05);
      margin-bottom: 5px;
      transition: all 0.2s;
    }
    .node-content:hover {
      background: rgba(255,255,255,0.1);
      transform: translateX(5px);
    }
    .node-info {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      flex: 1;
    }
    .expand-icon {
      font-size: 10px;
      transition: transform 0.2s;
      width: 15px;
      color: rgba(255,255,255,0.6);
    }
    .expand-icon.expanded {
      transform: rotate(90deg);
    }
    .empty-icon {
      width: 15px;
    }
    .icon-wrapper {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .facility-icon {
      background: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
    }
    .equipment-icon {
      background: rgba(168, 85, 247, 0.2);
      color: #c084fc;
    }
    .node-name {
      font-weight: 500;
      color: #e2e8f0;
    }
    .status-badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 500;
    }
    .status-badge.working {
      background: rgba(34, 197, 94, 0.2);
      color: #4ade80;
    }
    .status-badge.stopped {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }
    .node-actions {
      display: flex;
      gap: 5px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .node-content:hover .node-actions {
      opacity: 1;
    }
    .btn-icon {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.2);
      color: rgba(255,255,255,0.8);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-icon:hover {
      background: rgba(255,255,255,0.1);
      color: white;
    }
    .btn-icon.danger:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      color: #f87171;
    }
    .equipment-node {
      margin-left: 20px;
    }
    .equipment-content {
      background: rgba(0,0,0,0.2);
    }
  `]
})
export class TreeNodeComponent {
    @Input() facility!: Facility;
    @Output() addFacility = new EventEmitter<Facility>(); // Emits parent facility
    @Output() addEquipment = new EventEmitter<Facility>(); // Emits parent facility
    @Output() editFacility = new EventEmitter<Facility>();
    @Output() deleteFacility = new EventEmitter<number>();
    @Output() editEquipment = new EventEmitter<Equipment>();
    @Output() deleteEquipment = new EventEmitter<number>();

    isExpanded = false;

    get hasChildren(): boolean {
        return (this.facility.children && this.facility.children.length > 0) ||
            (this.facility.equipments && this.facility.equipments.length > 0);
    }

    toggleExpand() {
        if (this.hasChildren) {
            this.isExpanded = !this.isExpanded;
        }
    }

    onAddChild() {
        this.addFacility.emit(this.facility);
    }

    onAddEquipment() {
        this.addEquipment.emit(this.facility);
    }

    onEdit() {
        this.editFacility.emit(this.facility);
    }

    onDelete() {
        this.deleteFacility.emit(this.facility.id);
    }
}
