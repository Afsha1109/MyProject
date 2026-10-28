import { useRef, useState } from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '../utils/firebase.js';
import { ServerUrl } from '../App.jsx';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUserData } from '../redux/userSlice.js';

function Auth() {
  const dispatch = useDispatch();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const signInPending = useRef(false);

  const handleGoogleAuth = async () => {
    if (signInPending.current) return;

    signInPending.current = true;
    setIsSigningIn(true);
    setAuthError('');
    try {
      const response = await signInWithPopup(auth, provider);
      let User = response.user;
      let name = User.displayName;
      let email = User.email;
      const result = await axios.post(ServerUrl + "/api/auth/google",
      { name, email }, { withCredentials: true });
      dispatch(setUserData(result.data));

    } catch (error) {
      if (error?.code === 'auth/popup-closed-by-user') {
        setAuthError('The sign-in window was closed before sign-in finished. Please try again.');
      } else {
        console.error(error);
        setAuthError('Sign-in failed. Please try again.');
      }
    } finally {
      signInPending.current = false;
      setIsSigningIn(false);
      dispatch(setUserData(null));
    }
  };
  return (
    <div className='w-full min-h-screen bg-[#f3f3f3] flex justify-center items-center px-6 py-20'>
        <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className= 'w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl border border-gray-200'>
        <div className= 'flex items-center justify-center gap-3 mb-6'>
            <div className= 'bg-black text-white p-2 rounded-lg'>
                <BsRobot size={18} />   

            </div>
            <h2 className='font-semibold text-lg'>InterviewPrepAI</h2>
        </div>
        <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>
          Continue with
          <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2'>
            <IoSparkles size={16} />
            AI Smart Interview
          </span>
            </h1>
            <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8'>
              Sign on to start AI-powered mock interviews, track your progress, and receive personalized feedback to ace your interviews.
            </p>

            {authError && (
              <p role='alert' className='text-red-600 text-sm text-center mb-4'>
                {authError}
              </p>
            )}

            <motion.button
            onClick={handleGoogleAuth}
            disabled={isSigningIn}
            whileHover={{ opacity:0.9, scale: 1.05 }}
            whileTap={{ opacity:1, scale: 0.95 }}
            className='w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md disabled:cursor-not-allowed disabled:opacity-60'>
              <FcGoogle size={20} />
              {isSigningIn ? 'Signing in...' : 'Continue with Google'}
            </motion.button>
        </motion.div>
    </div>
  )
}

export default Auth