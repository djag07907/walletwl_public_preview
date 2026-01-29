// import { provideZonelessChangeDetection } from '@angular/core';
// import { TestBed } from '@angular/core/testing';
// import { App } from '@core/app.component';

// describe('App', () => {
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [App],
//       providers: [provideZonelessChangeDetection()]
//     }).compileComponents();
//   });

//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(App);
//     const app = fixture.componentInstance;
//     expect(app).toBeTruthy();
//   });

//   it('should have angular-template as title', () => {
//     const fixture = TestBed.createComponent(App);
//     const app = fixture.componentInstance;
//     expect(app.title).toEqual('angular-template');
//   });

//   it('should render router-outlet', () => {
//     const fixture = TestBed.createComponent(App);
//     fixture.detectChanges();
//     const compiled = fixture.nativeElement as HTMLElement;
//     expect(compiled.querySelector('router-outlet')).toBeTruthy();
//   });
// });
import { provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { App } from "@core/app.component";

describe("App", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should render title", () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("h1")?.textContent).toContain(
      "Hello, developer!"
    );
  });
});
