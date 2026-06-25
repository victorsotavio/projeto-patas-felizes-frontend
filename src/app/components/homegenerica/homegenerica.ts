import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Sidebar } from "../sidebar/sidebar";

@Component({
  selector: 'app-homegenerica',
  imports: [Navbar, Sidebar],
  templateUrl: './homegenerica.html',
  styleUrl: './homegenerica.css',
})
export class Homegenerica {

}
