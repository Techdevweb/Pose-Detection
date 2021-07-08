import {useRef} from 'react'
import './App.css';
// import * as tf from '@tensorflow/tfjs'
import * as posenet from '@tensorflow-models/posenet'
import Webcam from 'react-webcam'
// import { log } from '@tensorflow/tfjs';
import {drawKeypoints,drawSkeleton} from './utilities'

function App() {
  const webCamRef = useRef(null)
  const canvasRef = useRef(null)

  //Load Posenet
  const runPosenet=async()=>{
    const net=await posenet.load({
      architecture:'MobileNetV1',
      outputStride:16,
      inputResolution:{width:640,height:480},
      multiplier:0.75,
      scale:0.8
    })
    setInterval(()=>{
      detect(net)
    },100)
  }

  const detect = async(net) => {
    if(typeof webCamRef.current!=='undefined' && webCamRef.current!==null && webCamRef.current.video.readyState===4){
      //Get properties
      const video=webCamRef.current.video
      const videoWidth=webCamRef.current.video.videoWidth
      const videoHeight=webCamRef.current.video.videoHeight

      //set video height
      webCamRef.current.video.width=videoWidth
      webCamRef.current.video.height=videoHeight

      //Make detection
      const pose=await net.estimateSinglePose(video)
      console.log(pose);

      drawCanvas(pose,video,videoWidth,videoHeight,canvasRef)
    }
  }

  const drawCanvas=(pose,video,videoWidth,videoHeight,canvas) => {
    const ctx=canvas.current.getContext("2d")
    canvas.current.width=videoWidth
    canvas.current.height=videoHeight

    drawKeypoints(pose['keypoints'],0.9,ctx)
    drawSkeleton(pose['keypoints'],0.9,ctx)
  }

  runPosenet()

  return (
    <div className="App">
      <header className="App-header">
       <Webcam
        ref={webCamRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: '0',
          right: '0',
          textAlign: 'center',
          zindex:9,
          width:640,
          height:480
        }}
       />

       <canvas
       ref={canvasRef}
       style={{
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: '0',
        right: '0',
        textAlign: 'center',
        zindex:9,
        width:640,
        height:480
      }}
       />
      </header>
    </div>
  );
}

export default App;
