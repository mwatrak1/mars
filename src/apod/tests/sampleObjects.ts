import { ApodAttrs } from '../apod.schema';
import { ApodDateDto } from '../dto/apodDate.dto';
import { ApodResponse } from '../types/apod-response.type';

export const sampleApodDoc = {
  _id: '60b61ebee4670d210325437e',
  date: '2021-06-01',
  explanation:
    'What are those streaks across Orion? They are reflections of sunlight from numerous Earth-orbiting satellites. Appearing by eye as a series of successive points floating across a twilight sky, the increasing number of communications satellites, including SpaceX Starlink satellites, are causing concern among many astronomers. On the positive side, Starlink and similar constellations make the post-sunset sky more dynamic, satellite-based global communications faster, and help provide digital services to currently underserved rural areas.  On the negative side, though, these low Earth-orbit satellites make some deep astronomical imaging programs more difficult, in particular observing programs that need images taken just after sunset and just before dawn.  Planned future satellite arrays that function in higher orbits may impact investigations of the deep universe planned for large ground-based telescopes at any time during the night.  The streaks across Orion are not from Starlink but rather satellites in high geosynchronous orbit.  The featured picture, taken in 2019 December, is a digital combination of over 65 3-minutes exposures, with some images taken to highlight the background Orion Nebula, while others to feature the passing satellites.    SatCon2 Wokshop 12-16 July 2021: Mitigating Satellite Constellations',
  hdurl:
    'https://apod.nasa.gov/apod/image/2106/StarlinkOrion_Abolfath_2138.jpg',
  title: 'Satellites over Orion',
  url: 'https://apod.nasa.gov/apod/image/2106/StarlinkOrion_Abolfath_960.jpg',
};

export const sampleApodAttrs: ApodAttrs = {
  date: '2021-06-01',
  explanation:
    'What are those streaks across Orion? They are reflections of sunlight from numerous Earth-orbiting satellites. Appearing by eye as a series of successive points floating across a twilight sky, the increasing number of communications satellites, including SpaceX Starlink satellites, are causing concern among many astronomers. On the positive side, Starlink and similar constellations make the post-sunset sky more dynamic, satellite-based global communications faster, and help provide digital services to currently underserved rural areas.  On the negative side, though, these low Earth-orbit satellites make some deep astronomical imaging programs more difficult, in particular observing programs that need images taken just after sunset and just before dawn.  Planned future satellite arrays that function in higher orbits may impact investigations of the deep universe planned for large ground-based telescopes at any time during the night.  The streaks across Orion are not from Starlink but rather satellites in high geosynchronous orbit.  The featured picture, taken in 2019 December, is a digital combination of over 65 3-minutes exposures, with some images taken to highlight the background Orion Nebula, while others to feature the passing satellites.    SatCon2 Wokshop 12-16 July 2021: Mitigating Satellite Constellations',
  hdurl:
    'https://apod.nasa.gov/apod/image/2106/StarlinkOrion_Abolfath_2138.jpg',
  title: 'Satellites over Orion',
  url: 'https://apod.nasa.gov/apod/image/2106/StarlinkOrion_Abolfath_960.jpg',
};

export const sampleDateDto: ApodDateDto = {
  date: '2021-06-01',
};

export const apodResponseValidData: ApodResponse = {
  date: '2021-06-01',
  explanation:
    'What are those streaks across Orion? They are reflections of sunlight from numerous Earth-orbiting satellites. Appearing by eye as a series of successive points floating across a twilight sky, the increasing number of communications satellites, including SpaceX Starlink satellites, are causing concern among many astronomers. On the positive side, Starlink and similar constellations make the post-sunset sky more dynamic, satellite-based global communications faster, and help provide digital services to currently underserved rural areas.  On the negative side, though, these low Earth-orbit satellites make some deep astronomical imaging programs more difficult, in particular observing programs that need images taken just after sunset and just before dawn.  Planned future satellite arrays that function in higher orbits may impact investigations of the deep universe planned for large ground-based telescopes at any time during the night.  The streaks across Orion are not from Starlink but rather satellites in high geosynchronous orbit.  The featured picture, taken in 2019 December, is a digital combination of over 65 3-minutes exposures, with some images taken to highlight the background Orion Nebula, while others to feature the passing satellites.    SatCon2 Wokshop 12-16 July 2021: Mitigating Satellite Constellations',
  hdurl:
    'https://apod.nasa.gov/apod/image/2106/StarlinkOrion_Abolfath_2138.jpg',
  media_type: 'image',
  service_version: 'v1',
  title: 'Satellites over Orion',
  url: 'https://apod.nasa.gov/apod/image/2106/StarlinkOrion_Abolfath_960.jpg',
};
