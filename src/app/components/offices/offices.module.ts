import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionComponent } from './description/description.component';
import { GoogleMapsModule } from '@angular/google-maps';


@NgModule({
  declarations: [
    DescriptionComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule
  ],
  exports: [DescriptionComponent]
})
export class OfficesModule { }
