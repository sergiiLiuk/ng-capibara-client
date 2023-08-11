import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private renderer: Renderer2) {}
  title = 'Capibara client';
  ngOnInit(): void {
    // Set the rem value for the <html> element
    this.renderer.setStyle(document.documentElement, 'font-size', '16px'); // You can adjust the value as needed
  }
}
