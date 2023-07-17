const generateGridColInfo = (columnType: string) => {
  switch (columnType) {
    case "_12":
      return ["_12"];

    case "_6_6":
      return ["_6_6", "_4_8", "_8_4", "_12_12"];

    case "_3_3_6":
      return ["_3_3_6", "_6_6_12", "_12_6_6", "_12_12_12"];

    case "_3_3_3_3":
      return [
        "_3_3_3_3",
        "_6_6_12_12",
        "_12_6_6_12",
        "_12_12_6_6",
        "_6_6_6_6",
        "_8_4_8_4",
        "_4_8_4_8",
        "_8_4_12_12",
        "_4_8_12_12",
        "_12_12_12_12",
      ];

    case "_4_4_4":
      return ["_4_4_4", "_6_6_12", "_12_6_6", "_12_12_12"];

    default:
      return ["_12"];
  }
};

export default generateGridColInfo;
