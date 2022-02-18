import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { Component, OnInit} from '@angular/core';
import { ColDef, GridApi, GridOptions} from 'ag-grid-community';
import * as moment from 'moment';
import { VScholarDto } from 'src/app/core/to/VScholarDto';
import { ScholarService } from './services/scholar.service';
import { MatDatePickerComponent } from './mat-date-picker-component';
//import { DatePicker } from './datePicker';
import { GridReadyEvent, ICellEditorComp, ICellEditorParams } from 'ag-grid-community';


@Component({
  selector: 'app-scholar',
  templateUrl: './scholar.component.html',
  styleUrls: ['./scholar.component.scss']
})
export class ScholarComponent implements OnInit {

  
  buttonText: string = "Editar";
  editar = false;
  saveRows: number [] = [];

  rowDataScholar : VScholarDto[] = [];

  defaultColDef : ColDef;

  gridOptions: GridOptions;

  api: GridApi = new GridApi;

  columnDefSch: ColDef[] = [
    { field: 'username', headerName: 'Nombre de usuario', cellStyle: {'background-color': '#F8F8F8'}},
    { field: 'name', headerName: 'Nombre', cellStyle: {'background-color': '#F8F8F8'}}, 
    { field: 'lastname', headerName: 'Apellidos', cellStyle: {'background-color': '#F8F8F8'}}, 
    { field: 'customer', headerName: 'Cliente', cellStyle: {'background-color': '#F8F8F8'}},
    { field: 'hours', headerName: 'Horas Jornada', cellStyle: {'background-color': '#F8F8F8'}},
    { field: 'details', headerName: 'Detalle', cellStyle: {'background-color': '#F8F8F8'}},
    //El start_date está usando la clase MatDatePickerComponent para editar
    { field: 'start_date', headerName: 'Fecha inicio', editable: true,
      singleClickEdit: true, cellEditor: "datePicker", cellEditorPopup: false,
      valueFormatter : function(params) {
        if(params.data.start_date != null)
          return moment(params.data.start_date).format('DD/MM/YYYY');
        else
          return params.data.start_date;
      }
    }, 
    //El end_date está usando la clase DatePicker para editar( está al final, pero también se puede importar)
    { field: 'end_date', headerName: 'Fecha fin', editable: true,
      singleClickEdit: true, cellEditor: DatePicker, cellEditorPopup: true,
      valueFormatter : function(params) {
        if(params.data.end_date != null)
          return moment(params.data.end_date).format('DD/MM/YYYY');
        else
          return params.data.end_date;
      }
      /*
      valueSetter: params => {
        var newValue = params.newValue;
        if(newValue != null) {
          //params.data.end_date = moment(newValue).format('YYYY-MM-DD');
          var dateParts = newValue.split('/');
          params.data.end_date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        }
        else if (newValue){
          params.data.end_date = null;
        }
        return true;
      }
      */
    }, 
    { field: 'title', headerName: 'Titulación', editable: this.isEditing.bind(this),
      singleClickEdit: true}, 
    { field: 'action', headerName: 'Acción', editable: this.isEditing.bind(this),
      singleClickEdit: true, 
      valueGetter: function (params) {
        if (params.data.action == 1) {
            return 'Contrato';
        } else if (params.data.action == 0) {
            return 'Out';
        } else {
            return 'Continuar';
        }
      },
      valueSetter: params => {
        var newValue = params.newValue;
        if(newValue == "Contrato") {
          params.data.action = 1;
        }
        else if (newValue == "Out") {
          params.data.action = 0;
        }
        else {
          params.data.action = 2;
        }
        return true;
      }
    },
    { field: 'active', headerName: 'Estado', cellStyle: {'background-color': '#F8F8F8'},
      valueGetter: function (params) {
        if (params.data.active == 1) {
            return 'Activo';
        } else if (params.data.active == 0) {
            return 'Baja';
        } else {
            return 'Pendiente';
        }
      }
    },
  ];


  frameworkComponents: { datePicker: typeof MatDatePickerComponent; };

  constructor( private scholarService: ScholarService ) 
  { 
    this.frameworkComponents = { datePicker: MatDatePickerComponent };

    this.defaultColDef = {
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      filterParams: {
        filterOptions: ["contains"],
        newRowsAction: 'keep',
      },
    };

    this.gridOptions = {
      getRowNodeId: (data) => data.id,
    };
  }

  ngOnInit(): void {
    this.scholarService.findScholars().subscribe( (res) => {
      debugger;
      this.rowDataScholar = res;
    }); 
  }

  onGridReady = (params: { api: GridApi;}) => {
    this.api = params.api;

    var filter = {

      active: {
        type: 'contains',
        filter: 'Activo'
      }
    };
    
    this.api.setFilterModel(filter);
  }

  isEditing(): boolean {
    return this.editar;
  }

  changeMode(): void {

    if(this.buttonText == "Editar") {
      this.buttonText = "Guardar y Finalizar";
      this.editar = true;
    }
    else {
      this.buttonText = "Editar";
      this.editar = false;
      this.save();
    }
  }

  onCellEditingStopped(e: any) {
    if(e.oldValue != e.newValue) {
      if(!this.saveRows.includes(e.node.data.id))
        this.saveRows.push(e.node.data.id);
    }
}

  save() {
    this.api.forEachNode(node => {
      if(this.saveRows.includes(node.data.id) || node.data.id == null) {
        debugger;
        this.scholarService.saveOrUpdateScholar(node.data).subscribe(data => {
          node.updateData(data);
        });
      }
    });

    this.api?.onFilterChanged();
    this.saveRows = [];
  }

}

//Clase para modificar la fecha usando DatePicker
class DatePicker implements ICellEditorComp {
  eInput!: HTMLInputElement;

  // gets called once before the renderer is used
  init(params: ICellEditorParams) {
    // create the cell
    this.eInput = document.createElement('input');
    this.eInput.value = params.value;
    this.eInput.classList.add('ag-input');
    this.eInput.style.height = '100%';

    // https://jqueryui.com/datepicker/
    $(this.eInput).datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: () => {
        this.eInput.focus();
      },
    });
  }

  // gets called once when grid ready to insert the element
  getGui() {
    return this.eInput;
  }

  // focus and select can be done after the gui is attached
  afterGuiAttached() {
    this.eInput.focus();
    this.eInput.select();
  }

  // returns the new value after editing
  getValue() {
    return this.eInput.value;
  }

  // any cleanup we need to be done here
  destroy() {
    // but this example is simple, no cleanup, we could
    // even leave this method out as it's optional
  }

  // if true, then this editor will appear in a popup
  isPopup() {
    // and we could leave this method out also, false is the default
    return false;
  }
}