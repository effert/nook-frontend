import { forwardRef } from 'react';

function Iconfont(
  {
    type,
    className,
    onClick,
    ...rest
  }: {
    type: string;
    className?: string;
    onClick?: () => void;
    rest?: any;
  },
  ref: any
) {
  return (
    <svg
      ref={ref}
      {...rest}
      className={`icon ${className}`}
      onClick={onClick}
      aria-hidden="true"
    >
      <use xlinkHref={`#${type}`}></use>
    </svg>
  );
}

export default forwardRef(Iconfont);
