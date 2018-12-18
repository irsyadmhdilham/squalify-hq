import { Component } from '@angular/core';
import { ViewController, NavParams } from "ionic-angular";

import { PointProvider } from "../../../providers/point/point";
import { Colors } from "../../../functions/colors";
import { log } from "../../../interfaces/point";

@Component({
  selector: 'point-logs',
  templateUrl: 'point-logs.html'
})
export class PointLogsComponent {

  screenStatus: string;
  logs = [];

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private pointProvider: PointProvider
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  fetch() {
    this.screenStatus = 'loading';
    const pk = this.navParams.get('pk');
    this.pointProvider.getPointLogs(pk).subscribe(observe => {
      this.screenStatus = undefined;
      this.logs = observe.point_logs.map(val => {
        return {
          ...val,
          time: new Date(val.time)
        };
      });
    });
  }

  ionViewDidLoad() {
    this.fetch();
  }

  pointColor(log: log) {
    if (log.type === 'add') {
      return { color: Colors.secondary };
    }
    return { color: Colors.danger };
  }

}
