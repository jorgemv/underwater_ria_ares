import { markers } from './markers';

export class MarkersRender {
  constructor() {}
  // position: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined,
  // map: google.maps.Map | google.maps.StreetViewPanorama | null | undefined,
  // title: string | null | undefined,
  // icon: string | google.maps.Icon | google.maps.Symbol | null | undefined,
  // visible: boolean | null | undefined

  renderList(map: google.maps.Map, markers) {
    markers.map((marker) => {
      new google.maps.Marker({
        position: marker.position,
        map,
        title: marker.title,
        icon: {
          url: marker.icon.url,
          scaledSize: new google.maps.Size(
            marker.icon.size.width,
            marker.icon.size.height
          ),
        },
        visible: marker.visible,
      });
    });
  }

  static getMarkersFromJson() {
    alert(JSON.stringify(markers));
  }
}
