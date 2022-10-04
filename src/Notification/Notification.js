import React from 'react';
// import exclamationSVG, {ReactComponent as ErrorImg} from '../images/exclamation.svg';
// import successImg, {ReactComponent as SuccessImg} from '../images/circle-check-solid.svg';
import './Notification.css';

function Notification(props) {
    // var NotificationIMG = (props.status === 'error') ? <ErrorImg className="notificationImg" src={exclamationSVG} alt="warning"/> : <SuccessImg className="notificationImg" src={successImg} alt="success"/>;
    var className = ((props.status === 'error') ? 'errorNotification hidden' : 'successNotification') + ' Notification';
    
    return (
        <div id={props.id} className={className}>
            {/* {NotificationIMG} */}
            <p id="errorText">{props.errorText}</p>
        </div>
    );
}

export default Notification;