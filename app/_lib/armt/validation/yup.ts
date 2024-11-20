import * as Yup from 'yup';
import nhsNumber from './nhsNumber';
import ukPostcode from './ukPostcode';

declare module "yup" {
  interface StringSchema {
    nhsNumber(message?: string): Yup.StringSchema
    ukPostcode(message?: string): Yup.StringSchema
  }
}

Yup.addMethod<Yup.StringSchema>(Yup.string, "nhsNumber", 
  function testNhsNumber(this, message: string) {
    return this.test('nhs-number-valid', message, (s) => s ? nhsNumber(s) : false)
})

Yup.addMethod<Yup.StringSchema>(Yup.string, "ukPostcode", 
  function testUkPostcode(this, message: string) {
    return this.test('uk-postcode-valid', message, (s) => s ? ukPostcode(s) : false)
  }
)

export default Yup;