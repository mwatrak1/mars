export interface WeatherResponse {
  sols: MarsWeather[];
}

export interface MarsWeather {
  terrestrial_date: string;
  sol: string;
  ls: string;
  season: string;
  min_temp: number;
  max_temp: number;
  pressure: number;
  sunrise: string;
  sunset: string;
}
