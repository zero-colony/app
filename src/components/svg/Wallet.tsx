import React from "react";

interface WalletIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  size?: number;
}

export const WalletIcon: React.FC<WalletIconProps> = ({
  color = "currentColor",
  size = 20,
  className,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M5 6.66667H8.33333"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.3611 7.5H15.1923C13.7054 7.5 12.5 8.61929 12.5 10C12.5 11.3807 13.7054 12.5 15.1923 12.5H17.3611C17.4306 12.5 17.4653 12.5 17.4946 12.4982C17.944 12.4709 18.302 12.1385 18.3314 11.7212C18.3333 11.6939 18.3333 11.6617 18.3333 11.5972V8.40278C18.3333 8.33829 18.3333 8.30605 18.3314 8.27883C18.302 7.86153 17.944 7.52914 17.4946 7.50178C17.4653 7.5 17.4306 7.5 17.3611 7.5Z"
        stroke={color}
      />
      <path
        d="M17.4709 7.5C17.4061 5.93975 17.1972 4.98312 16.5238 4.30964C15.5475 3.33333 13.9761 3.33333 10.8334 3.33333L8.33341 3.33333C5.19072 3.33333 3.61937 3.33333 2.64306 4.30964C1.66675 5.28595 1.66675 6.8573 1.66675 10C1.66675 13.1427 1.66675 14.714 2.64306 15.6904C3.61937 16.6667 5.19072 16.6667 8.33342 16.6667H10.8334C13.9761 16.6667 15.5475 16.6667 16.5238 15.6904C17.1972 15.0169 17.4061 14.0603 17.4709 12.5"
        stroke={color}
      />
      <path
        d="M14.9927 10H15.0002"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
