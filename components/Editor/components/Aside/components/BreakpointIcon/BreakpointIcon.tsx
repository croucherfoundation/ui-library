interface BreakpointIconProps {
  layout: string;
}

function BreakpointIcon({ layout }: BreakpointIconProps) {
  switch (layout) {
    case "_4_8":
      return <FourEight />;
    case "_4_8_4_8":
      return <FourEightFourEight />;
    case "_4_8_12_12":
      return <FourEightTwelveTwelve />;
    case "_8_4":
      return <EightFour />;
    case "_8_4_8_4":
      return <EightFourEightFour />;
    case "_8_4_12_12":
      return <EightFourTwelveTwelve />;
    case "_12_12":
      return <TwelveTwelve />;
    case "_12_12_12_12":
      return <TwelveTwelveTwelveTwelve />;
    case "_6_6":
      return <SixSix />;
    case "_6_6_6_6":
      return <SixSixSixSix />;
    case "_6_6_12":
      return <SixSixTwelve />;
    case "_6_6_12_12":
      return <SixSixTwelveTwelve />;
    case "_12_6_6":
      return <TwelveSixSix />;
    case "_12_6_6_12":
      return <TwelveSixSixTwelve />;
    case "_12_12_12":
      return <TwelveTwelveTwelve />;
    case "_12_12_6_6":
      return <TwelveTwelveSixSix />;
    case "_4_4_4":
      return <FourFourFour />;
    case "_3_3_6":
      return <ThreeThreeSix />;
    case "_3_3_3_3":
      return <ThreeThreeThreeThree />;

    default:
      return <TwelveTwelve />;
  }
}

const FourFourFour = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <rect
      width={7.13}
      height={14.57}
      x={0.25}
      y={0.6}
      fill="#384152"
      data-name="4_4_4"
      rx={2.32}
      ry={2.32}
    />
    <rect
      width={7.13}
      height={14.57}
      x={8.43}
      y={0.6}
      fill="#384152"
      data-name="4_4_4"
      rx={2.32}
      ry={2.32}
    />
    <rect
      width={7.13}
      height={14.57}
      x={16.62}
      y={0.6}
      fill="#384152"
      data-name="4_4_4"
      rx={2.32}
      ry={2.32}
    />
  </svg>
);

const SixSix = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <g fill="#384152" data-name="6_6">
      <rect
        width={10.15}
        height={13.85}
        x={1.14}
        y={0.96}
        rx={2.06}
        ry={2.06}
      />
      <rect
        width={10.15}
        height={13.85}
        x={12.7}
        y={0.96}
        rx={2.06}
        ry={2.06}
      />
    </g>
  </svg>
);

const ThreeThreeThreeThree = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <g data-name="3_3_3_3">
      <rect
        width={5.06}
        height={14.57}
        x={0.33}
        y={0.6}
        fill="#384152"
        data-name="4_4_4"
        rx={1.05}
        ry={1.05}
      />
      <rect
        width={5.06}
        height={14.57}
        x={6.44}
        y={0.6}
        fill="#384152"
        data-name="4_4_4"
        rx={1.05}
        ry={1.05}
      />
      <g data-name="3_3_3_3">
        <rect
          width={5.06}
          height={14.57}
          x={12.5}
          y={0.6}
          fill="#384152"
          data-name="4_4_4"
          rx={1.05}
          ry={1.05}
        />
        <rect
          width={5.06}
          height={14.57}
          x={18.61}
          y={0.6}
          fill="#384152"
          data-name="4_4_4"
          rx={1.05}
          ry={1.05}
        />
      </g>
    </g>
  </svg>
);

const TwelveSixSix = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <g fill="#384152" data-name="6_6_12">
      <rect width={10.15} height={5.37} x={1.14} y={9.03} rx={1.81} ry={1.81} />
      <rect width={21.71} height={6.49} x={1.14} y={1.36} rx={2.06} ry={2.06} />
      <rect width={10.15} height={5.37} x={12.7} y={9.03} rx={1.81} ry={1.81} />
    </g>
  </svg>
);

const SixSixSixSix = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <g data-name="12_12_6_6">
      <rect
        width={11.17}
        height={6.37}
        x={0.33}
        y={1.05}
        fill="#384152"
        data-name="4_4_4"
        rx={1.68}
        ry={1.68}
      />
      <rect
        width={11.17}
        height={6.37}
        x={12.5}
        y={1.05}
        fill="#384152"
        data-name="4_4_4"
        rx={1.68}
        ry={1.68}
      />
      <rect
        width={11.17}
        height={6.37}
        x={0.33}
        y={8.34}
        fill="#384152"
        data-name="4_4_4"
        rx={1.68}
        ry={1.68}
      />
      <rect
        width={11.17}
        height={6.37}
        x={12.5}
        y={8.34}
        fill="#384152"
        data-name="4_4_4"
        rx={1.68}
        ry={1.68}
      />
    </g>
  </svg>
);

