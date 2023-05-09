import { Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { App } from 'src/app/models/app';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

    @Input() active = false;

    @Input() app!: App;

    @Output() onDelete = new Subject<App>();
    @Output() onClick = new Subject<App>();

}
