import type { InputHTMLAttributes, FC } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  unit: string;
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  error?: boolean;
}

export const Input: FC<InputProps> = ({ label, unit, value, onChange, onBlur, error, ...props }) => {
  return (
    <div className="flex flex-col relative group md:pt-2">
      <label className="absolute -top-[7px] md:-top-[4px] left-sm bg-background px-xs text-[10px] font-semibold md:font-bold text-outline z-10 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`w-full bg-surface border ${error ? 'border-error' : 'border-outline-variant'} rounded text-[20px] font-bold text-on-surface font-label-mono pl-sm pr-[64px] py-sm h-[56px] text-right focus:outline-none focus:border-secondary`}
          style={{ paddingRight: '55px' }}
          {...props}
        />
        <span 
          className="absolute right-0 h-full flex items-center text-outline font-medium text-[12px] font-label-mono border-l border-outline-variant px-sm"
          style={{ width: '40px', justifyContent: 'center', padding: '0px' }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
};
