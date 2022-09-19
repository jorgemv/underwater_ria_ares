import { markers } from './markers';
import { InfoWindowRender } from '../info-window/info-window-render';
import { BehaviorSubject } from 'rxjs';

export class MarkersRender {
  constructor() {}
  // position: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined,
  // map: google.maps.Map | google.maps.StreetViewPanorama | null | undefined,
  // title: string | null | undefined,
  // icon: string | google.maps.Icon | google.maps.Symbol | null | undefined,
  // visible: boolean | null | undefined

  renderList(map: google.maps.Map, markers) {
    let content = '';
    const $content = new BehaviorSubject(content)
    const infoWindowRender = new InfoWindowRender($content);
    markers.map((marker) => {
      const markerInstance = new google.maps.Marker({
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

      markerInstance.addListener('click', () => {
        this._setContent($content, marker);
        const infoWindowOpenOptions = {
          anchor: markerInstance,
          map: map,
          shouldFocus: true
        };
        infoWindowRender.render(infoWindowOpenOptions);
      });
    });
  }

  static getMarkersFromJson() {
    alert(JSON.stringify(markers));
  }

  private _setContent(contentSubject: BehaviorSubject<string>, marker: any): void {
    const content =
    '<div style="display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 2rem;">' +
      `<h1 style="margin-top: 0">${marker.title}</h1>` +
      '<p style="text-align: justify; text-justify: inter-word; margin-bottom: 2rem;">' +
        `${marker.description}` +
      '</p> ' +
      '<iframe ' +
        'width="560" ' +
        'height="315" ' +
        `src="${marker.videoUrl}" ` +
        'title="YouTube video player" ' +
        'frameborder="0" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
        'allowfullscreen ' +
      '>' +
      '</iframe>'
    '</div>';
    contentSubject.next(content);
  }
}
