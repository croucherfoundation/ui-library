export interface generatedLayoutInfoReturnType {
  columnsCount: number;
  id: string;
}

const generatedLayoutInfo = (columnType: string) => {
  switch (columnType) {
    case "_12":
      return 1;

    case "_6_6":
      return 2;

    case "_3_3_6":
      return 3;

    case "_3_3_3_3":
      return 4;

    case "_4_4_4":
      return 3;

    default:
      return 1;
  }
};

export default generatedLayoutInfo;
