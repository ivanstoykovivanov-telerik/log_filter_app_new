import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { LogService } from './log.service';
import { Log } from './Log';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  
  logs : Log[] = [];
  allLogs; 
  filter = new FormControl('');
  angForm: FormGroup;
  private startDate: string; 
  private endDate: string; 

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
    this.startDate = startDate._inputValue; 
    this.endDate = endDate._inputValue; 

    startTime = this.fixTime(startTime) ; 
    endTime = this.fixTime(endTime) ;

    let dateFrom : string =  `${startDate._inputValue}T${startTime.hour}:${startTime.minute}:${startTime.second}%2B03:00` ; 
    let dateTo : string =  `${endDate._inputValue}T${endTime.hour}:${endTime.minute}:${endTime.second}%2B03:00` ; 
    
    console.log(dateFrom);
    console.log(dateTo);

    const timeObj = {
      dateTo : dateTo,
      dateFrom : dateFrom
    }; 
    console.log(timeObj);
    
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
    // Logs displayed in "Unordered logs" section of the html
    const resultChanged = result.replace(/2019/g, "<br /><br /><span class='bg-primary text-white'>2019</span>"); 

    //Search Date : 
    const regex = /\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])*/g;
    let m;                //  every date found in the string of all logs
    let arrIndices = []; 
    let currentIndex = 0; 
    let lastIndex = 0; 
    let logs : Log[] = [];

    while ((m = regex.exec(result)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      arrIndices.push(m);
      console.log(m);
      
      if(m.index !== 0 ){
        lastIndex = currentIndex;
        currentIndex = m.index; 
        
        //LOG: 
        let currentLog = result.slice(lastIndex,currentIndex); 
        console.log(currentLog);

        let logElements = currentLog.split(" ");
        console.log(logElements);

        const contents : string[] = logElements.slice(4, logElements[length-1]);
        
        //a single log : 
        const logAsObj = new Log(logElements[0], logElements[1], logElements[2], contents ); 
        logs.push(logAsObj); 
      }

      currentIndex = m.index;
      
      console.log(m[0]);
      if (m.index === regex.lastIndex) {
          regex.lastIndex++;
      }
  }
    console.log(logs);
    this.logs = logs; 
    return resultChanged; 
  }



}
