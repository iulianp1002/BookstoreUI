import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorDialogComponent } from './author-dialog.component';

describe('AuthorComponent', () => {
  let component: AuthorDialogComponent;
  let fixture: ComponentFixture<AuthorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorDialogComponent]
    });
    fixture = TestBed.createComponent(AuthorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
