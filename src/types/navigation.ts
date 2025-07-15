import { useRoute, RouteProp } from '@react-navigation/native';
import { TiffinOrder } from './index';

type RootStackParamList = {
  Today: { editOrder?: TiffinOrder };
};

type TodayScreenRouteProp = RouteProp<RootStackParamList, 'Today'>;

export type { RootStackParamList, TodayScreenRouteProp };
