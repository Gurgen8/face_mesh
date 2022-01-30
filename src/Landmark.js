import React, { useRef,useState } from "react";
import  tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Spinner from 'react-bootstrap/Spinner'
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";
import "./Landmark.css";

function Landmark() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [f,setF]=useState()
 

  //  Load posenet
  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8
    });
    //
    setInterval(() => {
      detect(net);
    }, 100);
  };
  

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const face=await net.estimateFaces(video);
   
      setF(face)

      // Get canvas context
      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx);
    }
  };

  runFacemesh();

  return (
    <div className="App">
      <header style={{width:"100%"}} className="App-header">
         {!f? <h1>please wait for your data to be downloaded ... <Spinner animation="border" /> </h1> : <h1> your face avatar <Spinner animation="grow"  variant="success" /> </h1>}
        
        <Webcam
          ref={webcamRef} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            visibility:f?"hidden":'visible',
            textAlign: "center",
            zindex: 9,
            width:  700,
            height: 480
          }}
        />
 
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480
          }}
        />
      </header>
    </div>
  );
}

export default Landmark;