const TwelveTwelveSixSix = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <g data-name="12_12_6_6">
      <rect
        width={11.17}
        height={5.32}
        x={0.33}
        y={10.44}
        fill="#384152"
        data-name="4_4_4"
        rx={1.4}
        ry={1.4}
      />
      <rect
        width={11.17}
        height={5.32}
        x={12.5}
        y={10.44}
        fill="#384152"
        data-name="4_4_4"
        rx={1.4}
        ry={1.4}
      />
      <rect
        width={23.34}
        height={3.67}
        x={0.33}
        fill="#384152"
        data-name="4_4_4"
        rx={1.29}
        ry={1.29}
      />
      <rect
        width={23.34}
        height={3.97}
        x={0.33}
        y={5.28}
        fill="#384152"
        data-name="4_4_4"
        rx={1.29}
        ry={1.29}
      />
    </g>
  </svg>
);

const TwelveSixSixTwelve = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <g data-name="12_6_6_12">
      <rect
        width={11.17}
        height={5.32}
        x={0.33}
        y={5.22}
        fill="#384152"
        data-name="4_4_4"
        rx={1.4}
        ry={1.4}
      />
      <rect
        width={11.17}
        height={5.32}
        x={12.5}
        y={5.22}
        fill="#384152"
        data-name="4_4_4"
        rx={1.4}
        ry={1.4}
      />
      <rect
        width={23.34}
        height={3.67}
        x={0.33}
        fill="#384152"
        data-name="4_4_4"
        rx={1.29}
        ry={1.29}
      />
      <rect
        width={23.34}
        height={3.67}
        x={0.33}
        y={12.09}
        fill="#384152"
        data-name="4_4_4"
        rx={1.29}
        ry={1.29}
      />
    </g>
  </svg>
);

const SixSixTwelveTwelve = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <g data-name="6_6_12_12">
      <rect
        width={11.17}
        height={6.05}
        x={0.33}
        fill="#384152"
        data-name="4_4_4"
        rx={1.05}
        ry={1.05}
      />
      <rect
        width={11.17}
        height={6.05}
        x={12.5}
        fill="#384152"
        data-name="4_4_4"
        rx={1.05}
        ry={1.05}
      />
      <rect
        width={23.34}
        height={3.67}
        x={0.33}
        y={7.17}
        fill="#384152"
        data-name="4_4_4"
        rx={1.29}
        ry={1.29}
      />
      <rect
        width={23.34}
        height={3.67}
        x={0.33}
        y={12.09}
        fill="#384152"
        data-name="4_4_4"
        rx={1.29}
        ry={1.29}
      />
    </g>
  </svg>
);

const TwelveTwelveTwelve = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <rect
      width={21.71}
      height={4.62}
      x={1.14}
      y={0.42}
      fill="#384152"
      rx={1.7}
      ry={1.7}
    />
    <rect
      width={21.71}
      height={4.62}
      x={1.14}
      y={5.57}
      fill="#384152"
      rx={1.7}
      ry={1.7}
    />
    <rect
      width={21.71}
      height={4.62}
      x={1.14}
      y={10.72}
      fill="#384152"
      rx={1.7}
      ry={1.7}
    />
  </svg>
);

const SixSixTwelve = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <rect
      width={10.15}
      height={5.37}
      x={1.14}
      y={1.18}
      fill="#384152"
      rx={1.81}
      ry={1.81}
    />
    <rect
      width={21.71}
      height={6.49}
      x={1.14}
      y={8.09}
      fill="#384152"
      rx={2.06}
      ry={2.06}
    />
    <rect
      width={10.15}
      height={5.37}
      x={12.7}
      y={1.18}
      fill="#384152"
      rx={1.81}
      ry={1.81}
    />
  </svg>
);

const FourEight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <g fill="#384152" data-name="4_8">
      <rect width={7.13} height={14.57} x={0.25} y={0.6} rx={2.32} ry={2.32} />
      <rect width={14.21} height={14.57} x={9.53} y={0.6} rx={2.32} ry={2.32} />
    </g>
  </svg>
);

const TwelveTwelve = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <g fill="#384152" data-name="12_12">
      <rect width={22.2} height={6.44} x={0.9} y={0.96} rx={2.06} ry={2.06} />
      <rect width={22.2} height={6.44} x={0.9} y={8.36} rx={2.06} ry={2.06} />
    </g>
  </svg>
);

