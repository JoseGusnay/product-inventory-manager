import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../atoms/skeleton/skeleton';
import { UI_TEXTS } from '../../../../core/constants/ui-texts.constants';
import { TableColumn } from './table.interface';
import { TooltipDirective } from '../../../directives/tooltip.directive';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, TooltipDirective],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  data = input<any[]>([]);
  columns = input.required<TableColumn[]>();
  isLoading = input<boolean>(false);

  skeletonItems = computed(() => Array(5).fill(0));
  uiTexts = UI_TEXTS;
}
