import { Component, ViewChild } from '@angular/core';
import { Datepicker } from '../../../../components/datepicker/datepicker';
import { Row } from '../../../../services/Interfaces';
import { STATUS_MAP } from '../../../../components/status_map';
import { RequestService } from '../../../../services/RequestServices/RequestService';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../../components/button/button';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../../services/ReportServices/ReportService';
import { AuthService } from '../../../../services/auth';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reports',
  imports: [Datepicker,FormsModule,Button,CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports {

  @ViewChild(Datepicker,{static:false}) datepicker!: Datepicker;


  totalReports:number=0;
  selectedStatus: number = 5;
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = [];
  visiblePages: number[] = [];
  maxVisible: number = 4;
  startPage = 1;
  endPage = this.maxVisible;



  data: Row[] = []
  loading=false;

  ngOnInit() {
    this.fetchRequests();
  }
  
 

  columns: { label: string; key: keyof Row }[] = [
    { label: 'ID', key: 'id' },
    { label: 'Gondərən', key: 'sender' },
    { label: 'Kateqoriya', key: 'category' },
    { label: 'Tarix', key: 'date' },
    { label: 'İlk icra tarixi', key: 'firstOperationDate' },
    { label: 'İcra müddəti', key: 'operationTime' },
    { label: 'İcra edən', key: 'executor' },
    { label: 'Bağlanma tarixi', key: 'closedate' },
    { label: 'Status', key: 'status' },
  ];
  
  
  
  

  // Sort
  sort(key: keyof Row) {
    this.sortColumn = key;
    this.isAsc = !this.isAsc;

    this.data.sort((a, b) => {
      const valA = a[key] ?? '';
      const valB = b[key] ?? '';
      
      if (valA < valB) return this.isAsc ? -1 : 1;
      if (valA > valB) return this.isAsc ? 1 : -1;
      return 0;
    });
  }

  
  
  searchText = '';
  sortColumn = '';
  isAsc = false;

  getTableData() {
    let filtered = this.data;

    // Filter by search text
    if (this.searchText) {
      const text = this.searchText.toLowerCase();
      filtered = filtered.filter(row =>
        this.columns.some(col => String(row[col.key]).toLowerCase().includes(text))
      );
    }

    // Filter by date range
    if (this.datepicker?.range.value.start && this.datepicker?.range.value.end) {
    const startDate = new Date(this.datepicker.range.value.start);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(this.datepicker.range.value.end);
    endDate.setHours(23, 59, 59, 999);

    filtered = filtered.filter(row => {
      if (!row.date) return false;
      
      // Parse the date string (format: "DD.MM.YYYY HH:mm")
      const [datePart] = row.date.split(' ');
      const [day, month, year] = datePart.split('.');
      const rowDate = new Date(+year, +month - 1, +day);
      
      return rowDate >= startDate && rowDate <= endDate;
    });
  }

    this.totalPages = Math.ceil(filtered.length / this.selectedStatus);
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;

    const start = (this.currentPage - 1) * this.selectedStatus;
    const end = start + this.selectedStatus;


    return filtered.slice(start, end);
  }

  onDateChange() {
    this.currentPage = 1;
    this.updatePagination();
  }



  onItemsPerPageChange() {
      this.currentPage = 1;
      this.totalPages = Math.ceil(this.data.length / this.selectedStatus);
      this.updatePagination();
  }

  updatePagination() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateVisiblePages();
  }
  
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateVisiblePages();
  }
  
  updateVisiblePages() {
    this.endPage = Math.min(this.startPage + this.maxVisible - 1, this.totalPages);
    this.visiblePages = Array.from({ length: this.endPage - this.startPage + 1 }, (_, i) => this.startPage + i);
  }
  
  showNextGroup() {
    this.startPage = Math.min(this.startPage + this.maxVisible, this.totalPages - this.maxVisible + 1);
    this.updateVisiblePages();
  }
  
  showPreviousGroup() {
    this.startPage = Math.max(1, this.startPage - this.maxVisible);
    this.updateVisiblePages();
  }
  
  constructor(private authService: AuthService, private repService: ReportService) {}
  

   fetchRequests() {
    this.loading = true;
    this.repService.getAllReports().subscribe({
      next: (res: any[]) => {
        // console.log('API Response:', res); // Debug log
        
        this.data = res.map(r => ({
          id: r.id,
          sender: r.sender, 
          category: r.categoryName,
          executor: r.executor ?? 'Yoxdur',
          operationTime: r.operationTime,
          firstOperationDate: r.firstOperDate ? new Date(r.firstOperDate+"Z"
          ).toLocaleString('en-GB', {
            timeZone:'Asia/Baku',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).replace(',', '').replaceAll('/', '.') : undefined,
          date: new Date(r.createdAt+"Z").toLocaleString('en-GB', {
            timeZone:'Asia/Baku',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).replace(',', '').replaceAll('/', '.'),
          closedate: r.closeDate ? new Date(r.closeDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).replace(',', '').replaceAll('/', '.') : undefined,
          status: r.statusName=='New'?'açıq':r.statusName=='InProgress'?'icrada':r.statusName=='Completed'?'təsdiqləndi':r.statusName=='Denied'?'imtina':r.statusName=='Waiting'?'gözləmədə':'qapalı',
        }));

        this.totalReports = res.length;
        this.totalPages = Math.ceil(this.data.length / this.selectedStatus);
        this.updatePagination();
        this.loading = false;
      },
      error: (err:any) => {
        console.error('Error fetching reports', err);
        this.loading = false;
      }
    });
}
    
  
  logout() {
    this.authService.logout();
  }
  
  STATUS_MAP=STATUS_MAP;

  exportToExcel() {
    const dataToExport = this.getFilteredData();

    const exportData = dataToExport.map(row => ({
      'ID': row.id,
      'Göndərən': row.sender,
      'Kateqoriya': row.category,
      'Tarix': row.date,
      'İlk icra tarixi': row.firstOperationDate || '',
      'İcra müddəti': row.operationTime,
      'İcra edən': row.executor,
      'Bağlanma tarixi': row.closedate || '',
      'Status': row.status
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    const colWidths = [
      { wch: 10 },  
      { wch: 20 },  
      { wch: 15 },  
      { wch: 18 },  
      { wch: 18 },  
      { wch: 15 },  
      { wch: 20 },  
      { wch: 18 },  
      { wch: 12 }   
    ];
    ws['!cols'] = colWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hesabat');

    // Generate filename with current date
    const date = new Date();
    const filename = `Hesabat_${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}.xlsx`;

    // Save the file
    XLSX.writeFile(wb, filename);
  }

  getFilteredData() {
    let filtered = this.data;

    // Filter by search text
    if (this.searchText) {
      const text = this.searchText.toLowerCase();
      filtered = filtered.filter(row =>
        this.columns.some(col => String(row[col.key]).toLowerCase().includes(text))
      );
    }

    // Filter by date range
    if (this.datepicker?.range.value.start && this.datepicker?.range.value.end) {
      const startDate = new Date(this.datepicker.range.value.start);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(this.datepicker.range.value.end);
      endDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter(row => {
        if (!row.date) return false;
        
        const [datePart] = row.date.split(' ');
        const [day, month, year] = datePart.split('.');
        const rowDate = new Date(+year, +month - 1, +day);
        
        return rowDate >= startDate && rowDate <= endDate;
      });
    }

    return filtered;
  }
}

