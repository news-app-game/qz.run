import dayjs from 'dayjs/esm/index';
import relativeTime from 'dayjs/esm/plugin/relativeTime/index';
import 'dayjs/esm/locale/zh-cn';
import utc from 'dayjs/esm/plugin/utc/index';
import timezone from 'dayjs/esm/plugin/timezone/index';

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export const myDayjs = dayjs;

export const myDayjsWithTz = (time: string, tz: string = 'Asia/Shanghai') => {
  return myDayjs.tz(time, tz);
};
export const formatDate = (date: string | number | Date, format: string = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(format);
}