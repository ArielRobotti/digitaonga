import { CommentIcon, DislikeIcon, LikeIcon } from "../ui/icons";

import Button from "../shared/Button";
import { TextField } from "@mui/material";
import { shortP } from "../../utils/functions";
import { useState } from "react";

const ProposalComment = ({ created_at, likes, dislikes, thread, creator, comment }) => {
  const [newComment, setNewComment] = useState({ want: false, text: "" });

  return (
    <article className="min-w-[325px] min-h-[244px] h-fit bg-gray-200 rounded-[5px] p-4 text-gray-900 flex flex-col gap-2.5">
      <h5>{shortP(creator)}</h5>
      <span className="text-kokowai">{created_at}</span>
      <p>{comment}</p>

      <section className="flex items-center gap-4 justify-end py-2">
        <p className="flex items-center gap-2 cursor-pointer">
          {likes} <LikeIcon />
        </p>
        <p className="flex items-center gap-2 cursor-pointer">
          {dislikes} <DislikeIcon />
        </p>
        <p
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setNewComment({ ...newComment, want: !newComment.want })}
        >
          {thread?.length} <CommentIcon />
        </p>
      </section>

      {newComment.want &&
        thread.length > 0 &&
        thread.map((c) => (
          <p key={c.created_at} className="bg-wheua text-kokowai p-2.5">
            {c.comment}
          </p>
        ))}

      {/* {newComment.want && (
        <>
          <TextField
            placeholder="Comment..."
            multiline
            onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
            value={newComment.text}
          />

          {newComment.text.length > 0 && (
            <div className="flex justify-end mt-2">
              <Button size="small" variant="kokowai">
                Log in / Comment
              </Button>
            </div>
          )}
        </>
      )} */}
    </article>
  );
};

export default ProposalComment;
