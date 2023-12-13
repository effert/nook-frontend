export default function Iconfont({
  type,
  className,
  onClick,
}: {
  type: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <svg className={`icon ${className}`} onClick={onClick} aria-hidden="true">
      <use xlinkHref={`#${type}`}></use>
    </svg>
  );
}
