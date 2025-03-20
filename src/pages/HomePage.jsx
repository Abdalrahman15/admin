import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"
import TextTransition, { presets } from "react-text-transition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons"; 
import training from "../assets/images/yyy.webp"
import motivation from "../assets/images/motivate.webp"
import health from "../assets/images/run.jpg"

const TEXTS = [
  <>
    Health care ❣
  </>,
  <>
    Personal training{" "}
    <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>💪</span>
  </>,
  <>
    Motivation ⚡
  </>,
];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % TEXTS.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="h-screen bg-black home-header relative -z-40 w-full">
        <div className="absolute bg-gray-950 bg-opacity-55 top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center w-full">
          <h1 className="text-white text-5xl">Project Test</h1>
          <div className="flex flex-col lg:flex-row mt-5 text-4xl ">
          <h1 className="text-white font-serif ">
            <TextTransition springConfig={presets.wobbly}>{TEXTS[index]}</TextTransition> 
          </h1>
          <span className="text-white ms-5 font-serif">
            and more ...
          </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 p-10 mt-[100px] ms-">
    
      <div className="lg:flex justify-center gap-7 h-full ">
  <div className="text-center lg:text-left my-3  p-1 rounded-md lg:w-1/2   ">
  <motion.div
  initial={{ opacity: 0, x: window.innerWidth < 768 ? 0 : -100 }} 
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true, amount: 0.2 }}
  className=" bg-gray-300 bg-opacity-25 h-full flex justify-center  "
>
  <div className="  flex-col   justify-center items-center pt-3 ">
  <p className="text-center flex justify-center items-center gap-2 text-2xl font-bold font-serif ">
  Training <span><i class=" cursor-pointer fa-solid fa-dumbbell text-xl hover:rotate-180 dumble-animation text-yellow-600  "></i></span>
  </p>
  <p className="text-center mt-7 p-3 font-serif">
  We will train you and teach you <br></br> the basics of exercise to be your own trainer.
  </p>

  </div>
 
</motion.div>

  </div>
  <div className="flex justify-center items-cente">
  <motion.img
    initial={{ opacity: 0, x: window.innerWidth < 768 ? 0 : -100 }} 
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true, amount: 0.3 }}
    className=" rounded-lg shadow-lg p-1 w-[350px] h-[200px] object-cover     "
    src={training}
    alt="Training"
  />

  </div>

</div>
    
  
    
     


     
    </div>
      <div className="flex flex-col gap-10 p-10 mt-[0px] ms-">
    
      <div className="lg:flex justify-center gap-7 h-full ">
  <div className="text-center lg:text-left my-3 lg:w-1/2 p-1 rounded-md    ">
  <motion.div
  initial={{ opacity: 0, x: window.innerWidth < 768 ? 0 : -100 }} 
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true, amount: 0.2 }}
  className=" bg-gray-300 bg-opacity-25 h-full flex justify-center  "
>
  <div className="  flex-col   justify-center items-center pt-3 ">
  <p className="text-center flex justify-center items-center gap-2 text-2xl font-bold font-serif bolt-animation-dad   ">
  Motivation <span className="bolt-animation-dad"><i class="cursor-pointer fa-solid fa-bolt-lightning text-xl bolt-animation bolt-3d text-yellow-400"></i></span>
  </p>
  <p className="text-center mt-7 p-3 font-serif">
  We will encourage you to adopt healthy <br></br> and sporty habits and exercise.
  </p>

  </div>
 
</motion.div>

  </div>
  <div className="flex justify-center items-cente">
  <motion.img
  initial={{ opacity: 0, x: window.innerWidth < 768 ? 0 : -100 }} 
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true, amount: 0.3 }}
    className=" rounded-lg shadow-lg p-1 w-[350px] h-[200px] object-cover     "
    src={motivation}
    alt="Training"
  />

  </div>

</div>
    
  
    
     


     
    </div>
      <div className="flex flex-col gap-10 p-10 mt-[0px] ms-">
    
      <div className="lg:flex justify-center gap-7 h-full ">
  <div className="text-center lg:text-left my-3 lg:w-1/2 p-1 rounded-md    ">
  <motion.div
 initial={{ opacity: 0, x: window.innerWidth < 768 ? 0 : -100 }} 
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true, amount: 0.2 }}
  className=" bg-gray-300 bg-opacity-25 h-full flex justify-center  "
>
  <div className="  flex-col   justify-center items-center pt-3 ">
  <p className="text-center flex justify-center items-center gap-2 text-2xl font-bold font-serif ">
  Health care <span><i class="fa-solid fa-notes-medical hover-shake text-red-600 cursor-pointer"></i></span>
  </p>
  <p className="text-center mt-7 p-3 font-serif">
  We will teach you the basics of proper nutrition<br></br> to build a healthy and athletic body.
  </p>

  </div>
 
</motion.div>

  </div>
  <div className="flex justify-center items-cente">
  <motion.img
initial={{ opacity: 0, x: window.innerWidth < 768 ? 0 : -100 }} 
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true, amount: 0.3 }}
    className=" rounded-lg shadow-lg p-1 w-[350px] h-[200px] object-cover     "
    src={health}
    alt="Training"
  />

  </div>

</div>
    
  
    
     


     
    </div>
































    




























    
      

      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
      <div>home</div>
    </>
  );
}
