import { Component } from '@angular/core';
import { NgModel } from "@angular/forms";
import {
  ViewController,
  AlertController,
  LoadingController,
  ActionSheetController,
  ModalController
} from "ionic-angular";

import { AgencyProvider } from "../../../providers/agency/agency";
import { SalesProvider } from "../../../providers/sales/sales";
import { PostTipsComponent } from "../../post-tips/post-tips";

import { sales } from "../../../models/sales";

@Component({
  selector: 'add-sales',
  templateUrl: 'add-sales.html'
})
export class AddSalesComponent {

  screenStatus: string;
  company: string;
  repeatSales = false;
  newSales = false;
  surchargeVal: string
  tips: string;

  constructor(
    private viewCtrl: ViewController,
    private agencyProvider: AgencyProvider,
    private salesProvider: SalesProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  salesTypes() {
    if (this.company === 'CWA') {
      return ['EPF', 'Cash', 'ASB', 'PRS', 'Wasiat', 'Takaful'];
    } else if (this.company === 'Public Mutual') {
      return ['EPF', 'Cash'];
    }
  }

  surcharges() {
    if (this.company === 'CWA') {
      return [5, 6.5];
    }
    return false;
  }

  getCompany() {
    this.screenStatus = 'loading';
    this.agencyProvider.getAgencyDetail('company').subscribe(observe => {
      this.screenStatus = undefined;
      this.company = observe.company;
    }, () => {
      this.screenStatus = undefined;
      const alert = this.alertCtrl.create({
        title: 'Error has occured',
        subTitle: 'Failed to receive data',
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  addTips() {
    const selectTips = (mode: string) => {
      const modal = this.modalCtrl.create(PostTipsComponent, { mode });
      modal.present();
      modal.onDidDismiss(data => {
        if (data) {
          this.tips = data.tips;
        }
      });
    };
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select option',
      buttons: [
        { text: 'Select from template', handler: () => selectTips('template') },
        { text: 'Write tips', handler: () => selectTips('write') },
        { text: 'Cancel', role: 'cancel' }
      ]
    });
    actionSheet.present();
  }

  removeTips() {
    this.tips = undefined;
  }

  ionViewDidLoad() {
    this.getCompany();
  }

  async addSales(amountNgModel: NgModel, salesTypeNgModel: NgModel, locationNgModel: NgModel) {
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    try {
      if (!amountNgModel.valid) {
        throw 'Please insert sales amount';
      }
      if (!salesTypeNgModel.valid) {
        throw 'Please select sales type';
      }
      type data = sales & { tips?: string };
      let data: data  = {
        amount: parseFloat(amountNgModel.value),
        sales_type: salesTypeNgModel.value
      };
      if (this.company === 'CWA' && salesTypeNgModel.value === 'EPF' || salesTypeNgModel.value === 'Cash') {
        if (!this.surchargeVal || this.surchargeVal === '') {
          throw 'Please select surcharge';
        }
        data.surcharge = parseInt(this.surchargeVal);
      }
      if (locationNgModel.value !== '') {
        data.location = locationNgModel.value;
      }
      if (this.repeatSales) {
        data.repeat_sales = true;
      }
      if (this.tips) {
        data.tips = this.tips;
      }
      loading.present();
      this.salesProvider.createSales(data).subscribe(observe => {
        loading.dismiss();
        this.salesProvider.addSalesEmit(observe.amount);
        this.viewCtrl.dismiss({
          sales: observe
        });
      }, () => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error has occured',
          subTitle: 'Failed to add sales, please try again later',
          buttons: ['Ok']
        });
        alert.present();
      });
    } catch (err) {
      const alert = this.alertCtrl.create({
        title: 'Required field empty',
        subTitle: err,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

}
