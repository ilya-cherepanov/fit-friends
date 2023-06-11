import {useState} from 'react';


export function usePager(step: number, max: number) {
  const [page, setPage] = useState(0);

  const decrement = () => {
    if (page * step - step < 0) {
      return;
    }

    setPage(page - 1);
  };

  const increment = () => {
    if (page * step < (max - 1)) {
      setPage(page + 1);
    }
  };

  return {page, increment, decrement};
}
