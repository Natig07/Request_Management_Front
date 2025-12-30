import { Component, ViewChild } from '@angular/core';
import { Datepicker } from '../../../../components/datepicker/datepicker';
import { Row } from '../../../../services/Interfaces';
import { STATUS_MAP } from '../../../../components/status_map';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../../components/button/button';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../../services/ReportServices/ReportService';
import { AuthService } from '../../../../services/auth';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reports',
  imports: [Datepicker, FormsModule, Button, CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports {
  @ViewChild(Datepicker, { static: false }) datepicker!: Datepicker;

  // Pagination
  pageSize: number = 5;
  page: number = 1;
  currentPage: number = 1;
  totalCount: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];
  maxVisible: number = 4;
  startPage = 1;
  endPage = this.maxVisible;

  //Arrow sorting
  sortField: keyof Row | null = null;
  isAsc: boolean = true;

  onSort(columnKey: keyof Row) {
    if (this.sortField === columnKey) {
      this.isAsc = !this.isAsc; 
      console.log(columnKey)
    } else {
      this.sortField = columnKey;
      this.isAsc = true; 
    }
    this.page = 1; 
    this.fetchReports(); 
    
  }




  // Data
  data: Row[] = [];
  loading = false;

  // Search and filters
  searchText: { [key: string]: string } = {};

  fromDate?: string;
  toDate?: string;

  Math = Math;

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

  ngOnInit() {
    this.fetchReports();
  }

  fetchReports() {
    this.loading = true;

    const mergedSearch = Object.values(this.searchText)
      .filter(v => v && v.trim() !== '')
      .join(' ');

    this.repService.getFilteredReports({
      search: mergedSearch || undefined,
      fromDate: this.fromDate,
      toDate: this.toDate,
      page: this.page,
      pageSize: this.pageSize,
      sortField: this.sortField ? this.sortField.toString() : undefined,
      sortDirection: this.isAsc ? 'asc' : 'desc'
    }).subscribe({
      next: (res) => {
        console.log(res);
        this.data = res.items.map(r => ({
          id: r.id,
          sender: r.sender,
          category: r.categoryName,
          executor: r.executor ?? 'Yoxdur',
          operationTime: r.operationTime,
          firstOperationDate: r.firstOperDate
            ? new Date(r.firstOperDate + 'Z').toLocaleString('en-GB', {
                timeZone: 'Asia/Baku',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }).replace(',', '').replaceAll('/', '.')
            : undefined,
          date: new Date(r.createdAt + 'Z').toLocaleString('en-GB', {
            timeZone: 'Asia/Baku',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).replace(',', '').replaceAll('/', '.'),
          closedate: r.closeDate
            ? new Date(r.closeDate + 'Z').toLocaleString('en-GB', {
                timeZone: 'Asia/Baku',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }).replace(',', '').replaceAll('/', '.')
            : undefined,
          status: this.mapStatusName(r.statusName),
        }));

        this.totalCount = res.totalCount;
        this.currentPage = this.page;
        this.totalPages = this.newTotalPages;
        this.updatePagination();
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }


  mapStatusName(status: string): string {
    return status === 'New' ? 'açıq'
      : status === 'InProgress' ? 'icrada'
      : status === 'Completed' ? 'təsdiqləndi'
      : status === 'Denied' ? 'imtina'
      : status === 'Waiting' ? 'gözləmədə'
      : 'qapalı';
  }

  onSearchChange() {
    this.page = 1;
    this.fetchReports();
  }

  onDateChange() {
    const start = this.datepicker.range.value.start;
    const end = this.datepicker.range.value.end;

    this.fromDate = start ? this.formatDateForBackend(start) : undefined;
    this.toDate = end ? this.formatDateForBackend(end) : undefined;

    this.page = 1;
    console.log('fromDate:', this.fromDate, 'toDate:', this.toDate);
    console.log('start object:', start, 'end object:', end); // Add this
    this.fetchReports();
  }

  // Helper to format as "YYYY-MM-DD"
  formatDateForBackend(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00.000Z`;  // Add UTC time
  }



  onItemsPerPageChange() {
    this.page = 1;
    this.fetchReports();
  }

  updatePagination() {
    this.totalPages = this.newTotalPages;
    this.updateVisiblePages();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    this.currentPage = page;
    this.fetchReports();
  }

  updateVisiblePages() {
    this.endPage = Math.min(this.startPage + this.maxVisible - 1, this.totalPages);
    this.visiblePages = Array.from(
      { length: this.endPage - this.startPage + 1 },
      (_, i) => this.startPage + i
    );
  }

  showNextGroup() {
    this.startPage = Math.min(
      this.startPage + this.maxVisible,
      this.totalPages - this.maxVisible + 1
    );
    this.updateVisiblePages();
  }

  showPreviousGroup() {
    this.startPage = Math.max(1, this.startPage - this.maxVisible);
    this.updateVisiblePages();
  }

  get newTotalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  constructor(
    private authService: AuthService,
    private repService: ReportService
  ) {}

  logout() {
    this.authService.logout();
  }

  STATUS_MAP = STATUS_MAP;

  exportToExcel() {
    const exportData = this.data.map(row => ({
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

    const date = new Date();
    const filename = `Hesabat_${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}.xlsx`;

    XLSX.writeFile(wb, filename);
  }
}