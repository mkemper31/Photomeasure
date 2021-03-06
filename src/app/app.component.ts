import { Component, ViewChild } from '@angular/core';
import 'cropperjs/dist/cropper.css';
import {CropperComponent} from 'angular-cropperjs';
import { IfStmt } from '@angular/compiler';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
    '../../node_modules/cropperjs/dist/cropper.css'
  ]
})

export class AppComponent {
  @ViewChild('angularCropper', null) public angularCropper: CropperComponent;
  cropperEnabled = false;
  cropperReady = false;

  dragMoveEnabled = false;

  measureEnabled = false;
  measureIsCircle = false;
  startPlaced = false;
  measureStartPos = {x: 0, y: 0};
  endPlaced = false;
  measureEndPos = {x: 0, y: 0};
  distance = 0;

  angleEnabled = false;
  angleStartPlaced = false;
  angleCenterPlaced = false;
  angleEndPlaced = false;
  angleStartDistance = 0;
  angleEndDistance = 0;
  angle = 0;

  oldScaleType = 'mm';
  scaleType = 'mm';
  scale = 100;
  zoomScale = 0;
  relativeScale = 1;
  initialRatio = 1;
  timesZoom = 1;

  imageUrl = 'https://i.imgur.com/o0pSgfS.png';
  config = {
    autoCrop: false,
    movable: true,
    zoomable: true,
    viewMode: 2,
    ready() {
      console.log('ready');
    }
  };
  constructor() {
  }
  logCropper() {
    console.log(this.angularCropper);
  }

  readyTrigger() {
    this.cropperReady = true;
    this.angularCropper.cropper.disable();
    console.log(this.angularCropper.cropper.getImageData().width);
    this.initialRatio = this.angularCropper.cropper.getImageData().width / this.angularCropper.cropper.getImageData().naturalWidth;
    document.getElementsByClassName('cropper-wrapper')[0].id = 'cropper-wrapper';
    document.getElementsByClassName('cropper-crop')[0].id = 'cropper-box';
    this.setRelativeScale();
    const cropWrap = document.getElementById('cropper-wrapper');
    const measureStart = document.getElementById('measurestart');
    const measureEnd = document.getElementById('measureend');
    const measureLine = document.getElementById('measureline');
    const measureDisplay = document.getElementById('measuredisp');
    const angleStart = document.getElementById('anglestart');
    const angleCenter = document.getElementById('anglecenter');
    const angleEnd = document.getElementById('angleend');
    const angleStartLine = document.getElementById('anglelinestart');
    const angleEndLine = document.getElementById('anglelineend');
    const angleDisplay = document.getElementById('angledisp');
    cropWrap.appendChild(measureLine);
    cropWrap.appendChild(angleStartLine);
    cropWrap.appendChild(angleEndLine);
    cropWrap.appendChild(measureStart);
    cropWrap.appendChild(measureEnd);
    cropWrap.appendChild(angleStart);
    cropWrap.appendChild(angleCenter);
    cropWrap.appendChild(angleEnd);
    cropWrap.appendChild(measureDisplay);
    cropWrap.appendChild(angleDisplay);
  }

  zoomIn(event) {
    this.angularCropper.cropper.zoomTo(2);

  }
  zoomOut(event) {
    this.angularCropper.cropper.zoomTo(-0.5);
  }

  clearBox() {
    this.angularCropper.cropper.clear();
  }

  toggleDrag() {
    if (this.dragMoveEnabled) {
      this.angularCropper.cropper.setDragMode('none');
    } else {
      this.angularCropper.cropper.setDragMode('move');
    }
    this.dragMoveEnabled = !this.dragMoveEnabled;
  }

  clearMeasureLine() {
    this.startPlaced = false;
    this.endPlaced = false;
    this.measureEnabled = false;
    document.getElementById('measurestart').style.visibility = 'hidden';
    document.getElementById('measureend').style.visibility = 'hidden';
    document.getElementById('measureline').style.visibility = 'hidden';
    document.getElementById('measuredisp').style.visibility = 'hidden';
  }

  clearAngleMeasure() {
    this.angleStartPlaced = false;
    this.angleCenterPlaced = false;
    this.angleEndPlaced = false;
    this.angleEnabled = false;
    document.getElementById('anglestart').style.visibility = 'hidden';
    document.getElementById('anglecenter').style.visibility = 'hidden';
    document.getElementById('angleend').style.visibility = 'hidden';
    document.getElementById('anglelinestart').style.visibility = 'hidden';
    document.getElementById('anglelineend').style.visibility = 'hidden';
    document.getElementById('angledisp').style.visibility = 'hidden';
  }

  enableCropper() {
    this.angularCropper.cropper.enable();
    this.cropperEnabled = true;
  }

