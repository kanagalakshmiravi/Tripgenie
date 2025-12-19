import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import userPic from '../../../assets/user.jpg';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from 'react';
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios'


function Header() {

  const user = JSON.parse(localStorage.getItem('user'));
  const [openDailog, setOpenDailog] = useState(false);

  useEffect(() => {
    console.log(user)
  }, [])


  const login = useGoogleLogin({

    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)


  })
  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: `Application/json`
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDailog(false);
      window.location.reload()
    })
  }



  return (
    <div className='p-2 shadow-sm flex justify-between items-center px-5 ' >
      <div className='flex  items-center'>
        <img src="/logo.svg" alt="#" /><h2 className='font-bold text-2xl '>Tripgenie</h2>
      </div>
     
      <div>
        {user ?
          <div className='flex items-center gap-5 '>
            <a href='/My-trip'>
            <Button variant='outline' className="rounded-full">My Trips</Button>
            </a>


            <Popover>
              <PopoverTrigger><img src={userPic} alt="User" className='h-[55px]  w-[55px] cursor-pointer' /></PopoverTrigger>
              <PopoverContent>
                <h2 className='cursor-pointer' onClick={() => {
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}>Logout</h2>
              </PopoverContent>
            </Popover>

          </div>
          :
          <Button onClick={() => setOpenDailog(true)}>Sign In</Button>}

      </div>
      <Dialog open={openDailog}>

        <DialogContent>
          <DialogHeader>

            <DialogDescription>
              <img src="/logo.svg" />
              <h2 className="font-bold text-lg mt-7" >Sign In With Google</h2>
              <p>Sign in to the App with Google authenication securely</p>
              <Button

                onClick={login}
                className="w-full h-11 mt-5 flex gap-3 items-center">

                <FcGoogle className="h-7 w-7" />
                Sign In With Google

              </Button>



            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default Header