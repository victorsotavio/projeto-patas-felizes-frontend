import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Sidebar } from "../sidebar/sidebar";
import { Crudgenerico } from '../crudgenerico/crudgenerico';

@Component({
  selector: 'app-homegenerica',
  imports: [Navbar, Sidebar,Crudgenerico],
  templateUrl: './homegenerica.html',
  styleUrl: './homegenerica.css',
})
export class Homegenerica {

}
