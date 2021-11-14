import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { take } from 'rxjs';
import { OfficeService } from 'src/app/services/office.service';
import { Office } from '../../Office';
import * as _ from 'lodash';

@Component({
  selector: 'app-offices',
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss']
})
export class OfficesComponent implements OnInit {
  showDescription: boolean = false;
  showFilter: boolean = false;
  offices:Office[] = [];
  filteredOffices:Office[] = [];
  filteredStates = [
    {
      name: 'Johor',
      checked: true
    },
    {
      name: 'Kedah',
      checked: true
    },
    {
      name: 'Kelantan',
      checked: true
    }
    ,{
      name: 'Kuala Lumpur',
      checked: true
    },
    {
      name: 'Melaka',
      checked: true
    },
    {
      name: 'Negeri Sembilan',
      checked: true
    },
    {
      name: 'Perak',
      checked: true
    },
    {
      name: 'Perlis',
      checked: true
    },
    {
      name: 'Pulau Pinang',
      checked: true
    },
    {
      name: 'Sabah',
      checked: true
    },
    {
      name: 'Sarawak',
      checked: true
    },
    {
      name: 'Terengganu',
      checked: true
    }
  ];
  allState: boolean = true;
  selectedOffice:Office = {
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
  position: any = {}
  keyword: string = '';
  sortAscName: boolean = false;
  sortAscDistance: boolean = false;

  constructor(private officeService: OfficeService, private readonly geolocation$: GeolocationService) { }

  ngOnInit(): void {
    this.geolocation$.pipe(take(1)).subscribe(position => {
      this.position = position.coords;
      this.getOffices();
    });
  }

  toggleDescription(office: Object) {
    this.showDescription = !this.showDescription;
  }

  openDescription(office: Office) {
    this.selectedOffice  = office;
    this.showDescription = true;
  }

  closeDescription() {
    this.showDescription = false;
  }

  getOffices() {
    this.officeService.getOffices().subscribe((offices) => {
      this.offices = offices.lis;
      const newOffices = this.offices.map(office => {
        let tmp = office;
        tmp.distance = parseFloat(this.getDistance(office.lat, office.lon));
        return tmp;
      })
      this.offices = newOffices;
      this.filterResults('');
    });
  }

  getDistance(lat1: number, lon1: number) {
    const lat2 = this.position.latitude;
    const lon2 = this.position.longitude;
    var unit = 'KM';

    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;

    if (dist < 1) {
      dist = dist * 1000;
      unit = 'M';
    };

    return dist.toFixed(1);
  }

  printDistanceUnit(distance: number) {
    if (distance < 1) {
      return `${distance * 1000 } M`;
    } else {
      return `${distance} KM`;
    }
  }

  filterResults(keyword: string) {
    if (keyword == '') {
      this.filteredOffices = this.offices;
      this.filterStates();
    } else {
      this.filteredOffices = this.offices.filter(office => {
        return office.ads.toLowerCase().includes(keyword.toLowerCase()) || office.nam.toLowerCase().includes(keyword.toLowerCase());
      });
      this.filterStates();
    }
  }

  filterStates() {
    const newOffices = this.filteredOffices.filter(office => {
      let keys: string[] = [];
      this.filteredStates.forEach(state => {
        if(state.checked) {
          keys.push(state.name);
        }
      });
      return keys.some(elem => office.ads.includes(elem));
    });

    this.filteredOffices = newOffices;
  }

  sortByDistance() {
    this.filteredOffices = _.orderBy(this.offices, ['distance'], this.sortAscDistance ? 'asc' : 'desc');
    this.sortAscDistance = !this.sortAscDistance;
  }

  sortByName() {
    this.filteredOffices = _.orderBy(this.offices, ['nam'], this.sortAscName ? 'asc' : 'desc');
    this.sortAscName = !this.sortAscName;
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  toggleAllState() {
    if (this.allState) {
      const newStates = this.filteredStates.map(state => {
        let obj = state;
        obj.checked = true;
        return obj;
      })
      this.filteredStates = newStates;
    } else {
      const newStates = this.filteredStates.map(state => {
        let obj = state;
        obj.checked = false;
        return obj;
      })
      this.filteredStates = newStates;
    }
  }

  updateCheckedStates() {
    let allChecked = true;
    this.filteredStates.forEach(state => {
      if (!state.checked) allChecked = false;
    });
    this.allState = allChecked;
  }

  resetStates() {
    this.filteredStates = this.filteredStates.map(state => {
      let updatedStates = state;
      updatedStates.checked = true;
      return updatedStates;
    });
    this.updateCheckedStates();
  }
}
