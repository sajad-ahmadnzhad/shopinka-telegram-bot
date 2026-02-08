import z from 'zod';

const titleSchema = z
  .string()
  .trim()
  .max(50, 'عنوان نظر نمی تواند از 50 کارکتر بیشتر باشد.')
  .min(3, 'عنوان نظر نمی تواند از 3 کاراکتر کمتر باشد.');

const contentSchema = z
  .string()
  .trim()
  .max(200, 'نظر نمی تواند از 200 کاراکتر بیشتر باشد.')
  .min(5, 'نظر نمی تواند از 5 کاراکتر کمتر باشد.');

const rateSchema = z
  .number('امتیاز باید عدد باشد.')
  .int('امتیاز باید یک عدد مثبت باشد.')
  .min(1, 'امتیاز نمی تواند کمتر از 1 باشد.')
  .max(5, 'امتیاز نمی تواند بیشتر از 5 باشد.');

export const productCommentSchema = {
  title: titleSchema,
  content: contentSchema,
  rate: rateSchema,
};