  disableCropper() {
    this.clearBox();
    this.angularCropper.cropper.disable();
    this.cropperEnabled = false;
  }

  toggleCropper() {
    (this.cropperEnabled) ? this.disableCropper() : this.enableCropper();
  }

  disableMeasurementTool() {
    this.measureEnabled = false;
  }

  disableAngleTool() {
    this.angleEnabled = false;
  }

  toggleLineCircle() {
    const line = document.getElementById('measureline');
    if (this.measureIsCircle) {
      line.style.removeProperty('height');
      line.style.removeProperty('border-radius');
      line.style.removeProperty('border-width');
      this.measureIsCircle = false;
    } else {
      line.style.setProperty('height', this.distance + 'px');
      line.style.setProperty('border-radius', '50%');
      line.style.setProperty('border-width', '4px');
      this.measureIsCircle = true;
    }
    this.updateDistanceLine();
  }

  toggleMeasureTool() {
    this.disableAll();
    this.measureEnabled = true;
    document.getElementById('mainview').classList.add('measureenabled');
  }

  toggleAngleTool() {
    this.disableAll();
    this.angleEnabled = true;
    document.getElementById('mainview').classList.add('angleenabled');
  }

  disableAll() {
    this.disableAngleTool();
    this.disableMeasurementTool();
    this.disableCropper();
  }

  onImageClick(event: MouseEvent) {
    console.log(event.target['id']);
    if (event.target['id'] != 'cropper-box') return;
    if (this.measureEnabled) {
      if (!this.startPlaced) {
        this.placeMeasureStart(event);
      } else if (this.startPlaced && !this.endPlaced) {
        this.placeMeasureEnd(event);
        this.updateDistanceLine();
      }
    } else if (this.angleEnabled) {
      if (!this.angleStartPlaced) {
        this.placeAngleStart(event);
      } else if (!this.angleCenterPlaced) {
        this.placeAngleCenter(event);
      } else if (!this.angleEndPlaced) {
        this.placeAngleEnd(event);
      }
    }
  }

  placeMeasureStart(event: MouseEvent) {
    this.startPlaced = true;
    const starter = document.getElementById('measurestart') as HTMLDivElement;
    const mainview = document.getElementById('mainview') as HTMLDivElement;
    const xCoord = event.offsetX - 5;
    const yCoord = (mainview.offsetHeight - event.offsetY - 12) * -1;
    this.measureStartPos.x = xCoord;
    this.measureStartPos.y = yCoord;
    console.log(this.measureStartPos);
    starter.style.transform = 'translate3d(' + xCoord + 'px, ' + yCoord + 'px, 0px)';
    starter.style.visibility = 'visible';
  }

  placeMeasureEnd(event: MouseEvent) {
    const ender = document.getElementById('measureend') as HTMLDivElement;
    const mainview = document.getElementById('mainview') as HTMLDivElement;
    const xCoord = event.offsetX - 15;
    const yCoord = (mainview.offsetHeight - event.offsetY - 12) * -1;
    this.measureEndPos.x = xCoord;
    this.measureEndPos.y = yCoord;
    ender.style.transform = 'translate3d(' + xCoord + 'px, ' + yCoord + 'px, 0px)';
    ender.style.visibility = 'visible';
    this.endPlaced = true;
  }

  placeAngleStart(event: MouseEvent) {
    const point = document.getElementById('anglestart') as HTMLDivElement;
    const mainview = document.getElementById('mainview') as HTMLDivElement;
    const xCoord = event.offsetX - 25;
    const yCoord = (mainview.offsetHeight - event.offsetY - 12) * -1;
    point.style.transform = 'translate3d(' + xCoord + 'px, ' + yCoord + 'px, 0px)';
    point.style.visibility = 'visible';
    this.angleStartPlaced = true;
  }

  placeAngleCenter(event: MouseEvent) {
    const point = document.getElementById('anglecenter') as HTMLDivElement;
    const mainview = document.getElementById('mainview') as HTMLDivElement;
    const xCoord = event.offsetX - 35;
    const yCoord = (mainview.offsetHeight - event.offsetY - 12) * -1;
    point.style.transform = 'translate3d(' + xCoord + 'px, ' + yCoord + 'px, 0px)';
    point.style.visibility = 'visible';
    this.angleCenterPlaced = true;
  }

  placeAngleEnd(event: MouseEvent) {
    const point = document.getElementById('angleend') as HTMLDivElement;
    const mainview = document.getElementById('mainview') as HTMLDivElement;
    const xCoord = event.offsetX - 45;
    const yCoord = (mainview.offsetHeight - event.offsetY - 12) * -1;
    point.style.transform = 'translate3d(' + xCoord + 'px, ' + yCoord + 'px, 0px)';
    point.style.visibility = 'visible';
    document.getElementById('anglelinestart').style.visibility = 'visible';
    document.getElementById('anglelineend').style.visibility = 'visible';
    this.updateAngleStartLine();
    this.updateAngleEndLine();
    this.updateAngle();
    this.angleEndPlaced = true;
  }

