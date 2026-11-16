import type { Language, WeatherConditionKind } from '../types/weather';

export interface Translations {
  nav: {
    forecast: string;
    radar: string;
    atmosphere: string;
    locations: string;
    cities: string;
    searchCity: string;
  };
  common: {
    refresh: string;
    updating: string;
    now: string;
    today: string;
    active: string;
    manageAll: string;
    feelsLike: string;
    highShort: string;
    lowShort: string;
    wind: string;
    precip: string;
    humidity: string;
    dewPoint: string;
    uvIndex: string;
    uvPeak: string;
    visibility: string;
    sunrise: string;
    sunset: string;
    condition: string;
    peakWind: string;
    sunriseSunset: string;
    languageLabel: string;
    unitLabel: string;
  };
  forecast: {
    openRadarCta: string;
    pinnedLocations: string;
    hourlyTrajectory: string;
    currentHour: string;
    windVector: string;
    gusts: string;
    airQualityTitle: string;
    tapFullSpectrum: string;
    solarHorizon: string;
    pressureVisibility: string;
    tenDayForecast: string;
    selectDayDetails: string;
    humidityDry: string;
    humidityBalanced: string;
    humidityHigh: string;
    advisoryHighUv: (uv: string) => string;
    advisoryPrecip: (pct: number) => string;
    advisoryPrecipDetail: string;
    advisoryAqi: (aqi: number) => string;
    pressureTrend: {
      rising: string;
      steady: string;
      falling: string;
    };
  };
  radar: {
    titlePrefix: string;
    surfaceTemp: string;
    layers: {
      precipitation: string;
      wind: string;
      temperature: string;
      clouds: string;
    };
    legendMin: {
      precipitation: string;
      wind: string;
      temperature: string;
      clouds: string;
    };
    legendMax: {
      precipitation: string;
      wind: string;
      temperature: string;
      clouds: string;
    };
    play: string;
    pause: string;
    offset: string;
    zoomIn: string;
    zoomOut: string;
    resetView: string;
  };
  atmosphere: {
    titlePrefix: string;
    subtitle: string;
    usAqiTitle: string;
    solarUvPeakTitle: string;
    lunarTelemetryTitle: string;
    eveningCloudCover: (pct: number) => string;
    pollutantBreakdownTitle: string;
    uvCurveTitle: string;
    optimalWindowTitle: (hour: string) => string;
    optimalWindowDetail: (temp: number, unit: string, precip: number, wind: number, windUnit: string) => string;
    stargazingTitle: string;
    stargazingClear: (pct: number) => string;
    stargazingPartial: (pct: number) => string;
    pollutants: {
      pm25: string;
      pm10: string;
      ozone: string;
      no2: string;
      so2: string;
      co: string;
    };
    lunarPhases: {
      newMoon: string;
      waxingCrescent: string;
      firstQuarter: string;
      waxingGibbous: string;
      fullMoon: string;
      waningGibbous: string;
      waningCrescent: string;
    };
  };
  locations: {
    title: string;
    subtitle: string;
    settingsTitle: string;
    languageSettingLabel: string;
    languageSettingDesc: string;
    themeSettingLabel: string;
    themeSettingDesc: string;
    unitSettingLabel: string;
    unitSettingDesc: string;
    savedCitiesTitle: string;
    addCity: string;
    viewForecast: string;
    removeCity: (name: string) => string;
  };
  search: {
    dialogLabel: string;
    placeholder: string;
    closeAria: string;
    globalResults: string;
    featuredDestinations: string;
    useCurrentLocation: string;
    currentLocationName: string;
    gpsTelemetry: string;
    geoUnavailable: string;
    geoDenied: string;
    noResults: (query: string) => string;
    pinCity: (name: string) => string;
    unpinCity: (name: string) => string;
  };
  conditions: Record<WeatherConditionKind | 'mainly-clear' | 'mostly-clear' | 'heavy-rain', string>;
  aqi: {
    good: { rating: string; advisory: string };
    moderate: { rating: string; advisory: string };
    sensitive: { rating: string; advisory: string };
    unhealthy: { rating: string; advisory: string };
  };
  uv: {
    low: { level: string; advice: string };
    moderate: { level: string; advice: string };
    high: { level: string; advice: string };
    veryHigh: { level: string; advice: string };
    extreme: { level: string; advice: string };
  };
  alerts: {
    bannerHeading: string;
    urgentLabel: string;
    previewLabel: string;
    details: string;
    hideDetails: string;
    viewRadar: string;
    dismiss: string;
    testAlert: string;
    issuedFor: string;
    safetyGuidance: string;
    stormTitle: string;
    stormSummary: (city: string) => string;
    stormGuidance: string;
    windTitle: string;
    windSummary: (city: string, gust: string) => string;
    windGuidance: string;
    rainTitle: string;
    rainSummary: (city: string, amount: string) => string;
    rainGuidance: string;
    uvTitle: string;
    uvSummary: (city: string, uv: string) => string;
    uvGuidance: string;
    heatTitle: string;
    heatSummary: (city: string, temp: string) => string;
    heatGuidance: string;
    freezeTitle: string;
    freezeSummary: (city: string, temp: string) => string;
    freezeGuidance: string;
    aqiTitle: string;
    aqiSummary: (city: string, aqi: number) => string;
    aqiGuidance: string;
  };
  solarCycle: {
    title: string;
    aboveHorizon: string;
    belowHorizon: string;
    solarNoon: string;
    daylightSpan: string;
    remainingDaylight: string;
    untilSunrise: string;
    goldenHour: string;
    progressLabel: (pct: number) => string;
    scrubPrompt: string;
    elevation: string;
  };
  locationPrompt: {
    detectingTitle: string;
    detectingSubtitle: string;
    requestTitle: string;
    requestSubtitle: string;
    allowButton: string;
    dismissButton: string;
    deniedSubtitle: string;
  };
  theme: {
    label: string;
    light: string;
    dark: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    nav: {
      forecast: 'Forecast',
      radar: 'Radar',
      atmosphere: 'Atmosphere',
      locations: 'Settings & Cities',
      cities: 'Settings & Cities',
      searchCity: 'Search City',
    },
    common: {
      refresh: 'Refresh',
      updating: 'Updating',
      now: 'Now',
      today: 'Today',
      active: 'Active',
      manageAll: 'Manage All',
      feelsLike: 'Feels like',
      highShort: 'H',
      lowShort: 'L',
      wind: 'Wind',
      precip: 'precip',
      humidity: 'Humidity',
      dewPoint: 'Dew point',
      uvIndex: 'UV Index',
      uvPeak: 'UV Peak',
      visibility: 'Visibility',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      condition: 'Condition',
      peakWind: 'Peak Wind',
      sunriseSunset: 'Sunrise / Sunset',
      languageLabel: 'Language',
      unitLabel: 'Temperature unit',
    },
    forecast: {
      openRadarCta: 'Open Live Radar Layer',
      pinnedLocations: 'Pinned Locations',
      hourlyTrajectory: '24-Hour Trajectory',
      currentHour: 'Current Hour',
      windVector: 'Wind Vector',
      gusts: 'Gusts',
      airQualityTitle: 'Air Quality (US AQI)',
      tapFullSpectrum: 'Tap for full spectrum',
      solarHorizon: 'Solar Horizon',
      pressureVisibility: 'Pressure & Visibility',
      tenDayForecast: '10-Day Extended Forecast',
      selectDayDetails: 'Select any day for details',
      humidityDry: 'Crisp dry air mass across the surface.',
      humidityBalanced: 'Balanced moisture comfort index.',
      humidityHigh: 'High atmospheric moisture retention.',
      advisoryHighUv: (uv) => `High UV Index (${uv})`,
      advisoryPrecip: (pct) => `Precipitation Likely (${pct}%)`,
      advisoryPrecipDetail: 'Rain probability rises over the next 6 hours.',
      advisoryAqi: (aqi) => `Elevated AQI (${aqi})`,
      pressureTrend: {
        rising: 'Rising',
        steady: 'Steady',
        falling: 'Falling',
      },
    },
    radar: {
      titlePrefix: 'Atmospheric Radar',
      surfaceTemp: 'Surface temp',
      layers: {
        precipitation: 'Precipitation',
        wind: 'Wind Vectors',
        temperature: 'Thermal Field',
        clouds: 'Cloud Cover',
      },
      legendMin: {
        precipitation: '0 mm/h',
        wind: '5 km/h',
        temperature: 'Cool',
        clouds: 'Clear',
      },
      legendMax: {
        precipitation: '25+ mm/h',
        wind: '65 km/h',
        temperature: 'Warm',
        clouds: 'Overcast',
      },
      play: 'Play',
      pause: 'Pause',
      offset: 'Offset',
      zoomIn: 'Zoom in radar',
      zoomOut: 'Zoom out radar',
      resetView: 'Reset radar view',
    },
    atmosphere: {
      titlePrefix: 'Atmosphere & Astronomy',
      subtitle: 'Boundary-layer air quality composition, 24-hour UV curve, and lunar visibility windows.',
      usAqiTitle: 'US Air Quality Index',
      solarUvPeakTitle: 'Solar UV Peak Today',
      lunarTelemetryTitle: 'Lunar Telemetry',
      eveningCloudCover: (pct) => `Evening cloud cover averaging ${pct}% for night sky visibility.`,
      pollutantBreakdownTitle: 'Atmospheric Particulate & Gas Breakdown',
      uvCurveTitle: '24-Hour UV Curve',
      optimalWindowTitle: (hour) => `Optimal Outdoor Window · ${hour}`,
      optimalWindowDetail: (temp, unit, precip, wind, windUnit) =>
        `${temp}°${unit}, ${precip}% precip, ${wind} ${windUnit} breeze.`,
      stargazingTitle: 'Stargazing Clarity',
      stargazingClear: (pct) => `Clear twilight corridor (${pct}% cloud cover).`,
      stargazingPartial: (pct) => `Partial cloud canopy (${pct}% cloud cover) tonight.`,
      pollutants: {
        pm25: 'PM2.5 Fine Particulate',
        pm10: 'PM10 Coarse Aerosol',
        ozone: 'Surface Ozone (O₃)',
        no2: 'Nitrogen Dioxide (NO₂)',
        so2: 'Sulfur Dioxide (SO₂)',
        co: 'Carbon Monoxide (CO)',
      },
      lunarPhases: {
        newMoon: 'New Moon',
        waxingCrescent: 'Waxing Crescent',
        firstQuarter: 'First Quarter',
        waxingGibbous: 'Waxing Gibbous',
        fullMoon: 'Full Moon',
        waningGibbous: 'Waning Gibbous',
        waningCrescent: 'Waning Crescent',
      },
    },
    locations: {
      title: 'Settings & Cities',
      subtitle: 'Manage display language, appearance, and real-time multi-city telemetry comparison.',
      settingsTitle: 'Application Settings',
      languageSettingLabel: 'Display Language',
      languageSettingDesc: 'Select the interface language for all forecast and radar screens.',
      themeSettingLabel: 'Theme Appearance',
      themeSettingDesc: 'Switch between luminous daylight and deep midnight glass surfaces.',
      unitSettingLabel: 'Measurement Units',
      unitSettingDesc: 'Choose metric (°C, km/h) or imperial (°F, mph) units.',
      savedCitiesTitle: 'Saved Cities',
      addCity: 'Add City',
      viewForecast: 'View Forecast',
      removeCity: (name) => `Remove ${name}`,
    },
    search: {
      dialogLabel: 'Search global weather locations',
      placeholder: 'Search any city, airport, or region...',
      closeAria: 'Close search modal',
      globalResults: 'Global Search Results',
      featuredDestinations: 'Featured Destinations',
      useCurrentLocation: 'Use Current Location',
      currentLocationName: 'Current Location',
      gpsTelemetry: 'GPS Telemetry',
      geoUnavailable: 'Geolocation is unavailable in this browser.',
      geoDenied: 'Location permission denied. Choose a city below or search by name.',
      noResults: (query) => `No matching cities found for "${query}". Try a major city or region name.`,
      pinCity: (name) => `Pin ${name}`,
      unpinCity: (name) => `Remove ${name} from saved cities`,
    },
    conditions: {
      'clear-day': 'Clear Sky',
      'clear-night': 'Clear Night',
      'mainly-clear': 'Mainly Clear',
      'mostly-clear': 'Mostly Clear',
      'partly-cloudy': 'Partly Cloudy',
      cloudy: 'Overcast',
      fog: 'Atmospheric Fog',
      drizzle: 'Light Drizzle',
      rain: 'Rain Showers',
      'heavy-rain': 'Heavy Rain',
      snow: 'Snowfall',
      storm: 'Thunderstorm',
    },
    aqi: {
      good: {
        rating: 'Good',
        advisory: 'Air quality is crisp and clean with minimal particulate density.',
      },
      moderate: {
        rating: 'Moderate',
        advisory: 'Acceptable atmospheric clarity; unusually sensitive individuals should pace exertion.',
      },
      sensitive: {
        rating: 'Sensitive Groups',
        advisory: 'Elevated fine particulates; reduce prolonged outdoor exertion if sensitive.',
      },
      unhealthy: {
        rating: 'Unhealthy',
        advisory: 'High aerosol concentration detected across the boundary layer.',
      },
    },
    uv: {
      low: { level: 'Low', advice: 'Minimal solar risk. No protection needed.' },
      moderate: { level: 'Moderate', advice: 'Seek shade during midday solar peak.' },
      high: { level: 'High', advice: 'SPF 30+ and UV-filtering eyewear advised.' },
      veryHigh: { level: 'Very High', advice: 'Limit direct exposure between 11 AM and 4 PM.' },
      extreme: { level: 'Extreme', advice: 'Avoid unprotected sun exposure.' },
    },
    alerts: {
      bannerHeading: 'Weather Alerts',
      urgentLabel: 'Urgent Warning',
      previewLabel: 'Severe Alert Preview',
      details: 'Details',
      hideDetails: 'Hide Details',
      viewRadar: 'View Radar',
      dismiss: 'Dismiss alert',
      testAlert: 'Preview Storm Alert',
      issuedFor: 'Issued For',
      safetyGuidance: 'Safety Guidance',
      stormTitle: 'Severe Thunderstorm & Squall Warning',
      stormSummary: (city) =>
        `Convective storm cells and damaging wind gusts detected near ${city}. Seek sturdy indoor shelter immediately.`,
      stormGuidance:
        'Avoid open fields, tall trees, and coastal piers. Secure loose outdoor objects and monitor live radar vectors.',
      windTitle: 'High Wind Gust Advisory',
      windSummary: (city, gust) =>
        `Sustained gale-force gusts reaching ${gust} expected across ${city}.`,
      windGuidance:
        'Exercise caution when driving high-profile vehicles and stay clear of downed utility lines.',
      rainTitle: 'Heavy Rainfall & Flash Flood Watch',
      rainSummary: (city, amount) =>
        `Intense precipitation bands projecting ${amount} accumulation in ${city} may cause localized surface flooding.`,
      rainGuidance:
        'Avoid low-lying underpasses and flooded roadways; allow extra braking distance.',
      uvTitle: 'Extreme Solar UV Alert',
      uvSummary: (city, uv) =>
        `Peak ultraviolet radiation in ${city} reaching ${uv}. Rapid skin damage possible.`,
      uvGuidance: 'Stay indoors or in full shade during peak solar hours; wear SPF 50+ protection.',
      heatTitle: 'Extreme Heat Advisory',
      heatSummary: (city, temp) =>
        `Dangerous surface heat in ${city} reaching ${temp}. Prolonged outdoor exposure poses heat stress risks.`,
      heatGuidance: 'Stay hydrated, limit midday outdoor exertion, and check on vulnerable individuals.',
      freezeTitle: 'Sub-Zero Freeze Warning',
      freezeSummary: (city, temp) =>
        `Surface temperatures in ${city} dropping to ${temp}. Black ice formation likely.`,
      freezeGuidance: 'Protect exposed pipes and watch for slick bridges and shaded roadways.',
      aqiTitle: 'Unhealthy Air Quality Alert',
      aqiSummary: (city, aqi) => `Particulate pollution in ${city} elevated to US AQI ${aqi}.`,
      aqiGuidance: 'Keep windows closed and limit strenuous outdoor activity.',
    },
    solarCycle: {
      title: 'Solar Cycle',
      aboveHorizon: 'Above Horizon',
      belowHorizon: 'Below Horizon',
      solarNoon: 'Solar Noon',
      daylightSpan: 'Daylight',
      remainingDaylight: 'Remaining Light',
      untilSunrise: 'Until Sunrise',
      goldenHour: 'Golden Hour',
      progressLabel: (pct) => `${pct}% of daylight`,
      scrubPrompt: 'Hover arc to inspect solar elevation',
      elevation: 'Elevation',
    },
    locationPrompt: {
      detectingTitle: 'Detecting your location',
      detectingSubtitle: 'Requesting GPS access to load local atmospheric telemetry...',
      requestTitle: 'Use your current location',
      requestSubtitle: 'Allow location access to display real-time weather for where you are right now.',
      allowButton: 'Detect My Location',
      dismissButton: 'Keep Default City',
      deniedSubtitle: 'Location access was blocked or denied. You can enable it in your browser or search any city.',
    },
    theme: {
      label: 'Theme mode',
      light: 'Light mode',
      dark: 'Dark mode',
    },
  },
  tr: {
    nav: {
      forecast: 'Tahmin',
      radar: 'Radar',
      atmosphere: 'Atmosfer',
      locations: 'Ayarlar ve Şehirler',
      cities: 'Ayarlar ve Şehirler',
      searchCity: 'Şehir Ara',
    },
    common: {
      refresh: 'Yenile',
      updating: 'Güncelleniyor',
      now: 'Şimdi',
      today: 'Bugün',
      active: 'Etkin',
      manageAll: 'Tümünü Yönet',
      feelsLike: 'Hissedilen',
      highShort: 'Y',
      lowShort: 'D',
      wind: 'Rüzgar',
      precip: 'yağış',
      humidity: 'Nem',
      dewPoint: 'Çiy noktası',
      uvIndex: 'UV İndeksi',
      uvPeak: 'Maks. UV',
      visibility: 'Görüş Mesafesi',
      sunrise: 'Gün Doğumu',
      sunset: 'Gün Batımı',
      condition: 'Durum',
      peakWind: 'En Yüksek Rüzgar',
      sunriseSunset: 'Gün Doğumu / Batımı',
      languageLabel: 'Dil',
      unitLabel: 'Sıcaklık birimi',
    },
    forecast: {
      openRadarCta: 'Canlı Radar Katmanını Aç',
      pinnedLocations: 'Sabitlenen Konumlar',
      hourlyTrajectory: '24 Saatlik Seyir',
      currentHour: 'Mevcut Saat',
      windVector: 'Rüzgar Vektörü',
      gusts: 'Hamle',
      airQualityTitle: 'Hava Kalitesi (US AQI)',
      tapFullSpectrum: 'Tam spektrum için dokunun',
      solarHorizon: 'Güneş Ufku',
      pressureVisibility: 'Basınç ve Görüş',
      tenDayForecast: '10 Günlük Genişletilmiş Tahmin',
      selectDayDetails: 'Detaylar için herhangi bir güne dokunun',
      humidityDry: 'Yüzeyde ferah ve kuru hava kütlesi.',
      humidityBalanced: 'Dengeli nem ve konfor seviyesi.',
      humidityHigh: 'Yüksek atmosferik nem oranı.',
      advisoryHighUv: (uv) => `Yüksek UV İndeksi (${uv})`,
      advisoryPrecip: (pct) => `Yağış Olasılığı (%${pct})`,
      advisoryPrecipDetail: 'Önümüzdeki 6 saatte yağış ihtimali artıyor.',
      advisoryAqi: (aqi) => `Yükselmiş Hava Kalitesi İndeksi (${aqi})`,
      pressureTrend: {
        rising: 'Yükseliyor',
        steady: 'Sabit',
        falling: 'Düşüyor',
      },
    },
    radar: {
      titlePrefix: 'Atmosfer Radarı',
      surfaceTemp: 'Yüzey sıcaklığı',
      layers: {
        precipitation: 'Yağış',
        wind: 'Rüzgar Vektörleri',
        temperature: 'Isıl Alan',
        clouds: 'Bulut Örtüsü',
      },
      legendMin: {
        precipitation: '0 mm/sa',
        wind: '5 km/sa',
        temperature: 'Serin',
        clouds: 'Açık',
      },
      legendMax: {
        precipitation: '25+ mm/sa',
        wind: '65 km/sa',
        temperature: 'Sıcak',
        clouds: 'Kapalı',
      },
      play: 'Oynat',
      pause: 'Duraklat',
      offset: 'Zaman Farkı',
      zoomIn: 'Radarı yakınlaştır',
      zoomOut: 'Radarı uzaklaştır',
      resetView: 'Radar görünümünü sıfırla',
    },
    atmosphere: {
      titlePrefix: 'Atmosfer ve Astronomi',
      subtitle: 'Sınır katmanı hava kalitesi bileşimi, 24 saatlik UV eğrisi ve ay görüş pencereleri.',
      usAqiTitle: 'ABD Hava Kalitesi İndeksi',
      solarUvPeakTitle: 'Bugünkü Tepe UV İndeksi',
      lunarTelemetryTitle: 'Ay Telemetrisi',
      eveningCloudCover: (pct) => `Gece gökyüzü görüşü için ortalama %${pct} akşam bulutluluğu.`,
      pollutantBreakdownTitle: 'Atmosferik Partikül ve Gaz Dağılımı',
      uvCurveTitle: '24 Saatlik UV Eğrisi',
      optimalWindowTitle: (hour) => `En Uygun Açık Hava Saati · ${hour}`,
      optimalWindowDetail: (temp, unit, precip, wind, windUnit) =>
        `${temp}°${unit}, %${precip} yağış olasılığı, ${wind} ${windUnit} esinti.`,
      stargazingTitle: 'Yıldız Gözlem Netliği',
      stargazingClear: (pct) => `Açık alacakaranlık koridoru (%${pct} bulut örtüsü).`,
      stargazingPartial: (pct) => `Bu gece parçalı bulut örtüsü (%${pct} bulutluluk).`,
      pollutants: {
        pm25: 'PM2.5 İnce Partikül',
        pm10: 'PM10 Kaba Aerosol',
        ozone: 'Yüzey Ozonu (O₃)',
        no2: 'Azot Dioksit (NO₂)',
        so2: 'Kükürt Dioksit (SO₂)',
        co: 'Karbon Monoksit (CO)',
      },
      lunarPhases: {
        newMoon: 'Yeni Ay',
        waxingCrescent: 'Hilal (Büyüyen)',
        firstQuarter: 'İlk Dördün',
        waxingGibbous: 'Şişkin Ay (Büyüyen)',
        fullMoon: 'Dolunay',
        waningGibbous: 'Şişkin Ay (Küçülen)',
        waningCrescent: 'Hilal (Küçülen)',
      },
    },
    locations: {
      title: 'Ayarlar ve Şehirler',
      subtitle: 'Uygulama dilini, görünüm temasını ve kayıtlı şehirlerin anlık hava durumunu yönetin.',
      settingsTitle: 'Uygulama Ayarları',
      languageSettingLabel: 'Dil Seçimi',
      languageSettingDesc: 'Tahmin, radar ve atmosfer ekranlarının arayüz dilini belirleyin.',
      themeSettingLabel: 'Görünüm Teması',
      themeSettingDesc: 'Aydınlık gün ışığı veya derin gece cam teması arasında geçiş yapın.',
      unitSettingLabel: 'Ölçü Birimi',
      unitSettingDesc: 'Metrik (°C, km/sa) ve emperyal (°F, mph) birimler arasında seçim yapın.',
      savedCitiesTitle: 'Kayıtlı Şehirler',
      addCity: 'Şehir Ekle',
      viewForecast: 'Tahmini Gör',
      removeCity: (name) => `${name} şehrini kaldır`,
    },
    search: {
      dialogLabel: 'Küresel hava durumu konumlarında ara',
      placeholder: 'Şehir, havalimanı veya bölge arayın...',
      closeAria: 'Arama penceresini kapat',
      globalResults: 'Küresel Arama Sonuçları',
      featuredDestinations: 'Öne Çıkan Konumlar',
      useCurrentLocation: 'Mevcut Konumu Kullan',
      currentLocationName: 'Mevcut Konum',
      gpsTelemetry: 'GPS Telemetrisi',
      geoUnavailable: 'Bu tarayıcıda konum servisi kullanılamıyor.',
      geoDenied: 'Konum izni reddedildi. Aşağıdan bir şehir seçin veya adıyla arayın.',
      noResults: (query) => `"${query}" için eşleşen şehir bulunamadı. Başka bir şehir veya bölge adı deneyin.`,
      pinCity: (name) => `${name} şehrini sabitle`,
      unpinCity: (name) => `${name} şehrini kayıtlılardan kaldır`,
    },
    conditions: {
      'clear-day': 'Açık Gökyüzü',
      'clear-night': 'Açık Gece',
      'mainly-clear': 'Çoğunlukla Açık',
      'mostly-clear': 'Çoğunlukla Açık',
      'partly-cloudy': 'Parçalı Bulutlu',
      cloudy: 'Çok Bulutlu',
      fog: 'Sisli',
      drizzle: 'Hafif Çiseleme',
      rain: 'Sağanak Yağış',
      'heavy-rain': 'Şiddetli Yağmur',
      snow: 'Kar Yağışı',
      storm: 'Gök Gürültülü Fırtına',
    },
    aqi: {
      good: {
        rating: 'İyi',
        advisory: 'Hava kalitesi son derece temiz ve partikül yoğunluğu çok düşük.',
      },
      moderate: {
        rating: 'Orta',
        advisory: 'Kabul edilebilir atmosferik berraklık; hassas bireyler yoğun eforu dengelemeli.',
      },
      sensitive: {
        rating: 'Hassas Gruplar',
        advisory: 'İnce partikül oranı yükseldi; hassas gruplar uzun süreli açık hava eforunu azaltmalı.',
      },
      unhealthy: {
        rating: 'Sağlıksız',
        advisory: 'Sınır katmanında yüksek aerosol yoğunluğu tespit edildi.',
      },
    },
    uv: {
      low: { level: 'Düşük', advice: 'Minimum güneş riski. Ekstra koruma gerekmez.' },
      moderate: { level: 'Orta', advice: 'Öğle saatlerinde güneş tepe noktasındayken gölgeyi tercih edin.' },
      high: { level: 'Yüksek', advice: 'SPF 30+ güneş kremi ve UV filtreli gözlük önerilir.' },
      veryHigh: { level: 'Çok Yüksek', advice: '11:00 - 16:00 arası doğrudan güneş maruziyetini sınırlayın.' },
      extreme: { level: 'Aşırı', advice: 'Korunmasız güneş maruziyetinden kesinlikle kaçının.' },
    },
    alerts: {
      bannerHeading: 'Hava Durumu Uyarıları',
      urgentLabel: 'Acil Uyarı',
      previewLabel: 'Şiddetli Uyarı Önizlemesi',
      details: 'Detaylar',
      hideDetails: 'Gizle',
      viewRadar: 'Radarı Aç',
      dismiss: 'Uyarıyı kapat',
      testAlert: 'Fırtına Uyarısını Önizle',
      issuedFor: 'Etkilenen Bölge',
      safetyGuidance: 'Güvenlik Talimatı',
      stormTitle: 'Şiddetli Gök Gürültülü Fırtına Uyarısı',
      stormSummary: (city) =>
        `${city} çevresinde kuvvetli fırtına hücreleri ve sert rüzgar hamleleri tespit edildi. Kapalı ve güvenli bir alana geçin.`,
      stormGuidance:
        'Açık alanlardan, yüksek ağaçlardan ve kıyı şeridinden uzak durun; canlı radar katmanından fırtına yönünü takip edin.',
      windTitle: 'Kuvvetli Rüzgar ve Fırtına Hamlesi Uyarısı',
      windSummary: (city, gust) =>
        `${city} çevresinde ${gust} hızına ulaşan şiddetli rüzgar hamleleri bekleniyor.`,
      windGuidance:
        'Yüksek araç kullanırken dikkatli olun; çatı uçması ve devrilebilecek nesnelere karşı tedbir alın.',
      rainTitle: 'Şiddetli Yağış ve Ani Sel Riski',
      rainSummary: (city, amount) =>
        `${city} için yoğun yağış bantlarının ${amount} birikime ulaşması yerel su baskınlarına yol açabilir.`,
      rainGuidance:
        'Alt geçitlerden ve su birikintisi oluşan yollardan uzak durun; takip mesafenizi artırın.',
      uvTitle: 'Aşırı Güneş UV Uyarısı',
      uvSummary: (city, uv) => `${city} bölgesinde ultraviyole radyasyon ${uv} seviyesine ulaşıyor.`,
      uvGuidance: 'Öğle saatlerinde gölgede kalın ve SPF 50+ koruyucu kullanın.',
      heatTitle: 'Aşırı Sıcaklık Uyarısı',
      heatSummary: (city, temp) =>
        `${city} için sıcaklık ${temp} seviyesine ulaşıyor. Yüksek ısı stresi riski bulunuyor.`,
      heatGuidance: 'Bol sıvı tüketin, öğle saatlerinde doğrudan güneş altında yoğun efordan kaçının.',
      freezeTitle: 'Sıfırın Altında Don ve Buzlanma Uyarısı',
      freezeSummary: (city, temp) =>
        `${city} bölgesinde sıcaklık ${temp} seviyesine düşüyor. Gizli buzlanma riski yüksek.`,
      freezeGuidance: 'Köprü ve viyadüklerde buzlanmaya karşı dikkatli olun; açık tesisatları koruyun.',
      aqiTitle: 'Sağlıksız Hava Kalitesi Uyarısı',
      aqiSummary: (city, aqi) => `${city} için partikül yoğunluğu ABD AQI ${aqi} seviyesine yükseldi.`,
      aqiGuidance: 'Pencereleri kapalı tutun ve açık havada yoğun fiziksel aktiviteyi sınırlandırın.',
    },
    solarCycle: {
      title: 'Güneş Döngüsü',
      aboveHorizon: 'Ufuk Üstünde',
      belowHorizon: 'Ufuk Altında',
      solarNoon: 'Güneş Öğlesi',
      daylightSpan: 'Gün Uzunluğu',
      remainingDaylight: 'Kalan Gün Işığı',
      untilSunrise: 'Gün Doğumuna',
      goldenHour: 'Altın Saat',
      progressLabel: (pct) => `Gün ışığının %${pct}'i`,
      scrubPrompt: 'Güneş yüksekliğini incelemek için eğrinin üzerine gelin',
      elevation: 'Yükseklik',
    },
    locationPrompt: {
      detectingTitle: 'Konumunuz algılanıyor',
      detectingSubtitle: 'Bulunduğunuz yerin hava durumunu yüklemek için konum izni isteniyor...',
      requestTitle: 'Bulunduğunuz konuma göre hava durumu',
      requestSubtitle: 'Açılışta bulunduğunuz yerin anlık hava durumunu görmek için konum erişimine izin verin.',
      allowButton: 'Konumumu Kullan',
      dismissButton: 'Varsayılanla Devam Et',
      deniedSubtitle: 'Konum izni engellendi veya reddedildi. Tarayıcıdan izin verebilir ya da şehir arayabilirsiniz.',
    },
    theme: {
      label: 'Tema modu',
      light: 'Açık mod',
      dark: 'Koyu mod',
    },
  },
};
