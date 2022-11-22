import React, { useEffect, useState } from "react";
import "./Notification.css";

import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import { clearNotification } from "../Features/logedUserData";

import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

export default function Notification() {
  const dispatch = useDispatch();

  let [notificationState, setNotificationState] = useState({
    name: "",
    type: "",
    in: "",
  });

  const Notifications = useSelector(
    (state) => state.userData.value.notifications
  );
  //console.log(Notifications);

  useEffect(() => {
    try {
      if (
        !Notifications[Notifications.length - 1].data.name ||
        !Notifications[Notifications.length - 1].data === undefined
      )
        return;
      setNotificationState((prev) => {
        return {
          ...prev,
          name: Notifications[Notifications.length - 1].data.name,
          in: Notifications[Notifications.length - 1].data.in, //time
          type: Notifications[Notifications.length - 1].type,
        };
      });

      let notif = document.querySelector(".notification-container");
      notif.classList.add("showNotification");
      dispatch(clearNotification());

      let clearNotif = setTimeout(() => {
        notif.classList.remove("showNotification");
        return clearTimeout(clearNotif);
      }, 4 * 1000);

      //console.log(clearNotif)
      //return () => clearTimeout(clearNotif)
    } catch (error) {
      console.log(error);
    }
  }, [Notifications]);

  let notificationMessage;
  if (notificationState.type === "pomodoro") {
    notificationMessage = `${notificationState.in} minutes`;
  } else {
    notificationMessage = `${notificationState.in} minutes`;
  }

  return (
    <div className="notification-container">
      <div className="notification-image">
        <PriorityHighIcon sx={{ fontSize: "2rem", width: "50px" }} />
      </div>
      <div className="notification-content">
        <p className="notification-name">{notificationState.name}</p>
        <p className="notification-reminder">{notificationMessage}</p>
      </div>
    </div>
  );
}
