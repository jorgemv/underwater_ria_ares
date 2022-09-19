import { BehaviorSubject } from "rxjs";

export class InfoWindowRender {
    private _infoWindow: google.maps.InfoWindow;
    constructor(content: BehaviorSubject<string>) {
        this._infoWindow = new google.maps.InfoWindow({
            content: content.getValue()
        });
        content.subscribe((newContent) => {
            this._infoWindow.setContent(newContent);
        })
    }

    render(options: google.maps.InfoWindowOpenOptions) {
        this._infoWindow.open({
            anchor: options.anchor,
            map: options.map,
            shouldFocus: options.shouldFocus
        });
    }
}