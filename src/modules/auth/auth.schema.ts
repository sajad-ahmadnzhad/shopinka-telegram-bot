import z from 'zod';

export const otpCodeSchema = z.number('کد وارد شده باید عدد باشد.');

export const otpCodeLengthSchema = z.string().length(6, { error: 'کد وارد شده باید 6 رقمی باشد.' });

export const phoneSchema = z.string().regex(/^09\d{9}$/, 'شماره موبایل وارد شده معتبر نمی باشد.');

export const fullNameSchema = z
  .string()
  .max(25, 'نام شما نمی تواند از 25 کاراکتر بیشتر باشد.')
  .min(2, 'نام شما نمی تواند از 2 کاراکتر کمتر باشد.');
