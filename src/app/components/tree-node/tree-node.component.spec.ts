import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeNodeComponent } from './tree-node.component';
import { Facility } from '../../services/facility.service';

describe('TreeNodeComponent', () => {
    let component: TreeNodeComponent;
    let fixture: ComponentFixture<TreeNodeComponent>;

    const mockFacility: Facility = {
        id: 1,
        name: 'Test Facility',
        isWorking: true,
        timeRunning: new Date().toISOString(),
        children: [],
        equipments: []
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TreeNodeComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TreeNodeComponent);
        component = fixture.componentInstance;
        component.facility = mockFacility;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display facility name', () => {
        const element = fixture.nativeElement;
        expect(element.textContent).toContain('Test Facility');
    });

    it('should emit addFacility event', () => {
        const spy = vi.spyOn(component.addFacility, 'emit');
        component.onAddChild();
        expect(spy).toHaveBeenCalledWith(mockFacility);
    });
});
