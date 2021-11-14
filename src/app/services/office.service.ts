import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class OfficeService {
  private apiUrl = 'http://localhost:4200/api/m2/postBranchLocation';
  constructor(private http:HttpClient) { }

  getOffices(): Observable<any> {
    const body = {"ios":"100", "lan":"EN","ver":"100"};
    return this.http.post(this.apiUrl, body, httpOptions);
  }
}
