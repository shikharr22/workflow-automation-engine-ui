import { Typewriter } from "react-simple-typewriter";
import AuthForm from "../../components/authForm";

const Login = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-white uppercase tracking-widest">
        <Typewriter
          words={["Workflow Automation Engine"]}
          loop={false}
          cursor
          cursorStyle="_"
          typeSpeed={80}
          deleteSpeed={60}
          delaySpeed={1000}
        />
      </h1>
      <p className="mt-4 text-lg text-slate-300 font-mono tracking-wide">
        Sign in to manage and automate your workflows efficiently.
      </p>
      <AuthForm />
    </div>
  );
};

export default Login;
