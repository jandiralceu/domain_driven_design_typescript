export type Validation = {
  fieldName: string;
  value: any;
  validations?: {
    isRequired?: boolean;
    minLength?: number;
    maxLength?: number;
  };
};
