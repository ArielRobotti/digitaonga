import { AddFriendIcon, HeartIcon } from "../ui/icons";

import Button from "../shared/Button";

const NotificationCard = ({
  type = "proposal",
  description = "User name liked your comment in Proposal #456",
  time = "1 day ago",
}) => {
  return (
    <article className="bg-gray-200 p-6 border-b border-gray-300 last:border-b-0">
      <section className="flex gap-2.5 items-center">
        {type === "proposal" ? <HeartIcon /> : <AddFriendIcon />}
        <div className="flex flex-col gap-1">
          <p>{description}</p>
          <span>{time}</span>
        </div>
      </section>

      {type === "invite" && (
        <section className="flex gap-8 justify-center mt-10 ">
          <Button className="max-w-[172px] max-h-11">Reject</Button>
          <Button className="max-w-[172px] max-h-11" variant="kokowai">
            Accept
          </Button>
        </section>
      )}
    </article>
  );
};

export default NotificationCard;
