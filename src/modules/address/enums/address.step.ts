export enum CreateAddressStep {
  FullName = 'enter_full_name',
  Province = 'enter_province',
  City = 'enter_city',
  BuildingNumber = 'enter_building_number',
  PostalCode = 'enter_postal_code',
  PostalAddress = 'enter_postal_address',
  Unit = 'enter_unit',
  SetDefault = 'enter_set_default',
}

export enum RemoveAddressStep {
  Remove = 'remove_address',
}

export enum UpdateAddressStep {
  Update = 'update_address',
}

export enum GetAddressListStep {
  CreateNewAddress = 'create_new_address',
}
