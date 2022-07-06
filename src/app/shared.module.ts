import { NgModule } from '@angular/core';
import { CurrencySymbolPipe } from './currency-symbol.pipe';
import { CurrencyFormatPipe } from './currency-format.pipe';


@NgModule({
  declarations: [
  CurrencySymbolPipe,
  CurrencyFormatPipe
  ],
  imports: [
  ],
  exports: [
  CurrencySymbolPipe,
  CurrencyFormatPipe
  ]
})
export class SharedModule {}
