import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Button } from '../../../../components/button/button';
import { STATUS_MAP } from '../../../../components/status_map';
import { RequestService } from '../../../../services/RequestServices/RequestService';
import { Row } from '../../../../services/Interfaces';
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'app-requests',
  imports: [CommonModule, RouterModule, FormsModule, Button],
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

  // Search inputs for each column
  searchText: { [key: string]: string } = {};
  
  onSearchChange() {
    this.page = 1;
    this.buildSearchQuery();
    this.fetchRequests();
  }

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

  data: Row[] = [];
  loading = false;
  page = 1;
  pageSize = 5;
  totalCount = 0;
  search?: string;
  fromDate?: string;
  toDate?: string;
  
  activeFilter: string | null = 'all';

  setActiveFilter(filterStatus: string) {
    this.activeFilter = filterStatus;
    this.page = 1;
    this.fetchRequests();
  }

  // Pagination properties
  currentPage: number = 1;
  totalPages: number = 0;
  visiblePages: number[] = [];
  maxVisible: number = 4;
  startPage = 1;
  endPage = this.maxVisible;

  userName: string | null = null;
  Math = Math;


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
    this.fetchRequests(); 
    
  }

  ngOnInit() {
    this.fetchRequests();
    this.userName = this.authService.getUserFullName();
  }

  // Build combined search query from individual column searches
  buildSearchQuery() {
    const searchParts: string[] = [];
    
    Object.keys(this.searchText).forEach(key => {
      const value = this.searchText[key];
      if (value && value.trim()) {
        searchParts.push(value.trim());
      }
    });
    
    this.search = searchParts.length > 0 ? searchParts.join(' ') : undefined;
  }

    backendToFrontendStatusMap: Record<string, string> = {
      New: 'açıq',
      InProgress: 'icrada',
      Completed: 'təsdiqləndi',
      Denied: 'imtina',
      Waiting: 'gözləmədə',
      Closed: 'qapalı'
    };


  fetchRequests() {
    this.loading = true;

    const mergedSearch = Object.values(this.searchText)
      .filter(v => v && v.trim() !== '')
      .join(' ');

    this.requestService.getFilteredRequests({
      statusId: this.mapStatusToId(this.activeFilter),
      search: mergedSearch  || undefined,
      fromDate: this.fromDate,
      toDate: this.toDate,
      page: this.page,
      pageSize: this.pageSize,
      sortField: this.sortField ? this.sortField.toString() : undefined,
      sortDirection: this.isAsc ? 'asc' : 'desc'
    }).subscribe({
      next: (res) => {
        this.data = res.items.map(r => ({
          id: r.id,
          sender: `${r.username} ${r.usersurname}`,
          header: r.header ?? r.text?.slice(0, 20) ?? '',
          text: r.text ?? '',
          category: r.categoryName,
          executor: r.executorName
            ? `${r.executorName} ${r.executorSurname}`
            : 'Yoxdur',
          date: new Date(r.createdAt + 'Z').toLocaleString('en-GB', {
            timeZone: 'Asia/Baku',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).replace(',', '').replaceAll('/', '.'),
          status: this.mapStatusName(r.statusName),
          file: r.fileId
        }));

        this.totalCount = res.totalCount;
        this.filters= this.filters.map((f: { status: string; label:string, count:number })=>{
          if(f.status === 'all'){
            return {...f, count:res.totalCount}
          }

          const backendStatus = Object.keys(res.statusCounts || {})
            .find(k => this.backendToFrontendStatusMap[k] === f.status);

          return {
            ...f,
            count: backendStatus
              ? res.statusCounts[backendStatus]
              : 0
          };
        })
        this.currentPage = this.page;
        this.totalPages = this.newTotalPages;
        this.updatePagination();
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  onItemsPerPageChange() {
    this.page = 1;
    this.fetchRequests();
  }

  updatePagination() {
    this.totalPages = this.newTotalPages;
    this.updateVisiblePages();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    this.currentPage = page;
    this.fetchRequests();
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

  mapStatusToId(status: string | null): number | undefined {
    const map: any = {
      'açıq': 1,
      'icrada': 2,
      'təsdiqləndi': 3,
      'imtina': 4,
      'gözləmədə': 5,
      'qapalı': 6
    };
    return status && map[status] ? map[status] : undefined;
  }

  mapStatusName(status: string): string {
    return status === 'New' ? 'açıq'
      : status === 'InProgress' ? 'icrada'
      : status === 'Completed' ? 'təsdiqləndi'
      : status === 'Denied' ? 'imtina'
      : status === 'Waiting' ? 'gözləmədə'
      : 'qapalı';
  }

  get newTotalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  constructor(private authService: AuthService, private requestService: RequestService) {}

  logout() {
    this.authService.logout();
  }

  STATUS_MAP = STATUS_MAP;
}