import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Facility {
    id: number;
    name: string;
    isWorking: boolean;
    timeRunning: string; // ISO String
    parentId?: number | null;
    equipments: any[]; // Using any for now to avoid circular dependency, or define Equipment interface here/shared
    children: Facility[];
}

export interface CreateFacilityDto {
    name: string;
    isWorking: boolean;
    timeRunning: string;
    parentId?: number | null;
}

export interface UpdateFacilityDto {
    name: string;
    isWorking: boolean;
    timeRunning: string;
    parentId?: number | null;
}

@Injectable({
    providedIn: 'root'
})
export class FacilityService {
    private apiUrl = 'http://localhost:5246/Facility';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Facility[]> {
        return this.http.get<Facility[]>(this.apiUrl);
    }

    getById(id: number): Observable<Facility> {
        return this.http.get<Facility>(`${this.apiUrl}/${id}`);
    }

    create(data: CreateFacilityDto): Observable<Facility> {
        return this.http.post<Facility>(this.apiUrl, data);
    }

    update(id: number, data: UpdateFacilityDto): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, data);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
