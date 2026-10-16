import { InlineMath, BlockMath } from "react-katex";

export default function Formula({ tex, block = false, className = "" }) {
  const Component = block ? BlockMath : InlineMath;
  return (
    <span className={`text-ink [&_.katex]:text-inherit ${className}`}>
      <Component math={tex} />
    </span>
  );
}
