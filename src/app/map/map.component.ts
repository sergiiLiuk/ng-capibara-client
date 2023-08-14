import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Map, NavigationControl, Marker } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import * as turf from '@turf/turf';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  map: mapboxgl.Map | undefined;
  draw: any;
  selectedFeatures: turf.AllGeoJSON = turf.featureCollection([]);

  selectedArea: number | null = null;

  mapStyle =
    'https://api.maptiler.com/maps/satellite/style.json?key=meIz87U0Ci2zKW6N0Saq';
  mapAccessToken = 'YOUR_MAP_ACCESS_TOKEN';

  tileDataUrl =
    'https://api.maptiler.com/tiles/9b13310f-69eb-4fc2-87a5-65448a1595ff/tiles.json?key=meIz87U0Ci2zKW6N0Saq';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    mapboxgl.accessToken =
      'pk.eyJ1Ijoic2VyZ2lpbGl1ayIsImEiOiJjbGxiYnpjM3owN2RkM2hxdWg3OXN2cWd5In0.XSTip8TBnC04m5ujxMKmYw';
  }

  ngAfterViewInit() {
    this.http.get(this.tileDataUrl).subscribe((data: any) => {
      this.initializeMap(data);
    });
  }

  initializeMap(data: any): void {
    if (this.mapContainer) {
      this.map = new mapboxgl.Map({
        container: this.mapContainer.nativeElement,
        style: this.mapStyle,
        center: [data.center[0], data.center[1]],
        zoom: data.center[2],
        bounds: data.bounds, // Set the initial view bounds
        fitBoundsOptions: { padding: 20 }, // Adjust padding as needed
        maxBounds: data.bounds, // Restrict panning outside these bounds
      });

      this.map.on('load', () => {
        data.tiles.forEach((tileUrl: string) => {
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
        // Add the Draw control
        const draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: true,
            trash: true,
          },
          // styles: [
          //   // Style for the polygon fill
          //   {
          //     id: 'gl-draw-polygon-fill',
          //     type: 'fill',
          //     paint: {
          //       'fill-color': '#00FF00',
          //       'fill-opacity': 0.3,
          //     },
          //   },
          //   // Style for the polygon outline
          //   {
          //     id: 'gl-draw-polygon-stroke',
          //     type: 'line',
          //     paint: {
          //       'line-color': '#00FF00',
          //       'line-width': 2,
          //     },
          //   },
          //   // Add more styles as needed for other draw modes
          // ],
          defaultMode: 'draw_polygon',
        });
        // @ts-ignore
        this.map.addControl(draw, 'top-right');

        this.map.on('draw.create', handleSelectArea);
        this.map.on('draw.delete', handleSelectArea);
        this.map.on('draw.update', handleSelectArea);
        // Log any map errors
        this.map.on('error', (error) => {
          console.error('Map Error:', error);
        });

        function handleSelectArea(e: any): void {
          console.log('click');

          const data = draw.getAll();

          if (data.features.length > 0) {
            const area = turf.area(data);
            // Restrict the area to 2 decimal points.
            const rounded_area = Math.round(area * 100) / 100;
            console.log('res: ', rounded_area);
          } else {
            if (e.type !== 'draw.delete')
              alert('Click the map to draw a polygon.');
          }
        }
      });
    }
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
