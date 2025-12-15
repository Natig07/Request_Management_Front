import { CommonModule,  } from '@angular/common';
import { Component, HostListener, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Button } from '../../../../components/button/button';
import { STATUS_MAP } from '../../../../components/status_map';
import { RequestService } from '../../../../services/RequestServices/RequestService';
import { Row } from '../../../../services/Interfaces';
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'app-requests',
  imports: [CommonModule,RouterModule,FormsModule,Button],
  templateUrl: './requests.html',
  styleUrl: './requests.css'
})

export class Requests {
  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.dropdown-container');
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  
  filters = [
    { label: 'Hamısı', status: 'all', count: 0 },
    { label: 'Açıq', status: 'açıq', count: 0 },
    { label: 'İcrada', status: 'icrada', count: 0 },
    { label: 'Qapalı', status: 'qapalı', count: 0 },
    { label: 'Gözləmədə', status: 'gözləmədə', count: 0 },
    { label: 'Təsdiqlənmiş', status: 'təsdiqləndi', count: 0 },
    { label: 'İmtina edilmiş', status: 'imtina', count: 0 },
  ];

  //Arrow filter part
  searchText: { [key: string]: string } = {};
  sortColumn = '';
  isAsc = false;

  columns: { label: string; key: keyof Row }[] = [
    { label: 'ID', key: 'id' },
    { label: 'Gondərən', key: 'sender' },
    { label: 'Başlıq', key: 'header' },
    { label: 'Mətn', key: 'text' },
    { label: 'Kateqoriya', key: 'category' },
    { label: 'İcraçı', key: 'executor' },
    { label: 'Tarix', key: 'date' },
    { label: 'Status', key: 'status' },
  ];

  data: Row[] = []
  loading = false;
  
  updateFilterCounts() {
    this.filters.forEach(filter => {
      if (filter.status === 'all') {
        filter.count = this.data.length;
      } else {
        filter.count = this.data.filter(row => row.status === filter.status).length;
      }
    });
  }

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

  activeFilter = 'all';

  setActiveFilter(filterStatus: string) {
    const filter = this.filters.find(f => f.status === filterStatus);
    this.activeFilter = filter ? filter.status : 'all';
    this.currentPage = 1; 
    this.updatePagination();
  }

  // Pagination properties
  selectedStatus: number = 5;
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = [];
  visiblePages: number[] = [];
  maxVisible: number = 4;
  startPage = 1;
  endPage = this.maxVisible;

  userName: string | null = null;

  ngOnInit() {
    this.fetchRequests();
    this.userName = this.authService.getUserFullName();
  }

  fetchRequests() {
    this.loading = true;
    this.requestService.getAllRequests().subscribe({
      next: (res: any[]) => {
        // console.log(res);
        this.data = res.map(r => ({
          id: r.id,
          sender: `${r.username+" "+r.usersurname}`,
          header: r.header ?? r.text?.slice(0, 20) ?? '',
          text: r.text ?? '',
          category: r.categoryName,
          executor: r.executor?.name ?? 'Yoxdur',
          date: new Date(r.createdAt+"Z").toLocaleString('en-GB', {
            timeZone:'Asia/Baku',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).replace(',', '').replaceAll('/', '.'),
          
          status: r.statusName=='New'?'açıq':r.statusName=='InProgress'?'icrada':r.statusName=='Completed'?'təsdiqləndi':r.statusName=='Denied'?'imtina':r.statusName=='Waiting'?'gözləmədə':'qapalı',
          file: r.file?.fileName ?? null
        }));

        this.updateFilterCounts();
        this.totalPages = Math.ceil(this.getFilteredData().length / this.selectedStatus);
        this.updatePagination();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching requests', err);
        this.loading = false;
      }
    });
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.getFilteredData().length / this.selectedStatus);
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

  // Helper method to get filtered data (without slicing for pagination)
  getFilteredData() {
    let filtered = this.data;

    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(row => row.status === this.activeFilter);
    }

    if (this.searchText) {
      filtered = filtered.filter(row =>
        this.columns.every(col =>
          !this.searchText[col.key] ||
          String(row[col.key]).toLowerCase().includes(this.searchText[col.key].toLowerCase())
        )
      );
    }

    return filtered;
  }

  // Returns paginated data for the table
  getTableData() {
    const filtered = this.getFilteredData();
    
    // Recalculate total pages based on filtered data
    const newTotalPages = Math.ceil(filtered.length / this.selectedStatus);
    if (newTotalPages !== this.totalPages) {
      this.totalPages = newTotalPages;
      this.updatePagination();
    }

    // Ensure current page is valid
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }

    const start = (this.currentPage - 1) * this.selectedStatus;
    const end = start + this.selectedStatus;

    return filtered.slice(start, end);
  }

  showNextGroup() {
    this.startPage = Math.min(this.startPage + this.maxVisible, this.totalPages - this.maxVisible + 1);
    this.updateVisiblePages();
  }

  showPreviousGroup() {
    this.startPage = Math.max(1, this.startPage - this.maxVisible);
    this.updateVisiblePages();
  }
  
  getFilterCount(status: string) {
    return this.data.filter(row => status === 'all' ? true : row.status === status).length;
  }

  constructor(private authService: AuthService, private requestService: RequestService) {}

  logout() {
    this.authService.logout();
  }

  STATUS_MAP = STATUS_MAP;
}