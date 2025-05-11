import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import '../styles/navbar.css'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);  


  const handlePreferencesClick = () => {
      setShowModal(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault(); 

    if (isSignUp && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const url = isSignUp ? 'http://localhost:5000/api/register' : 'http://localhost:5000/api/login';
    const payload = isSignUp
      ? { email, password, confirmPassword }
      : { email, password };

    try {
      const response = await axios.post(url, payload);
      console.log('Response:', response.data);

      if(response.data.message == 'Login successful') {
        setIsLoggedIn(true); 
        setShowModal(false); 
        navigate('/preference')
      }
      if(response.data.message == 'User registered') {
        setShowModal(true);
        setIsSignUp(!isSignUp);
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Something went wrong!');
    }
  };

  const onClose = () => {
    setShowModal(false);
  };

  const handleGoogleLogin = () => {
    alert('Google login clicked');
  };

  return (
    <>
      <nav className='bg-blue-600 text-white p-4'>
        <div className='flex justify-between items-center'>
          <div className='live-news-header text-xl font-bold'>
            Real Time <span className='highlighted-news'>News</span>
          </div>
          <Button
            className='md:hidden text-white focus:outline-none'
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              {menuOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </Button>
          <div className='hidden md:flex space-x-4'>
            <Link className='relative mx-2 px-2 py-1 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full' to='/'>Home</Link>
            <Link className='relative mx-2 px-2 py-1 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full' to='/about'>About</Link>
            <Link className='relative mx-2 px-2 py-1 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full' to='/wheather'>Wheather</Link>
             {!isLoggedIn ? (
              <Link onClick={handlePreferencesClick} className='relative mx-2 px-2 py-1 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full'>
                Preferences
              </Link>
            ) : (
              <Link onClick={handleLogout} to='/' className='relative mx-2 px-2 py-1 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full'>
                Logout
              </Link>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className='md:hidden mt-2 flex flex-col space-y-2'>
            <Link className='px-2' to='/'>Home</Link>
            <Link className='px-2' to='/about'>About</Link>
            <Link className='px-2' to='/wheather'>Wheather</Link>
            {!isLoggedIn ? (
              <Link onClick={handlePreferencesClick} className='relative mx-2 px-2 py-1 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full'>
                Preferences
              </Link>
            ) : (
              <Link onClick={handleLogout} to='/' className='relative mx-2 px-2 py-1 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full'>
                Logout
              </Link>
            )}
          </div>
        )}
      </nav>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-white text-2xl bg-gray-800 hover:bg-gray-700 rounded-full h-8 w-8 flex items-center pb-0.5 justify-center cursor-pointer" onClick={onClose}>
                ×
              </span>
            </div>

            <form onSubmit={handleLogin} className="p-8 pb-6">
              <div className="flex flex-col items-center mb-6">
                <div className="h-16 w-16 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mb-4">
                  {isSignUp ? (
                    <UserPlus className="h-8 w-8 text-white" />
                  ) : (
                    <LogIn className="h-8 w-8 text-white" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-white/70 text-sm mt-1">
                  {isSignUp ? "Sign up to get started" : "Log in to your account"}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-1">Password</label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-purple-500"
                    required
                  />
                </div>

                {isSignUp && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-1">Confirm Password</label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-purple-500"
                      required
                    />
                  </div>
                )}

                {!isSignUp && (
                  <div className="text-right">
                    <a href="#" className="text-sm font-medium text-purple-300 hover:text-purple-200">Forgot password?</a>
                  </div>
                )}

                <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white py-3">
                  {isSignUp ? "Sign Up" : "Log In"}
                </Button>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <div className="border-t border-white/20 w-full"></div>
                <div className="mx-4 text-white/60">or</div>
                <div className="border-t border-white/20 w-full"></div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full mt-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M22 12a10 10 0 1 1-10.8-10c.5 0 .9.4.9.9v2.6a.56.56 0 0 1-.3.5c-.9.5-1.5 1.6-1.5 2.7C11.2 10.5 12.8 12 14.6 12H17c.5 0 .9.4.9.9V15c0 .5-.4.9-.9.9h-3.3c-1.2 0-2.3-.6-3-1.5"></path>
                  <path d="M20 20h-8"></path>
                </svg>
                Continue with Google
              </Button>
            </form>

            <div className="p-4 text-center">
              <p className="text-white/80">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <Button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-semibold text-blue-400 hover:text-blue-500"
                >
                  {isSignUp ? "Log in" : "Sign up"}
                </Button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
