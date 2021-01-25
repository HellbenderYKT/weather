import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { element } from 'protractor';
import { of, throwError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';

export const API_URL = 'http://api.openweathermap.org/data/2.5';
export const MY_KEY = '4315e5d498ac1e487940e7862c367d90';

export type City = {
  name: string;
  temp: number;
  icon: string;
  date: Date;
};

export class Response {
  weather: { id: number; main: string; description: string; icon: string }[];
  country: string;
  base: string;
  name: string;
  coord: { lon: number; lat: number };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
  sys: {
    type: number;
    id: number;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  cod: number;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  notification: string;

  city: string = 'London';

  list: City[] = [];

  error?: string;

  textColor: string;

  constructor(private httpClient: HttpClient) {
    console.log('constr');
  }

  ngOnInit() {}

  ngOnDestroy() {
    console.log('destroy');
  }

  handleClick() {
    const alreadyExist = this.list.some((item) => {
      return item.name.toUpperCase() === this.city.toUpperCase();
    });
    if (alreadyExist) {
      this.error = 'Такой город уже добавлен';
      return;
    }
    this.httpClient
      .get<Response>(
        `${API_URL}/weather?q=${this.city}&appid=${MY_KEY}&units=metric`
      )
      .pipe(catchError(this.handleError))
      .pipe(filter((response) => !(response instanceof HttpErrorResponse)))
      .pipe(map((response) => response as Response))
      .subscribe((response) => {
        if (this.error !== undefined) {
          this.error = undefined;
        }
        this.list.push({
          temp: response.main.temp,
          name: this.city,
          icon: response.weather[0].icon,
          date: new Date(),
        });
        this.city = '';
        this.notification = 'Новый город добавлен'
        setTimeout(() => {
          this.notification = '';
        }, 5000);
      });
  }

  handleError = (response: HttpErrorResponse) => {
    this.error = response.error.message;
    return of(response);
  };

  handleSort() {
    this.list.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
  }

  handleDelete(i: number) {
    // this.temp = undefined;
    this.list.splice(i, 1);
    // console.log(i);
  }

  handleRefresh(item: City) {
    console.log(item);
    this.httpClient
      .get<Response>(
        `${API_URL}/weather?q=${item.name}&appid=${MY_KEY}&units=metric`
      )
      .subscribe((response) => {
        item.temp = response.main.temp;
        item.icon = response.weather[0].icon;
        item.date = new Date();
      });
  }

  // handleChange(value: string) {
  //   // const value = event.target.value
  //   // this.city = (<HTMLInputElement>event.target).value;
  //   this.city = value;
  // }

  changetInput() {
    this.city = 'Morokko';
  }
}

// не добовлять дублирующий город
// показывать ошибку какой город не найден
// очищать инпут после добавления города
// добавить кнопку обновить погоду для города
//
