import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Office } from 'src/app/Office';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {
  @Input() office: Office = {
    ads: '',
    efd: '',
    ste: '',
    lon: 0,
    nam: '',
    fax: '',
    key: '',
    lat: 0,
    distance: 0
  };
  @Output() onCloseModal:EventEmitter<any> = new EventEmitter();
  center: google.maps.LatLngLiteral = {
    lat: this.office.lat,
    lng: this.office.lon
  }
  constructor() { }

  ngOnInit(): void {
  }

  closeModal(): void{
    this.onCloseModal.emit();
  }

  printDistanceUnit(distance: number) {
    if (distance < 1) {
      return `${distance * 1000 } M`;
    } else {
      return `${distance} KM`;
    }
  }
}
