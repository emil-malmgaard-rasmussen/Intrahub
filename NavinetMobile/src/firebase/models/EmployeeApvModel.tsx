export type Participant = {
  displayName: string;
  uid: string;
};

export type Question = {
  description: string;
  title: string;
  type: string; // You could make this more specific if there are only specific types
};

export type EmployeeApvModel = {
  id: string;
  apvType: 'employeeApv' | 'projectApv';
  createdBy: string;
  name: string;
  networkId: string;
  participants: Participant[];
  questions: Question[];
};
