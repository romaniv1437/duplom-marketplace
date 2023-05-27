import { Component, Injectable, OnDestroy } from "@angular/core";
import { ReplaySubject } from "rxjs";

@Component({
  template: ``
})
@Injectable()

export abstract class ControlSubscribtionComponent implements OnDestroy {
  protected destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
