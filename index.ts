import { MarkersRender } from './src/domain/marker/marker-render';
import { markers } from './src/domain/marker/markers';

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// This example adds hide() and show() methods to a custom overlay's prototype.
// These methods toggle the visibility of the container <div>.
// overlay to or from the map.

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById('map') as HTMLElement,
    {
      zoom: 12,
      center: { lat: 43.399532, lng: -8.258441 },
      mapTypeId: 'satellite',
    }
  );

  const bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(43.3253, -8.4825),
    new google.maps.LatLng(43.5095, -8.1213)
  );

  let image = './src/assets/img/nautical-chart.png';

  const markersRender = new MarkersRender();
  markersRender.renderList(map, markers);

  /* Change markers on zoom */
  google.maps.event.addListener(map, 'zoom_changed', () => {
    const zoom = map.getZoom();
    console.log(zoom);
  });

  /**
   * The custom USGSOverlay object contains the USGS image,
   * the bounds of the image, and a reference to the map.
   */
  class USGSOverlay extends google.maps.OverlayView {
    private bounds: google.maps.LatLngBounds;
    private image: string;
    private div?: HTMLElement;

    constructor(bounds: google.maps.LatLngBounds, image: string) {
      super();

      this.bounds = bounds;
      this.image = image;
    }

    /**
     * onAdd is called when the map's panes are ready and the overlay has been
     * added to the map.
     */
    onAdd() {
      this.div = document.createElement('div');
      this.div.style.borderStyle = 'none';
      this.div.style.borderWidth = '0px';
      this.div.style.position = 'absolute';

      // Create the img element and attach it to the div.
      const img = document.createElement('img');

      img.src = this.image;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.position = 'absolute';
      img.style.opacity = '60%';
      this.div.appendChild(img);

      // Add the element to the "overlayLayer" pane.
      const panes = this.getPanes()!;

      panes.overlayLayer.appendChild(this.div);
    }

    draw() {
      // We use the south-west and north-east
      // coordinates of the overlay to peg it to the correct position and size.
      // To do this, we need to retrieve the projection from the overlay.
      const overlayProjection = this.getProjection();

      // Retrieve the south-west and north-east coordinates of this overlay
      // in LatLngs and convert them to pixel coordinates.
      // We'll use these coordinates to resize the div.
      const sw = overlayProjection.fromLatLngToDivPixel(
        this.bounds.getSouthWest()
      )!;
      const ne = overlayProjection.fromLatLngToDivPixel(
        this.bounds.getNorthEast()
      )!;

      // Resize the image's div to fit the indicated dimensions.
      if (this.div) {
        this.div.style.left = sw.x + 'px';
        this.div.style.top = ne.y + 'px';
        this.div.style.width = ne.x - sw.x + 'px';
        this.div.style.height = sw.y - ne.y + 'px';
      }
    }

    /**
     * The onRemove() method will be called automatically from the API if
     * we ever set the overlay's map property to 'null'.
     */
    onRemove() {
      if (this.div) {
        (this.div.parentNode as HTMLElement).removeChild(this.div);
        delete this.div;
      }
    }

    /**
     *  Set the visibility to 'hidden' or 'visible'.
     */
    hide() {
      if (this.div) {
        this.div.style.visibility = 'hidden';
      }
    }

    show() {
      if (this.div) {
        this.div.style.visibility = 'visible';
      }
    }

    toggle() {
      if (this.div) {
        if (this.div.style.visibility === 'hidden') {
          this.show();
        } else {
          this.hide();
        }
      }
    }

    toggleDOM(map: google.maps.Map) {
      if (this.getMap()) {
        this.setMap(null);
      } else {
        this.setMap(map);
      }
    }
  }

  const overlay: USGSOverlay = new USGSOverlay(bounds, image);

  overlay.setMap(map);

  const toggleButton = document.createElement('button');

  toggleButton.textContent = 'Toggle';
  toggleButton.classList.add('custom-map-control-button');

  const toggleDOMButton = document.createElement('button');

  toggleDOMButton.textContent = 'Toggle DOM Attachment';
  toggleDOMButton.classList.add('custom-map-control-button');

  toggleButton.addEventListener('click', () => {
    overlay.toggle();
  });

  toggleDOMButton.addEventListener('click', () => {
    overlay.toggleDOM(map);
  });

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleDOMButton);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleButton);
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
