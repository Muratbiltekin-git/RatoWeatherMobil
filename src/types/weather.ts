export type TemperatureUnit = 'C' | 'F';

export type Language = 'en' | 'tr';

export type ThemeMode = 'dark' | 'light';

export type ScreenView = 'forecast' | 'radar' | 'atmosphere' | 'locations';

export type WeatherConditionKind =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'storm'
  | 'snow';

export interface CityLocation {
  id: string;
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CurrentWeather {
  temperatureC: number;
  feelsLikeC: number;
  humidity: number;
  dewPointC: number;
  pressureHpa: number;
  pressureTrend: 'rising' | 'steady' | 'falling';
  windSpeedKmh: number;
  windGustsKmh: number;
  windDirectionDeg: number;
  uvIndex: number;
  visibilityKm: number;
  cloudCover: number;
  precipitationMm: number;
  isDay: boolean;
  weatherCode: number;
  conditionLabel: string;
  conditionKind: WeatherConditionKind;
  highC: number;
  lowC: number;
  sunriseIso: string;
  sunsetIso: string;
}

export interface HourlyForecastItem {
  timeIso: string;
  hourLabel: string;
  temperatureC: number;
  feelsLikeC: number;
  precipProbability: number;
  precipitationMm: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  uvIndex: number;
  humidity: number;
  cloudCover: number;
  isDay: boolean;
  weatherCode: number;
  conditionLabel: string;
  conditionKind: WeatherConditionKind;
}

export interface DailyForecastItem {
  dateIso: string;
  dayName: string;
  shortDate: string;
  tempMaxC: number;
  tempMinC: number;
  precipProbabilityMax: number;
  precipitationSumMm: number;
  uvIndexMax: number;
  windSpeedMaxKmh: number;
  sunriseIso: string;
  sunsetIso: string;
  weatherCode: number;
  conditionLabel: string;
  conditionKind: WeatherConditionKind;
}

export interface AirQualityData {
  usAqi: number;
  pm25: number;
  pm10: number;
  ozone: number;
  no2: number;
  so2: number;
  co: number;
  ratingLabel: string;
  advisoryText: string;
}

export interface WeatherBundle {
  location: CityLocation;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality: AirQualityData;
  fetchedAtIso: string;
  source: 'live' | 'cached';
}

export interface CitySummary {
  location: CityLocation;
  temperatureC: number;
  highC: number;
  lowC: number;
  humidity: number;
  windSpeedKmh: number;
  conditionLabel: string;
  conditionKind: WeatherConditionKind;
  isDay: boolean;
  localTimeLabel: string;
}
