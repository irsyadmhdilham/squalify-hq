import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import * as moment from "moment";

import { point } from "../../../../interfaces/point";
import { Colors } from "../../../../functions/colors";
import { log } from "../../../../interfaces/point";

import { Attribute } from "./attribute";
import { PointSummaryComponent } from "../../../../components/point/point-summary/point-summary";

@IonicPage()
@Component({
  selector: 'page-point-detail',
  templateUrl: 'point-detail.html',
})
export class PointDetailPage {

  point: point = this.navParams.get('point');
  date = moment(this.point.date, 'YYYY-MM-DD');
  logs = this.point.logs
  productivePoints = [
    new Attribute(this.point, 'ftf.png', 'FTF/Nesting/Booth', 2),
    new Attribute(this.point, 'field-work.png', 'Joining field work', 1),
    new Attribute(this.point, 'referral.png', 'Referrals', 1),
    new Attribute(this.point, 'call.png', 'Calls/Email/Socmed', 1 ),
    new Attribute(this.point, 'appointment.png', 'Appointment secured', 2 ),
    new Attribute(this.point, 'sales-presentation.png', 'Sales presentation', 3 ),
    new Attribute(this.point, 'career-presentation.png', 'Career presentation', 3 ),
    new Attribute(this.point, 'case-closed.png', 'Case closed', 4 ),
    new Attribute(this.point, 'sign-contract.png', 'Sign up contract', 3)
  ];
  careerPoints = [
    new Attribute(this.point, 'suit.png', 'Millionnaire suit', 3 ),
    new Attribute(this.point, 'update.png', 'Update upline', 2 ),
    new Attribute(this.point, 'servicing.png', 'Servicing/Follow up', 1 ),
    new Attribute(this.point, 'coaching.png', 'Personal coaching', 1 ),
    new Attribute(this.point, 'early.png', 'Be early training', 3 ),
    new Attribute(this.point, 'agency-program.png', 'Agency program', 5)
  ];
  totalPoints = this.sumTotalPoints();
  totalProductivePoints = this.sumProductivePoints();
  totalCareerPoints = this.sumCareerPoints();

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController) { }

  pointColor(log: log) {
    if (log.type === 'add') {
      return { color: Colors.secondary };
    }
    return { color: Colors.danger };
  }

  showSummary() {
    const modal = this.modalCtrl.create(PointSummaryComponent, { point: this.point });
    modal.present();
  }

  sumTotalPoints() {
    return this.point.attributes.map(val => val.point).reduce((a, b) => a + b);
  }

  sumProductivePoints() {
    const productivePoints = this.productivePoints.map(val => val.attribute);
    const attributes = this.point.attributes.filter(val => {
      const getAttr = productivePoints.filter(attr => attr === val.attribute);
      if (getAttr.length > 0) {
        return true;
      }
      return false;
    });
    if (attributes.length > 0) {
      return attributes.map(val => val.point).reduce((a, b) => a + b);
    }
    return 0;
  }

  sumCareerPoints() {
    const careerPoints = this.careerPoints.map(val => val.attribute);
    const attributes = this.point.attributes.filter(val => {
      const getAttr = careerPoints.filter(attr => attr === val.attribute);
      if (getAttr.length > 0) {
        return true;
      }
      return false;
    });
    if (attributes.length > 0) {
      return attributes.map(val => val.point).reduce((a, b) => a + b);
    } 
    return 0;
  }

}
