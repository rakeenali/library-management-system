import { Admin } from '../store/Admin';

const check = () => {
  let identity = '';
  const unsbuscribe = Admin.subscribe(value => {
    if (value.isAdmin) {
      identity = 'admin';
      return;
    }
    identity = 'user';
    return;
  });
  unsbuscribe();
  return identity;
};

export default check;
