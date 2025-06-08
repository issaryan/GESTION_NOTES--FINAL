import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, AdminDashboardData } from '../../services/api/dashboard.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Navigation
  activeTab = 'statistics';
  public Math = Math;
  
  // Data
  adminDashboardData: AdminDashboardData | null = null;
  chartData: any = null;
  loading = true;
  error: string | null = null;

  // Tab configuration
  tabs = [
    { id: 'statistics', label: 'Statistiques Générales', icon: 'bi-graph-up' },
    { id: 'admins', label: 'Gestion Admins', icon: 'bi-people-fill' },
    { id: 'teachers', label: 'Gestion Enseignants', icon: 'bi-person-badge' },
    { id: 'students', label: 'Gestion Étudiants', icon: 'bi-mortarboard' },
    { id: 'classes', label: 'Gestion Classes', icon: 'bi-building' },
    { id: 'schedules', label: 'Emplois du Temps', icon: 'bi-calendar3' }
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getAdminDashboard()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.adminDashboardData = data;
          this.loadChartData();
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
        }
      });
  }

  private loadChartData(): void {
    this.dashboardService.getAdminChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.chartData = data;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des données graphiques:', error);
        }
      });
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  // Utility methods for statistics
  getGrowthTrend(current: number, previous: number): 'up' | 'down' | 'stable' {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  calculatePercentage(part: number, total: number): number {
    return total > 0 ? Math.round((part / total) * 100) : 0;
  }

  // Enhanced utility methods
  getCircleProgress(percentage: number): string {
    const circumference = 2 * Math.PI * 25; // radius = 25
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    return strokeDasharray;
  }

  // TrackBy functions for performance optimization
  trackByTabId(index: number, tab: any): string {
    return tab.id;
  }

  trackByClassName(index: number, classStats: any): string {
    return classStats.class_name;
  }

  trackByStudentId(index: number, student: any): string {
    return student.matricule || student.id || index.toString();
  }

  trackByTeacherId(index: number, teacher: any): string {
    return teacher.id || teacher.full_name || index.toString();
  }

  // Mock methods for future functionality
  handleAdminAction(action: string): void {
    console.log(`Action admin: ${action}`);
    // TODO: Implement admin management
  }

  handleTeacherAction(action: string): void {
    console.log(`Action enseignant: ${action}`);
    // TODO: Implement teacher management
  }

  handleStudentAction(action: string): void {
    console.log(`Action étudiant: ${action}`);
    // TODO: Implement student management
  }

  handleClassAction(action: string): void {
    console.log(`Action classe: ${action}`);
    // TODO: Implement class management
  }

  handleScheduleAction(action: string): void {
    console.log(`Action emploi du temps: ${action}`);
    // TODO: Implement schedule management
  }
}