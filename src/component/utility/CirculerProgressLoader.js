import { memo } from 'react';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import CircularWithValueLabel from "./CirculerProgress";

const CircularProgressLoader = memo(() => {
  return (
    <div className={dashboard['card--loading']}>
      <div className={dashboard['card_body']}>
        <div className={dashboard['card_button_and_icon']} />
        <CircularWithValueLabel />
      </div>
      <div className={dashboard['card_footer']}>Loading...</div>
    </div>
  );
});

CircularProgressLoader.displayName = 'CircularProgressLoader';

export default CircularProgressLoader;