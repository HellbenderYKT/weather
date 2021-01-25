import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_URL, MY_KEY } from '../home-page/home-page.component';

type Response = {
  cod: string;
  message: number;
  cnt: number;
  list: Item[];
  city: CityResponse;
};

type Item = {
  main: { temp: number };
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
  wind: { speed: number };
  dt_txt: string;
};

type CityResponse = {
  id: number;
  name: string;
  coord: { lat: number; lon: number };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
};

@Component({
  selector: 'app-weather-page',
  templateUrl: './weather-page.component.html',
  styleUrls: ['./weather-page.component.scss'],
})
export class WeatherPageComponent implements OnInit {
  isLoading: boolean = false;

  weather: Response;

  list: Item[] = [];

  city: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      this.httpClient
        .get<Response>(
          `${API_URL}/forecast?q=${params.city}&appid=${MY_KEY}&units=metric&lang=ru`
        )
        .subscribe((response) => {
          this.isLoading = false;
          console.log(response);
          this.city = response.city.name;
          this.list = response.list;
          // console.log(response.list);
        });
    });
  }
}

/////// все параметры Item: ////////

// type Item = {
//   dt: number;
//   main: {
//     temp: number;
//     feels_like: number;
//     temp_min: number;
//     temp_max: number;
//     pressure: number;
//     sea_level: number;
//     grnd_level: number;
//     humidity: number;
//     temp_kf: number;
//   };
//   weather: [
//     {
//       id: number;
//       main: string;
//       description: string;
//       icon: string;
//     }
//   ];
//   clouds: { all: number };
//   wind: { speed: number; deg: number };
//   visibility: number;
//   pop: number;
//   sys: { pod: string };
//   dt_txt: string;
// };
