import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Equipment {
    id: number;
    name: string;
    description: string;
    serialNumber: string;
    isOperational: boolean;
    facilityId: number;
}

export interface CreateEquipmentDto {
    name: string;
    description: string;
    serialNumber: string;
    isOperational: boolean;
    facilityId: number;
}

export interface UpdateEquipmentDto {
    name: string;
    description: string;
    serialNumber: string;
    isOperational: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class EquipmentService {
    private apiUrl = 'http://localhost:5246/Equipment';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Equipment[]> {
        return this.http.get<Equipment[]>(this.apiUrl);
    }

    getByFacilityId(facilityId: number): Observable<Equipment[]> {
        return this.http.get<Equipment[]>(`${this.apiUrl}/facility/${facilityId}`);
    }

    getById(id: number): Observable<Equipment> {
        return this.http.get<Equipment>(`${this.apiUrl}/${id}`);
    }

    create(data: CreateEquipmentDto): Observable<Equipment> {
        return this.http.post<Equipment>(this.apiUrl, data);
    }

    update(id: number, data: UpdateEquipmentDto): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, data);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
