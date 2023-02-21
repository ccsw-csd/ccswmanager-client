import { Component, OnInit} from '@angular/core';
import { DialogComponent } from '../core/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { iif } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CellClickedEvent, ColDef, GridApi, GridOptions} from 'ag-grid-community';
import * as moment from 'moment';
import ResizeObserver from 'resize-observer-polyfill';

import { PersonalService } from '../personal/services/personal.service';
import { InternService } from './services/intern.service';

import { InternDto } from '../core/to/InternDto';
import { PersonDto } from '../core/to/PersonDto';
import { AlertDialogComponent } from '../core/alert-dialog/alert-dialog.component';
import { TimelineComponent } from './timeline/timeline.component';
import { TextDialogComponent } from './text-dialog/text-dialog.component';
import { MultiselectEditorComponent } from '../core/multiselect-editor/multiselect-editor.component';
import { LdapInternDialogComponent } from './ldap-intern-dialog/ldap-intern-dialog.component';


@Component({
  selector: 'app-intern',
  templateUrl: './intern.component.html',
  styleUrls: ['./intern.component.scss']
})
export class InternComponent implements OnInit {

  edit: boolean = false;

  ldap: boolean = true;

  gridOptions: GridOptions;
  api: GridApi = new GridApi;
  
  columnDefs: ColDef[];
  defaultColDef : ColDef;
  frameworkComponents;

  searchPersonsCtrl = new FormControl();
  isLoading: boolean = false;
  errorMsg: string | undefined;

  rowData : InternDto[] = [];
  saveRows: InternDto[] = [];
  deleteRows: InternDto[] = [];
  persons: any[] = [];

  counter: number = 0;

  educations: string[] = [];
  educationCenters: string[] = [];
  centers: string[] = [];
  provinces: string[] = [];
  technologies: string[] = [];
  levels: string[] = [];
  actions: string[] = [];

  public dialogRef : TimelineComponent | any;

  filterModel : any;

