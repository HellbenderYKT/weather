import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { City } from '../home-page/home-page.component';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
})
export class CityComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Output()
  delete = new EventEmitter();

  @Output()
  refresh = new EventEmitter();

  @Input()
  index: number;

  @Input()
  data: City;

  onDelete() {
    this.delete.emit(this.index);
  }

  onRefresh() {
    this.refresh.emit(this.data);
  }
}
