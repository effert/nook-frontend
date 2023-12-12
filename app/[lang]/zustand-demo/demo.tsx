'use client';
import { useRef, useEffect } from 'react';
import useStore from '@/lib/stores/demo';

export default function ZustandDemo() {
  const { bears, increasePopulation, removeAllBears } = useStore();

  return (
    <div>
      <div>
        <div>{bears}</div>
        <div>
          <button onClick={increasePopulation}>one up</button>
        </div>
        <div>
          <button onClick={removeAllBears}>removeAllBears</button>
        </div>
      </div>
    </div>
  );
}
