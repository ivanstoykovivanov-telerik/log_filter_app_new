import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap' ;
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DecimalPipe } from '@angular/common';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [ 
        BrowserModule,
        HttpClientModule,
        CommonModule, 
        FormsModule,
        ReactiveFormsModule,
        NgbModule
      ],
      providers: [DecimalPipe]      
    })
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create the app', async(() => {    
    expect(component).toBeTruthy();
  }));

  it('should render label From', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.labelTime').textContent).toContain('From');
  });

  describe('removeFirstZero', () => {
    it('should be defined', () => {
      expect(component.removeFirstZero).toBeDefined();
    });

    it('should return 5 when 05', () => {
      expect(component.removeFirstZero('05')).toEqual('5');
    });

    it('should return 5 when number 5', () => {
      expect(component.removeFirstZero(5)).toEqual('5');
    });

    it('should return 05 when 005', () => {
      expect(component.removeFirstZero('005')).toEqual('05');
    });
  });

  describe('fixTime', () => {
    it('should be defined', () => {
      expect(component.fixTime).toBeDefined();
    });

    it('should empty object when empty object comes', () => {
      expect(JSON.stringify(component.fixTime({}))).toEqual('{}');
    });

    it('{hour: 1, minute: 1, second: 1} should be equal to {"hour":"01","minute":"01","second":"01"}', () => {
      const param = {hour: 1, minute: 1, second: 1};
      expect(JSON.stringify(component.fixTime(param))).toEqual('{"hour":"01","minute":"01","second":"01"}');
    });

    it('{hour: 17, minute: 11, second: 10} should be equal to {"hour":17,"minute":11,"second":10}', () => {
      const param = {hour: 17, minute: 11, second: 10};
      expect(JSON.stringify(component.fixTime(param))).toEqual('{"hour":17,"minute":11,"second":10}');
    });
  });
});
