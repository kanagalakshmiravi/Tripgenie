import React from 'react'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router'

export default function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9' >
        <h1
        className='font-extrabold text-[50px] text-center mt-16'>
          <span className='text-[#f56551]'> Discover Your Next Adventure With AI:</span> Personslized Itineraries at Your Fingertip
          <p className='text-lg text-gray-600 text-center font-normal  mt-10'> Your personal welness recommender and health advisor creating custom itineraries tailored to your interests and budget.

          </p>
          <Link to={'/create-trip'} >  
          <Button> Get Started, It's Free</Button>
          </Link>
        </h1>
    </div>
  )
}
