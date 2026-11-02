import { useId } from "react";

export default function Hamster({
  color = "blue",
  back = false,
  sleepy = false,
  className = "",
}: {
  color?: "blue" | "orange";
  back?: boolean;
  sleepy?: boolean;
  className?: string;
}) {
  const id = useId().replaceAll(":", "");
  const shirt = color === "blue" ? "#348bff" : "#ff9c43";
  const shade = color === "blue" ? "#1745b9" : "#db5e1c";
  return (
    <svg
      className={className}
      viewBox="0 0 200 225"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-fur`} cx=".36" cy=".2" r=".85">
          <stop stopColor="#ffe4af" />
          <stop offset=".6" stopColor="#e8ac65" />
          <stop offset="1" stopColor="#a65e35" />
        </radialGradient>
        <radialGradient id={`${id}-cream`} cx=".4" cy=".2" r=".9">
          <stop stopColor="#fff8e9" />
          <stop offset="1" stopColor="#e6c9a3" />
        </radialGradient>
        <linearGradient
          id={`${id}-shirt`}
          x1="60"
          y1="120"
          x2="130"
          y2="205"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={shirt} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
        <radialGradient id={`${id}-ear`} cx=".35" cy=".3" r=".75">
          <stop stopColor="#ffc9b6" />
          <stop offset="1" stopColor="#ca7c71" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="212" rx="61" ry="9" fill="#041e29" opacity=".5" />
      <ellipse
        cx="68"
        cy="198"
        rx="23"
        ry="14"
        fill="#814529"
        transform="rotate(-13 68 198)"
      />
      <ellipse
        cx="131"
        cy="198"
        rx="23"
        ry="14"
        fill="#814529"
        transform="rotate(13 131 198)"
      />
      <path
        d="M47 153C42 129 57 116 74 114H128C149 118 160 145 152 173L139 195C119 205 80 205 59 194Z"
        fill={`url(#${id}-shirt)`}
      />
      <path d="M78 119Q99 133 123 119" stroke="#d0edff" strokeWidth="7" />
      <path
        d="M50 142L34 161M149 142L165 162"
        stroke={shade}
        strokeWidth="23"
        strokeLinecap="round"
      />
      <ellipse
        cx="30"
        cy="166"
        rx="16"
        ry="18"
        fill={`url(#${id}-cream)`}
        transform="rotate(28 30 166)"
      />
      <ellipse
        cx="171"
        cy="166"
        rx="16"
        ry="18"
        fill={`url(#${id}-cream)`}
        transform="rotate(-28 171 166)"
      />
      <path
        d="M39 176L32 171M162 176L169 171"
        stroke="#b9997e"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse
        cx="49"
        cy="42"
        rx="25"
        ry="29"
        fill={`url(#${id}-fur)`}
        transform="rotate(-25 49 42)"
      />
      <ellipse
        cx="151"
        cy="42"
        rx="25"
        ry="29"
        fill={`url(#${id}-fur)`}
        transform="rotate(25 151 42)"
      />
      <ellipse
        cx="49"
        cy="43"
        rx="16"
        ry="19"
        fill={`url(#${id}-ear)`}
        transform="rotate(-25 49 43)"
      />
      <ellipse
        cx="151"
        cy="43"
        rx="16"
        ry="19"
        fill={`url(#${id}-ear)`}
        transform="rotate(25 151 43)"
      />
      <path
        d="M24 82C24 49 54 31 99 30C145 30 177 51 177 84L184 93L176 98L179 111L166 111C156 141 133 152 100 151C62 151 41 137 32 114L20 112L25 101L17 96Z"
        fill={`url(#${id}-fur)`}
      />
      {back ? (
        <>
          <path
            d="M84 45Q101 37 119 44M80 52Q100 44 120 50"
            stroke="#f7d69a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M83 162V184M115 160Q126 160 126 173Q126 185 115 185Q104 185 104 173Q104 160 115 160Z"
            stroke="#e6f5ff"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <ellipse cx="101" cy="193" rx="11" ry="7" fill="#e7c7a1" />
        </>
      ) : (
        <>
          <path
            d="M100 77C115 64 131 74 139 88C168 86 174 110 158 129C145 147 112 150 100 148C76 151 50 141 40 126C24 106 39 85 61 88C72 72 84 66 100 77Z"
            fill={`url(#${id}-cream)`}
          />
          {sleepy ? (
            <>
              <path
                d="M58 86Q68 94 78 85M122 85Q132 94 142 86"
                stroke="#543425"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M143 61L154 56M61 58L50 54"
                stroke="#9d693b"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <ellipse cx="67" cy="84" rx="11" ry="14" fill="#2b2325" />
              <ellipse cx="133" cy="84" rx="11" ry="14" fill="#2b2325" />
              <ellipse cx="64" cy="79" rx="4" ry="5" fill="#fff" />
              <ellipse cx="130" cy="79" rx="4" ry="5" fill="#fff" />
              <circle cx="70" cy="90" r="2" fill="#89726c" />
              <circle cx="136" cy="90" r="2" fill="#89726c" />
            </>
          )}
          <ellipse
            cx="48"
            cy="106"
            rx="12"
            ry="7"
            fill="#f2a598"
            opacity=".65"
          />
          <ellipse
            cx="152"
            cy="106"
            rx="12"
            ry="7"
            fill="#f2a598"
            opacity=".65"
          />
          <path
            d="M93 103Q100 98 107 103Q109 108 100 113Q90 108 93 103"
            fill="#c57a75"
          />
          <path
            d="M100 113V119M100 119Q89 128 82 119M100 119Q110 128 118 119"
            stroke="#72523c"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d="M95 124V132H105V124" fill="#fff" />
          <path d="M100 125V132" stroke="#ddd0bd" />
          <path
            d="M54 113L31 109M55 119L30 122M145 113L169 109M144 119L170 122"
            stroke="#b99a78"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M88 166L99 176L114 158"
            stroke="#d5eeff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      <path d="M59 188Q100 201 141 188" stroke={shade} strokeWidth="4" />
      <ellipse cx="61" cy="198" rx="15" ry="6" fill="#b88150" />
      <ellipse cx="137" cy="198" rx="15" ry="6" fill="#b88150" />
    </svg>
  );
}
