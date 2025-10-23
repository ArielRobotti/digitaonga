import Button from "../../components/shared/Button";
import useMemberStore from "../../store/useMemberStore";
import useMember from "../../hooks/useMember";
// import { useNavigate } from "react-router";

const FirstSteps = () => {

  // const navigate = useNavigate()
  const { member } = useMemberStore();
  const { connect, disconnect, user } = useMember();

  // if (!member.loading && !member.data){
  //   navigate("/")
  // }

  return (
    <main className="">
      <div className="grid place-items-center xl:mt-6">
        <img
          src="/images/png/pattern_kokowaif2.png"
          alt="kokowaif pattern"
          className="xl:w-[90%]"
        />
      </div>

      <section className="grid place-items-center gap-14 mt-14 xl:mt-32">
        <h2 className="uppercase">KIA ORA!</h2>

        <h4 className="uppercase">WE’RE GLAD YOU’RE HERE!</h4>

        <p className="max-w-[300px] xl:max-w-[645px]">
          You’re part of a growing community protecting knowledge, rights, and taonga.
          <br />
          Ka mua, ka muri - Let’s shape the future together.
        </p>

        <div className="grid place-items-center gap-4 mt-40 w-full md:mt-0">
          {/* <Button variant="kokowai" onClick={() => (window.location.href = `/assign-role`)}>
            Assign roles
          </Button> */}
          {user &&<Button variant="kokowai" onClick={() => (window.location.href = user? "/profile": "/")}>
            Complete your profile
          </Button >}
          {/* <Button variant="kokowai">Complete your profile</Button> */}
        </div>
      </section>
    </main>
  );
};

export default FirstSteps;
