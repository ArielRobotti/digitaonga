import { memberParser } from "../utils/parsers";
import { useAuth } from "@nfid/identitykit/react";
import useCanister from "./useCanister";
import { useEffect } from "react";
import useMemberStore from "../store/useMemberStore";
import { useNavigate } from "react-router";

const useMember = () => {
  const { connect, user, isConnecting, disconnect } = useAuth();
  const [dao] = useCanister();
  const { member, setMember } = useMemberStore();
  const navigate = useNavigate();

  // get or create user
  useEffect(() => {
    if (user && dao) {
      (async () => {
        
        // const responseMember = await dao.login()
        // if (responseMember[0]){
        //   setMember(memberParser(responseMember[0]));
        // } else {
        //   const newMewmber = await dao.create_member();
        //   setMember(memberParser(newMewmber))
        // }
        try {
          const resMember = await dao.get_member(user.principal);

          // console.log({ resMember });
          if (resMember?.Err) {
            const newMember = await dao.create_member();
            console.log(newMember)
            setMember(memberParser(newMember));
            navigate("/on_boarding");
          } else {
            console.log(resMember.Ok)
            setMember(memberParser(resMember.Ok));
            await dao.set_last_activity_member();
          }
        } catch (err) {
          // console.log("getting or creating member error:", err);
        }
      })();
    }
  }, [user, dao]);

  return { connect, disconnect, user, isConnecting };
};

export default useMember;
