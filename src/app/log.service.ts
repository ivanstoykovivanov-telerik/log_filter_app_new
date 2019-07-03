import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import  * as credentials from  './credentials';

//Credentials for Login: 
const username = credentials.username ; 
const password = credentials.password ; 

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Basic ' + btoa(`${username}:${password}`)
  })
};

const httpOptionsBinary = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Basic ' + btoa(`${username}:${password}`)
  }), 
  responseType : "blob" as "json"
};


@Injectable({
  providedIn: 'root'
})
export class LogService { 
  
  private fragmentValue :string = "apama-oeeapp-scope-t44680917-deployment-5cc65d4f5f-ntdb9";  

  // private firstRequest : string = "https://adamosoeedev.adamos-dev.com/inventory/managedObjects?pageSize=100&type=c8y_Application_6447&withTotalPages=true"; 
  // private secondRequest: string = "https://adamosoeedev.adamos-dev.com/event/events"; 
  // private dateFrom = "2019-07-01T11:02:37%2B03:00"; 
  // private dateTo = "2019-07-01T11:12:37%2B03:00" ; 
  // private fragmentType: string = "c8y_Instance";
 
  // private type: string = "c8y_LogfileRequest" ; 
  // private pageSize: number = 100; 
  // private source: number = 3637;
 

  constructor(
    private httpClient: HttpClient  
  ) { }


  getLogsFinal(dateTo, dateFrom){
    let secondRequestN = `https://adamosoeedev.adamos-dev.com/event/events?fragmentValue=${this.fragmentValue}&dateTo=${dateTo}&fragmentType=c8y_Instance&source=3637&dateFrom=${dateFrom}&type=c8y_LogfileRequest&pageSize=100&currentPage=1`;   
    //First reuqest
     console.log(secondRequestN);
     return this.httpClient.get(secondRequestN, httpOptions); 
     //Second Request
  }

  getBinaryFile(binaryID){
    let requestN =  `https://adamosoeedev.adamos-dev.com/event/events/${binaryID}/binaries`; 
    return this.httpClient.get(requestN, httpOptionsBinary ); 
  }

}

