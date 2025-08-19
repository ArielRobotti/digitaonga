import NotificationCard from "../../components/notifications/NotificationCard";
import useNotification from "../../store/useNotifications";

const Notifications = () => {
  // Store
  const { notifications } = useNotification();

  return (
    <main>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} {...notification} />
      ))}
    </main>
  );
};

export default Notifications;
