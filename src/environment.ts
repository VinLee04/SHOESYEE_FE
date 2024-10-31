/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  successCode: 1000,
  connectCoreUri: 'http://localhost:8080/shoesyee',
};

export const CUSTOMER_URL_HOME = `/home`;
export const STAFF_URL_HOME = `/management/users`;

export const API_URL_UPLOADS = `${environment.connectCoreUri}/uploads`;
export const API_URL_USERS = `${environment.connectCoreUri}/users`;
export const API_URL_PASSWORD = `${environment.connectCoreUri}/password`;
export const API_URL_ROLES = `${environment.connectCoreUri}/roles`;
export const API_URL_PERMISSIONS = `${environment.connectCoreUri}/permissions`;
export const API_URL_PRODUCTS = `${environment.connectCoreUri}/products`;
export const API_URL_PRODUCT_DETAILS = `${environment.connectCoreUri}/productDetails`;
export const API_URL_PRODUCT_REVIEWS = `${environment.connectCoreUri}/productReviews`;
export const API_URL_DISCOUNTS = `${environment.connectCoreUri}/discounts`;
export const API_URL_ORDERS = `${environment.connectCoreUri}/orders`;
export const API_URL_ORDER_DETAILS = `${environment.connectCoreUri}/orderDetails`;