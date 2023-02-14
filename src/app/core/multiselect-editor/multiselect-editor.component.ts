import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';

@Component({
  selector: 'app-multiselect-editor',
  templateUrl: './multiselect-editor.component.html',
  styleUrls: ['./multiselect-editor.component.scss']
})
export class MultiselectEditorComponent implements AgEditorComponent, AfterViewInit {

  @ViewChild('container', { read: ViewContainerRef }) public container;

  options: string[] = [];
  selectedOptions: string[] = [];

  ngAfterViewInit() {
    window.setTimeout(() => {
      this.container.element.nativeElement.focus();
    });
  }

  agInit(params: any): void {
    params.values.forEach(value => this.options.push(value));
    this.selectedOptions = params.value;
  }

  getValue(): any {
    return this.selectedOptions;
  }

  isPopup(): boolean {
    return true;
  }

}
