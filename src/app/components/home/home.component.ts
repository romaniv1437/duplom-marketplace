import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {categories} from "../../mock/mock.data";


interface NavNode {
  name: string;
  url: string;
  children?: NavNode[];
}

const TREE_DATA: NavNode[] = [
  {
    name: 'Категорії',
    url: 'products/all',
    children: categories,
  },
  {
    name: 'Профіль',
    url: 'account'
  },
  {
    name: 'Cart',
    url: 'cart'
  },
];

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  url: string;
  level: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private _transformer = (node: NavNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      url: node.url,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

}
