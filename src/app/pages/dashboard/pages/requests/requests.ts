import { CommonModule,  } from '@angular/common';
import { Component, HostListener, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Button } from '../../../../components/button/button';
import { Auth } from '../../../../services/auth';

interface Row {
  id: number;
  sender: string;
  header: string;
  text: string;
  category: string;
  executor: string;
  date: string;
  status: string;
}



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

  searchText = '';
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

  data: Row[] = [
  { id: 12746, 
    sender: 'Oqtay.İbrahimov', 
    header: 'test',
    text:"From: Nigar.T Kerimova Sent:Tuesday 24.07.2025 14:16",
    category: 'IRD Test proqramı', 
    executor:"Nariman.Ehmedov", 
    date: (new Date("2025-07-24T14:16")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }).replace(",","").replaceAll("/","."), 
    status: 'qapalı' 
  },
  { id: 32349, 
    sender: 'Elshan.Sharifov', 
    header: 'master.socar.az',
    text:"From: Elshan Sharifov Sent: Wednesday 02.11.2024 10:41",
    category: 'Sayğaclar Plomblar', 
    executor:"Kenan.Mikayilov", 
    date: (new Date("2024-11-02 10:41")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }).replace(",","").replaceAll("/","."), 
    status: 'açıq' 
  },
  { id: 20443, 
    sender: 'Vugar.Samadov', 
    header: 'Ödənişin silinməsi',
    text:"Salam. Oktyabr ayında ünvansızlar cədvəlinə düşənskdeüdküdieüfjüfeo3dfijhwihfhefeicerycbeyrgweuifwefygewy",
    category: 'Agis - Proqram təminatı', executor:"Nasimi.Behbudov", 
    date:(new Date("2024-11-02 10:36")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }).replace(",","").replaceAll("/","."), 
    status: 'icrada' 
  },
  { id: 56882, 
    sender: 'Vugar.Samadov', 
    header: 'Ödənişin silinməsi',
    text:"Salam. Oktyabr ayında ünvansızlar cədvəlinə düşənskdeüdküdieüfjüfeo3",
    category: 'Agis - Proqram təminatı', executor:"Nasimi.Behbudov", 
    date:(new Date("2024-11-02 10:36")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }).replace(",","").replaceAll("/","."), 
    status: 'təsdiqləndi' 
  },
  { id: 34223, 
    sender: 'Vugar.Samadov',
    header: 'Ödənişin silinməsi',
    text:"Salam. Oktyabr ayında ünvansızlar cədvəlinə düşənskdeüdküdieüfjüfeo3",
    category: 'Agis - Proqram təminatı', executor:"Nasimi.Behbudov", 
    date:(new Date("2024-11-02 10:36")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }).replace(",","").replaceAll("/","."), 
    status: 'imtina' 
  },
  { id: 12676, 
    sender: 'Oqtay.İbrahimov', 
    header: 'test',
    text:"From: Nigar.T Kerimova Sent:Tuesday 24.07.2025 14:16",
    category: 'IRD Test proqramı', 
    executor:"Nariman.Ehmedov", 
    date: (new Date("2025-07-24T14:16")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }).replace(",","").replaceAll("/","."), 
    status: 'qapalı' 
  },
  { id: 32459, 
    sender: 'Elshan.Sharifov', 
    header: 'master.socar.az',
    text:"From: Elshan Sharifov Sent: Wednesday 02.11.2024 10:41",
    category: 'Sayğaclar Plomblar', 
    executor:"Kenan.Mikayilov", 
    date: (new Date("2024-11-02 10:41")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }).replace(",","").replaceAll("/","."), 
    status: 'açıq' 
  },
  { id: 20893, 
    sender: 'Vugar.Samadov', 
    header: 'Ödənişin silinməsi',
    text:"Salam. Oktyabr ayında ünvansızlar cədvəlinə düşənskdeüdküdieüfjüfeo3",
    category: 'Agis - Proqram təminatı', executor:"Nasimi.Behbudov", 
    date:(new Date("2024-11-02 10:36")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }).replace(",","").replaceAll("/","."), 
    status: 'icrada' 
  },
  { id: 53882, 
    sender: 'Vugar.Samadov', 
    header: 'Ödənişin silinməsi',
    text:"Salam. Oktyabr ayında ünvansızlar cədvəlinə düşənskdeüdküdieüfjüfeo3",
    category: 'Agis - Proqram təminatı', executor:"Nasimi.Behbudov", 
    date:(new Date("2024-11-02 10:36")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }).replace(",","").replaceAll("/","."), 
    status: 'təsdiqləndi' 
  },
  { id: 32623, 
    sender: 'Vugar.Samadov', 
    header: 'Ödənişin silinməsi',
    text:"Salam. Oktyabr ayında ünvansızlar cədvəlinə düşənskdeüdküdieüfjüfeo3",
    category: 'Agis - Proqram təminatı', executor:"Nasimi.Behbudov", 
    date:(new Date("2024-11-02 10:36")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }).replace(",","").replaceAll("/","."), 
    status: 'gözləmədə' 
  },
  { id: 19846, 
    sender: 'Oqtay.İbrahimov', 
    header: 'test',
    text:"From: Nigar.T Kerimova Sent:Tuesday 24.07.2025 14:16",
    category: 'IRD Test proqramı', 
    executor:"Nariman.Ehmedov", 
    date: (new Date("2025-07-24T14:16")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }).replace(",","").replaceAll("/","."), 
    status: 'qapalı' 
  },
  { id: 33649, 
    sender: 'Elshan.Sharifov', 
    header: 'master.socar.az',
    text:"From: Elshan Sharifov Sent: Wednesday 02.11.2024 10:41",
    category: 'Sayğaclar Plomblar', 
    executor:"Kenan.Mikayilov", 
    date: (new Date("2024-11-02 10:41")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }).replace(",","").replaceAll("/","."), 
    status: 'açıq' 
  },
  { id: 28443, 
    sender: 'Vugar.Samadov', 
    header: 'Ödənişin silinməsi',
    text:"Salam. Oktyabr ayında ünvansızlar cədvəlinə düşənskdeüdküdieüfjüfeo3",
    category: 'Agis - Proqram təminatı', executor:"Nasimi.Behbudov", 
    date:(new Date("2024-11-02 10:36")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }).replace(",","").replaceAll("/","."), 
    status: 'icrada' 
  },
  { id: 52882, 
    sender: 'Vugar.Samadov', 
    header: 'Ödənişin silinməsi',
    text:"Salam. Oktyabr ayında ünvansızlar cədvəlinə düşənskdeüdküdieüfjüfeo3",
    category: 'Agis - Proqram təminatı', executor:"Nasimi.Behbudov", 
    date:(new Date("2024-11-02 10:36")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }).replace(",","").replaceAll("/","."), 
    status: 'təsdiqləndi' 
  },
  { id: 30223, 
    sender: 'Vugar.Samadov', 
    header: 'Ödənişin silinməsi',
    text:"Salam. Oktyabr ayında ünvansızlar cədvəlinə düşənskdeüdküdieüfjüfeo3",
    category: 'Agis - Proqram təminatı', executor:"Nasimi.Behbudov", 
    date:(new Date("2024-11-02 10:36")).toLocaleDateString("en-GB",{
    day:"2-digit",
    month:"2-digit",
    year:"numeric",
    hour:"2-digit",
    minute:"2-digit",
    hour12:false,
  }
  ).replace(",","").replaceAll("/","."), 
  status: 'imtina' 
  },
  { id: 12846, 
    sender: 'Oqtay.İbrahimov', 
    header: 'test',
    text:"From: Nigar.T Kerimova Sent:Tuesday 24.07.2025 14:16",
    category: 'IRD Test proqramı', 
    executor:"Nariman.Ehmedov", 
    date: (new Date("2025-07-24T14:16")).toLocaleDateString("en-GB",{
    day:"2-digit",
    month:"2-digit",
    year:"numeric",
    hour:"2-digit",
    minute:"2-digit",
    hour12:false,
  }
  ).replace(",","").replaceAll("/","."), 
    status: 'qapalı' 
  },
  { id: 32229, 
    sender: 'Elshan.Sharifov', 
    header: 'master.socar.az',
    text:"From: Elshan Sharifov Sent: Wednesday 02.11.2024 10:41",
    category: 'Sayğaclar Plomblar', 
    executor:"Kenan.Mikayilov", 
    date: (new Date("2024-11-02 10:41")).toLocaleDateString("en-GB",{
    day:"2-digit",
    month:"2-digit",
    year:"numeric",
    hour:"2-digit",
    minute:"2-digit",
    hour12:false,
    }).replace(",","").replaceAll("/","."), 
    status: 'açıq' 
  },
  { id: 20663, 
    sender: 'Vugar.Samadov', 
    header: 'Ödənişin silinməsi',
    text:"Salam. Oktyabr ayında ünvansızlar cədvəlinə düşənskdeüdküdieüfjüfeo3",
    category: 'Agis - Proqram təminatı', executor:"Nasimi.Behbudov", 
    date:(new Date("2024-11-02 10:36")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }
  ).replace(",","").replaceAll("/","."), 
    status: 'icrada' 
  },
  { id: 56992, 
    sender: 'Vugar.Samadov', 
    header: 'Ödənişin silinməsi',
    text:"Salam. Oktyabr ayında ünvansızlar cədvəlinə düşənskdeüdküdieüfjüfeo3",
    category: 'Agis - Proqram təminatı', executor:"Nasimi.Behbudov", 
    date:(new Date("2024-11-02 10:36")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }
  ).replace(",","").replaceAll("/","."), 
    status: 'təsdiqləndi' 
  },
  { id: 32523, 
    sender: 'Vugar.Samadov', 
    header: 'Ödənişin silinməsi',
    text:"Salam. Oktyabr ayında ünvansızlar cədvəlinə düşənskdeüdküdieüfjüfeo3",
    category: 'Agis - Proqram təminatı', executor:"Nasimi.Behbudov", 
    date:(new Date("2024-11-02 10:36")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }
  ).replace(",","").replaceAll("/","."), 
  status: 'imtina' 
  },
  { id: 19646, 
    sender: 'Oqtay.İbrahimov', 
    header: 'test',
    text:"From: Nigar.T Kerimova Sent:Tuesday 24.07.2025 14:16",
    category: 'IRD Test proqramı', 
    executor:"Nariman.Ehmedov", 
    date: (new Date("2025-07-24T14:16")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }
  ).replace(",","").replaceAll("/","."), 
    status: 'qapalı' 
  },
  { id: 30449, 
    sender: 'Elshan.Sharifov', 
    header: 'master.socar.az',
    text:"From: Elshan Sharifov Sent: Wednesday 02.11.2024 10:41",
    category: 'Sayğaclar Plomblar', 
    executor:"Kenan.Mikayilov", 
    date: (new Date("2024-11-02 10:41")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }
  ).replace(",","").replaceAll("/","."), 
    status: 'açıq' 
  },
  { id: 26743, 
    sender: 'Vugar.Samadov', 
    header: 'Ödənişin silinməsi',
    text:"Salam. Oktyabr ayında ünvansızlar cədvəlinə düşənskdeüdküdieüfjüfeo3",
    category: 'Agis - Proqram təminatı', executor:"Nasimi.Behbudov", 
    date:(new Date("2024-11-02 10:36")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }
  ).replace(",","").replaceAll("/","."), 
  status: 'icrada' 
  },
  { id: 52232, 
    sender: 'Vugar.Samadov',
    header: 'Ödənişin silinməsi',
    text:"Salam. Oktyabr ayında ünvansızlar cədvəlinə düşənskdeüdküdieüfjüfeo3",
    category: 'Agis - Proqram təminatı', executor:"Nasimi.Behbudov", 
    date:(new Date("2024-11-02 10:36")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }
  ).replace(",","").replaceAll("/","."), 
    status: 'təsdiqləndi' 
  },
  { id: 39873, 
    sender: 'Vugar.Samadov', 
    header: 'Ödənişin silinməsi',
    text:"Salam. Oktyabr ayında ünvansızlar cədvəlinə düşənskdeüdküdieüfjüfeo3",
    category: 'Agis - Proqram təminatı', executor:"Nasimi.Behbudov", 
    date:(new Date("2024-11-02 10:36")).toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }
  ).replace(",","").replaceAll("/","."), 
    status: 'imtina' 
  },
];
  
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
    this.isAsc=!this.isAsc;

  this.data.sort((a, b) => {
    if (a[key] < b[key]) return this.isAsc ? -1 : 1;
    if (a[key] > b[key]) return this.isAsc ? 1 : -1;
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

  // filteredData() {
  //   let filtered = this.data;

  //   if (this.activeFilter !== 'all') {
  //     filtered = filtered.filter(row => row.status === this.activeFilter);
  //   }

  //   // Apply search filter if needed
  //   if (this.searchText) {
  //     const text = this.searchText.toLowerCase();
  //     filtered = filtered.filter(row =>
  //       this.columns.some(col => String(row[col.key]).toLowerCase().includes(text))
  //     );
  //   }

  //   return filtered;
  // }

 

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
  this.updateFilterCounts();
  this.totalPages = Math.ceil(this.data.length / this.selectedStatus);
  this.updateVisiblePages();
  this.userName = this.authService.getUserFullName();
}


  onItemsPerPageChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const filteredLength = this.data.filter(r => 
      this.activeFilter === 'all' || r.status === this.activeFilter
    ).length;

    this.totalPages = Math.ceil(filteredLength / this.selectedStatus);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateVisiblePages();
  }


  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  updateVisiblePages() {
    this.endPage = Math.min(this.startPage + this.maxVisible - 1, this.totalPages);
    this.visiblePages = Array.from({ length: this.endPage - this.startPage + 1 }, (_, i) => this.startPage + i);
  }

  getTableData() {
    
    let filtered = this.data;

    
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(row => row.status === this.activeFilter);
    }

    
    if (this.searchText) {
      const text = this.searchText.toLowerCase();
      filtered = filtered.filter(row =>
        this.columns.some(col => String(row[col.key]).toLowerCase().includes(text))
      );
    }

    
    this.totalPages = Math.ceil(filtered.length / this.selectedStatus);

    
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;

   
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


  constructor(private authService: Auth) {}

  

  logout() {
    this.authService.logout();
  }
 
  

}

