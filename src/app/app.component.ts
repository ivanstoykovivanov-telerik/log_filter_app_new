import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { LogService } from './log.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  events : []; 
  allLogs; 
  filter = new FormControl('');
  angForm: FormGroup;

  constructor(
    private logService : LogService, 
    private fb: FormBuilder,
    ){
      this.createForm(); 
  }

  ngOnInit(){
    console.log(this.allLogs);
  }

  createForm(){
    this.angForm = this.fb.group({
    })
  }
 

  displayBinary(binary : Blob){
    let fileReader = new FileReader();
    fileReader.onload = (event: any) => {
      var contents = event.target.result;
      console.log(contents);
      let brContents = this.parseLog(contents); 
      this.allLogs = brContents; 
     
    }
    fileReader.readAsText(binary);
    
  }

  onClickFind(startTime, endTime, startDate, endDate){
    console.log("Time: ");
    console.log(startTime);
    console.log(endTime);
    
    console.log("Date :");
    console.log(startDate._inputValue);
    console.log(endDate._inputValue);

    startTime = this.fixTime(startTime) ; 
    endTime = this.fixTime(endTime) ;

    console.log(startTime);
    console.log(endTime);

    let dateFrom : string =  `${startDate._inputValue}T${startTime.hour}:${startTime.minute}:${startTime.second}%2B03:00` ; 
    let dateTo : string =  `${endDate._inputValue}T${endTime.hour}:${endTime.minute}:${endTime.second}%2B03:00` ; 
    
    console.log(dateFrom);
    console.log(dateTo);

    const timeObj = {
      dateTo : dateTo,
      dateFrom : dateFrom
    }; 
    
    this.getBinaryFinal(timeObj); 
  }

  getBinaryFinal(time: {dateTo, dateFrom}){
    this.logService.getLogsFinal(time.dateTo, time.dateFrom).subscribe(
      (res: any) => {
       console.log(res);
       let binaryID = res.events[0].c8y_IsBinary.name ; 
       console.log(binaryID);

       this.logService.getBinaryFile(binaryID).subscribe(
        (res: any) => {
          this.displayBinary(res); 
        }
       ) 
      }
    ) 
  }

  removeFirstZero(num){
   let number : string = num.toString(); 
    if(number.charAt(0) === '0' ){
      return number.substr(1); 
    }
  }

  fixTime(time){
    
    if(Number(time.hour < 10)){
      this.removeFirstZero(time.hour); 
      time.hour = `0${time.hour}`; 
    }
    
    if(Number(time.minute < 10)){
      this.removeFirstZero(time.minute); 
      time.minute = `0${time.minute}`; 
    }

    if(Number(time.second < 10)){
      this.removeFirstZero(time.second); 
      time.second = `0${time.second}`; 
    }

    return time; 
  }

  parseLog(result){

    //Date: 
    const resultChanged = result.replace(/2019/g, "<br /><br /><span class='bg-primary text-white'>2019</span>"); 
    console.log(resultChanged);

    
    
    return resultChanged; 
  }

}