  moveMeasureStart(event) {
    this.updateDistanceLine();
  }

  moveMeasureEnd(event) {
    this.updateDistanceLine();
  }

  moveAngleStart(event) {
    this.updateAngleStartLine();
    this.updateAngle();
  }

  moveAngleCenter(event) {
    this.updateAngleStartLine();
    this.updateAngleEndLine();
    this.updateAngle();
  }

  moveAngleEnd(event) {
    this.updateAngleEndLine();
    this.updateAngle();
  }

  updateAngleStartLine() {
    const start = document.getElementById('anglestart');
    const end = document.getElementById('anglecenter');
    const line = document.getElementById('anglelinestart') as HTMLDivElement;
    const c = this.getAveragePosition(start, end);
    const a = this.getAngleBetweenElements(start, end);
    this.angleStartDistance = this.getDistanceBetweenElements(start, end);
    line.style.width = (this.angleStartDistance - 10).toString() + 'px';
    line.style.left = (c.x - (this.angleStartDistance / 2) + 5) + 'px';
    line.style.top = c.y + 'px';
    // disp.style.left = (c.x - (this.distance / 2) + 10) + 'px';
    // disp.style.top = c.y - 30 + 'px';
    line.style.transform = 'rotate(' + a + 'deg)';
    line.style.visibility = 'visible';
    // disp.style.visibility = 'visible';
  }

  updateAngleEndLine() {
    const start = document.getElementById('anglecenter');
    const end = document.getElementById('angleend');
    const line = document.getElementById('anglelineend') as HTMLDivElement;
    const c = this.getAveragePosition(start, end);
    const a = this.getAngleBetweenElements(start, end);
    this.angleEndDistance = this.getDistanceBetweenElements(start, end);
    line.style.width = (this.angleEndDistance - 10).toString() + 'px';
    line.style.left = (c.x - (this.angleEndDistance / 2) + 5) + 'px';
    line.style.top = c.y + 'px';
    // disp.style.left = (c.x - (this.distance / 2) + 10) + 'px';
    // disp.style.top = c.y - 30 + 'px';
    line.style.transform = 'rotate(' + a + 'deg)';
    line.style.visibility = 'visible';
    // disp.style.visibility = 'visible';
  }

  updateAngle() {
    const start = document.getElementById('anglestart');
    const center = document.getElementById('anglecenter');
    const end = document.getElementById('angleend');
    const startCenterAngle = this.getAngleBetweenElements(start, center);
    const endCenterAngle = this.getAngleBetweenElements(end, center);
    this.angle = Math.min(Math.abs(startCenterAngle - endCenterAngle), Math.abs(endCenterAngle - startCenterAngle));
    if (this.angle > 180) { this.angle = 360 - this.angle; }
    this.updateAngleDisplayLocation()
  }

  updateAngleDisplayLocation() {
    const disp = document.getElementById('angledisp') as HTMLDivElement;
    disp.style.visibility = 'visible';
    disp.style.left = this.getPositionAtCenter(document.getElementById('anglecenter')).x + 'px';
    disp.style.top = this.getPositionAtCenter(document.getElementById('anglecenter')).y - 30 + 'px';
  }

  updateDistanceLine() {
    const start = document.getElementById('measurestart');
    const end = document.getElementById('measureend');
    const line = document.getElementById('measureline') as HTMLDivElement;
    const disp = document.getElementById('measuredisp') as HTMLDivElement;
    this.distance = this.getDistanceBetweenElements(start, end);
    const c = this.getAveragePosition(start, end);
    const a = this.getAngleBetweenElements(start, end);
    line.style.width = (this.distance - 10).toString() + 'px';
    line.style.left = (c.x - (this.distance / 2) + 5) + 'px';
    line.style.top = c.y + 'px';
    line.style.transform = 'rotate(' + a + 'deg)';
    if (this.measureIsCircle) {
      line.style.height = this.distance - 10 + 'px';
      line.style.top = (c.y - (this.distance / 2) + 2) + 'px';
      line.style.left = (c.x - (this.distance / 2) + 2) + 'px';
    }
    disp.style.left = (c.x - (this.distance / 2) + 10) + 'px';
    disp.style.top = c.y - 30 + 'px';
    line.style.visibility = 'visible';
    disp.style.visibility = 'visible';
  }

  updateDistanceLineLength(dist) {
    const line = document.getElementById('measureline') as HTMLDivElement;
    line.style.width = dist.toString() + 'px';
  }

  updateDistanceLinePosition(centerpoint) {
    const line = document.getElementById('measureline') as HTMLDivElement;
    console.log(centerpoint);
  }

