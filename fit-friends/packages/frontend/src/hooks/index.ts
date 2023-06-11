import {store} from '../store';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {RootState} from '../types/store';


export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
