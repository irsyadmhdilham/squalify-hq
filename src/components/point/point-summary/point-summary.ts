import { Component } from '@angular/core';
import { ViewController, NavParams } from "ionic-angular";

import { Attribute } from "../../../pages/dashboard/points/point-detail/attribute";

@Component({
  selector: 'point-summary',
  templateUrl: 'point-summary.html'
})
export class PointSummaryComponent {

  point = this.navParams.get('point');
  productivePoint = this.point.productive_point;
  careerPoint = this.point.career_point;
  total = this.point.total;
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

  constructor(private viewCtrl: ViewController, private navParams: NavParams) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
