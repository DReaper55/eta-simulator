import { CanvasClickEvent } from './clickEvent'
// import { ObjectEvent } from './objectEvent'
// import { CanvasTouchEvent } from './touchEvent'
// import { CanvasZoomEvent } from './zoomEvent'
// import { WindowEvent } from './windowEvent'

import { CanvasMoveEvent } from "./moveEvent";

export class CanvasEvent {
  clickEvent: CanvasClickEvent
  moveEvent: CanvasMoveEvent
  // zoomEvent: CanvasZoomEvent
  // objectEvent: ObjectEvent
  // windowEvent: WindowEvent
  // touchEvent: CanvasTouchEvent

  constructor() {    
    const moveEvent = new CanvasMoveEvent()
    this.moveEvent = moveEvent;
    
    const clickEvent = new CanvasClickEvent()
    this.clickEvent = clickEvent;

    // const zoomEvent = new CanvasZoomEvent()
    // this.zoomEvent = zoomEvent

    // const objectEvent = new ObjectEvent()
    // this.objectEvent = objectEvent

    // const windowEvent = new WindowEvent()
    // this.windowEvent = windowEvent

    // const touchEvent = new CanvasTouchEvent()
    // this.touchEvent = touchEvent
    
  }

  removeEvent() {
    // this.windowEvent.removeWindowEvent()
    // this.touchEvent.removeTouchEvent()
    this.moveEvent.removeMoveEvent()
  }
}