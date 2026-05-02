import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ColourOption {
  name: string;
  hex: string;
}

@Component({
  selector: 'app-colour-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div>
      <p class="text-sm font-semibold text-dark mb-2">
        Colour: <span class="font-normal text-muted">{{ selectedColour ?? 'Select' }}</span>
      </p>
      <div class="flex flex-wrap gap-2">
        @for (colour of colours; track colour.name) {
          <button
            class="w-8 h-8 rounded-full border-2 transition"
            [class.border-navy]="selectedColour === colour.name"
            [class.border-transparent]="selectedColour !== colour.name"
            [style.background]="colour.hex"
            [attr.aria-label]="colour.name"
            [attr.aria-pressed]="selectedColour === colour.name"
            [title]="colour.name"
            (click)="colourChange.emit(colour.name)"
          ></button>
        }
      </div>
    </div>
  `,
})
export class ColourSelectorComponent {
  @Input({ required: true }) colours: ColourOption[] = [];
  @Input() selectedColour: string | null = null;
  @Output() colourChange = new EventEmitter<string>();
}
