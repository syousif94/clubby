import React, { ChangeEvent, CSSProperties, forwardRef, useState } from 'react';
import { useSpring, animated as a } from 'react-spring';

interface IInputProps {
  onChange(e: ChangeEvent<HTMLInputElement>): void;
  value: string | undefined;
  placeholder: string;
  type?: string | undefined;
  style?: CSSProperties;
  autoFocus?: boolean | undefined;
  disabled?: boolean;
}

type Ref = HTMLInputElement | null;

export default forwardRef<Ref, IInputProps>(
  (
    {
      value,
      onChange,
      placeholder,
      type = 'text',
      style,
      autoFocus,
      disabled = false,
    }: IInputProps,
    ref
  ) => {
    const [focused, setFocused] = useState(autoFocus || false);
    const movePlaceholder = focused || value?.length;
    const { transform } = useSpring({
      transform: `translateY(${movePlaceholder ? -12 : 0}px) scale(${
        movePlaceholder ? 0.7 : 1
      })`,
      config: { mass: 2, tension: 1200, friction: 120 },
    });
    return (
      <label
        style={{
          display: 'flex',
          position: 'relative',
          height: 50,
          border:
            focused && !disabled ? '1px solid #237df4' : '1px solid #efefef',
          borderRadius: 7,
          boxShadow: focused ? '0 0 5px -3px #0a438d' : undefined,
          background: disabled ? '#f9f9f9' : undefined,
          pointerEvents: disabled ? 'none' : undefined,
          ...style,
        }}
      >
        <a.div
          style={{
            position: 'absolute',
            left: 10,
            fontWeight: 300,
            color: '#888',
            fontSize: '1.1rem',
            alignSelf: 'center',
            transform,
            transformOrigin: '0 50%',
            pointerEvents: 'none',
          }}
        >
          {placeholder}
        </a.div>
        <input
          ref={ref}
          style={{
            flex: 1,
            fontWeight: 300,
            fontSize: '1.1rem',
            color: '#000',
            padding: ' 15px 10px 0',
          }}
          type={type}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}
        />
      </label>
    );
  }
);