  constructor( 
    private internService: InternService, 
    private personalService: PersonalService, 
    public dialog: MatDialog
  ) {

    this.columnDefs = [
      { field: 'delete', headerName:'', minWidth: 62, maxWidth: 62, floatingFilter: false, editable: false, sortable: false, hide: true,
        cellRenderer: function(params) {
          return '<span><i class="material-icons" style="margin-top:10px; color: lightcoral;">clear</i></span>'
        },
        onCellClicked: (event: CellClickedEvent) => this.delete(event)
      },

      { field: 'period', headerName: 'Periodo', maxWidth: 85, minWidth: 85,
        cellStyle: params => {
          if (params.value == "" || params.value == null || params.value == undefined) {
            return {borderColor: 'lightcoral'};
          } else if (params.value.length > 5) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'username', headerName: 'Username', maxWidth: 120, minWidth: 120,
        cellStyle: params => {
          if(params.value?.length > 25) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'name', headerName: 'Nombre', maxWidth: 200, minWidth: 150,
        cellStyle: params => {
          if (params.value == "" || params.value == null || params.value == undefined) {
            return {borderColor: 'lightcoral'};
          } else if (params.value.length > 50) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'lastname', headerName: 'Apellidos', minWidth: 150,
        cellStyle: params => {
          if (params.value == "" || params.value == null || params.value == undefined) {
            return {borderColor: 'lightcoral'};
          } else if (params.value.length > 100) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'gender', headerName: 'Genero', maxWidth: 98, minWidth: 98,
        valueGetter: function (params) {
          if (params.data.gender == 1) {
            return 'Mujer';
          } else if (params.data.gender == 2) {
            return 'Hombre';
          } else if (params.data.gender == 0) {
            return 'Otros';
          } else {
            return null;
          }
        },
        valueSetter: params => {
          var newValue = params.newValue;
          if(newValue == "Mujer") {
            params.data.gender = 1;
          } else if (newValue == "Hombre") {
            params.data.gender = 2;
          } else if (newValue == "Otros") {
            params.data.gender = 0;
          } else {
            params.data.gender = null;
          }
          return true;
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['','Mujer', 'Hombre', 'Otros']
        }
      },

      { field: 'education', headerName: 'Titulación', maxWidth: 200, minWidth: 200,
        cellEditor: 'agSelectCellEditor',
        valueGetter: function (params) {
          return (params.data.education == null || params.data.education == "" || params.data.education == undefined) ? '' : params.data.education.name;
        },
        valueSetter: params => {
          var newValue = params.newValue;
          var id = this.educations.indexOf(newValue);
          params.data.education = (newValue == null || newValue == "" || newValue == undefined) ? null : {id: id, name: newValue};
          return true;
        }
      },

      { field: 'educationCenter', headerName: 'Centro', maxWidth: 200, minWidth: 200,
        cellEditor: 'agSelectCellEditor',
        valueGetter: function (params) {
          return (params.data.educationCenter == null || params.data.educationCenter == "" || params.data.educationCenter == undefined) ? '' : '[' + params.data.educationCenter.type + '] ' + params.data.educationCenter.name;
        },
        valueSetter: params => {
          var newValue = params.newValue;

          if(newValue == null || newValue == "" || newValue == undefined){
            params.data.educationCenter = null;
          } else {
            var id = this.educationCenters.indexOf(newValue);
            var educationCenterParts = newValue.split('] ');
            params.data.educationCenter = {id: id, name: educationCenterParts[1], type: educationCenterParts[0].replace('[', '')};
          }
          return true;
        }
      },

      { field: 'center', headerName: 'Oficina', maxWidth: 114, minWidth: 114,
        cellEditor: 'agSelectCellEditor',
        valueGetter: function (params) {
          return params.data.center.name;
        },
        valueSetter: params => {
          var newValue = params.newValue;
          var id = this.centers.indexOf(newValue);
          params.data.center = {id: id, name: newValue};

          return true;
        }
      },

      { field: 'province', headerName: 'Localización', maxWidth: 150, minWidth: 150,
        cellEditor: 'agSelectCellEditor',
        valueGetter: function (params) {
          return (params.data.province == null || params.data.province == "" || params.data.province == undefined) ? '' : params.data.province.province;
        },
        valueSetter: params => {
          var newValue = params.newValue;
          var id = this.provinces.indexOf(newValue);
          params.data.province = (newValue == null || newValue == "" || newValue == undefined) ? null : {id: id, province: newValue};
          return true;
        }
      },

      { field: 'startDate', headerName: 'Inicio', maxWidth: 130, minWidth: 130,
        cellEditorPopup: false, comparator : this.dateComparator,
        valueGetter : function(params) {
          return params.data.startDate != null ? moment(params.data.startDate).format('DD/MM/YYYY') : params.data.startDate;
        },
        valueSetter: params => {
          var newValue = params.newValue;
          if (newValue == ""){
            params.data.startDate = null;
          } else if(newValue != null) {
            var dateParts = newValue.split('/');
            params.data.startDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          }
          return true;
        }
      },

      { field: 'endDate', headerName: 'Fin', maxWidth: 130, minWidth: 130,
        cellEditorPopup: false, comparator : this.dateComparator,
        valueGetter : function(params) {
          return params.data.endDate != null ? moment(params.data.endDate).format('DD/MM/YYYY') : params.data.endDate;
        },
        valueSetter: params => {
          var newValue = params.newValue;
          if (newValue == ""){
            params.data.endDate = null;
          } else if (newValue != null) {
            var dateParts = newValue.split('/');
            params.data.endDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          }
          return true;
        }
      },

      { field: 'hours', headerName: 'Horas', maxWidth: 75, minWidth: 75,
        cellStyle: params => {
          if (params.value == "" || params.value == null || params.value == undefined) {
            return {borderColor: 'lightcoral'};
          } else if (params.value.length > 2) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'customer', headerName: 'Cliente', maxWidth: 150, minWidth: 150,
        cellStyle: params => {
          if (params.value?.length > 100) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'code', headerName: 'Código', maxWidth: 100, minWidth: 100,
        cellStyle: params => {
          if (params.value?.length > 50) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'technologies', headerName: 'Tecnologias', maxWidth: 200, minWidth: 200,
        cellEditor: 'multiselectCellEditor',
        valueGetter: function (params) {
          return (params.data.technologies == null || params.data.technologies.length == 0 || params.data.technologies == undefined) ? '' : params.data.technologies.map(t => t.name);
        },
        valueSetter: params => {
          var newValue = params.newValue;
          
          if (newValue != null && newValue != undefined){
            params.data.technologies = [];

            newValue.forEach(tech => {
              var id = this.technologies.indexOf(tech);
              params.data.technologies.push({id: id, name: tech});
            });
          }
          return true;
        }
      },

      { field: 'englishLevel', headerName: 'Inglés', maxWidth: 114, minWidth: 114,
        cellEditor: 'agSelectCellEditor',
        valueGetter: function (params) {
          return (params.data.englishLevel == null || params.data.englishLevel == "" || params.data.englishLevel == undefined) ? '' : params.data.englishLevel.name;
        },
        valueSetter: params => {
          var newValue = params.newValue;
          var id = this.levels.indexOf(newValue);
          params.data.englishLevel = (newValue == null || newValue == "" || newValue == undefined) ? null : {id: id, name: newValue};
          return true;
        }
      },

      { field: 'mentor', headerName: 'Mentor', maxWidth: 150, minWidth: 150,
        cellStyle: params => {
          if(params.value?.length > 200) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'coordinator', headerName: 'Coordinador', maxWidth: 150, minWidth: 150,
        cellStyle: params => {
          if (params.value == "" || params.value == null || params.value == undefined) {
            return {borderColor: 'lightcoral'};
          } else if (params.value.length > 200) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'hrManager', headerName: 'Resp. RRHH', maxWidth: 150, minWidth: 150,
        cellStyle: params => {
          if (params.value == "" || params.value == null || params.value == undefined) {
            return {borderColor: 'lightcoral'};
          } else if (params.value.length > 200) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'action', headerName: 'Acción', maxWidth: 150, minWidth: 150,
        cellEditor: 'agSelectCellEditor',
        valueGetter: function (params) {
          return (params.data.action == null || params.data.action == "" || params.data.action == undefined) ? '' : params.data.action.name;
        },
        valueSetter: params => {
          var newValue = params.newValue;
          var id = this.actions.indexOf(newValue);
          params.data.action = (newValue == null || newValue == "" || newValue == undefined) ? null : {id: id, name: newValue};
          return true;
        }
      },

      { field: 'contractDate', headerName: 'F. Contrato', maxWidth: 130, minWidth: 130,
        cellEditorPopup: false, comparator : this.dateComparator,
        valueGetter : function(params) {
          return params.data.contractDate != null ? moment(params.data.contractDate).format('DD/MM/YYYY') : params.data.contractDate;
        },
        valueSetter: params => {
          var newValue = params.newValue;
          if (newValue == ""){
            params.data.contractDate = null;
          } else if (newValue != null) {
            var dateParts = newValue.split('/');
            params.data.contractDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          }
          return true;
        }
      },

      { field: 'active', headerName: 'Estado', maxWidth: 98, minWidth: 98,
        valueGetter: function (params) {
          if (params.data.active == 1) {
              return 'Activo';
          } else if (params.data.active == 0) {
              return 'Inactivo';
          } else {
              return 'Pendiente';
          }
        },
        valueSetter: params => {
          var newValue = params.newValue;
          if(newValue == "Activo") {
            params.data.active = 1;
          } else if (newValue == "Inactivo") {
            params.data.active = 0;
          } else {
            params.data.active = 2;
          }
          return true;
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['Activo', 'Inactivo', 'Pendiente']
        }
      },

      { field: 'link', headerName:'', maxWidth: 62, minWidth: 62, floatingFilter: false, editable: false, sortable: false,
        cellRenderer: function(params) {
          if((params.data.link == null || params.data.link == "" || params.data.link == undefined)){
            return '<span><i class="material-icons" style="margin-top:10px; color: #12abdb;">link_off</i></span>'
          } else {
            return '<span><i class="material-icons" style="margin-top:10px; color: #12abdb;">link</i></span>'
          }
        },
        onCellClicked: (event: CellClickedEvent) => this.link(event)
      },

      { field: 'comment', headerName:'', maxWidth: 62, minWidth: 62, floatingFilter: false, editable: false, sortable: false,
        cellRenderer: function(params) {
          if((params.data.comment == null || params.data.comment == "" || params.data.comment == undefined)){
            return '<span><i class="material-icons" style="margin-top:10px; color: #12abdb;">chat_bubble</i></span>'
          } else {
            return '<span><i class="material-icons" style="margin-top:10px; color: #12abdb;">chat</i></span>'
          }
        },
        onCellClicked: (event: CellClickedEvent) => this.comment(event)
      }
    ];

    this.defaultColDef = {
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      filterParams: {
        filterOptions: ["contains","equals"],
        newRowsAction: 'keep',
      },
      floatingFilterComponentParams: {suppressFilterButton:true},
      suppressMenu: true,
      editable: this.isEditing.bind(this),
      singleClickEdit: true,
      tooltipValueGetter(params) {
        return params.value;
      }
    };

    this.gridOptions = {
      getRowNodeId: (data) => data.id
    };

    this.frameworkComponents = {
      multiselectCellEditor: MultiselectEditorComponent
    };
  }

  ngOnInit(): void {
    this.getInterns();
    this.getEducations();
    this.getEducationCenters();
    this.getCenters();
    this.getProvinces();
    this.getTechnologies();
    this.getLevels();
    this.getActions();

    this.searchPersonsCtrl.valueChanges.pipe(
      debounceTime(100),
      tap(() => {
        this.errorMsg = '';
        this.persons = [];
        this.isLoading = true;
      }),
      switchMap(value =>
        iif(() => value.length > 2,
        this.personalService.findScholarsByFilter(value))
        .pipe(
          finalize(() => { this.isLoading = false; })
        )
      )
    ).subscribe((data: any) => {
      this.persons = this.persons.concat(data);
    });
  }

  getInterns() : void {
    this.internService.findInterns().subscribe((res) => {
      this.rowData = res;
      this.checkLdap();
    });
  }

  checkLdap(): void {
    this.internService.checkLdap().subscribe((res) => {
      this.ldap = res;
    })
  }

  getEducations() : void {
    this.personalService.findEducation().subscribe((res) => {
      res.forEach(education => {
        if(education.id != undefined && education.name) {
          this.educations[education.id] = education.name;
        }
      });
      var column = this.api.getColumnDef('education');
      if (column != null) {
        column.cellEditorParams = { values: this.educations}
      }
    });
  }

  getEducationCenters() : void {
    this.personalService.findEducationCenter().subscribe((res) => {
      res.forEach(educationCenter => {
        if(educationCenter.id != undefined && educationCenter.name) {
          this.educationCenters[educationCenter.id] = '[' + educationCenter.type + '] ' + educationCenter.name;
        }
      });
      var column = this.api.getColumnDef('educationCenter');
      if (column != null) {
        column.cellEditorParams = { values: this.educationCenters}
      }
    });
  }

  getCenters() : void {
    this.personalService.findCenters().subscribe((res) => {
      res.forEach(center => {
        if(center.id != undefined && center.name) {
          this.centers[center.id] = center.name;
        }
      });
      var column = this.api.getColumnDef('center');
      if (column != null) {
        column.cellEditorParams = { values: this.centers}
      }
    });
  }

  getProvinces() : void {
    this.personalService.findProvince().subscribe((res) => {
      res.forEach(provinceKey => {
        if(provinceKey.id != undefined && provinceKey.province) {
          this.provinces[provinceKey.id] = provinceKey.province;
        }
        this.provinces[0] = '';
      });
      var column = this.api.getColumnDef('province');
      if (column != null) {
        column.cellEditorParams = { values: this.provinces}
      }
    });
  }

  getTechnologies() : void {
    this.personalService.findTechnology().subscribe((res) => {
      res.forEach(technology => {
        if(technology.id != undefined && technology.name) {
          this.technologies[technology.id] = technology.name;
        }
      });
      var column = this.api.getColumnDef('technologies');
      if (column != null) {
        column.cellEditorParams = { values: this.technologies}
      }
    });
  }

  getLevels() : void {
    this.personalService.findLevel().subscribe((res) => {
      res.forEach(level => {
        if(level.id != undefined && level.name) {
          this.levels[level.id] = level.name;
        }
      });
      var column = this.api.getColumnDef('englishLevel');
      if (column != null) {
        column.cellEditorParams = { values: this.levels}
      }
    });
  }

  getActions() : void {
    this.personalService.findAction().subscribe((res) => {
      res.forEach(action => {
        if(action.id != undefined && action.name) {
          this.actions[action.id] = action.name;
        }
      });
      var column = this.api.getColumnDef('action');
      if (column != null) {
        column.cellEditorParams = { values: this.actions}
      }
    });
  }

  onGridReady = (params: { api: GridApi;}) => {
    this.api = params.api;

    const filter = {
      active: {
        type: 'equals',
        filter: 'Activo'
      }
    };

    const sort = [
      {colId: 'endDate', sort: 'asc'}
    ];

    this.api.setFilterModel(filter);
    this.filterModel = this.api.getFilterModel();
    this.api.setSortModel(sort);
    this.api.sizeColumnsToFit();
    let agGrid = document.getElementById('agGridIntern');
    let obs = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.api.sizeColumnsToFit();
      }
    });
    if(agGrid != null)
      obs.observe(agGrid);
  }

  resetFilters(): void {
    this.api.setFilterModel(this.filterModel);
  }

  isEditing(): boolean {
    return this.edit;
  }

  changeMode(): void {
    if(this.edit == false) {
      this.edit = true;
      this.gridOptions.columnApi?.setColumnVisible('delete', true);
      this.api.sizeColumnsToFit();
    } else {
      if(this.validations()) {
        this.searchPersonsCtrl.setValue("");
        this.edit = false;
        this.gridOptions.columnApi?.setColumnVisible('delete', false);
        this.api.sizeColumnsToFit();
        this.save();
      } else {
        this.dialog.open(AlertDialogComponent, {
          data: { titulo: "Error", informacion: "Existen campos que tienen errores o bien no pueden ser vacíos o bien el texto es demasiado largo.<br />Por favor, revise los errores antes de guardar los datos."}
        });
      }
    }
  }

  validations(): boolean {
    var correct = true;

    this.api.forEachNode(node => {
      if(this.saveRows.includes(node.data)) {
        if(this.isEmpty(node.data.period) || this.isEmpty(node.data.name) || this.isEmpty(node.data.lastname) || this.isEmpty(node.data.center) || this.isEmpty(node.data.hours)
        || this.isEmpty(node.data.englishLevel) || this.isEmpty(node.data.coordinator) || this.isEmpty(node.data.hrManager) || this.isEmpty(node.data.active) ) {
          correct = false;
        } else if(!this.isEmpty(node.data.startDate) && !this.isEmpty(node.data.endDate) && (moment(node.data.startDate, "YYYY-MM-DD").valueOf() > moment(node.data.endDate, "YYYY-MM-DD").valueOf())) {
          correct = false;
        } else if(node.data.period?.length > 5 || node.data.username?.length > 25 || node.data.name?.length > 50 || node.data.lastname?.length > 100 || node.data.email?.length > 100
          || node.data.hours?.length > 2 || node.data.customer?.length > 100 || node.data.code?.length > 50
          || node.data.mentor?.length > 200 || node.data.coordinator?.length > 200 || node.data.hrManager?.length > 50 || node.data.link?.length > 400 || node.data.comment?.length > 400) {
          correct = false;
        }
      }
    });
    return correct;
  }

  isEmpty(value: any): boolean {
    return value === undefined || value === null || value === '';
  }

  undoChanges(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: "Atención", description: "Vas a deshacer los cambios que hayas podido hacer en el listado y que no se hayan guardado.<br/>¿Estás seguro que deseas deshacer los cambios?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.edit = false;
        this.gridOptions.columnApi?.setColumnVisible('delete', false);
        this.api.sizeColumnsToFit();
        this.saveRows = [];
        this.deleteRows = [];
        this.searchPersonsCtrl.setValue("");
        this.getInterns();
      }
    });
  }

  onCellEditingStopped(e: any) {
    if(e.oldValue != e.newValue) {
      if(!this.saveRows.includes(e.node.data))
        this.saveRows.push(e.node.data);
    }
  }

  save(): void {
    var internsChanged: InternDto[] = [];

    this.api.forEachNode(node => {
      if(this.saveRows.includes(node.data)) {
        internsChanged.push(node.data);
      }
    });

    internsChanged = internsChanged.concat(this.deleteRows);

    this.internService.saveOrUpdateInterns(internsChanged).subscribe(data => {
      this.rowData = data;
      this.checkLdap();
    });

    this.api?.onFilterChanged();
    this.saveRows = [];
    this.deleteRows = [];
  }

  addPersonToData(person: PersonDto): void {

    var intern: InternDto = new InternDto();

    intern.period = this.getQuarter();
    intern.username = person.username;
    intern.name = person.name;
    intern.lastname = person.lastname;
    intern.email = person.email;

    if(person.hours == null) {
      intern.hours = 5;
    }

    if(person.center == null) {
      var idCenter = this.centers.findIndex(center => center == 'Valencia');
      intern.center = {id: idCenter, name: this.centers[idCenter]};
    } else {
      intern.center = person.center;
    }

    if (person.province == null) {
      var idProvince = this.provinces.findIndex(province => province == intern.center?.name);
      intern.province = {id: idProvince, province: this.provinces[idProvince]};
    }

    var idLevel = this.levels.findIndex(level => level == 'Pendiente');
    intern.englishLevel = {id: idLevel, name: this.levels[idLevel]};

    if(person.active == null) {
      intern.active = 1;
    }

    intern.technologies = [];

    this.rowData = this.rowData.concat([intern]);
    this.searchPersonsCtrl.setValue("");
    this.saveRows.push(intern);
  }

  getQuarter(): string {
    var today = new Date();
    return 'Q' + Math.floor((today.getMonth() + 3) / 3).toString() + '\'' +  today.getFullYear().toString().slice(2);
  }

  delete(event: CellClickedEvent): void {
    var rowNode;
    if(event.node.id != undefined)
      rowNode = this.api.getRowNode(event.node.id);

    var index = this.rowData.indexOf(rowNode?.data);
    this.rowData.splice(index, 1);
    this.api.setRowData(this.rowData);

    var intern: InternDto = rowNode?.data;

    if(this.saveRows.includes(intern)) {
      var indexSave = this.saveRows.indexOf(intern);
      this.saveRows.splice(indexSave, 1);
    }

    if(intern.id != null && intern.id != undefined) {
      intern.delete = true;
      this.deleteRows.push(intern);
    }
  }

  link(event: CellClickedEvent): void {

    var intern: InternDto = event.node.data;

    const dialogRef = this.dialog.open(TextDialogComponent, {
      data: { title: "Link evaluación", text: intern.link, edit: this.edit }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        
        if(this.saveRows.includes(intern)) {
          var indexSave = this.saveRows.indexOf(intern);
          this.saveRows.splice(indexSave, 1);
        }
    
        intern.link = result;
        this.saveRows.push(intern);
      }
    });
  }

  comment(event: CellClickedEvent): void {

    var intern: InternDto = event.node.data;

    const dialogRef = this.dialog.open(TextDialogComponent, {
      data: { title: "Comentario", text: intern.comment, edit: this.edit }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        
        if(this.saveRows.includes(intern)) {
          var indexSave = this.saveRows.indexOf(intern);
          this.saveRows.splice(indexSave, 1);
        }
    
        intern.comment = result;
        this.saveRows.push(intern);
      }
    });
  }

  openTimeLine(): void {
    this.dialogRef = this.dialog.open(TimelineComponent, {
      data: {},
      width: '90vw',
      height: '90vh'
    });
  }

  resizeGrid(): void {
    this.api.sizeColumnsToFit();
  }

  firstDataRendered(): void {
    this.resizeGrid();
    this.updateChips();
  }

  updateChips(): void {
    this.counter = 0;

    this.api.forEachNodeAfterFilter(node => this.counter++);
  }

  openLdap(): void {
    const dialogRef = this.dialog.open(LdapInternDialogComponent, {
      data: {}
    });
  }

  onBtExport(): void {
    var excelParams = {
      fileName: 'BecariosCCA',
      columnSeparator: ';',
    }
    this.api.exportDataAsCsv(excelParams);
  }

  dateComparator(date1 : any, date2 : any) {
    var date1Number = date1 && moment(date1, "DD/MM/YYYY").valueOf();
    var date2Number = date2 && moment(date2, "DD/MM/YYYY").valueOf();

    if (date1Number == null && date2Number == null) {
      return 0;
    }

    if (date1Number == null) {
      return -1;
    } else if (date2Number == null) {
      return 1;
    }

    return date1Number - date2Number;
  }

}