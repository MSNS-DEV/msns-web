type ClassProps = {
  sessionId?: string;
  classId: string;
  grade: string;
  section: string;
  category: "Montessori" | "Primary" | "Middle" | "SSC_I" | "SSC_II";
  fee: number;
};

type StudentProps = {
  studentId: string;
  registrationNumber: string;
  studentMobile: string;
  fatherMobile: string;
  admissionNumber: string;
  studentName: string;
  gender: "MALE" | "FEMALE" | "CUSTOM";
  dateOfBirth: string;
  fatherName: string;
  studentCNIC: string;
  fatherCNIC: string;
  fatherProfession?: string;
  bloodGroup?: string | null;
  guardianName?: string | null;
  caste?: string;
  currentAddress: string;
  permanentAddress: string;
  medicalProblem?: string | null;
  profilePic?: string | null;
  isAssign: boolean;
  discount: number;
  discountByPercent: number;
};

type EmployeeProps = {
  employeeId: string;
  employeeName: string;
  fatherName: string;
  gender: "MALE" | "FEMALE" | "CUSTOM";
  dob: string;
  cnic: string;
  maritalStatus: "Married" | "Unmarried" | "Widow" | "Divorced";
  doj: string;
  designation: "Principal" | "Admin" | "Head" | "Clerk" | "Teacher" | "Worker";
  residentialAddress: string;
  mobileNo: string;
  additionalContact?: string | null;
  education: string;
  salaryAssignments?: SalaryAssignmentProps[];
  salaryIncrements?: SalaryIncrementProps[];
};

type SessionProps = {
  sessionId: string;
  sessionName: string;
  sessionFrom: string;
  sessionTo: string;
  isActive: boolean;
  salaryAssignments?: SalaryAssignmentProps[];
};

type FeeProps = {
  feeId?: string;
  level: string;
  admissionFee: number;
  tuitionFee: number;
  examFund: number;
  computerLabFund?: number | null;
  studentIdCardFee: number;
  infoAndCallsFee: number;
  type: "MonthlyFee" | "AnnualFee";
  createdAt?: Date;
  updatedAt?: Date;
};

type ClassStudentProps = {
  feeId: unknown;
  scId: string;
  classId: string;
  sessionId: string;
  student: StudentProps;
  class: ClassProps;
  session: SessionProps;
};

type ClassFeeProps = {
  scId: string;
  feeId: string;
  classId: string;
  sessionId: string;
  class: ClassProps;
  fee: FeeProps;
  session: SessionProps;
};

type FeeStudentClassProps = {
  sfcId: string;
  studentClassId: string;
  feeId: string;
  discount: number;
  discountByPercent: number;
  discountDescription: string;
  createdAt: Date;
  updatedAt: Date;
  feeStudentClass: ClassStudentProps;
  fee: FeeProps;
};

type SalaryAssignmentProps = {
  id: string;
  employeeId: string;
  employee: EmployeeProps;
  baseSalary: number;
  increment: number;
  totalSalary: number;
  assignedDate: Date;
  sessionId: string;
  session: SessionProps;
};

type SalaryIncrementProps = {
  id: string;
  employeeId: string;
  employee: EmployeeProps;
  incrementAmount: number;
  reason: string;
  effectiveDate: Date;
};
