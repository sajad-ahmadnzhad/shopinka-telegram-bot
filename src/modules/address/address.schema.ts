import { z } from 'zod';

const fullNameSchema = z
  .string('نام کامل باید رشته ای باشد.')
  .trim()
  .min(3, 'نام کامل نباید کمتر از 3 کاراکتر داشته باشد.')
  .max(25, 'نام کامل نباید از 25 کاراکتر بیشتر باشد.');

const provinceSchema = z.string('استان باید رشته باشد.').trim().min(2, 'استان نامعتبر است.');

const citySchema = z.string('شهر باید رشته باشد.').trim().min(2, 'شهر نامعتبر می باشد.');

const postalAddressSchema = z.string('آدرس پستی باید رشته باشد.').trim().min(5, 'آدرس پستی نمی تواند از 5 کاراکتر کمتر باشد.');

const buildingNumberSchema = z.number('شماره ساختمان باید عدد باشد.').min(1, 'شماره ساختمان نامعتبر است.');

const unitSchema = z.number('شماره واحد باید عدد باشدو.').min(1, 'شماره واحد نامعتبر می باشد.').optional();

const postalCodeSchema = z.string().regex(/^\d{10}$/, 'کد پستی نامعتبر می باشد.');

export const addressSchema = {
  fullName: fullNameSchema,
  province: provinceSchema,
  city: citySchema,
  postalAddress: postalAddressSchema,
  buildingNumber: buildingNumberSchema,
  unit: unitSchema,
  postalCode: postalCodeSchema,
};