const TwelveTwelveTwelveTwelve = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <g fill="#384152" data-name="12_12_12_12">
      <rect width={20.52} height={3} x={1.74} y={8.3} rx={1.5} ry={1.5} />
      <rect width={20.52} height={3} x={1.74} y={12.38} rx={1.5} ry={1.5} />
      <rect width={20.52} height={3} x={1.74} y={0.38} rx={1.5} ry={1.5} />
      <rect width={20.52} height={3} x={1.74} y={4.46} rx={1.5} ry={1.5} />
    </g>
  </svg>
);

const FourEightTwelveTwelve = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
   <g fill="#384152" data-name="8_4_12_12">
      <rect width={7.13} height={5.11} x={0.25} y={0.06} rx={1.88} ry={1.88} />
      <rect width={14.21} height={5.11} x={9.53} y={0.06} rx={1.88} ry={1.88} />
      <rect width={23.5} height={3.76} x={0.25} y={6.84} rx={1.88} ry={1.88} />
      <rect width={23.5} height={3.76} x={0.25} y={11.95} rx={1.88} ry={1.88} />
    </g>
  </svg>
);

const EightFourTwelveTwelve = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <g fill="#384152" data-name="8_4_12_12">
      <rect
        width={7.13}
        height={5.11}
        x={16.62}
        y={0.12}
        rx={1.88}
        ry={1.88}
        transform="rotate(180 20.18 2.675)"
      />
      <rect
        width={14.21}
        height={5.11}
        x={0.25}
        y={0.12}
        rx={1.88}
        ry={1.88}
        transform="rotate(180 7.36 2.675)"
      />
      <rect
        width={23.5}
        height={3.76}
        x={0.25}
        y={6.9}
        rx={1.88}
        ry={1.88}
        transform="rotate(180 12 8.775)"
      />
      <rect
        width={23.5}
        height={3.76}
        x={0.25}
        y={12}
        rx={1.88}
        ry={1.88}
        transform="rotate(-180 12 13.885)"
      />
    </g>
  </svg>
);

const FourEightFourEight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
     <g fill="#384152" data-name="4_8_4_8">
      <rect width={7.13} height={6.21} x={0.25} y={0.77} rx={1.88} ry={1.88} />
      <rect width={14.21} height={6.21} x={9.53} y={0.77} rx={1.88} ry={1.88} />
      <rect width={7.13} height={6.21} x={0.25} y={8.78} rx={1.88} ry={1.88} />
      <rect width={14.21} height={6.21} x={9.53} y={8.78} rx={1.88} ry={1.88} />
    </g>
  </svg>
);

const EightFourEightFour = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
   <g fill="#384152" data-name="8_4_8_4">
      <rect
        width={7.13}
        height={6.21}
        x={16.62}
        y={0.77}
        rx={1.88}
        ry={1.88}
        transform="rotate(180 20.18 3.875)"
      />
      <rect
        width={14.21}
        height={6.21}
        x={0.25}
        y={0.77}
        rx={1.88}
        ry={1.88}
        transform="rotate(180 7.36 3.875)"
      />
      <rect
        width={7.13}
        height={6.21}
        x={16.62}
        y={8.78}
        rx={1.88}
        ry={1.88}
        transform="rotate(180 20.18 11.885)"
      />
      <rect
        width={14.21}
        height={6.21}
        x={0.25}
        y={8.78}
        rx={1.88}
        ry={1.88}
        transform="rotate(180 7.36 11.885)"
      />
    </g>
  </svg>
);

const ThreeThreeSix = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <g data-name="3_3_6">
      <rect
        width={11.43}
        height={14.57}
        x={12.57}
        y={0.6}
        fill="#384152"
        data-name="4_4_4"
        rx={1.52}
        ry={1.52}
      />
      <rect
        width={5.06}
        height={14.57}
        x={0.21}
        y={0.6}
        fill="#384152"
        data-name="4_4_4"
        rx={1.05}
        ry={1.05}
      />
      <rect
        width={5.06}
        height={14.57}
        x={6.32}
        y={0.6}
        fill="#384152"
        data-name="4_4_4"
        rx={1.05}
        ry={1.05}
      />
    </g>
  </svg>
);

const EightFour = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15.76">
    <g fill="#384152" data-name="8_4">
      <rect
        width={7.13}
        height={14.57}
        x={16.62}
        y={0.6}
        rx={2.96}
        ry={2.96}
        transform="rotate(180 20.18 7.88)"
      />
      <rect
        width={14.21}
        height={14.57}
        x={0.25}
        y={0.6}
        rx={2.96}
        ry={2.96}
        transform="rotate(180 7.36 7.88)"
      />
    </g>
  </svg>
);

export default BreakpointIcon;
