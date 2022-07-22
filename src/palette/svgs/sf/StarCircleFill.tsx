import { Circle, EMaskUnits } from "react-native-svg"
import { Icon, IconProps, Mask, Path, Rect } from "../Icon"
import { useColor } from "palette/hooks"

export const StarCircleFill: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 20 20">
      <Mask
        id="path-1-outside-1"
        maskUnits={"userSpaceOnUse" as EMaskUnits}
        x="0"
        y="0"
        width="20"
        height="20"
        fill="black"
      >
        <Rect fill={color("white100")} width="20" height="20" />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM9.65332 10.6357H7.16602C6.98145 10.6357 6.84961 10.5082 6.84961 10.3369C6.84961 10.2402 6.89355 10.1523 6.96826 10.0556L10.9585 5.06782C11.2573 4.69428 11.7231 4.93598 11.5562 5.38862L10.2422 8.94819H12.7295C12.9141 8.94819 13.0415 9.08002 13.0415 9.24702C13.0415 9.34809 13.002 9.43598 12.9272 9.52827L8.93701 14.5205C8.63818 14.8896 8.16797 14.6479 8.33936 14.1953L9.65332 10.6357Z"
        />
      </Mask>
      <Circle cx="10" cy="10" r="5" fill={color("white100")} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM7.67083 14.2656C7.39837 14.4634 7.16986 14.5117 6.98968 14.3711C6.8095 14.2349 6.76995 14.0107 6.87982 13.6943L7.79827 10.9565L5.45159 9.27344C5.17913 9.08008 5.06488 8.87354 5.13958 8.6582C5.2099 8.44287 5.41644 8.3374 5.75482 8.3418L8.63323 8.36377L9.50775 5.61279C9.61322 5.29199 9.77142 5.125 9.99554 5.125C10.2241 5.125 10.3823 5.29199 10.4877 5.61279L11.3622 8.36377L14.2407 8.3418C14.579 8.3374 14.7856 8.44287 14.8559 8.6582C14.9262 8.87354 14.8163 9.08008 14.5439 9.27344L12.1972 10.9565L13.1157 13.6943C13.2255 14.0107 13.186 14.2349 13.0058 14.3711C12.8212 14.5117 12.5971 14.4634 12.3246 14.2656L9.99554 12.5562L7.67083 14.2656Z"
        fill={color("green100")}
      />
      <Path
        d="M6.98968 14.3711L8.22022 12.7945L8.20813 12.785L8.1959 12.7758L6.98968 14.3711ZM7.67083 14.2656L8.84565 15.8843L8.85567 15.8769L7.67083 14.2656ZM6.87982 13.6943L8.76916 14.3504L8.77262 14.3404L8.77596 14.3304L6.87982 13.6943ZM7.79827 10.9565L9.69442 11.5926L10.1642 10.1922L8.96392 9.33134L7.79827 10.9565ZM5.45159 9.27344L6.61725 7.64822L6.60909 7.64242L5.45159 9.27344ZM5.13958 8.6582L7.0291 9.31375L7.0351 9.29643L7.04079 9.27901L5.13958 8.6582ZM5.75482 8.3418L5.72884 10.3417L5.73955 10.3417L5.75482 8.3418ZM8.63323 8.36377L8.61797 10.3637L10.0925 10.375L10.5392 8.96967L8.63323 8.36377ZM9.50775 5.61279L7.60779 4.98815L7.60472 4.9975L7.60174 5.00689L9.50775 5.61279ZM10.4877 5.61279L12.3937 5.00689L12.3908 4.9975L12.3877 4.98815L10.4877 5.61279ZM11.3622 8.36377L9.45623 8.96967L9.90296 10.375L11.3775 10.3637L11.3622 8.36377ZM14.2407 8.3418L14.2559 10.3418L14.2666 10.3416L14.2407 8.3418ZM14.5439 9.27344L13.3864 7.6424L13.3782 7.64824L14.5439 9.27344ZM12.1972 10.9565L11.0316 9.33134L9.83125 10.1922L10.3011 11.5926L12.1972 10.9565ZM13.1157 13.6943L11.2195 14.3304L11.2229 14.3404L11.2263 14.3504L13.1157 13.6943ZM13.0058 14.3711L11.7996 12.7758L11.7937 12.7802L13.0058 14.3711ZM12.3246 14.2656L11.1412 15.878L11.1499 15.8842L12.3246 14.2656ZM9.99554 12.5562L11.1789 10.9438L9.99442 10.0744L8.8107 10.9449L9.99554 12.5562ZM16 10C16 13.3137 13.3137 16 10 16V20C15.5228 20 20 15.5228 20 10H16ZM10 4C13.3137 4 16 6.68629 16 10H20C20 4.47715 15.5228 0 10 0V4ZM4 10C4 6.68629 6.68629 4 10 4V0C4.47715 0 0 4.47715 0 10H4ZM10 16C6.68629 16 4 13.3137 4 10H0C0 15.5228 4.47715 20 10 20V16ZM5.75914 15.9477C6.32302 16.3878 7.00179 16.5233 7.62908 16.4173C8.17023 16.3258 8.58626 16.0725 8.84562 15.8842L6.49604 12.647C6.50109 12.6434 6.53848 12.6164 6.60657 12.5836C6.67408 12.5511 6.79509 12.5015 6.96222 12.4732C7.1355 12.4439 7.35505 12.4385 7.59728 12.4962C7.84271 12.5547 8.05342 12.6643 8.22022 12.7945L5.75914 15.9477ZM4.99047 13.0383C4.87152 13.3809 4.76065 13.8711 4.85294 14.4275C4.95578 15.0476 5.28661 15.5907 5.78346 15.9664L8.1959 12.7758C8.51258 13.0152 8.73354 13.3782 8.79903 13.773C8.85396 14.1043 8.77825 14.3242 8.76916 14.3504L4.99047 13.0383ZM5.90213 10.3204L4.98367 13.0582L8.77596 14.3304L9.69442 11.5926L5.90213 10.3204ZM4.28595 10.8986L6.63263 12.5817L8.96392 9.33134L6.61724 7.64824L4.28595 10.8986ZM3.25007 8.00266C3.0212 8.66234 3.10049 9.33677 3.39004 9.89497C3.64474 10.386 4.0171 10.7079 4.2941 10.9045L6.60909 7.64242C6.61363 7.64565 6.79263 7.76757 6.94077 8.05315C7.12375 8.4059 7.18326 8.8694 7.0291 9.31375L3.25007 8.00266ZM5.78079 6.34197C5.42668 6.33737 4.93055 6.38308 4.43327 6.63836C3.87423 6.92536 3.44162 7.41496 3.23837 8.0374L7.04079 9.27901C6.90786 9.68611 6.61368 10.0153 6.26008 10.1968C5.96825 10.3467 5.74457 10.3418 5.72885 10.3416L5.78079 6.34197ZM8.6485 6.36383L5.77008 6.34186L5.73955 10.3417L8.61797 10.3637L8.6485 6.36383ZM7.60174 5.00689L6.72722 7.75786L10.5392 8.96967L11.4138 6.2187L7.60174 5.00689ZM9.99554 3.125C9.31828 3.125 8.71832 3.40315 8.28341 3.84397C7.90215 4.23042 7.71113 4.67385 7.60779 4.98815L11.4077 6.23744C11.4049 6.24599 11.3895 6.29157 11.3525 6.35936C11.3156 6.42701 11.2468 6.53573 11.1309 6.65322C11.011 6.77471 10.8452 6.90061 10.6306 6.99303C10.4139 7.08636 10.1948 7.125 9.99554 7.125V3.125ZM12.3877 4.98815C12.2845 4.67422 12.0926 4.22759 11.7067 3.83915C11.2656 3.39505 10.6643 3.125 9.99554 3.125V7.125C9.80256 7.125 9.58709 7.08832 9.37152 6.99667C9.15747 6.90567 8.99059 6.78064 8.86881 6.65804C8.75119 6.53963 8.68132 6.42961 8.64373 6.36089C8.60615 6.29216 8.59056 6.2459 8.58777 6.23744L12.3877 4.98815ZM13.2683 7.75786L12.3937 5.00689L8.58172 6.2187L9.45623 8.96967L13.2683 7.75786ZM14.2254 6.34186L11.347 6.36383L11.3775 10.3637L14.2559 10.3417L14.2254 6.34186ZM16.7571 8.0374C16.5539 7.41496 16.1212 6.92536 15.5622 6.63836C15.0649 6.38308 14.5688 6.33737 14.2147 6.34197L14.2666 10.3416C14.2509 10.3418 14.0272 10.3467 13.7354 10.1968C13.3818 10.0153 13.0876 9.68611 12.9547 9.27901L16.7571 8.0374ZM15.7014 10.9045C15.9847 10.7034 16.3553 10.3791 16.6077 9.88747C16.8919 9.3337 16.9659 8.67696 16.7571 8.0374L12.9547 9.27901C12.8162 8.85478 12.8704 8.40897 13.0492 8.06065C13.1961 7.77444 13.3755 7.65014 13.3864 7.64242L15.7014 10.9045ZM13.3628 12.5817L15.7095 10.8986L13.3782 7.64824L11.0316 9.33134L13.3628 12.5817ZM15.0118 13.0582L14.0933 10.3204L10.3011 11.5926L11.2195 14.3304L15.0118 13.0582ZM14.212 15.9664C14.7089 15.5907 15.0397 15.0476 15.1425 14.4275C15.2348 13.8711 15.1239 13.3809 15.005 13.0383L11.2263 14.3504C11.2172 14.3242 11.1415 14.1043 11.1964 13.773C11.2619 13.3782 11.4829 13.0152 11.7996 12.7758L14.212 15.9664ZM11.1499 15.8842C11.404 16.0687 11.8195 16.3246 12.3632 16.417C12.9981 16.5249 13.6656 16.3827 14.2179 15.962L11.7937 12.7802C11.9524 12.6593 12.1563 12.5531 12.3981 12.4958C12.6379 12.4389 12.8572 12.4436 13.0332 12.4735C13.2023 12.5022 13.3246 12.5527 13.3922 12.5855C13.4601 12.6184 13.4966 12.645 13.4994 12.647L11.1499 15.8842ZM8.81215 14.1685L11.1413 15.878L13.508 12.6533L11.1789 10.9438L8.81215 14.1685ZM8.85567 15.8769L11.1804 14.1674L8.8107 10.9449L6.48599 12.6544L8.85567 15.8769Z"
        fill={color("white100")}
        mask="url(#path-1-outside-1)"
      />
    </Icon>
  )
}
