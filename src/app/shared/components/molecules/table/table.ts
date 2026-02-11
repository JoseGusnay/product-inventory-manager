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

  // We don't need actionExecuted here anymore if the parent handles actions via template
  // But we might want to keep it if we want a generic "row click" or similar.
  // For now, removing specific action output as it will be handled by the action column template.

  skeletonItems = computed(() => Array(5).fill(0));
  uiTexts = UI_TEXTS;
}
