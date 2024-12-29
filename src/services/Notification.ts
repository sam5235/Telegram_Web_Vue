import { Notify, QNotifyCreateOptions } from 'quasar';

const SuccessNotification = (
  message: string,
  color = 'positive',
  position: QNotifyCreateOptions['position'] = 'top',
  timeout = 1000,
  icon = 'done'
) => {
  Notify.create({
    message: message,
    color: color,
    position: position,
    timeout: timeout,
    icon: icon,
  });
};
const ErrorNotification = (
  message: string,
  color = 'negative',
  position: QNotifyCreateOptions['position'] = 'top',
  timeout = 2000,
  icon = 'warning'
) => {
  Notify.create({
    message: message,
    color: color,
    position: position,
    timeout: timeout,
    icon: icon,
  });
};

export { SuccessNotification, ErrorNotification };