  onWindowChange(event) {
    if (this.startPlaced && this.endPlaced) {
      this.updateDistanceLine();
    }
    if (this.angleStartPlaced && this.angleCenterPlaced && this.angleEndPlaced) {
      this.updateAngleStartLine();
      this.updateAngleEndLine();
      this.updateAngleDisplayLocation();
    }
  }

  logScaleAndType() {
    console.log(this.scale, this.scaleType);
  }

  resetZoom() {
    this.angularCropper.cropper.zoomTo(this.initialRatio);
  }

  updateZoom(event: InputEvent) {
    const maxZoom = 2 * this.initialRatio;
    const zoomRatio = event.target['valueAsNumber'] / 100 * this.initialRatio + this.initialRatio + (maxZoom * (event.target['valueAsNumber'] / 100));
    console.log('zoom ratio:', zoomRatio, zoomRatio / this.initialRatio);
    this.timesZoom = zoomRatio / this.initialRatio;
    this.angularCropper.cropper.enable();
    this.angularCropper.cropper.zoomTo(zoomRatio);
    this.zoomScale = event.target['valueAsNumber'];
    if (!this.cropperEnabled) {
      this.angularCropper.cropper.disable();
    }
  }

  onZoom(event: CustomEvent) {
    console.log('--------zoomed---------');
    console.log(event);
    console.log(event.detail);
    this.timesZoom = Math.max(event.detail.ratio / this.initialRatio, 1);
  }

  updateScale(event: Event) {
    if (this.oldScaleType === 'mm') {
      if (this.scaleType === 'cm') {
        this.scale *= 0.1;
      } else if (this.scaleType === 'in') {
        this.scale *= 0.0393701;
      }
    } else if (this.oldScaleType === 'cm') {
      if (this.scaleType === 'mm') {
        this.scale *= 10;
      } else if (this.scaleType === 'in') {
        this.scale *= 0.393701;
      }
    } else if (this.oldScaleType === 'in') {
      if (this.scaleType === 'mm') {
        this.scale *= 25.4;
      } else if (this.scaleType === 'cm') {
        this.scale *= 2.54;
      }
    }
    this.scale = Math.round(this.scale * 100) / 100;
    this.oldScaleType = this.scaleType;
    this.setRelativeScale();
    console.log(event);
  }

  getPositionAtCenter(element) {
    const {top, left, width, height} = element.getBoundingClientRect();
    return {
      x: left + width / 2,
      y: top + height / 2
    };
  }

  getDistanceBetweenElements(a, b) {
    const aPosition = this.getPositionAtCenter(a);
    const bPosition = this.getPositionAtCenter(b);

    return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
  }

  getAveragePosition(a, b) {
    const aPosition = this.getPositionAtCenter(a);
    const bPosition = this.getPositionAtCenter(b);

    return {
      x: (aPosition.x + bPosition.x) / 2,
      y: (aPosition.y + bPosition.y) / 2
    };
  }

  getAngleBetweenElements(a, b) {
    const aPosition = this.getPositionAtCenter(a);
    const bPosition = this.getPositionAtCenter(b);

    return Math.atan2(aPosition.y - bPosition.y, aPosition.x - bPosition.x) * 180 / Math.PI;
  }

  setRelativeScale() {
    const { top, left, width, height } = document.getElementsByClassName('cropper')[0].getBoundingClientRect();
    console.log('width:', width);
    this.relativeScale = this.scale / width;
  }

  onDragMove(event: CustomEvent) {
    if (event.detail.action !== 'move') {
      return;
    }
    const measureStart = document.getElementById('measurestart');
    const measureEnd = document.getElementById('measureend');
    const measureLine = document.getElementById('measureline');
    const angleStart = document.getElementById('anglestart');
    const angleCenter = document.getElementById('anglecenter');
    const angleEnd = document.getElementById('angleend');
    const angleLineStart = document.getElementById('anglelinestart');
    const angleLineEnd = document.getElementById('anglelineend');
    if (this.startPlaced) {
      this.measureStartPos.x += event.detail.originalEvent.movementX;
      this.measureStartPos.y += event.detail.originalEvent.movementY;
      measureStart.style.transform = 'translate3d(' + this.measureStartPos.x + 'px, ' + this.measureStartPos.y + 'px, 0px)';
    }
    if (this.endPlaced) {
      this.measureEndPos.x += event.detail.originalEvent.movementX;
      this.measureEndPos.y += event.detail.originalEvent.movementY;
      measureEnd.style.transform = 'translate3d(' + this.measureEndPos.x + 'px, ' + this.measureEndPos.y + 'px, 0px)';
      this.updateDistanceLine();
    }
  }

  onCropButtonClick() {
    this.angularCropper.cropper.crop();
  }

}
