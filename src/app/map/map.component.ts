import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Map, NavigationControl, Marker } from 'maplibre-gl';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  map: Map | undefined;
  data: any = {};

  mapStyle =
    'https://api.maptiler.com/maps/satellite/style.json?key=meIz87U0Ci2zKW6N0Saq';
  mapAccessToken = 'YOUR_MAP_ACCESS_TOKEN';

  tileDataUrl =
    'https://api.maptiler.com/tiles/9b13310f-69eb-4fc2-87a5-65448a1595ff/tiles.json?key=meIz87U0Ci2zKW6N0Saq';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(this.tileDataUrl).subscribe((data: any) => {
      this.data = data;
    });
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap(): void {
    if (this.mapContainer) {
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: this.mapStyle,
        center: [-74.5, 40],
        zoom: 9,
      });

      this.map.on('load', () => {
        this.data.tiles.forEach((tileUrl: string) => {
          this.map.addSource(tileUrl, {
            type: 'raster',
            tiles: [tileUrl],
            tileSize: 256,
          });

          this.map.addLayer({
            id: tileUrl,
            type: 'raster',
            source: tileUrl,
            paint: {},
          });
        });
      });

      // Log any map errors
      this.map.on('error', (error) => {
        console.error('Map Error:', error);
      });
    }
  }

  // ngAfterViewInit() {
  //   this.http.get(this.tileDataUrl).subscribe((data: any) => {
  //     this.configureMapLayers(data);
  //   });
  // }
  // configureMapLayers(data: any): void {
  //   console.log('op: ', data);

  //   const initialState = { lng: 139.753, lat: 35.6844, zoom: 14 };

  //   this.map = new Map({
  //     container: this.mapContainer.nativeElement,
  //     style: `https://api.maptiler.com/maps/satellite/style.json?key=meIz87U0Ci2zKW6N0Saq`,
  //     center: [initialState.lng, initialState.lat],
  //     zoom: initialState.zoom,
  //   });

  //   data.tiles.forEach((layer: any) => {
  //     this.map.addLayer({
  //       id: layer.id,
  //       type: 'raster',
  //       source: {
  //         type: 'raster',
  //         tiles: [layer.tiles],
  //         tileSize: 256,
  //       },
  //     });
  //   });
  //   this.map.addControl(new NavigationControl(), 'top-right');
  //   new Marker({ color: '#FF0000' })
  //     .setLngLat([139.7525, 35.6846])
  //     .addTo(this.map);
  // }
  ngOnDestroy() {
    this.map?.remove();
  }
}
