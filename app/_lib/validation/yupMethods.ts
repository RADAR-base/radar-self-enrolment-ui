import * as Yup from 'yup';
import nhsNumber from './nhsNumber';

declare module "yup" {
  interface StringSchema {
    nhsNumber(): Yup.StringSchema
  }
}

Yup.addMethod<Yup.StringSchema>(Yup.string, "nhsNumber", 
  function testNhsNumber(this, message: string) {
    return this.test('nhs-number-valid', message, (s) => s ? nhsNumber(s) : false)
})

export default Yup;